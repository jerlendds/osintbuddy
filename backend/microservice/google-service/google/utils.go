package google

import (
	"github.com/gocolly/colly"
)

type SearchResult struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Breadcrumb  string `json:"breadcrumb"`
	Index       int    `json:"index"`
}

type VideoResult struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Link        string `json:"link"`
	Index       int    `json:"index"`
}

type QuestionResult struct {
	Question string `json:"question"`
}

type StoriesResult struct {
	Link        string `json:"link"`
	Description string `json:"description"`
	Index       int    `json:"index"`
}

type StatsResult struct {
	Related []string `json:"related"`
	Result  []string `json:"result"`
}

type SerpResults struct {
	Stories   []StoriesResult  `json:"stories"`
	Videos    []VideoResult    `json:"videos"`
	Questions []QuestionResult `json:"questions"`
	Search    []SearchResult   `json:"search"`
	Stats     []StatsResult    `json:"stats"`
}

func setGoogleHeaders(r *colly.Request) {
	r.Headers.Set("Host", "www.google.com")
	r.Headers.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0")
	r.Headers.Set("Accept", "text/html")
	r.Headers.Set("Accept-Language", "en-US,en;q=0.5")
	r.Headers.Set("Accept-Encoding", "text/html")
	r.Headers.Set("Connection", "keep-alive")
	r.Headers.Set("Upgrade-Insecure-Requests", "1")
	r.Headers.Set("Sec-Fetch-Dest", "document")
	r.Headers.Set("Sec-Fetch-Mode", "navigate")
	r.Headers.Set("Sec-Fetch-Site", "same-site")
	r.Headers.Set("TE", "trailers")
}
