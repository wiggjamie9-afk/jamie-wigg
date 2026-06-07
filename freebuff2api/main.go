package main

import (
	"flag"
	"log"
	"net"
	"net/http"
)

func main() {
	var configPath string
	flag.StringVar(&configPath, "config", "config.json", "Path to config file")
	flag.Parse()

	// Load configuration
	cfg, err := LoadConfig(configPath)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Create proxy handler
	handler := NewProxyHandler(cfg)

	// Setup router
	http.HandleFunc("/v1/chat/completions", handler.HandleChatCompletions)
	http.HandleFunc("/v1/models", handler.HandleModels)
	http.HandleFunc("/v1/completions", handler.HandleCompletions)
	http.HandleFunc("/health", handler.HandleHealth)
	http.HandleFunc("/", handler.HandleNotFound)

	// Parse listen address
	host, port, err := net.SplitHostPort(cfg.ListenAddr)
	if err != nil {
		log.Fatalf("Invalid listen address: %v", err)
	}

	listenAddr := net.JoinHostPort(host, port)
	log.Printf("Freebuff2API starting on %s", listenAddr)
	log.Printf("Upstream: %s", cfg.UpstreamBaseURL)
	log.Printf("Loaded %d auth tokens", len(cfg.AuthTokens))
	log.Printf("Token rotation interval: %v", cfg.RotationInterval)

	if err := http.ListenAndServe(listenAddr, nil); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
