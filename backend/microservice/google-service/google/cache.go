package google

import (
	"encoding/json"
	"fmt"
	"log"
	"net/url"
	"strconv"
	"time"

	"github.com/gocolly/colly"
	"github.com/gocolly/colly/queue"
)

var cacheSerpResults = new(SerpResults)

func ParseGoogleResult(el *colly.HTMLElement) {
	var breadcrumb string = el.ChildText("div.TbwUpd.NJjxre cite")
	var heading string = el.ChildText("a h3.LC20lb.MBeuO.DKV0Md")
	var urlString string = el.ChildAttr("div.yuRUbf a", "href")
	var description string = el.ChildText("div.VwiC3b.yXK7lf.MUxGbd.yDYNvb.lyLwlc.lEBKkf")

	var jsonObj map[string]interface{}
	err := json.Unmarshal([]byte("{}"), &jsonObj)
	if err != nil {
		fmt.Println(err)
		return
	}

	if len(urlString) > 0 {
		searchResult := &SearchResult{
			Title:       heading,
			Description: description,
			Link:        urlString,
			Breadcrumb:  breadcrumb,
		}
		cacheSerpResults.Search = append(cacheSerpResults.Search, *searchResult)
	}
}

func CrawlGoogleCache(searchQuery string, pages string) {

	var paginationIndex = 1
	totalPages, err := strconv.Atoi(pages)
	if err != nil {
		panic(err)
	}

	var initialUrl string = fmt.Sprintf("http://webcache.googleusercontent.com/search?q=cache:%s", url.QueryEscape(searchQuery))
	var nextPage string = ""

	// Create a new collector
	c := colly.NewCollector()
	// proxy
	// rp, err := proxy.RoundRobinProxySwitcher()
	// if err != nil {
	// log.Fatal(err)
	// }
	// c.SetProxyFunc(rp)
	c.Limit(&colly.LimitRule{
		DomainGlob:  "*google.*",
		Parallelism: 2,
		RandomDelay: 2 * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}
	c.SetRequestTimeout(10 * time.Second)

	q, _ := queue.New(
		2, // Number of consumer threads
		&queue.InMemoryQueueStorage{MaxSize: 10000}, // Use default queue storage
	)

	c.OnRequest(func(r *colly.Request) {
		setHeaders(r)
	})

	c.OnResponse(func(r *colly.Response) {
		// r.Save(fmt.Sprintf("%d.html", paginationIndex))
		paginationIndex += 1
	})

	// Set HTML callback for pagination
	c.OnHTML("#pnnext", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		if paginationIndex <= totalPages {
			q.AddURL(fmt.Sprintf("https://google.com/%sclient=firefox-b-e", link))
		}
	})
	resultStats := new(StatsResult)
	// parse related searches
	c.OnHTML("div.s75CSd.OhScic.AB4Wff", func(e *colly.HTMLElement) {
		relatedSearch := e.Text
		resultStats.Related = append(resultStats.Related, relatedSearch)
	})
	// parse about stats at top of page e.g. 'About 83,000,000 results (0.22 seconds) '
	c.OnHTML("#result-stats", func(e *colly.HTMLElement) {
		result := e.Text
		resultStats.Result = append(resultStats.Result, result)
		cacheSerpResults.Stats = append(cacheSerpResults.Stats, *resultStats)
		resultStats.Related = nil
		resultStats.Result = nil
	})

	// parse top 'top stories' section
	c.OnHTML("a.WlydOe", func(e *colly.HTMLElement) {
		storiesLink := e.Attr("href")
		storiesDesc := e.ChildText("div.mCBkyc.tNxQIb.ynAwRc.jBgGLd.OSrXXb")
		if len(storiesLink) > 0 {
			var jsonObj map[string]interface{}
			err := json.Unmarshal([]byte("{}"), &jsonObj)
			if err != nil {
				fmt.Println(err)
				return
			}
			storiesResult := &StoriesResult{
				Description: storiesDesc,
				Link:        storiesLink,
			}
			cacheSerpResults.Stories = append(cacheSerpResults.Stories, *storiesResult)
		}
	})

	// parse top 'videos section' of search results
	c.OnHTML("div.RzdJxc", func(e *colly.HTMLElement) {
		var videosHeader = e.ChildText("div.fc9yUc.tNxQIb.ynAwRc.OSrXXb")
		var videosSubheader = e.ChildText("div.FzCfme")
		var videosLink = e.ChildAttr("div.sI5x9c > a.X5OiLe", "href")
		if len(videosLink) > 0 {
			var jsonObj map[string]interface{}
			err := json.Unmarshal([]byte("{}"), &jsonObj)
			if err != nil {
				fmt.Println(err)
				return
			}
			videoResult := &VideoResult{
				Title:       videosHeader,
				Description: videosSubheader,
				Link:        videosLink,
			}
			cacheSerpResults.Videos = append(cacheSerpResults.Videos, *videoResult)
		}
	})

	// parse people also ask section
	c.OnHTML("div.wQiwMc.related-question-pair div div span", func(e *colly.HTMLElement) {
		var question = e.Text
		if len(question) > 0 {
			var jsonObj map[string]interface{}
			err := json.Unmarshal([]byte("{}"), &jsonObj)
			if err != nil {
				fmt.Println(err)
				return
			}
			questionResult := &QuestionResult{
				Question: question,
			}
			cacheSerpResults.Questions = append(cacheSerpResults.Questions, *questionResult)
		}

	})

	// parse typical search results
	c.OnHTML("#cnt", func(e *colly.HTMLElement) {
		e.ForEach(".MjjYud", func(_ int, el *colly.HTMLElement) {
			ParseGoogleResult(el)
			el.ForEach("div.d4rhi", func(_ int, elm *colly.HTMLElement) {
				ParseGoogleResult(elm)
			})
		})
	})

	c.OnError(func(_ *colly.Response, err error) {
		log.Println("Something went wrong:", err)
	})
	if nextPage == "" {

		q.AddURL(initialUrl)
	}

	q.Run(c)

}

func GoogleCacheService(query string, pages string) SerpResults {
	cacheSerpResults = new(SerpResults)
	CrawlGoogleCache(query, pages)
	return *cacheSerpResults
}
