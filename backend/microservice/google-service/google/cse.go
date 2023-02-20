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
	// "github.com/gocolly/colly/queue"
)

func CrawlCse(searchQuery string, pages string, cseUrl string)  map[string]interface{} {
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

	// q, _ := queue.New(
	// 	2, // Number of consumer threads
	// 	&queue.InMemoryQueueStorage{MaxSize: 10000}, // Use default queue storage
	// )

	c.OnRequest(func(r *colly.Request) {
		setHeaders(r)
	})
	var rawData string
 	var data map[string]interface{}
	c.OnResponse(func(r *colly.Response) {

		urlResp := strings.Split(string(r.Body[:]), "})(")
		if len(urlResp) > 1 {
			jsonString := strings.Split(urlResp[1], ");")[0]
			var jsonMap map[string]interface{}
			json.Unmarshal([]byte(jsonString), &jsonMap)
			paginationIndex += 1
			vUrl := fmt.Sprintf("https://cse.google.com/cse/element/v1?"+"rsz=filtered_cse&num=100&hl=en&source=gcsc&gss=.com&cselibv=%s&cx=%s&q=%s&safe=off&cse_tok=%s&sort=&exp=&oq=%s&cseclient=hosted-page-client&callback=1431", jsonMap["cselibVersion"], jsonMap["cx"], searchQuery, jsonMap["cse_token"], searchQuery)
			c.Visit(vUrl)
		} else {
			rawData = string(r.Body[:])
			rawData = strings.Split(rawData, "1431(")[1]
			rawData = strings.Split(rawData, ");")[0]
			json.Unmarshal([]byte(rawData), &data)
		}

	})

	c.OnError(func(_ *colly.Response, err error) {
		log.Println("Something went wrong:", err)
	})
	if nextPage == "" {
		c.Visit(reqUrl)
	} else {
		return data
	}
	return data
}

func GoogleCSEService(query string, pages string, cseUrl string)  map[string]interface{} {
	crawlData := CrawlCse(query, pages, cseUrl)
	return crawlData
}
