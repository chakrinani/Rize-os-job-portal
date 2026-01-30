package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

type VerifyPaymentRequest struct {
	TxHash        string `json:"txHash"`
	WalletAddress string `json:"walletAddress"`
}

type PaymentVerification struct {
	TxHash        string    `bson:"txHash" json:"txHash"`
	WalletAddress string    `bson:"walletAddress" json:"walletAddress"`
	UserID        string    `bson:"userId" json:"userId"`
	Verified      bool      `bson:"verified" json:"verified"`
	VerifiedAt    time.Time `bson:"verifiedAt" json:"verifiedAt"`
}

// VerifyPayment verifies a blockchain transaction and stores the verification
func VerifyPayment(w http.ResponseWriter, r *http.Request) {
	userID, _ := r.Context().Value("userId").(string)
	if userID == "" {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		return
	}

	var req VerifyPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if req.TxHash == "" || req.WalletAddress == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Transaction hash and wallet address are required"})
		return
	}

	// Verify transaction (simplified - in production, verify on-chain)
	verified := verifyTransactionOnChain(req.TxHash, req.WalletAddress)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Store verification
	payment := PaymentVerification{
		TxHash:        req.TxHash,
		WalletAddress: req.WalletAddress,
		UserID:        userID,
		Verified:      verified,
		VerifiedAt:    time.Now(),
	}

	_, err := PaymentsCol.InsertOne(ctx, payment)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to store verification"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if verified {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"verified": true, "message": "Payment verified"})
	} else {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Transaction verification failed"})
	}
}

// verifyTransactionOnChain verifies a transaction on the blockchain
// In production, use proper RPC calls or APIs like Etherscan
func verifyTransactionOnChain(txHash, walletAddress string) bool {
	// For development: accept any valid-looking hash
	// In production, verify:
	// 1. Transaction exists on-chain
	// 2. Transaction is confirmed (enough confirmations)
	// 3. Transaction sent from walletAddress
	// 4. Transaction sent to admin wallet
	// 5. Amount matches platform fee

	adminWallet := os.Getenv("ADMIN_WALLET")
	if adminWallet == "" {
		adminWallet = "0x742d35Cc6634C0532925a3b844Bc9e7595f3Ae92" // Default for dev
	}

	// Simplified check: verify txHash format (Ethereum tx hash is 66 chars with 0x prefix)
	if len(txHash) < 10 {
		return false
	}

	// In production, make HTTP request to Etherscan API or RPC:
	// GET https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=...
	// Then verify: from == walletAddress, to == adminWallet, status == success

	// For now, accept if txHash looks valid (starts with 0x and is hex)
	if len(txHash) == 66 && txHash[:2] == "0x" {
		return true
	}

	return false
}

// CheckPaymentVerification checks if a payment is verified for a user
func CheckPaymentVerification(userID, txHash string) bool {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var payment PaymentVerification
	err := PaymentsCol.FindOne(ctx, bson.M{
		"userId":   userID,
		"txHash":   txHash,
		"verified": true,
	}).Decode(&payment)

	return err == nil && payment.Verified
}

func RegisterPaymentRoutes(r *mux.Router) {
	r.HandleFunc("/api/verify-payment", JWTMiddleware(VerifyPayment)).Methods("POST")
}
