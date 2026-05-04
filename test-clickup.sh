#!/bin/bash
# Test script for CU-CLI

echo "=== CU-CLI Test ==="

# Test 1: Check if token is set
echo ""
echo "1. Checking auth status..."
cu-cli auth status

# If no token, prompt user
echo ""
echo "2. To set token, run:"
echo "   cu-cli auth set pk_YOUR_TOKEN_HERE"
echo ""
echo "Get your token from: https://app.clickup.com/settings/apps"
echo ""

# Test with token if set
if [ -n "$CLICKUP_API_TOKEN" ]; then
    echo "3. Testing workspaces..."
    cu-cli workspaces
    
    echo ""
    echo "4. Testing spaces..."
    cu-cli spaces
    
    echo ""
    echo "5. Testing tasks list (need a list ID)..."
    echo "   cu-cli tasks list --list-id YOUR_LIST_ID"
else
    echo "Set CLICKUP_API_TOKEN env var to test"
fi

echo ""
echo "=== Test Complete ==="
