dev:
	docker-compose --env-file .env.dev -f ./docker-compose.yml up -d --no-log-prefix holder_backend postgres