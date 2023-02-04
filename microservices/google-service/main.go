package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/openinfolabs-org/serp-microservice/google"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/google", googleSearch)

	e.Logger.Fatal(e.Start(":1323"))
}

func googleSearch(c echo.Context) error {
	var crawlResults = google.GoogleService(c.QueryParam("query"), c.QueryParam("pages"))
	return c.JSON(http.StatusOK, crawlResults)
}
