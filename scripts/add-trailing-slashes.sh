#!/bin/bash
# Add trailing slashes to all internal page links for SEO
# Prevents 301 redirects by matching Eleventy's directory structure

set -e

INCLUDES_DIR="/Users/johnsmith/Desktop/work/trescudo/src/_includes"

echo "Adding trailing slashes to internal links..."
echo "Working directory: $INCLUDES_DIR"
echo ""

# List of all page slugs (excluding homepage)
PAGES=(
  "about" "contact" "error"
  "consulting" "managed-security-service-provider" "offensive-security" "implementation-integration"
  "cloud-security" "endpoint-security" "vulnerability-management" "privileged-access"
  "identity-fraud-prevention" "network-application-security" "agentic-ai-hyperautomation"
  "government-defense" "retail-e-commerce" "aviation" "manufacturing-industrial" "technology-saas"
  "guides" "cybersecurity-briefs" "reports" "ransomware-readiness-quick-scan" "vendor-quick-scan"
  "privacy-policy" "terms"
)

COUNT=0

for page in "${PAGES[@]}"; do
  # Update in all include files
  # Only add trailing slash if not already present
  for file in ${INCLUDES_DIR}/*.njk; do
    if grep -q "href=\"/${page}\"" "$file" 2>/dev/null; then
      sed -i '' "s|href=\"/${page}\"|href=\"/${page}/\"|g" "$file"
      echo "✓ Updated /${page} → /${page}/ in $(basename $file)"
      ((COUNT++))
    fi
  done
done

echo ""
echo "=========================================="
echo "✅ Updated $COUNT links across include files"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. cd src && npm run build"
echo "  2. Verify: grep 'href=\"/about/\"' ../dist/index.html"
echo "  3. Test: No more 301 redirects on internal links"
