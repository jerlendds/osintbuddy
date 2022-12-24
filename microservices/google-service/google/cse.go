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



func CrawlCse(searchQuery string, pages string) {
var serpResults = new(SerpResults)

	var paginationIndex = 0
	totalPages, err := strconv.Atoi(pages)
	if err != nil {
		panic(err)
	}

	var initialUrl string = fmt.Sprintf("https://www.google.com/search?q=%s&client=firefox-b-e", url.QueryEscape(searchQuery))
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
	c.SetRequestTimeout(60 * time.Second)

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
		if paginationIndex < totalPages {
			q.AddURL(fmt.Sprintf("https://google.com/%sclient=firefox-b-e", link))
		}
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
			serpResults.Stories = append(serpResults.Stories, *storiesResult)
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
			serpResults.Videos = append(serpResults.Videos, *videoResult)
		}
	})

	// parse people also ask section
	c.OnHTML("div.wQiwMc.related-question-pair", func(e *colly.HTMLElement) {
		var peopleAlsoAskQuestion = e.ChildText("div.JlqpRe")
		if len(peopleAlsoAskQuestion) > 0 {
			var jsonObj map[string]interface{}
			err := json.Unmarshal([]byte("{}"), &jsonObj)
			if err != nil {
				fmt.Println(err)
				return
			}
			questionResult := &QuestionResult{
				Question: peopleAlsoAskQuestion,
			}
			serpResults.Questions = append(serpResults.Questions, *questionResult)
		}

	})

	// parse typical search results
	c.OnHTML("#cnt", func(e *colly.HTMLElement) {
		e.ForEach(".MjjYud", func(_ int, el *colly.HTMLElement) {
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

			// parse classic search result
			if len(urlString) > 0 {
				searchResult := &SearchResult{
					Title:       heading,
					Description: description,
					Link:        urlString,
					Breadcrumb:  breadcrumb,
				}
				serpResults.Search = append(serpResults.Search, *searchResult)
			}
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

func CseService() int {
	return 1
}
