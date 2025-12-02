#!/bin/bash

# ==========================================
# Testing Scripts for Agora Integration
# ==========================================

# 1. Variables
TOKEN_SERVER_URL="http://localhost:3001"
SUPABASE_URL="<YOUR_SUPABASE_URL>"
SUPABASE_SERVICE_KEY="<YOUR_SUPABASE_SERVICE_KEY>"
TEST_USER_ID="<VALID_USER_UUID>"
TEST_CHANNEL="test_channel_001"

# 2. Fetch Token from Token Server
# Note: You need a valid Supabase JWT for the user. 
# For testing, you can sign one manually or login via client to get one.
# Here we assume you have a JWT in a file or variable.
JWT_TOKEN="<PASTE_YOUR_JWT_HERE>"

echo "--- Fetching Agora Token ---"
curl -X GET "${TOKEN_SERVER_URL}/api/token?channel=${TEST_CHANNEL}&uid=12345&role=publisher" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"

echo -e "\n\n"

# 3. Create Call Row in Supabase (using Service Key for test)
echo "--- Creating Call Row in Supabase ---"
curl -X POST "${SUPABASE_URL}/rest/v1/calls" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "caller_id": "'"${TEST_USER_ID}"'",
    "callee_id": "'"${TEST_USER_ID}"'", 
    "channel": "'"${TEST_CHANNEL}"'",
    "status": "ringing"
  }'

echo -e "\n\nDone."
