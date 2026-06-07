.PHONY: build run dev test clean docker-build docker-run lint

build:
	go build -o freebuff2api .

run: build
	./freebuff2api -config config.json

dev:
	go run . -config config.json

test:
	go test -v ./...

clean:
	rm -f freebuff2api

docker-build:
	docker build -t freebuff2api:latest .

docker-run: docker-build
	docker run -d --name freebuff2api -p 8080:8080 \
		-e AUTH_TOKENS="token1,token2" \
		freebuff2api:latest

docker-stop:
	docker stop freebuff2api || true
	docker rm freebuff2api || true

lint:
	go fmt ./...
	go vet ./...

deps:
	go mod tidy
	go mod download
