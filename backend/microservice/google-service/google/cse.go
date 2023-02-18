package google

import (
	// "encoding/json"
	"encoding/json"
	"fmt"
	"log"

	// "net/url"

	// "strconv"
	"strings"
	"time"

	"github.com/gocolly/colly"
	"github.com/gocolly/colly/queue"
)

var cseResults = new(SerpResults)

func CrawlCse(searchQuery string, pages string, cseUrl string) {
	var paginationIndex = 1
	// totalPages, err := strconv.Atoi(pages)
	// if err != nil {
	// panic(err)
	// }
	nextPage := ""
	baseUrl := strings.Split(cseUrl, "//")
	baseUrl = strings.Split(baseUrl[1], "/")
	reqUrl := "https://" + baseUrl[0] + "/cse.js?ie=UTF-8&hpg=1&cx=" + strings.Split(cseUrl, "cx=")[1]

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

	c.SetRequestTimeout(10 * time.Second)

	q, _ := queue.New(
		2, // Number of consumer threads
		&queue.InMemoryQueueStorage{MaxSize: 10000}, // Use default queue storage
	)

	c.OnRequest(func(r *colly.Request) {
		setHeaders(r)
	})

	c.OnResponse(func(r *colly.Response) {
		x := strings.Split(string(r.Body[:]), "})(")
		jsonString := strings.Split(x[1], ");")[0]
		var jsonMap map[string]interface{}
		json.Unmarshal([]byte(jsonString), &jsonMap)

		fmt.Println(jsonMap)
		r.Save(fmt.Sprintf("%d.html", paginationIndex))
		paginationIndex += 1
		vUrl := fmt.Sprintf("https://cse.google.com/cse/element/v1?"+"rsz=filtered_cse&num=100&hl=en&source=gcsc&gss=.com&cselibv=%s&cx=%s&q=%s&safe=off&cse_tok=%s&sort=&exp=&oq=%s&cseclient=hosted-page-client&callback=1431", jsonMap["cselibVersion"], jsonMap["cx"], searchQuery, jsonMap["cse_token"], searchQuery)
		fmt.Println(vUrl)
		c.Visit(vUrl)
	})

	c.OnResponse(func(r *colly.Response) {
		fmt.Println(r, r.Body)
	})

	c.OnError(func(_ *colly.Response, err error) {
		log.Println("Something went wrong:", err)
	})
	if nextPage == "" {

		q.AddURL(reqUrl)
	}

	q.Run(c)
}

func GoogleCSEService(query string, pages string, cseUrl string) SerpResults {
	serpResults = new(SerpResults)
	CrawlCse(query, pages, cseUrl)
	return *serpResults
}
