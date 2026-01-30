package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load env (Render ignores .env, uses dashboard vars)
	_ = godotenv.Load()

	// Init DB
	InitDB()

	r := mux.NewRouter()

	// -----------------------
	// CORS (Render-safe)
	// -----------------------
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			origin := os.Getenv("CORS_ORIGIN")
			if origin == "" {
				origin = "*"
			}

			w.Header().Set("Access-Control-Allow-Origin", origin)
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
	// API ROUTES (IMPORTANT: before frontend)
	// -----------------------
	api := r.PathPrefix("/api").Subrouter()
	RegisterAuthRoutes(api)
	RegisterProfileRoutes(api)
	RegisterPaymentRoutes(api)
	RegisterJobRoutes(api)

	// -----------------------
	// Serve React build
	// -----------------------
	buildPath := "./public"
	indexFile := filepath.Join(buildPath, "index.html")

	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		filePath := filepath.Join(buildPath, req.URL.Path)

		if _, err := os.Stat(filePath); err == nil {
			http.ServeFile(w, req, filePath)
			return
		}
		http.ServeFile(w, req, indexFile)
	})

	// -----------------------
	// PORT (Render FIX)
	// -----------------------
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := "0.0.0.0:" + port
	log.Println("Server running on", addr)

	log.Fatal(http.ListenAndServe(addr, r))
}
