package main

import (
	"encoding/json"
	"os"
	"strings"
	"time"
)

type Config struct {
	ListenAddr       string        `json:"LISTEN_ADDR"`
	UpstreamBaseURL  string        `json:"UPSTREAM_BASE_URL"`
	AuthTokens       []string      `json:"AUTH_TOKENS"`
	RotationInterval time.Duration `json:"ROTATION_INTERVAL"`
	RequestTimeout   time.Duration `json:"REQUEST_TIMEOUT"`
	APIKeys          []string      `json:"API_KEYS"`
	HTTPProxy        string        `json:"HTTP_PROXY"`
}

func LoadConfig(filePath string) (*Config, error) {
	cfg := &Config{
		ListenAddr:       ":8080",
		UpstreamBaseURL:  "https://codebuff.com",
		RotationInterval: 6 * time.Hour,
		RequestTimeout:   15 * time.Minute,
	}

	// Try to load from JSON file
	if data, err := os.ReadFile(filePath); err == nil {
		if err := json.Unmarshal(data, cfg); err != nil {
			return nil, err
		}
	}

	// Override with environment variables
	if v := os.Getenv("LISTEN_ADDR"); v != "" {
		cfg.ListenAddr = v
	}
	if v := os.Getenv("UPSTREAM_BASE_URL"); v != "" {
		cfg.UpstreamBaseURL = v
	}
	if v := os.Getenv("AUTH_TOKENS"); v != "" {
		cfg.AuthTokens = strings.Split(v, ",")
		for i, token := range cfg.AuthTokens {
			cfg.AuthTokens[i] = strings.TrimSpace(token)
		}
	}
	if v := os.Getenv("ROTATION_INTERVAL"); v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			cfg.RotationInterval = d
		}
	}
	if v := os.Getenv("REQUEST_TIMEOUT"); v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			cfg.RequestTimeout = d
		}
	}
	if v := os.Getenv("API_KEYS"); v != "" {
		cfg.APIKeys = strings.Split(v, ",")
		for i, key := range cfg.APIKeys {
			cfg.APIKeys[i] = strings.TrimSpace(key)
		}
	}
	if v := os.Getenv("HTTP_PROXY"); v != "" {
		cfg.HTTPProxy = v
	}

	return cfg, nil
}
