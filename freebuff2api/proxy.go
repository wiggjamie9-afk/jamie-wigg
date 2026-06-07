package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"sync"
	"time"
)

type ProxyHandler struct {
	cfg             *Config
	httpClient      *http.Client
	tokenRotation   *TokenRotation
	mu              sync.RWMutex
	currentTokenIdx int
}

type TokenRotation struct {
	tokens     []string
	current    int
	mu         sync.Mutex
	lastRotate time.Time
	interval   time.Duration
}

func NewProxyHandler(cfg *Config) *ProxyHandler {
	transport := &http.Transport{
		MaxIdleConns:        100,
		MaxIdleConnsPerHost: 10,
	}

	if cfg.HTTPProxy != "" {
		if proxyURL, err := url.Parse(cfg.HTTPProxy); err == nil {
			transport.Proxy = http.ProxyURL(proxyURL)
		} else {
			log.Printf("Warning: invalid HTTP_PROXY: %v", err)
		}
	}

	return &ProxyHandler{
		cfg: cfg,
		httpClient: &http.Client{
			Transport: transport,
			Timeout:   cfg.RequestTimeout,
		},
		tokenRotation: &TokenRotation{
			tokens:     cfg.AuthTokens,
			current:    0,
			lastRotate: time.Now(),
			interval:   cfg.RotationInterval,
		},
	}
}

func (tr *TokenRotation) GetToken() string {
	tr.mu.Lock()
	defer tr.mu.Unlock()

	if time.Since(tr.lastRotate) > tr.interval && len(tr.tokens) > 1 {
		tr.current = (tr.current + 1) % len(tr.tokens)
		tr.lastRotate = time.Now()
		log.Printf("Rotated to token index %d", tr.current)
	}

	if len(tr.tokens) == 0 {
		return ""
	}
	return tr.tokens[tr.current]
}

func (ph *ProxyHandler) getRandomUserAgent() string {
	userAgents := []string{
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
	}
	return userAgents[rand.Intn(len(userAgents))]
}

func (ph *ProxyHandler) validateAPIKey(req *http.Request) bool {
	if len(ph.cfg.APIKeys) == 0 {
		return true
	}

	authHeader := req.Header.Get("Authorization")
	if authHeader == "" {
		return false
	}

	const prefix = "Bearer "
	if len(authHeader) <= len(prefix) {
		return false
	}

	providedKey := authHeader[len(prefix):]
	for _, validKey := range ph.cfg.APIKeys {
		if providedKey == validKey {
			return true
		}
	}
	return false
}

func (ph *ProxyHandler) proxyRequest(req *http.Request, body []byte) (*http.Response, error) {
	// Create new request to upstream
	upstreamURL := ph.cfg.UpstreamBaseURL + req.URL.Path
	if req.URL.RawQuery != "" {
		upstreamURL += "?" + req.URL.RawQuery
	}

	proxyReq, err := http.NewRequest(req.Method, upstreamURL, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}

	// Set headers with stealth characteristics
	proxyReq.Header.Set("User-Agent", ph.getRandomUserAgent())
	proxyReq.Header.Set("Authorization", "Bearer "+ph.tokenRotation.GetToken())
	proxyReq.Header.Set("Content-Type", "application/json")

	// Copy relevant headers from original request
	for key, values := range req.Header {
		if key != "Authorization" && key != "Host" && key != "User-Agent" {
			proxyReq.Header[key] = values
		}
	}

	return ph.httpClient.Do(proxyReq)
}

func (ph *ProxyHandler) HandleChatCompletions(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if !ph.validateAPIKey(req) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusBadRequest)
		return
	}
	req.Body.Close()

	resp, err := ph.proxyRequest(req, body)
	if err != nil {
		log.Printf("Upstream error: %v", err)
		http.Error(w, "Gateway error", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func (ph *ProxyHandler) HandleCompletions(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if !ph.validateAPIKey(req) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(w, "Failed to read body", http.StatusBadRequest)
		return
	}
	req.Body.Close()

	resp, err := ph.proxyRequest(req, body)
	if err != nil {
		log.Printf("Upstream error: %v", err)
		http.Error(w, "Gateway error", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func (ph *ProxyHandler) HandleModels(w http.ResponseWriter, req *http.Request) {
	if !ph.validateAPIKey(req) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	resp, err := ph.proxyRequest(req, nil)
	if err != nil {
		log.Printf("Upstream error: %v", err)
		http.Error(w, "Gateway error", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

func (ph *ProxyHandler) HandleHealth(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

func (ph *ProxyHandler) HandleNotFound(w http.ResponseWriter, req *http.Request) {
	http.Error(w, fmt.Sprintf("Not found: %s", req.URL.Path), http.StatusNotFound)
}
