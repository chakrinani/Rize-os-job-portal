package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

func main() {
	// -----------------------
	// Init DB
	// -----------------------
	InitDB()

	// Router
	r := mux.NewRouter()

	// -----------------------
	// CORS Middleware (PROD SAFE)
	// -----------------------
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

			origin := os.Getenv("CORS_ORIGIN")
			if origin == "" {
				origin = "*" // safe for demo/interview
			}

			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

			if req.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, req)
		})
	})

	// -----------------------
	// API ROUTES (IMPORTANT)
	// -----------------------
	api := r.PathPrefix("/api").Subrouter()
	RegisterAuthRoutes(api)
	RegisterProfileRoutes(api)
	RegisterPaymentRoutes(api)
	RegisterJobRoutes(api)

	// -----------------------
	// Serve React Frontend
	// -----------------------
	buildPath := "./public"
	indexFile := filepath.Join(buildPath, "index.html")

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		filePath := filepath.Join(buildPath, req.URL.Path)

		if stat, err := os.Stat(filePath); err == nil && !stat.IsDir() {
			http.ServeFile(w, req, filePath)
			return
		}

		http.ServeFile(w, req, indexFile)
	})

	// -----------------------
	// PORT (DEPLOYMENT FIX)
	// -----------------------
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := "0.0.0.0:" + port
	log.Println("🚀 Server running on", addr)
	log.Fatal(http.ListenAndServe(addr, r))
}
