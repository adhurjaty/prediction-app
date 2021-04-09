#!/bin/sh

cd `dirname $0`
# TODO: check output and fail 
docker build -f Dockerfile.hardhat.server -t braggingrights/hardhat-server:latest ..
docker build -f Dockerfile.webapp -t braggingrights/webapp:latest ..
docker build -f Dockerfile.db -t braggingrights/postgres:latest ..
docker build -f Dockerfile.alembic -t braggingrights/alembic:latest ..