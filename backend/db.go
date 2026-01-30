package main

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	DB          *mongo.Database
	UsersCol    *mongo.Collection
	ProfilesCol *mongo.Collection
	JobsCol     *mongo.Collection
	PaymentsCol *mongo.Collection
)

func InitDB() {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}
	dbName := os.Getenv("MONGODB_DB")
	if dbName == "" {
		dbName = "job_portal"
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("MongoDB connect:", err)
	}
	if err := client.Ping(context.Background(), nil); err != nil {
		log.Fatal("MongoDB ping:", err)
	}

	DB = client.Database(dbName)
	UsersCol = DB.Collection("users")
	ProfilesCol = DB.Collection("profiles")
	JobsCol = DB.Collection("jobs")
	PaymentsCol = DB.Collection("payments")

	// Unique index on email for signup duplicate check
	_, _ = UsersCol.Indexes().CreateOne(context.Background(), mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	})

	log.Println("MongoDB connected")
}
