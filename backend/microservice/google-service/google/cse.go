package google

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gocolly/colly"
)

func CrawlCse(searchQuery string, pages string, cseId string) map[string]interface{} {
	var paginationIndex = 1
	nextPage := ""
	cseAuthUrl := "https://cse.google.com/cse.js?ie=UTF-8&hpg=1&cx=" + cseId
	c := colly.NewCollector()

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*google.*",
		Parallelism: 2,
		RandomDelay: 2 * time.Second,
	})
	c.SetRequestTimeout(10 * time.Second)
	c.OnRequest(func(r *colly.Request) {
		setGoogleHeaders(r)
	})

	var rawData string
	var data map[string]interface{}

	c.OnResponse(func(r *colly.Response) {
		urlResp := strings.Split(string(r.Body[:]), "})(")
		if len(urlResp) > 1 {
			paginationIndex += 1
			fmt.Println("Parsing CSE auth response for token...")

			cseAuthString := strings.Split(urlResp[1], ");")[0]
			var authValues map[string]string
			json.Unmarshal([]byte(cseAuthString), &authValues)

			dataUrl := getCseDataUrl(searchQuery, authValues)
			fmt.Printf("\nRequesting CSE data: %s ", dataUrl)
			c.Visit(dataUrl)
		} else {
			rawData = string(r.Body[:])
			rawData = strings.Split(rawData, "1984(")[1]
			rawData = strings.TrimSuffix(rawData, ");")
			json.Unmarshal([]byte(rawData), &data)
		}
	})

	c.OnError(func(_ *colly.Response, err error) {
		log.Println("Something went wrong: ", err)
	})

	if nextPage == "" {
		fmt.Printf("CSE Auth Request: %s  \n", cseAuthUrl)
		c.Visit(cseAuthUrl)
	}
	return data
}

func GoogleCSEService(query string, pages string, cseUrl string) map[string]interface{} {
	crawlData := CrawlCse(query, pages, cseUrl)
	return crawlData
}
