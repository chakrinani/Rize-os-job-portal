package main

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Job struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	Skills      []string           `bson:"skills" json:"skills"`
	Salary      string             `bson:"salary" json:"salary"`
	PostedBy    string             `bson:"postedBy" json:"postedBy"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
}

type CreateJobRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Skills        []string `json:"skills"`
	Salary        string   `json:"salary"`
	WalletAddress string   `json:"walletAddress"`
	PaymentTxHash string   `json:"paymentTxHash"`
}

func CreateJob(w http.ResponseWriter, r *http.Request) {
	userID, _ := r.Context().Value("userId").(string)
	if userID == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		return
	}

	var req CreateJobRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if req.Title == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Title is required"})
		return
	}

	// 🔕 Wallet & payment validation DISABLED for demo / assignment
	// In production, enable this block to enforce platform fee
	/*
		if req.WalletAddress == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Wallet address is required. Please connect your wallet.",
			})
			return
		}

		if req.PaymentTxHash == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Payment transaction hash is required. Please pay the platform fee.",
			})
			return
		}

		if !CheckPaymentVerification(userID, req.PaymentTxHash) {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Payment verification failed. Please verify your payment transaction.",
			})
			return
		}
	*/

	job := Job{
		Title:       req.Title,
		Description: req.Description,
		Skills:      req.Skills,
		Salary:      req.Salary,
		PostedBy:    userID,
		CreatedAt:   time.Now(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	res, err := JobsCol.InsertOne(ctx, job)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create job"})
		return
	}

	job.ID = res.InsertedID.(primitive.ObjectID)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	
	// Return the complete job with all fields including the ID
	response := map[string]interface{}{
		"id":          job.ID.Hex(),
		"_id":         job.ID.Hex(),
		"title":       job.Title,
		"description": job.Description,
		"salary":      job.Salary,
		"skills":      job.Skills,
		"postedBy":    job.PostedBy,
		"createdAt":   job.CreatedAt,
	}
	json.NewEncoder(w).Encode(response)
}

func GetJobs(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cur, err := JobsCol.Find(
		ctx,
		bson.M{},
		options.Find().SetSort(bson.D{{Key: "createdAt", Value: -1}}),
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to fetch jobs"})
		return
	}
	defer cur.Close(ctx)

	var jobList []Job
	if err := cur.All(ctx, &jobList); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to decode jobs"})
		return
	}

	if jobList == nil {
		jobList = []Job{}
	}

	// Format jobs with hex string IDs for JSON response
	var response []map[string]interface{}
	for _, job := range jobList {
		response = append(response, map[string]interface{}{
			"id":          job.ID.Hex(),
			"_id":         job.ID.Hex(),
			"title":       job.Title,
			"description": job.Description,
			"salary":      job.Salary,
			"skills":      job.Skills,
			"postedBy":    job.PostedBy,
			"createdAt":   job.CreatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func RegisterJobRoutes(r *mux.Router) {
	r.HandleFunc("/api/jobs", JWTMiddleware(CreateJob)).Methods("POST")
	r.HandleFunc("/api/jobs", GetJobs).Methods("GET")
}
