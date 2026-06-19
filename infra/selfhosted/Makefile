.PHONY: help secrets up down restart pull logs ps validate

help:
	@echo "Targets:"
	@echo "  make secrets   - generate .env from .env.example with random secrets"
	@echo "  make validate  - docker compose config (syntax + env check)"
	@echo "  make up        - pull images and start the whole stack"
	@echo "  make down      - stop the stack (keeps volumes/data)"
	@echo "  make restart   - restart the stack"
	@echo "  make pull      - pull latest images"
	@echo "  make logs      - tail logs for all services"
	@echo "  make ps        - show running services"

# Generate .env from the template, filling every blank secret with a random
# value and replacing the SearXNG placeholder key. Won't clobber an existing .env.
secrets:
	@test ! -f .env || { echo ".env already exists — refusing to overwrite"; exit 1; }
	@cp .env.example .env
	@for key in POSTGRES_PASSWORD VAULTWARDEN_ADMIN_TOKEN LINKDING_PASSWORD \
	            MINIFLUX_PASSWORD CHHOTO_PASSWORD READECK_SECRET_KEY \
	            OPENWEBUI_SECRET_KEY UMAMI_APP_SECRET; do \
	  val=$$(openssl rand -base64 32 | tr -d '/+=' | cut -c1-40); \
	  sed -i "s|^$$key=.*|$$key=$$val|" .env; \
	done
	@sed -i "s|REPLACE_WITH_OPENSSL_RAND_HEX_32|$$(openssl rand -hex 32)|" searxng/settings.yml
	@echo ".env created with random secrets. Now edit DOMAIN and ADMIN_EMAIL:"
	@echo "  nano .env"

validate:
	docker compose config -q && echo "compose OK"

up:
	docker compose pull
	docker compose up -d
	@echo "Up. Dashboard: https://home.$$(grep ^DOMAIN= .env | cut -d= -f2)"

down:
	docker compose down

restart:
	docker compose restart

pull:
	docker compose pull

logs:
	docker compose logs -f --tail=100

ps:
	docker compose ps
