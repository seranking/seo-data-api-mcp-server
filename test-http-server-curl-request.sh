#!/bin/sh

TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "Error: No token provided as the first argument."
  echo "Usage: $0 '<SERANKING_API_TOKEN>'"
  exit 1
fi

curl -X POST http://localhost:5000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "id": "2",
    "method": "tools/call",
    "params": {
      "name": "domainKeywords",
      "arguments": {
        "source": "us",
        "domain": "example.com",
        "type": "organic",
        "order_field": "position",
        "order_type": "desc",
        "limit": 5
      }
    }
  }'
