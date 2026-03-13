#!/bin/bash
# Generate daily horoscopes for all 12 signs
# Run daily via cron: 0 6 * * * /path/to/generate-daily-horoscopes.sh

BASE_URL="${1:-https://askthestars.ai}"
SIGNS="aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces"

echo "🌟 Generating daily horoscopes from $BASE_URL"
echo "$(date)"
echo "---"

for sign in $SIGNS; do
  echo -n "  $sign... "
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/horoscope/$sign")
  echo "$status"
  sleep 1  # Be gentle with rate limits
done

echo "---"
echo "✦ Daily horoscopes generated"

# Also trigger weekly and monthly (they're cached, so cheap to call)
echo ""
echo "🌙 Generating weekly & monthly forecasts..."
for sign in $SIGNS; do
  curl -s -o /dev/null "$BASE_URL/api/horoscope/$sign/weekly"
  curl -s -o /dev/null "$BASE_URL/api/horoscope/$sign/monthly"
  sleep 1
done

echo "✦ All horoscopes generated"
