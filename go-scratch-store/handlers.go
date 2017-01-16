package main

import (
	"encoding/json"
	"log"
	"net/http"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// GetScratches Returns a handler function as a closure scoped with an *mgo.Session
func GetScratches(s *mgo.Session) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		session := s.Copy()
		defer session.Close()

		c := session.DB(AppConfig.MongoDatabase).C(AppConfig.MongoCollection)

		var scratches []Scratch
		err := c.Find(bson.M{}).All(&scratches)
		if err != nil {
			ErrorWithJSON(w, "Database error", http.StatusInternalServerError)
			log.Println("Failed get all scratches: ", err)
			return
		}

		respBody, err := json.MarshalIndent(scratches, "", "  ")
		if err != nil {
			log.Fatal(err)
		}

		ResponseWithJSON(w, respBody, http.StatusOK)

	}
}
