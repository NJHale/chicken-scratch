package main

import "time"

// Scratch model
type Scratch struct {
	ID      string    `json:"Id"`
	CoopID  string    `json:"coopId"`
	Content string    `json:"content"`
	Date    time.Time `json:"date"`
}
