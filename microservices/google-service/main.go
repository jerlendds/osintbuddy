package main

import (
	"net/http"

	"github.com/jerlendds/osintbuddy/google"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/", hello)

	// Start server
	e.Logger.Fatal(e.Start(":1323"))
}

type Response struct {
	Data []byte
}

// Handler
func hello(c echo.Context) error {
	var crawlResults = google.GoogleService(c.QueryParam("query"), c.QueryParam("pages"))
	return c.JSON(http.StatusOK, crawlResults)
}
