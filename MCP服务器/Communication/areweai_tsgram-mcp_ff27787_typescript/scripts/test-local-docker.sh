#!/bin/bash

# Local Docker Testing Script for Signal AI Chat Bot
# Usage: ./scripts/test-local-docker.sh

set -e

echo "🧪 Testing Signal AI Chat Bot with Docker"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your actual API keys and phone number"
    echo "   Required: SIGNAL_PHONE_NUMBER, OPENAI_API_KEY or OPENROUTER_API_KEY"
    exit 1
fi

# Build and start services
echo "🏗️ Building and starting Docker services..."
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

# Test Signal API health
echo "🔗 Testing Signal API health..."
if curl -f http://localhost:8080/v1/health 2>/dev/null; then
    echo "✅ Signal API is healthy"
else
    echo "❌ Signal API is not responding"
    docker-compose logs signal-api
    exit 1
fi

# Test Signal Bot health
echo "🤖 Testing Signal Bot health..."
if curl -f http://localhost:3000/health 2>/dev/null; then
    echo "✅ Signal Bot is healthy"
else
    echo "❌ Signal Bot is not responding"
    docker-compose logs signal-bot
    exit 1
fi

echo ""
echo "🎉 All services are running successfully!"
echo ""
echo "📱 Next steps for Signal setup:"
echo ""
echo "1. Register your Signal phone number:"
echo "   curl -X POST 'http://localhost:8080/v1/register/+YOUR_PHONE_NUMBER'"
echo ""
echo "2. Check your phone for SMS verification code, then verify:"
echo "   curl -X POST 'http://localhost:8080/v1/register/+YOUR_PHONE_NUMBER/verify/123456'"
echo ""
echo "3. Test sending a message to yourself:"
echo "   curl -X POST 'http://localhost:8080/v2/send' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"number\": \"+YOUR_PHONE_NUMBER\","
echo "       \"recipients\": [\"+YOUR_PHONE_NUMBER\"],"
echo "       \"message\": \"!openai Hello from Docker!\""
echo "     }'"
echo ""
echo "4. Monitor logs:"
echo "   docker-compose logs -f"
echo ""
echo "5. Stop services when done:"
echo "   docker-compose down"
echo ""
echo "🔧 Troubleshooting:"
echo "   - If registration fails, try a different phone number"
echo "   - Check that your API keys are correctly set in .env"
echo "   - View individual service logs: docker-compose logs <service-name>"