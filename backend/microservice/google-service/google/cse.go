package google

import (
	"encoding/json"
	"fmt"
	"log"
	"net/url"
	"strings"
	"time"

	"github.com/gocolly/colly"
)

func getCseDataUrl(searchQuery string, authValues map[string]string) string {
	var u, err = url.Parse("https://cse.google.com/cse/element/v1")
	if err != nil {
		log.Fatal(err)
	}
	cseParams := u.Query()
	cseParams.Set("rsz", "filtered_cse")
	cseParams.Set("num", "100") // total results returned, can return up to 100
	cseParams.Set("hl", "en")   // @todo make this configurable on the frontend
	cseParams.Set("source", "gcsc")
	cseParams.Set("gss", ".com")
	cseParams.Set("cselibv", authValues["cselibVersion"])
	cseParams.Set("cx", authValues["cx"])
	cseParams.Set("safe", "off")
	cseParams.Set("q", searchQuery)
	cseParams.Set("oq", searchQuery)
	cseParams.Set("cse_tok", authValues["cse_token"])
	cseParams.Set("gss", ".com")
	cseParams.Set("callback", "1431")
	cseParams.Set("sort", "")
	cseParams.Set("exp", "")
	cseParams.Set("cseclient", "hosted-page-client")
	u.RawQuery = cseParams.Encode()
	return u.String()
}

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
			fmt.Println(urlResp)

			cseAuthString := strings.Split(urlResp[1], ");")[0]
			var authValues map[string]string
			json.Unmarshal([]byte(cseAuthString), &authValues)

			dataUrl := getCseDataUrl(searchQuery, authValues)
			fmt.Printf("\nRequesting CSE data: %s ", dataUrl)
			c.Visit(dataUrl)
		} else {
			rawData = string(r.Body[:])
			rawData = strings.Split(rawData, "1431(")[1]
			rawData = strings.Split(rawData, ");")[0]
			json.Unmarshal([]byte(rawData), &data)
		}
	})

	c.OnError(func(_ *colly.Response, err error) {
		log.Println("Something went wrong: ", err)
	})
	if nextPage == "" {
		fmt.Printf("CSE Auth Request: %s  \n", cseAuthUrl)
		c.Visit(cseAuthUrl)
	} else {
		return data
	}
	return data
}

func GoogleCSEService(query string, pages string, cseUrl string) map[string]interface{} {
	crawlData := CrawlCse(query, pages, cseUrl)
	return crawlData
}
