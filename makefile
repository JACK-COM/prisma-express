ifneq (,$(wildcard ./.env))
	include .env
endif
SHELL := /bin/bash
export

# dev env spin up
dev:
# Only install concurrently if it's not already installed
	npm list -g concurrently || npm i -g concurrently
	concurrently "make dev-web" "make dev-api"

# run dev web
dev-web:
	cd ./web && npm install --force && npm run start

dev-api:
# run dev api
	cd ./api && npm install && npm run start

build:
	cd ./web && npm install --force && npm run build && cd ../api && npm install && npm run build
	cp -rf ./api/package.json ./api/lib/
	cp -rf ./api/prisma ./api/lib/

tf-init:
	cd ./terraform && terraform init

tf-upgrade:
	cd ./terraform && terraform init -upgrade

tf-plan: tf-init
	cd ./terraform && terraform plan -lock=false

tf-deploy: tf-init
	cd ./terraform && terraform apply -auto-approve -lock=false
	aws s3 cp ./web/dist s3://www-mythosforge-app-bucket --recursive --acl public-read

tf-deploy-local: build tf-init
	cd ./terraform && terraform apply -auto-approve -lock=false
	aws s3 cp ./web/dist s3://www-mythosforge-app-bucket --recursive --acl public-read

tf-redeploy: tf-init
	cd ./terraform && terraform apply -replace=$(target) -auto-approve -lock=false
	aws s3 cp ./web/dist s3://www-mythosforge-app-bucket --recursive --acl public-read

hulk-smash:
	cd ./terraform && terraform destroy -auto-approve