#!/bin/bash

# --- 1. SETTINGS ---
# Get the current directory so the tabs know where they are
PROJECT_ROOT=$(pwd)

echo "🚀 Initiating Competitor Monitoring Project..."

# --- 2. THE SSM TUNNEL (Tab 1) ---
# Creates a new terminal window
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_ROOT' && bash backend/aws_config.sh\""
echo "✅ Step 1: SSM Tunnel starting..."

# --- 3. THE BREATHING ROOM ---
# We wait 5 seconds to let the AWS tunnel stabilize
sleep 5

# --- 4. THE FASTAPI BACKEND (Tab 2) ---
# Opens a new tab in the current frontmost terminal window
osascript -e "tell application \"Terminal\" to activate" \
          -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
          -e "delay 0.5" \
          -e "tell application \"Terminal\" to do script \"cd '$PROJECT_ROOT' && source .venv/bin/activate && export PYTHONPATH=. && uvicorn backend.main:app --port 8000 --reload\" in front window"
echo "✅ Step 2: FastAPI Backend launching..."

# --- 5. THE REACT FRONTEND (Tab 3) ---
# Opens a new tab in the current frontmost terminal window
osascript -e "tell application \"Terminal\" to activate" \
          -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
          -e "delay 0.5" \
          -e "tell application \"Terminal\" to do script \"cd '$PROJECT_ROOT'/frontend && npm run dev\" in front window"
echo "✅ Step 3: React Frontend starting..."

echo "------------------------------------------------"
echo "All systems are GO."
echo "Terminal Tab 1: AWS RDS Tunnel"
echo "Terminal Tab 2: Backend API (http://localhost:8000)"
echo "Terminal Tab 3: UI Dashboard (http://localhost:5173)"
echo "------------------------------------------------"
