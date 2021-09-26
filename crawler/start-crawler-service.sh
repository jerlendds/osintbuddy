#!/usr/bin/env bash

echo "[INFO] Starting Crawler Service"

uvicorn main:app --host 0.0.0.0 --port 7242
