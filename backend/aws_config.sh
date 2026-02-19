#!/bin/bash
set -ex

# Use environment variables for credentials
# export AWS_ACCESS_KEY_ID="..."
# export AWS_SECRET_ACCESS_KEY="..."
# export AWS_DEFAULT_REGION="..."

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
