#!/bin/bash
# Automated HTML to Nunjucks migration script
# Extracts metadata and content, creates .njk files

set -e

PAGES_DIR="/Users/johnsmith/Desktop/work/trescudo/src/pages"
cd "$PAGES_DIR"

# Function to extract metadata from HTML
extract_title() {
    grep '<title>' "$1" | sed 's/.*<title>\(.*\)<\/title>.*/\1/' | head -1
}

extract_description() {
    grep 'name="description"' "$1" | sed 's/.*content="\([^"]*\)".*/\1/' | head -1
}

extract_keywords() {
    grep 'name="keywords"' "$1" | sed 's/.*content="\([^"]*\)".*/\1/' | head -1
}

extract_og_title() {
    grep 'property="og:title"' "$1" | sed 's/.*content="\([^"]*\)".*/\1/' | head -1
}

extract_og_image() {
    grep 'property="og:image"' "$1" | sed 's/.*content="\([^"]*\)".*/\1/' | head -1
}

extract_canonical() {
    grep 'rel="canonical"' "$1" | sed 's/.*href="https:\/\/trescudo.com\/\([^"]*\)".*/\1/' | head -1
}

# Function to extract page content
extract_content() {
    local FILE=$1
    # Find start line (breadcrumb or first section)
    local START=$(grep -n "breadcumb-wrapper\|<section class=\"space\|<div class=\"overflow-hidden space" "$FILE" | head -1 | cut -d: -f1)
    # Find end line (footer start)
    local END=$(grep -n "Footer Area\|footer class=\"footer-wrapper" "$FILE" | head -1 | cut -d: -f1)

    if [ -z "$START" ] || [ -z "$END" ]; then
        echo "Error: Could not find content boundaries in $FILE" >&2
        return 1
    fi

    # Extract content (before footer)
    END=$((END - 1))
    sed -n "${START},${END}p" "$FILE"
}

# Function to create .njk file
create_njk() {
    local HTML_FILE=$1
    local BASENAME=$(basename "$HTML_FILE" .html)
    local NJK_FILE="${BASENAME}.njk"

    echo "Processing: $HTML_FILE → $NJK_FILE"

    # Extract metadata
    TITLE=$(extract_title "$HTML_FILE")
    DESCRIPTION=$(extract_description "$HTML_FILE")
    KEYWORDS=$(extract_keywords "$HTML_FILE")
    OG_TITLE=$(extract_og_title "$HTML_FILE")
    OG_IMAGE=$(extract_og_image "$HTML_FILE")
    SLUG=$(extract_canonical "$HTML_FILE")

    # Default slug if not found
    if [ -z "$SLUG" ]; then
        SLUG="$BASENAME"
    fi

    # Default OG title if not found
    if [ -z "$OG_TITLE" ]; then
        OG_TITLE="Trescudo Cybersecurity"
    fi

    # Default OG image if not found
    if [ -z "$OG_IMAGE" ]; then
        OG_IMAGE="http://trescudo.com/thumbnail.jpg"
    fi

    # Create .njk file with front matter
    cat > "$NJK_FILE" << NJKEOF
---
layout: base.njk
title: "$TITLE"
description: "$DESCRIPTION"
keywords: "$KEYWORDS"
slug: "$SLUG"
ogImage: "$OG_IMAGE"
ogTitle: "$OG_TITLE"
ctaText: "Contact Us"
ctaLink: "/contact"
---

{# PAGE CONTENT ONLY #}
NJKEOF

    # Extract and append content
    extract_content "$HTML_FILE" >> "$NJK_FILE"

    if [ $? -eq 0 ]; then
        echo "✅ Created: $NJK_FILE"
        return 0
    else
        echo "❌ Failed: $NJK_FILE"
        rm -f "$NJK_FILE"
        return 1
    fi
}

# Main migration loop
echo "=========================================="
echo "HTML to Nunjucks Migration Script"
echo "=========================================="
echo ""

MIGRATED=0
FAILED=0

# Find all .html files (not .html.bak)
for HTML_FILE in *.html; do
    # Skip if no files found
    [ -e "$HTML_FILE" ] || continue

    # Skip backup files
    if [[ "$HTML_FILE" == *.html.bak ]]; then
        continue
    fi

    # Create .njk file
    if create_njk "$HTML_FILE"; then
        # Backup original HTML
        mv "$HTML_FILE" "${HTML_FILE}.bak"
        echo "📦 Backed up: $HTML_FILE → ${HTML_FILE}.bak"
        ((MIGRATED++))
    else
        ((FAILED++))
    fi

    echo ""
done

echo "=========================================="
echo "Migration Summary"
echo "=========================================="
echo "✅ Successfully migrated: $MIGRATED pages"
echo "❌ Failed: $FAILED pages"
echo ""
echo "Next steps:"
echo "  1. Review generated .njk files"
echo "  2. Run: npm run build"
echo "  3. Test all pages"
echo "  4. Commit changes"
