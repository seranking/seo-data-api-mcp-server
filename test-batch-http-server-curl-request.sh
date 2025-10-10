#!/bin/sh

TOKEN="$1"

if [ -z "$TOKEN" ]; then
  echo "Error: No token provided as the first argument."
  echo "Usage: $0 '<SERANKING_API_TOKEN>'"
  exit 1
fi

# here we send a batch request with two different calls to MCP Server as one single HTTP request
# the response will be a JSON array with two different responses, one for each call
# see https://www.jsonrpc.org/specification#batch for more details about JSON-RPC
curl -s -X POST http://localhost:5000/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer $TOKEN" \
  -d '[
    {
      "jsonrpc": "2.0",
      "id": "2",
      "method": "tools/call",
      "params": {
        "name": "domainKeywords",
        "arguments": {
          "source": "us",
          "domain": "microsoft.com",
          "type": "organic",
          "order_field": "position",
          "order_type": "desc",
          "limit": 2
        }
      }
    },
    {
      "jsonrpc": "2.0",
      "id": "3",
      "method": "tools/call",
      "params": {
        "name": "domainKeywords",
        "arguments": {
          "source": "uk",
          "domain": "oracle.com",
          "type": "organic",
          "order_field": "position",
          "order_type": "desc",
          "limit": 2
        }
      }
    }
  ]'

