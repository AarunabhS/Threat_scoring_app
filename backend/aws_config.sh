#!/bin/bash
set -ex

# Load environment variables from .env
if [ -f "backend/.env" ]; then
    set -a
    source backend/.env
    set +a
fi

# Plugin path
export PATH="$PATH:$(pwd)/backend"

# RDS Details
REGION="us-east-1"
INSTANCE_ID="i-074ff6482997c99a1" # RDS Bastion Host
REMOTE_PORT="5432"
LOCAL_PORT="5431"
RDS_ENDPOINT="b2b-leads-database.cybm6jthqldn.us-east-1.rds.amazonaws.com"

# Check if plugin is executable
chmod +x ./backend/session-manager-plugin

# Start port forwarding
# We run this in the background or use a specific tool if available
# Since I'm an agent, I'll start it and expect it to stay alive for a while
./.venv/bin/aws ssm start-session \
    --region $REGION \
    --target $INSTANCE_ID \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters host=$RDS_ENDPOINT,portNumber=$REMOTE_PORT,localPortNumber=$LOCAL_PORT
