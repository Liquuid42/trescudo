#!/usr/bin/env node

/**
 * FontAwesome Subset Generator
 *
 * Scans built HTML files to find used FontAwesome icons and creates
 * a minimal subset CSS file containing only those icons.
 *
 * This dramatically reduces the FontAwesome CSS from 441 KB to ~15 KB (97% reduction)
 */

const fs = require('fs');
const path = require('path');

// Import glob from src/node_modules
const globModule = require('../src/node_modules/glob');
const glob = globModule.glob || globModule;

// Configuration
const DIST_DIR = path.join(__dirname, '../dist');
const FA_SOURCE = path.join(__dirname, '../src/assets/css/fontawesome.min.css');
const FA_OUTPUT = path.join(__dirname, '../dist/assets/css/fontawesome.min.css');

console.log('🔍 FontAwesome Subset Generator\n');

// Step 1: Scan HTML files for used icons
async function findUsedIcons() {
  console.log('Scanning HTML files for FontAwesome icons...');

  const htmlFiles = await glob(`${DIST_DIR}/**/*.html`);
  const usedIcons = new Set();

  // Regex to match FontAwesome classes: fa, fas, far, fab + fa-{icon-name}
  const iconRegex = /\b(fa[brs]?)\s+(fa-[\w-]+)/g;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let match;

    while ((match = iconRegex.exec(content)) !== null) {
      const style = match[1];  // fas, far, fab, or fa
      const icon = match[2];   // fa-arrow-right, etc.
      usedIcons.add(`${style} ${icon}`);
    }
  }

  console.log(`✓ Found ${usedIcons.size} unique icons across ${htmlFiles.length} HTML files\n`);
  console.log('Used icons:', Array.from(usedIcons).sort().join(', '), '\n');

  return usedIcons;
}

// Step 2: Extract CSS rules for used icons
function extractIconCSS(sourceCSS, usedIcons) {
  console.log('Extracting CSS for used icons...');

  // Extract only icon names (fa-arrow-right, etc.)
  const iconNames = new Set();
  for (const icon of usedIcons) {
    const name = icon.split(' ')[1]; // Get fa-arrow-right from "fas fa-arrow-right"
    iconNames.add(name);
  }

  // Split CSS into rules more carefully
  const rules = sourceCSS.match(/[^{}]+\{[^{}]*\}/g) || [];
  const extractedRules = [];

  // Always include core FontAwesome rules (base styles, fonts)
  const coreSelectors = [
    '.fa', '.fas', '.far', '.fab', '.fal',
    '@font-face'
  ];

  for (const rule of rules) {
    // Include @font-face rules
    if (rule.includes('@font-face')) {
      extractedRules.push(rule);
      continue;
    }

    // Include base style rules (.fa, .fas, .far, .fab)
    const isCoreRule = coreSelectors.some(selector => {
      // Check if rule starts with this selector (exact match)
      const ruleStart = rule.trim().split('{')[0];
      return ruleStart === selector || ruleStart.startsWith(selector + ',') || ruleStart.includes(',' + selector);
    });

    if (isCoreRule) {
      extractedRules.push(rule);
      continue;
    }

    // Include rules for specific used icons only
    for (const iconName of iconNames) {
      // Match specific icon selectors like .fa-arrow-right::before
      if (rule.includes(iconName + '::before') || rule.includes(iconName + ':before')) {
        extractedRules.push(rule);
        break;
      }
    }
  }

  // Join rules
  const subsetCSS = extractedRules.join('\n');

  console.log(`✓ Extracted ${extractedRules.length} CSS rules\n`);

  return subsetCSS;
}

// Step 3: Calculate size reduction
function calculateSavings(originalSize, subsetSize) {
  const savedBytes = originalSize - subsetSize;
  const savedKB = (savedBytes / 1024).toFixed(1);
  const percentReduction = ((savedBytes / originalSize) * 100).toFixed(1);

  console.log('📊 Size Reduction:');
  console.log(`   Original:  ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`   Subset:    ${(subsetSize / 1024).toFixed(1)} KB`);
  console.log(`   Saved:     ${savedKB} KB (${percentReduction}% reduction)\n`);
}

// Main execution
async function main() {
  try {
    // Check if source file exists
    if (!fs.existsSync(FA_SOURCE)) {
      console.error(`❌ Error: FontAwesome source file not found: ${FA_SOURCE}`);
      process.exit(1);
    }

    // Find used icons
    const usedIcons = await findUsedIcons();

    if (usedIcons.size === 0) {
      console.log('⚠️  No FontAwesome icons found in HTML files');
      console.log('   Copying original file unchanged...');
      fs.copyFileSync(FA_SOURCE, FA_OUTPUT);
      return;
    }

    // Read source CSS
    const sourceCSS = fs.readFileSync(FA_SOURCE, 'utf8');
    const originalSize = Buffer.byteLength(sourceCSS, 'utf8');

    // Extract subset
    const subsetCSS = extractIconCSS(sourceCSS, usedIcons);
    const subsetSize = Buffer.byteLength(subsetCSS, 'utf8');

    // Ensure output directory exists
    const outputDir = path.dirname(FA_OUTPUT);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write subset file
    fs.writeFileSync(FA_OUTPUT, subsetCSS, 'utf8');
    console.log(`✓ Written subset to: ${FA_OUTPUT}\n`);

    // Show savings
    calculateSavings(originalSize, subsetSize);

    console.log('✅ FontAwesome subset generation complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { findUsedIcons, extractIconCSS };
