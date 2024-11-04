#!/bin/bash

# Set strict error handling
set -euo pipefail

# Load environment variables
if [ -f .env ]; then
  source .env
fi

# Validate required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: 'DATABASE_URL' not set in .env" >&2
  exit 1
fi
if [ -z "$NEXTAUTH_URL" ]; then
  echo "ERROR: 'NEXTAUTH_URL' not set in .env" >&2
  exit 1
fi
if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "ERROR: 'NEXTAUTH_SECRET' not set in .env" >&2
  exit 1
fi

# Define project root directory
PROJECT_ROOT=$(cd "$(dirname "$0")" && pwd)

# Define log file location
LOG_FILE="$PROJECT_ROOT/logs/startup.log"

# Define PID file location
PID_FILE="$PROJECT_ROOT/tmp/fitness-tracker.pid"

# Define service timeouts
SERVICE_TIMEOUT=60

# Define health check intervals
HEALTH_CHECK_INTERVAL=5

# Utility functions
log_info() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") INFO: $@" >> "$LOG_FILE"
}
log_error() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") ERROR: $@" >&2 >> "$LOG_FILE"
}
cleanup() {
  if [ -f "$PID_FILE" ]; then
    rm "$PID_FILE"
  fi
}
check_dependencies() {
  if ! command -v npm &> /dev/null; then
    log_error "Error: 'npm' is not installed. Please install it first."
    exit 1
  fi
  if ! command -v prisma &> /dev/null; then
    log_error "Error: 'prisma' is not installed. Please install it first."
    exit 1
  fi
}

# Health check functions
check_port() {
  nc -z "$1" "$2" &> /dev/null
  if [ $? -eq 0 ]; then
    return 0
  fi
  return 1
}
wait_for_service() {
  local service_port="$1"
  local service_host="$2"
  local timeout="$3"
  local counter=0
  while [[ $counter -lt $timeout ]]; do
    if check_port "$service_host" "$service_port"; then
      log_info "Service is ready on port $service_port"
      return 0
    fi
    sleep "$HEALTH_CHECK_INTERVAL"
    counter=$((counter + 1))
  done
  log_error "Service timeout: Service is not ready on port $service_port"
  exit 1
}
verify_service() {
  # Implement service-specific health checks here
  # Example for Node.js server
  # curl -s -o /dev/null -w "%{http_code}" "http://$1:$2/health"
  # if [ $? -eq 0 ]; then
  #   return 0
  # fi
  # return 1
}

# Service management functions
start_database() {
  # Start PostgreSQL using the DATABASE_URL env variable
  # Example command for PostgreSQL
  # sudo pg_ctl start -D /var/lib/postgresql/data -l /var/log/postgresql/postgresql.log
  log_info "Starting database service..."
  # ... database-specific startup command ...
  wait_for_service "localhost" "5432" "$SERVICE_TIMEOUT"
  if verify_service "localhost" "5432"; then
    log_info "Database service started successfully."
  fi
}
start_backend() {
  log_info "Starting backend service..."
  cd "$PROJECT_ROOT"
  # Start the Node.js backend server
  # Example command for Next.js
  npm run start
  # ... backend-specific startup command ...
  wait_for_service "localhost" "3000" "$SERVICE_TIMEOUT"
  if verify_service "localhost" "3000"; then
    log_info "Backend service started successfully."
  fi
}
start_frontend() {
  log_info "Starting frontend service..."
  cd "$PROJECT_ROOT"
  # Start the Next.js development server
  # Example command for Next.js
  npm run dev
  # ... frontend-specific startup command ...
  wait_for_service "localhost" "3000" "$SERVICE_TIMEOUT"
  if verify_service "localhost" "3000"; then
    log_info "Frontend service started successfully."
  fi
}
store_pid() {
  local pid="$1"
  echo "$pid" > "$PID_FILE"
  log_info "PID saved to: $PID_FILE"
}

# Main execution flow
check_dependencies
log_info "Starting Fitness Tracker MVP..."

# Start database service
start_database

# Start backend service
start_backend

# Start frontend service
start_frontend

# Store PID for graceful shutdown
store_pid $!

# Handle exit signals
trap cleanup EXIT
trap cleanup ERR

log_info "Fitness Tracker MVP started successfully."