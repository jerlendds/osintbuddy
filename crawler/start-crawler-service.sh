#!/usr/bin/env bash

echo "[INFO] Starting Crawler Service"

# TODO: Remove reload for prod
uvicorn main:app --host 0.0.0.0 --port 7242 \
--reload \
--reload-dir /spiderman/crawler \
--reload-dir /spiderman \
