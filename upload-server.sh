#!/bin/bash

# Exit immediately if a command fails
set -e

# Configuration
SSH_KEY=".ssh/key"
REMOTE_USER="root"
REMOTE_HOST="64.23.167.120"
REMOTE_DIR="/var/cardsServer"
LOCAL_DIR="$(pwd)"

echo "=== Copying server files $REMOTE_USER@$REMOTE_HOST ==="

# Step 1: Copy files to remote server
echo "Copying files to $REMOTE_HOST..."
scp -i "$SSH_KEY" -r "$LOCAL_DIR/server.js" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
scp -i "$SSH_KEY" -r "$LOCAL_DIR/package.json" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
scp -i "$SSH_KEY" -r "$LOCAL_DIR/package-lock.json" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
scp -i "$SSH_KEY" -r "$LOCAL_DIR/.env" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
