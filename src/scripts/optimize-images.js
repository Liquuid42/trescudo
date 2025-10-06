#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format with quality optimization
 * Generates multiple sizes for responsive images
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const DIST_IMG_DIR = path.join(__dirname, '../../dist/assets/img');
const QUALITY = 85; // WebP quality (0-100)
const SIZES = {
  thumbnail: 400,
  medium: 800,
  large: 1920
};

// Track statistics
const stats = {
  processed: 0,
  originalSize: 0,
  webpSize: 0,
  errors: []
};

/**
 * Convert image to WebP format
 */
async function convertToWebP(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();

    // Skip if already WebP or not an image
    if (ext === '.webp' || !['.jpg', '.jpeg', '.png'].includes(ext)) {
      return;
    }

    const dir = path.dirname(imagePath);
    const basename = path.basename(imagePath, ext);
    const webpPath = path.join(dir, `${basename}.webp`);

    // Skip if WebP already exists and is newer
    if (fs.existsSync(webpPath)) {
      const originalStat = fs.statSync(imagePath);
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtime > originalStat.mtime) {
        console.log(`⏭  Skipping ${path.relative(DIST_IMG_DIR, imagePath)} (WebP up to date)`);
        return;
      }
    }

    // Get original file size
    const originalSize = fs.statSync(imagePath).size;

    // Convert to WebP
    await sharp(imagePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    stats.processed++;
    stats.originalSize += originalSize;
    stats.webpSize += webpSize;

    console.log(`✓ ${path.relative(DIST_IMG_DIR, imagePath)} → ${(webpSize / 1024).toFixed(1)} KB (${savings}% smaller)`);

  } catch (error) {
    stats.errors.push({ file: imagePath, error: error.message });
    console.error(`✗ Error processing ${imagePath}: ${error.message}`);
  }
}

/**
 * Optimize large images by resizing
 */
async function optimizeLargeImage(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return;
    }

    const metadata = await sharp(imagePath).metadata();

    // Only resize if width > 1920px
    if (metadata.width <= SIZES.large) {
      return;
    }

    const originalSize = fs.statSync(imagePath).size;

    // Resize and optimize
    await sharp(imagePath)
      .resize(SIZES.large, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(imagePath + '.tmp');

    // Replace original
    fs.renameSync(imagePath + '.tmp', imagePath);

    const newSize = fs.statSync(imagePath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(`↓ Resized ${path.relative(DIST_IMG_DIR, imagePath)} from ${metadata.width}px → ${SIZES.large}px (${savings}% smaller)`);

  } catch (error) {
    console.error(`✗ Error optimizing ${imagePath}: ${error.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼  Image Optimization Starting...\n');
  console.log(`Directory: ${DIST_IMG_DIR}`);
  console.log(`Quality: ${QUALITY}%\n`);

  // Find all images
  const imagePatterns = [
    path.join(DIST_IMG_DIR, '**/*.jpg'),
    path.join(DIST_IMG_DIR, '**/*.jpeg'),
    path.join(DIST_IMG_DIR, '**/*.png')
  ];

  const images = [];
  for (const pattern of imagePatterns) {
    const matches = await glob(pattern);
    images.push(...matches);
  }

  console.log(`Found ${images.length} images to process\n`);

  // Step 1: Resize oversized images
  console.log('Step 1: Resizing oversized images...');
  for (const imagePath of images) {
    await optimizeLargeImage(imagePath);
  }
  console.log('');

  // Step 2: Convert to WebP
  console.log('Step 2: Converting to WebP...');
  for (const imagePath of images) {
    await convertToWebP(imagePath);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Image Optimization Complete!\n');
  console.log(`Images processed: ${stats.processed}`);
  console.log(`Original size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`WebP size: ${(stats.webpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((1 - stats.webpSize / stats.originalSize) * 100).toFixed(1)}%`);
  console.log(`Space saved: ${((stats.originalSize - stats.webpSize) / 1024 / 1024).toFixed(2)} MB`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${stats.errors.length}`);
    stats.errors.forEach(err => {
      console.log(`  - ${err.file}: ${err.error}`);
    });
  }

  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
