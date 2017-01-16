package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
)

// Config struct holding the app's config ass pulled from environment variables
type Config struct {
	MongoDatabase   string
	MongoCollection string
	MongoUser       string
	MongoPass       string
	MongoHost       string
	MongoPort       string
}

// AppConfig captures environment variable configuration as a struct
var AppConfig = Config{
	MongoDatabase:   os.Getenv("MONGO_DATABASE"),
	MongoCollection: os.Getenv("MONGO_COLLECTION"),
	MongoUser:       os.Getenv("MONGO_USER"),
	MongoPass:       os.Getenv("MONGO_PASS"),
	MongoHost:       os.Getenv("SCRATCH_STORE_DB_HOST"),
	MongoPort:       os.Getenv("SCRATCH_STORE_DB_PORT"),
}

// ErrorWithJSON asdf
func ErrorWithJSON(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	fmt.Fprintf(w, "{message: %q}", message)
}

// ResponseWithJSON adsf
func ResponseWithJSON(w http.ResponseWriter, json []byte, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)
	w.Write(json)
}

// ensureIndex asdf
func ensureIndex(s *mgo.Session) {
	session := s.Copy()
	defer session.Close()

	c := session.DB(AppConfig.MongoDatabase).C(AppConfig.MongoCollection)

	index := mgo.Index{
		Key:        []string{"ID"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err := c.EnsureIndex(index)
	if err != nil {
		panic(err)
	}
}

func wireRouter(router *mux.Router, session *mgo.Session) {
	// Wire all handler functions to the mux router
	router.HandleFunc("/scratches", GetScratches(session)).Methods("GET")
}

// main A main function!
func main() {
	// Open an mgo session
	session, err := mgo.Dial(AppConfig.MongoHost)
	if err != nil {
		panic(err)
	}
	// Defer mgo session close
	defer session.Close()

	// Set mgo mode to monotonic and ensure indexing
	session.SetMode(mgo.Monotonic, true)
	ensureIndex(session)

	// Declare a new mux router instance
	router := mux.NewRouter()
	// Wire the router
	wireRouter(router, session)

	// Fire up the http server and log the results
	log.Fatal(http.ListenAndServe("localhost", router))
}
