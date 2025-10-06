#!/bin/bash
# Download Google Fonts for self-hosting
# Open Sans (300, 400, 700) and Exo (400, 700)

set -e

FONTS_DIR="/Users/johnsmith/Desktop/work/trescudo/src/assets/fonts"

echo "📥 Downloading Google Fonts for self-hosting..."
echo ""

# Open Sans 300
echo "Downloading Open Sans 300..."
curl -sL "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.woff2" \
  -o "$FONTS_DIR/open-sans/open-sans-300.woff2"

# Open Sans 400
echo "Downloading Open Sans 400..."
curl -sL "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4gaVc.woff2" \
  -o "$FONTS_DIR/open-sans/open-sans-400.woff2"

# Open Sans 700
echo "Downloading Open Sans 700..."
curl -sL "https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4gaVc.woff2" \
  -o "$FONTS_DIR/open-sans/open-sans-700.woff2"

# Exo 400
echo "Downloading Exo 400..."
curl -sL "https://fonts.gstatic.com/s/exo/v21/4UaZrEtFpBI4f1ZSIK9d4LjJ4lM2CwNsOl4p5Is.woff2" \
  -o "$FONTS_DIR/exo/exo-400.woff2"

# Exo 700
echo "Downloading Exo 700..."
curl -sL "https://fonts.gstatic.com/s/exo/v21/4UaZrEtFpBI4f1ZSIK9d4LjJ4tM3CwNsOl4p5Is.woff2" \
  -o "$FONTS_DIR/exo/exo-700.woff2"

echo ""
echo "✅ Fonts downloaded successfully!"
ls -lh "$FONTS_DIR/open-sans/" "$FONTS_DIR/exo/"
