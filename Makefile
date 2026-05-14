# RHYTHMIX — one-command deploy and dev targets.
#
# Run `make help` to see what's available.
# Run `make doctor` if anything misbehaves.

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help
.ONESHELL:

REF ?=
PROFILE ?= development
PLATFORM ?= all

SUPABASE_FUNCTIONS := generate generate-status stripe-intent stripe-webhook revenuecat-webhook notify

# Colours (only when stderr is a TTY)
ifeq ($(shell tty -s && echo yes), yes)
  CYAN := \033[36m
  GREEN := \033[32m
  YELLOW := \033[33m
  RED := \033[31m
  RESET := \033[0m
else
  CYAN :=
  GREEN :=
  YELLOW :=
  RED :=
  RESET :=
endif

define banner
	@printf "$(CYAN)── %s ──$(RESET)\n" "$(1)"
endef

##@ Setup

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: \033[36mmake <target>\033[0m\n"} \
	/^[a-zA-Z0-9_.-]+:.*##/ { printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2 } \
	/^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)
.PHONY: help

doctor: ## Check that every required CLI is on PATH
	$(call banner,Doctor)
	@for cmd in node npm supabase eas; do
	  if command -v $$cmd >/dev/null 2>&1; then
	    printf "$(GREEN)✓$(RESET) %-10s %s\n" "$$cmd" "$$($$cmd --version 2>&1 | head -1)"
	  else
	    printf "$(RED)✗$(RESET) %-10s missing — run \`make install\`\n" "$$cmd"
	  fi
	done
.PHONY: doctor

install: ## Install Supabase + EAS CLIs and mobile deps
	$(call banner,Install)
	@if ! command -v supabase >/dev/null; then \
	  echo "Installing supabase CLI..."; \
	  npm install -g supabase || curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | sudo tar -xz -C /usr/local/bin supabase; \
	fi
	@if ! command -v eas >/dev/null; then \
	  echo "Installing eas-cli..."; \
	  npm install -g eas-cli; \
	fi
	@cd rhythmix-mobile && npm install --no-audit --no-fund
.PHONY: install

##@ Supabase

link: ## Link this checkout to your Supabase project (REF=xxxx)
	$(call banner,Link)
	@if [ -z "$(REF)" ]; then echo "Usage: make link REF=<your-project-ref>"; exit 1; fi
	supabase link --project-ref $(REF)
.PHONY: link

bundle: ## Regenerate supabase/bundle.sql from the migrations
	$(call banner,Bundle)
	bash scripts/build-sql-bundle.sh
.PHONY: bundle

db-push: ## Apply migrations to the linked Supabase project
	$(call banner,DB push)
	supabase db push
.PHONY: db-push

db-reset-local: ## Reset and re-apply migrations to a LOCAL Supabase (requires Docker)
	$(call banner,DB reset local)
	supabase db reset
.PHONY: db-reset-local

functions-deploy: ## Deploy all six Edge Functions
	$(call banner,Functions deploy)
	@for fn in $(SUPABASE_FUNCTIONS); do \
	  echo "→ $$fn"; \
	  supabase functions deploy $$fn; \
	done
.PHONY: functions-deploy

functions-serve: ## Serve all Edge Functions locally (requires `supabase start`)
	$(call banner,Functions serve)
	supabase functions serve --no-verify-jwt
.PHONY: functions-serve

secrets: ## Set Edge Function secrets from .env at the repo root
	$(call banner,Secrets)
	@if [ ! -f .env ]; then echo "Create a .env file at the repo root with REPLICATE_API_TOKEN, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, REVENUECAT_WEBHOOK_AUTH, NOTIFY_INTERNAL_SECRET"; exit 1; fi
	supabase secrets set --env-file .env
.PHONY: secrets

logs-%: ## Tail logs for a function: `make logs-generate`
	supabase functions logs $* --tail

deploy: db-push functions-deploy ## Push migrations + deploy all functions
	$(call banner,Deploy complete)
	@echo "Next: make secrets    (set the runtime secrets from .env)"
.PHONY: deploy

##@ Mobile

mobile-install: ## Install rhythmix-mobile dependencies
	cd rhythmix-mobile && npm install --no-audit --no-fund
.PHONY: mobile-install

mobile-start: ## Run the Expo dev server
	cd rhythmix-mobile && npm start
.PHONY: mobile-start

mobile-typecheck: ## Type-check the mobile app
	cd rhythmix-mobile && npx tsc --noEmit
.PHONY: mobile-typecheck

mobile-lint: ## Lint the mobile app
	cd rhythmix-mobile && npm run lint
.PHONY: mobile-lint

mobile-check: mobile-typecheck mobile-lint ## Type-check + lint
.PHONY: mobile-check

eas-init: ## Mint an EAS projectId and patch app.json
	cd rhythmix-mobile && npx eas-cli init
.PHONY: eas-init

eas-build: ## Build via EAS (PROFILE=development|preview|production, PLATFORM=ios|android|all)
	cd rhythmix-mobile && npx eas-cli build --profile $(PROFILE) --platform $(PLATFORM)
.PHONY: eas-build

eas-submit: ## Submit a production build to App Store + Play Store
	cd rhythmix-mobile && npx eas-cli submit --profile production --platform $(PLATFORM)
.PHONY: eas-submit

eas-update: ## Push an OTA update (BRANCH=production, MESSAGE="...")
	cd rhythmix-mobile && npx eas-cli update --branch $(BRANCH) --message "$(MESSAGE)"
.PHONY: eas-update

##@ All-in-one

ship: mobile-check deploy eas-build ## Type-check + deploy backend + build mobile
	$(call banner,Shipped)
	@echo "Production deploy + mobile build kicked off."
.PHONY: ship
