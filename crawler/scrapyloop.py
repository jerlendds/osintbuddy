# GNU GPL v3 -- https://gitlab.com/granitosaurus/scrapy-loop/-/tree/master
# I fucking love this guy who wrote the above, I spent 3 days struggling with my own
# solution until I came across this genius
import logging
import signal
from datetime import datetime, timedelta

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from twisted.internet import reactor
from twisted.internet.task import deferLater, LoopingCall


log = logging.getLogger('scrapyloop')


class ScrapyLoop:
    """
    Scrapy crawl scheduler that loops indefinitely via Twisted callbacks
    This loop supports three intervals i.e. sleep timers
        success - how long to sleep when crawl finishes as usual
        crash - how long to sleep when crawl encounters unhandled exception
        empty[optional] - how long to sleep if queue is determined to be empty;
            ScrapyLoop.loop_crawl(MySpider, queue_count_func=some_func)
    Signals:
    It is possible to attach signals to loop crawlers as well:
        crawler = Crawler(MySpider, get_project_settings())
        crawler.signals.connect(some_function, signals.spider_closed)
        ScrapyLoop().loop_crawl(crawler)
    """

    def __init__(
            self, success_interval=300, crash_interval=-1, empty_interval=5, empty_heartbeat_interval=60 * 60 * 5,
            callbacks=None, errbacks=None, empty_callbacks=None,
    ):
        """
        Scrapy crawl scheduler that loops forever.

        :param success_interval: loop restart interval after crawler finished crawling
            When spider successfully finished a crawl the process will wait N seconds before restarting
        :param crash_interval: loop restart interval after crawler crashes, -1 for no restart
            If spider crashes by receiving some unhandled error (like in spider.start_requests)
            the spider will restart after N seconds unless N=-1 - the process will be terminated instead
        :param empty_interval: loop restart interval after spider queue is empty
            Ever N seconds the queue function is being called to check whether crawler has something in queue
            this can be used to avoid spider startup if spider url queues (like rabbitmq or redis) are empty.
        :param empty_heartbeat_interval: interval for "still waiting" logging, -1 to disable
            While waiting for queue to fill up every N seconds heartbeat message is being logged that
            the process is still waiting for queue to fill up.
        :param callbacks: list of callbacks called before sleep
        :param errbacks: list of errbacks called before sleep if spider crashes
        :param empty_callbacks: list of callbacks called before sleep when queue is empty
        """
        self.success_interval = success_interval
        self.crash_interval = crash_interval
        self.empty_interval = empty_interval
        self.errbacks = errbacks or []
        self.callbacks = callbacks or []
        self.empty_callbacks = empty_callbacks or []
        self.empty_heartbeat_interval = empty_heartbeat_interval
        self.empty_heartbeat = LoopingCall(lambda _: log.info('  still waiting for queue'),
                                           self.empty_heartbeat_interval)

        self.err_sent = False
        self.waiting_for_queue = False
        self.runner = CrawlerProcess(get_project_settings())

    def resume_time(self, interval) -> str:
        """calculate resume time and return string representation"""
        return (datetime.utcnow() + timedelta(seconds=interval)).isoformat(sep=' ').split('.')[0]

    def crawl_errback(self, failure):
        """Callback for when crawling is interrupted by unhandled error"""
        log.error(failure.getTraceback())
        if self.crash_interval < 0:
            log.error('stopping loop')
            self.runner._signal_shutdown(signal.SIGTERM, None)
        else:
            log.error(f'spider crashed; waiting {self.success_interval} seconds to restart, '
                      f'will restart at: {self.resume_time(self.crash_interval)}')
        return failure

    def crawl_callback(self, result):
        """Callback for when crawling finished """
        log.info(f'spider finished; waiting {self.success_interval} seconds to restart, '
                 f'will restart at: {self.resume_time(self.success_interval)}')
        return result

    def sleep(self, *args, seconds):
        """Non blocking sleep callback"""
        return deferLater(reactor, seconds, lambda: None)

    def _crawl(self, result, crawler_or_spidercls, queue_count_func=None, **spider_kwargs):
        """recursive callback for crawl loop via CrawlProcess"""
        if queue_count_func:
            queue_size = queue_count_func()
            if queue_size:
                log.info(f'found {queue_size} items in queue')
                self.waiting_for_queue = False
                if self.empty_heartbeat.running:
                    self.empty_heartbeat.stop()
            else:
                if not self.waiting_for_queue:
                    log.info(f'spider queue is empty; will continue to check every {self.empty_interval} seconds...')
                    if self.empty_heartbeat_interval >= 0:
                        self.empty_heartbeat.start(self.empty_heartbeat_interval)
                self.waiting_for_queue = True

                d = self.sleep(seconds=self.empty_interval)
                d.addCallback(self._crawl, crawler_or_spidercls, queue_count_func, **spider_kwargs)
                return d

        d = self.runner.crawl(crawler_or_spidercls, **spider_kwargs)

        d.addCallback(self.crawl_callback)
        d.addErrback(self.crawl_errback)
        for errback in self.errbacks:
            d.addErrback(errback)
        for callback in self.callbacks:
            d.addCallback(callback)

        d.addCallback(self.sleep, seconds=self.success_interval)
        if self.crash_interval >= 0:
            d.addErrback(self.sleep, seconds=self.crash_interval)

        # repeat
        d.addCallback(self._crawl, crawler_or_spidercls, queue_count_func=queue_count_func, **spider_kwargs)
        return d

    def loop_crawl(self, crawler_or_spidercls, queue_count_func=None, **spider_kwargs):
        """
        crawl provided spider class endlessly
        :param queue_count_func: function that returns spider queue size
            This can be used to prevent crawler startup if queue is empty and instead check
            queue every self.empty_interval.
        :params spider_kwargs: keyword arguments to pass to spider
        """
        d = self._crawl(None, crawler_or_spidercls, queue_count_func=queue_count_func, **spider_kwargs)
        return self.runner.start(False)
