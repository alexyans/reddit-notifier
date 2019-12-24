all: build up
.PHONY: all

build:
	@echo "---> Building Docker images..."
	@docker-compose build
	@echo "Done."
.PHONY: build

build-deployed:
	@echo "---> Building Docker image..."
	@docker-compose -f docker-compose.prod.yml build notifier
	@echo "Done."
.PHONY: build-deployed

test: up
	@echo "---> Running tests..."
	@docker-compose exec notifier yarn run test
	@echo "Done."
.PHONY: test

test-deployed: up-deployed
	@echo "---> Running tests..."
	@docker-compose -f docker-compose.prod.yml exec notifier yarn run test
	@echo "Done."
.PHONY: test-deployed

up:
	@echo "---> Starting Docker containers..."
	@docker-compose up -d
.PHONY: up

up-deployed:
	@echo "---> Starting Docker containers..."
	@docker-compose -f docker-compose.prod.yml up notifier -d
.PHONY: up-deployed

# todo fix
clean:
	@echo "---> Cleaning up..."
	@docker-compose clean
	@echo "Done."
.PHONY: clean
