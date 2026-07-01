.PHONY: help up down backend-setup frontend-setup migrate seed test lint fresh logs

help: ## Show help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Docker ───────────────────────────────────────────────────────────

up: ## Start all Docker services
	docker compose up -d

down: ## Stop all Docker services
	docker compose down

logs: ## View Docker logs
	docker compose logs -f

# ─── Backend ──────────────────────────────────────────────────────────

backend-setup: ## Install backend dependencies, generate key, run migrations
	cd backend && composer install
	cd backend && cp -n .env.example .env || true
	cd backend && php artisan key:generate
	cd backend && php artisan migrate
	@echo "✅ Backend setup complete"

backend-serve: ## Start Laravel development server
	cd backend && php artisan serve

# ─── Frontend ─────────────────────────────────────────────────────────

frontend-setup: ## Install frontend dependencies
	cd frontend && npm install
	@echo "✅ Frontend setup complete"

frontend-dev: ## Start Next.js development server
	cd frontend && npm run dev

# ─── Database ─────────────────────────────────────────────────────────

migrate: ## Run database migrations
	cd backend && php artisan migrate

seed: ## Seed demo data
	cd backend && php artisan db:seed

fresh: ## Fresh migrate + seed
	cd backend && php artisan migrate:fresh --seed

# ─── Testing ──────────────────────────────────────────────────────────

test: ## Run all tests
	cd backend && php artisan test
	cd frontend && npm run lint

test-backend: ## Run backend tests only
	cd backend && php artisan test

test-frontend: ## Run frontend lint & type check
	cd frontend && npm run lint
	cd frontend && npm run type-check

lint: ## Run linters
	cd backend && ./vendor/bin/pint
	cd frontend && npm run lint

# ─── Utilities ────────────────────────────────────────────────────────

cache-clear: ## Clear all caches
	cd backend && php artisan optimize:clear

swagger: ## Generate API documentation
	cd backend && php artisan l5-swagger:generate
