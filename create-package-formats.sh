#!/bin/bash

# Login first to get fresh token
echo "Login to get token..."
LOGIN_RESPONSE=$(curl -s -X POST https://brewery-pms-api-production.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@brewery.com","password":"Password123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Got token"
echo ""

API_URL="https://brewery-pms-api-production.up.railway.app"

# Function to create package format
create_format() {
  echo "Creating: $1"
  curl -s -X POST "$API_URL/packaging/formats" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$2" | grep -o '"name":"[^"]*' | cut -d'"' -f4
}

echo "Creating Package Formats..."
echo ""

# Bottles
create_format "330ml Bottle" '{
  "name": "330ml Bottle",
  "type": "BOTTLE",
  "size": 330,
  "unit": "ml",
  "description": "Standard 330ml glass bottle"
}'

create_format "500ml Bottle" '{
  "name": "500ml Bottle",
  "type": "BOTTLE",
  "size": 500,
  "unit": "ml",
  "description": "Large 500ml glass bottle"
}'

create_format "750ml Bottle" '{
  "name": "750ml Bottle",
  "type": "BOTTLE",
  "size": 750,
  "unit": "ml",
  "description": "Premium 750ml bottle"
}'

# Kegs
create_format "20L Keg" '{
  "name": "20L Keg",
  "type": "KEG",
  "size": 20,
  "unit": "L",
  "description": "Standard 20 liter keg"
}'

create_format "30L Keg" '{
  "name": "30L Keg",
  "type": "KEG",
  "size": 30,
  "unit": "L",
  "description": "Medium 30 liter keg"
}'

create_format "50L Keg" '{
  "name": "50L Keg",
  "type": "KEG",
  "size": 50,
  "unit": "L",
  "description": "Large 50 liter keg"
}'

# Cans
create_format "330ml Can" '{
  "name": "330ml Can",
  "type": "CAN",
  "size": 330,
  "unit": "ml",
  "description": "Standard aluminum can"
}'

create_format "500ml Can" '{
  "name": "500ml Can",
  "type": "CAN",
  "size": 500,
  "unit": "ml",
  "description": "Large aluminum can"
}'

# Growlers
create_format "1L Growler" '{
  "name": "1L Growler",
  "type": "GROWLER",
  "size": 1,
  "unit": "L",
  "description": "1 liter growler"
}'

create_format "2L Growler" '{
  "name": "2L Growler",
  "type": "GROWLER",
  "size": 2,
  "unit": "L",
  "description": "2 liter growler"
}'

# Crowlers
create_format "946ml Crowler" '{
  "name": "946ml Crowler",
  "type": "CROWLER",
  "size": 946,
  "unit": "ml",
  "description": "Standard 32oz crowler"
}'

echo ""
echo "✅ Done! Created 11 package formats"
echo "Now you can add packaging operations!"
