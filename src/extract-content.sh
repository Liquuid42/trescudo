#!/bin/bash
# Extract page content between header and footer for migration

FILE=$1
if [ -z "$FILE" ]; then
    echo "Usage: $0 <html-file>"
    exit 1
fi

# Find line numbers
START=$(grep -n "breadcumb-wrapper\|<section class=\"space\|<div class=\"overflow-hidden space" "$FILE" | head -1 | cut -d: -f1)
END=$(grep -n "Footer Area\|footer class=\"footer-wrapper" "$FILE" | head -1 | cut -d: -f1)

if [ -z "$START" ] || [ -z "$END" ]; then
    echo "Error: Could not find content boundaries"
    exit 1
fi

# Calculate end line (before footer)
END=$((END - 1))

echo "Extracting lines $START to $END from $FILE"
sed -n "${START},${END}p" "$FILE"
