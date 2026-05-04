# CU-CLI - ClickUp CLI
# Makefile for building and installing

BINARY_NAME=cu-cli
DIST_DIR=dist
BIN_DIR=bin

.PHONY: all build install clean test help

all: build

## Build

build: ## Build the project using TypeScript compiler
	npm run build

## Installation

install: build ## Install the CLI globally via npm
	npm install -g .

## Development

deps: ## Install npm dependencies
	npm install

test: ## Run the test script
	bash test-clickup.sh

## Utilities

clean: ## Remove build artifacts
	rm -rf $(DIST_DIR)
	rm -rf node_modules

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
