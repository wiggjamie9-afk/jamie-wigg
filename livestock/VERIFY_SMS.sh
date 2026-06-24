#!/bin/bash

# HerdCheck SMS Implementation Verification Script
# Run this to verify all Phase 1 components are in place

set -e

echo "🔍 HerdCheck Week 1 Phase 1: SMS Vet-Alert Verification"
echo "========================================================="
echo ""

PASS=0
FAIL=0

check_file() {
  local file=$1
  local pattern=$2
  local desc=$3

  if [ -f "$file" ]; then
    if grep -q "$pattern" "$file" 2>/dev/null; then
      echo "✅ $desc"
      ((PASS++))
    else
      echo "❌ $desc (pattern not found in $file)"
      ((FAIL++))
    fi
  else
    echo "❌ $desc (file not found: $file)"
    ((FAIL++))
  fi
}

echo "📁 Files Check:"
echo "---------------"
check_file "livestock/lib/sms.js" "sendVetAlert" "SMS client library exists"
check_file "livestock/api/sms/send/route.js" "POST /api/sms/send" "Cloudflare Worker endpoint exists"
check_file "livestock/api-mock.js" "Mock SMS API" "Mock API for development exists"
check_file "livestock/db.js" "sent_actions" "IndexedDB sent_actions store configured"
check_file "livestock/index.html" "send-vet-alert" "Result screen SMS button added"
check_file "livestock/index.html" "settings-vet-phone" "Settings vet phone field added"
check_file "livestock/index.html" "lib/sms.js" "SMS library linked in HTML"
check_file "livestock/app.js" "sendVetAlert" "App.js SMS send handler exists"
check_file "livestock/app.css" "btn-warning" "Button styling added"
echo ""

echo "📖 i18n Translations Check:"
echo "--------------------------"
check_file "livestock/i18n.js" "result.sendVetAlert" "English SMS translations"
check_file "livestock/i18n.js" "वेट को अलर्ट भेजें" "Hindi SMS translations"
echo ""

echo "📚 Documentation Check:"
echo "----------------------"
check_file "livestock/TESTING_SMS.md" "Week 1 Phase 1" "Testing guide exists"
check_file "livestock/SMS_IMPLEMENTATION_SUMMARY.md" "Deliverables Complete" "Implementation summary exists"
echo ""

echo "🔬 Feature Checks:"
echo "-----------------"
if node -c livestock/lib/sms.js 2>/dev/null; then
  echo "✅ lib/sms.js syntax valid"
  ((PASS++))
else
  echo "❌ lib/sms.js has syntax errors"
  ((FAIL++))
fi

if node -c livestock/db.js 2>/dev/null; then
  echo "✅ db.js syntax valid"
  ((PASS++))
else
  echo "❌ db.js has syntax errors"
  ((FAIL++))
fi

if node -c livestock/app.js 2>/dev/null; then
  echo "✅ app.js syntax valid"
  ((PASS++))
else
  echo "❌ app.js has syntax errors"
  ((FAIL++))
fi

echo ""
echo "📊 Results:"
echo "-----------"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 All checks passed! SMS vet-alert implementation is complete."
  exit 0
else
  echo "⚠️  $FAIL check(s) failed. Review the output above."
  exit 1
fi
