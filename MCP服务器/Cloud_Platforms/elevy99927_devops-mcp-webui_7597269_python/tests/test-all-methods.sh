#!/bin/bash

echo "🚀 Testing ALL MCP Bridge Methods"
echo "================================="

BASE_URL="http://localhost:9000"

echo ""
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq .

echo ""
echo "2. Testing kubectl_get (pods)..."
curl -s "$BASE_URL/kubectl_get" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"resourceType":"pods","namespace":"default"}' | jq '.items | length'

echo ""
echo "3. Testing kubectl_describe (deployment)..."
curl -s "$BASE_URL/kubectl_describe" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"resourceType":"deployment","name":"hello-mcp","namespace":"default"}' | jq '.metadata.name'

echo ""
echo "4. Testing kubectl_logs..."
FIRST_POD=$(curl -s "$BASE_URL/kubectl_get" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"resourceType":"pods","namespace":"default","labelSelector":"app=hello-mcp"}' | jq -r '.items[0].metadata.name')

if [ "$FIRST_POD" != "null" ]; then
  echo "Getting logs from pod: $FIRST_POD"
  curl -s "$BASE_URL/kubectl_logs" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$FIRST_POD\",\"namespace\":\"default\",\"tail\":5}" | jq -r '.output' | head -3
else
  echo "No pods found to get logs from"
fi

echo ""
echo "5. Testing kubectl_scale..."
curl -s "$BASE_URL/kubectl_scale" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"hello-mcp","namespace":"default","replicas":2,"resourceType":"deployment"}' | jq .

echo ""
echo "6. Testing kubectl_delete (create and delete a test pod)..."
# First create a test pod
curl -s "$BASE_URL/kubectl_apply" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"manifest":"apiVersion: v1\nkind: Pod\nmetadata:\n  name: test-delete-pod\n  namespace: default\nspec:\n  containers:\n  - name: nginx\n    image: nginx:alpine","namespace":"default"}' > /dev/null

sleep 2

# Then delete it
curl -s "$BASE_URL/kubectl_delete" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"resourceType":"pod","name":"test-delete-pod","namespace":"default"}' | jq .

echo ""
echo "7. Testing helm_install (nginx chart)..."
curl -s "$BASE_URL/helm_install" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-nginx",
    "chart": "nginx",
    "namespace": "test-helm",
    "repo": "https://charts.bitnami.com/bitnami",
    "values": {
      "replicaCount": 1,
      "service": {"type": "ClusterIP"}
    }
  }' | jq .

echo ""
echo "8. Testing helm_uninstall..."
sleep 5
curl -s "$BASE_URL/helm_uninstall" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test-nginx","namespace":"test-helm"}' | jq .

echo ""
echo "9. Testing exec_pod..."
if [ "$FIRST_POD" != "null" ]; then
  echo "Executing command in pod: $FIRST_POD"
  curl -s "$BASE_URL/exec_pod" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$FIRST_POD\",\"namespace\":\"default\",\"command\":\"echo 'Hello from pod'\"}" | jq .
else
  echo "No pods available for exec test"
fi

echo ""
echo "✅ All method tests completed!"
echo ""
echo "📊 Summary of tested methods:"
echo "   ✅ /health - Health check"
echo "   ✅ /kubectl_get - List resources"
echo "   ✅ /kubectl_describe - Describe resources"
echo "   ✅ /kubectl_apply - Apply manifests"
echo "   ✅ /kubectl_delete - Delete resources"
echo "   ✅ /kubectl_logs - Get logs"
echo "   ✅ /kubectl_scale - Scale resources"
echo "   ✅ /helm_install - Install Helm charts"
echo "   ✅ /helm_uninstall - Uninstall Helm releases"
echo "   ✅ /exec_pod - Execute commands in pods"
echo "   ⚠️  /port_forward - Port forwarding (long-running)"
echo "   ⚠️  /helm_upgrade - Helm upgrade (needs existing release)"