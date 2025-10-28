#!/bin/bash

# Script to test trailing slash redirect behavior and performance impact
# Usage: ./test-trailing-slash.sh <url-without-trailing-slash>
# Example: ./test-trailing-slash.sh https://example.com/page

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <url-without-trailing-slash>"
    echo "Example: $0 https://example.com/page"
    exit 1
fi

URL_WITHOUT_SLASH="$1"
URL_WITH_SLASH="${1}/"

# Create temporary file for curl timing format
TIMING_FORMAT=$(mktemp)
cat > "$TIMING_FORMAT" << 'EOF'
{
  "dns_lookup": %{time_namelookup},
  "tcp_connection": %{time_connect},
  "tls_handshake": %{time_appconnect},
  "time_redirect": %{time_redirect},
  "time_to_first_byte": %{time_starttransfer},
  "total_time": %{time_total},
  "num_redirects": %{num_redirects},
  "http_code": %{http_code},
  "redirect_url": "%{redirect_url}"
}
EOF

echo "Testing trailing slash redirect behavior and performance"
echo "==========================================================="
echo ""

# Test WITHOUT trailing slash
echo "Testing: $URL_WITHOUT_SLASH"
echo "-----------------------------------------------------------"
curl -I "$URL_WITHOUT_SLASH" 2>&1 | head -15
echo ""
echo "Timing data:"
curl -L -w "@$TIMING_FORMAT" -o /dev/null -s "$URL_WITHOUT_SLASH"
echo ""
echo ""

# Test WITH trailing slash
echo "Testing: $URL_WITH_SLASH"
echo "-----------------------------------------------------------"
curl -I "$URL_WITH_SLASH" 2>&1 | head -15
echo ""
echo "Timing data:"
curl -L -w "@$TIMING_FORMAT" -o /dev/null -s "$URL_WITH_SLASH"
echo ""
echo ""

# Multiple runs for averaging
echo "Performance comparison (20 runs each):"
echo "==========================================================="
echo ""

declare -a times_without=()
declare -a times_with=()

echo -n "Running tests"
for i in {1..20}; do
    echo -n "."
    time_without=$(curl -L -w "%{time_total}" -o /dev/null -s "$URL_WITHOUT_SLASH")
    times_without+=($time_without)

    time_with=$(curl -L -w "%{time_total}" -o /dev/null -s "$URL_WITH_SLASH")
    times_with+=($time_with)
done
echo " done!"
echo ""

# Calculate averages
avg_without=$(printf '%s\n' "${times_without[@]}" | awk '{sum+=$1} END {print sum/NR}')
avg_with=$(printf '%s\n' "${times_with[@]}" | awk '{sum+=$1} END {print sum/NR}')

# Calculate difference
difference=$(echo "$avg_without - $avg_with" | bc)
percentage=$(echo "scale=2; ($difference / $avg_with) * 100" | bc)

echo "Average time WITHOUT trailing slash: ${avg_without}s"
echo "Average time WITH trailing slash:    ${avg_with}s"
echo "Difference:                          ${difference}s (${percentage}% slower)"
echo ""

# Cleanup
rm "$TIMING_FORMAT"

echo "TIP: Run this from multiple geographic locations to see CDN impact"
echo "TIP: Use WebPageTest.org for visual waterfall comparison"
