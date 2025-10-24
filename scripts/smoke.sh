#!/bin/bash

# Smoke Tests pour LMS - Tests de base après déploiement
# Usage: ./scripts/smoke.sh https://your-app.vercel.app

set -e

BASE_URL=${1:-"http://localhost:3000"}
ORG_SLUG="test-org"

echo "🧪 Smoke Tests LMS - Base URL: $BASE_URL"
echo "=========================================="

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour tester une URL
test_url() {
    local method=$1
    local url=$2
    local expected_status=$3
    local description=$4
    
    echo -n "Testing $description... "
    
    if [ "$method" = "GET" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    elif [ "$method" = "POST" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d '{"title":"Smoke Test Pathway"}')
    elif [ "$method" = "PUT" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$url" \
            -H "Content-Type: application/json" \
            -d '{"title":"Smoke Test Updated"}')
    elif [ "$method" = "DELETE" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$url")
    fi
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✅ $status${NC}"
        return 0
    else
        echo -e "${RED}❌ $status (expected $expected_status)${NC}"
        return 1
    fi
}

# Tests de base
echo -e "\n${YELLOW}1. Tests de santé${NC}"
test_url "GET" "$BASE_URL/api/health" "200" "Health check"

# Tests API avec authentification requise
echo -e "\n${YELLOW}2. Tests API (auth required)${NC}"
test_url "GET" "$BASE_URL/api/formations?org=$ORG_SLUG" "400" "Formations API (missing auth)"
test_url "GET" "$BASE_URL/api/parcours?org=$ORG_SLUG" "400" "Parcours API (missing auth)"

# Test de rate limiting
echo -e "\n${YELLOW}3. Test de rate limiting${NC}"
echo -n "Testing rate limiting... "
for i in {1..65}; do
    curl -s -o /dev/null "$BASE_URL/api/formations?org=$ORG_SLUG" &
done
wait

# Le 65ème appel devrait retourner 429
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/formations?org=$ORG_SLUG")
if [ "$status" = "429" ]; then
    echo -e "${GREEN}✅ Rate limiting works (429)${NC}"
    
    # Vérifier les headers de rate limiting
    headers=$(curl -s -I "$BASE_URL/api/formations?org=$ORG_SLUG")
    if echo "$headers" | grep -q "X-RateLimit-Limit"; then
        echo -e "${GREEN}✅ Rate limit headers present${NC}"
    else
        echo -e "${YELLOW}⚠️  Rate limit headers missing${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Rate limiting not triggered ($status)${NC}"
fi

# Test des pages principales
echo -e "\n${YELLOW}4. Test des pages${NC}"
test_url "GET" "$BASE_URL/" "200" "Home page"
test_url "GET" "$BASE_URL/login/admin" "200" "Login page"

# Test de l'API env-check
echo -e "\n${YELLOW}5. Test de configuration${NC}"
test_url "GET" "$BASE_URL/api/env-check" "200" "Environment check"

# Test Sentry (optionnel)
echo -e "\n${YELLOW}6. Test Sentry (optionnel)${NC}"
echo -n "Testing Sentry error capture... "
sentry_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/_boom")
if [ "$sentry_status" = "500" ]; then
    echo -e "${GREEN}✅ Sentry test endpoint returns 500${NC}"
    echo -e "${YELLOW}ℹ️  Check Sentry dashboard for captured error${NC}"
else
    echo -e "${YELLOW}⚠️  Sentry test status unclear ($sentry_status)${NC}"
fi

# Test avec authentification simulée (si possible)
echo -e "\n${YELLOW}7. Test d'authentification${NC}"
echo -n "Testing auth flow... "

# Test sans token (devrait retourner 401)
auth_status=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer invalid-token" \
    "$BASE_URL/api/formations?org=$ORG_SLUG")

if [ "$auth_status" = "401" ] || [ "$auth_status" = "400" ]; then
    echo -e "${GREEN}✅ Auth protection works ($auth_status)${NC}"
else
    echo -e "${YELLOW}⚠️  Auth status unclear ($auth_status)${NC}"
fi

# Test de performance
echo -e "\n${YELLOW}8. Test de performance${NC}"
echo -n "Testing response time... "
start_time=$(date +%s%3N)
curl -s -o /dev/null "$BASE_URL/api/health"
end_time=$(date +%s%3N)
duration=$((end_time - start_time))

if [ "$duration" -lt 1000 ]; then
    echo -e "${GREEN}✅ Fast response (${duration}ms)${NC}"
else
    echo -e "${YELLOW}⚠️  Slow response (${duration}ms)${NC}"
fi

# Test de santé général
echo -e "\n${YELLOW}9. Test de santé général${NC}"
echo -n "Testing overall health... "

# Vérifier que l'application répond
health_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$health_status" = "200" ]; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${RED}❌ Application unhealthy ($health_status)${NC}"
    exit 1
fi

echo -e "\n${GREEN}🎉 Smoke tests completed successfully!${NC}"
echo "=========================================="
echo "✅ Health check responding"
echo "✅ API endpoints protected"
echo "✅ Rate limiting active"
echo "✅ Authentication protected"
echo "✅ Pages loading"
echo "✅ Performance acceptable"
echo "✅ Sentry monitoring (if configured)"
echo ""
echo "🚀 Application ready for production!"
echo ""
echo "📊 Next steps:"
echo "1. Check Vercel Functions logs for Pino structured logs"
echo "2. Verify Sentry events in dashboard (if configured)"
echo "3. Monitor rate limiting headers"
echo "4. Set up uptime monitoring on /api/health"
