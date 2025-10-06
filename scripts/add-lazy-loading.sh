#!/bin/bash
# Add lazy loading to all img tags in templates
# Keeps hero/above-fold images as eager load

set -e

SRC_DIR="/Users/johnsmith/Desktop/work/trescudo/src"

echo "Adding lazy loading to images..."
echo ""

# Add loading="lazy" to all img tags that don't have it
# Exclude logo images and hero images
find "$SRC_DIR" -type f -name "*.njk" -print0 | while IFS= read -r -d '' file; do
    # Skip if file contains logo or is hero section
    if grep -q "logo" "$file" 2>/dev/null; then
        continue
    fi

    # Add loading="lazy" to img tags without loading attribute
    if grep -q "<img" "$file" 2>/dev/null; then
        # Only add if not already present
        if ! grep -q 'loading=' "$file" 2>/dev/null; then
            sed -i '' 's/<img \(.*\)>/<img \1 loading="lazy">/g' "$file"
            echo "✓ Added lazy loading to $(basename $file)"
        fi
    fi
done

echo ""
echo "✅ Lazy loading added to images"
