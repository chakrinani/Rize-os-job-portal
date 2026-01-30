package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Profile struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID        string             `bson:"userId" json:"userId"`
	Name          string             `bson:"name" json:"name"`
	Bio           string             `bson:"bio" json:"bio"`
	LinkedInURL   string             `bson:"linkedInUrl" json:"linkedInUrl"`
	Skills        []string           `bson:"skills" json:"skills"`
	WalletAddress string             `bson:"walletAddress" json:"walletAddress"`
	UpdatedAt     time.Time          `bson:"updatedAt" json:"updatedAt"`
}

type ProfileUpdateRequest struct {
	Name          string   `json:"name"`
	Bio           string   `json:"bio"`
	LinkedInURL   string   `json:"linkedInUrl"`
	Skills        []string `json:"skills"`
	WalletAddress string   `json:"walletAddress"`
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	userID, _ := r.Context().Value("userId").(string)
	if userID == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var profile Profile
	err := ProfilesCol.FindOne(ctx, bson.M{"userId": userID}).Decode(&profile)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(Profile{UserID: userID})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to get profile"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID, _ := r.Context().Value("userId").(string)
	if userID == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		return
	}

	var req ProfileUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	now := time.Now()
	update := bson.M{
		"$set": bson.M{
			"userId":        userID,
			"name":          req.Name,
			"bio":           req.Bio,
			"linkedInUrl":   req.LinkedInURL,
			"skills":        req.Skills,
			"walletAddress": req.WalletAddress,
			"updatedAt":    now,
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := ProfilesCol.UpdateOne(ctx, bson.M{"userId": userID}, update, opts)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to save profile"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated"})
}

func RegisterProfileRoutes(r *mux.Router) {
	r.HandleFunc("/api/profile", JWTMiddleware(GetProfile)).Methods("GET")
	r.HandleFunc("/api/profile", JWTMiddleware(UpdateProfile)).Methods("PUT", "POST")
}
