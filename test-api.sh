#!/bin/bash
# test_endpoints.sh
# Simple test script for your Express backend API (port 5000)
# Requires: bash + curl

BASE_URL="http://localhost:5000/api"

echo "=============================="
echo "Testing /api/login endpoint..."
echo "=============================="
curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"login": "rickl", "password": "COP4331"}' \
  | jq .

echo
echo "=============================="
echo "Testing /api/addcard endpoint..."
echo "=============================="
curl -s -X POST "$BASE_URL/addcard" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "card": "Test Player"}' \
  | jq .

echo
echo "=============================="
echo "Testing /api/searchcards endpoint..."
echo "=============================="
curl -s -X POST "$BASE_URL/searchcards" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "search": "ruth"}' \
  | jq .

echo
echo "=============================="
echo "All endpoint tests complete."
echo "=============================="
