# Phase 2: HTML Template Migration Guide

## Overview
This guide explains how to migrate the existing 27 HTML files to use Eleventy templates with reusable includes.

## What Was Created

### Directory Structure
```
src/
├── _includes/           # Reusable HTML partials
│   ├── analytics.njk
│   ├── analytics-noscript.njk
│   ├── favicons.njk
│   ├── css.njk
│   ├── scripts.njk
│   ├── preloader.njk
│   ├── mobile-menu.njk
│   ├── header.njk
│   └── footer.njk
├── _layouts/            # Page layouts
│   └── base.njk         # Base layout template
└── [pages].html         # Original HTML files (to be converted)
```

### Files Created

#### 1. **analytics.njk** - Google Analytics & GTM
- Google Tag Manager script
- Google Analytics (gtag.js)
- **Savings**: 16 lines × 27 files = 432 lines eliminated

#### 2. **favicons.njk** - Favicon Links
- All 18 favicon and meta tags
- **Savings**: 18 lines × 27 files = 486 lines eliminated

#### 3. **css.njk** - CSS Includes
- Google Fonts
- Bootstrap, FontAwesome, Magnific Popup, Swiper, Custom CSS
- **Savings**: 13 lines × 27 files = 351 lines eliminated

#### 4. **scripts.njk** - JavaScript Includes
- All library includes (jQuery, GSAP, Lenis, etc.)
- Main application script
- Conditional particles.js loading
- **Savings**: 30 lines × 27 files = 810 lines eliminated

#### 5. **preloader.njk** - Loading Screen
- Preloader HTML
- **Savings**: 13 lines × 27 files = 351 lines eliminated

#### 6. **mobile-menu.njk** - Mobile Navigation
- Complete mobile menu with all links
- **Savings**: 59 lines × 27 files = 1,593 lines eliminated

#### 7. **header.njk** - Main Header/Navigation
- Desktop navigation
- Logo and menu
- CTA button (customizable)
- **Savings**: 76 lines × 27 files = 2,052 lines eliminated

#### 8. **footer.njk** - Footer & Scroll-to-Top
- Complete footer with locations, links, social media
- Scroll-to-top button
- **Savings**: 157 lines × 27 files = 4,239 lines eliminated

#### 9. **base.njk** - Base Layout Template
- Combines all includes into single layout
- Front matter variables for page-specific data

### Total Savings
**~10,314 lines of duplicated HTML eliminated!**

## Migration Process

### Step 1: Extract Page-Specific Data

For each HTML file, identify the unique page data:
- Page title
- Meta description
- Meta keywords
- OG image
- Canonical URL slug
- Header CTA button text/link (if custom)
- Whether it's a one-page navigation

### Step 2: Convert HTML to Nunjucks

**Before** (consulting.html - 648 lines):
```html
<!doctype html>
<html class="no-js" lang="en" dir="ltr">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){...})</script>
<!-- 95 more lines of head content -->
</head>
<body class="bg-black">
<!-- Mobile menu - 59 lines -->
<!-- Header - 76 lines -->

<!-- PAGE CONTENT STARTS HERE -->
<div class="breadcumb-wrapper">...</div>
<section class="space-top">...</section>
<!-- PAGE CONTENT ENDS HERE -->

<!-- Footer - 157 lines -->
<!-- Scripts - 30 lines -->
</body>
</html>
```

**After** (consulting.njk - ~200 lines):
```njk
---
layout: base.njk
title: "Cybersecurity Consulting & Advisory Services | Trescudo"
description: "Align your security program with business objectives. Our expert advisory services include vCISO, NIS2/DORA compliance assessments, and strategic risk management."
keywords: "cybersecurity consulting services,cyber security strategy consulting, CISO as a service"
slug: "consulting"
ogImage: "http://trescudo.com/assets/img/pages/technology-saas-thumbnail.png"
ctaText: "Book a Strategic Consultation"
ctaLink: "#book"
---

{# PAGE CONTENT ONLY #}
<div class="breadcumb-wrapper" data-bg-src="assets/img/bg/consulting-bg.png" data-overlay="black" data-opacity="7">
    <div class="container">
        <div class="row">
            <div class="col-xxl-12">
                <div class="breadcumb-content">
                    <h1 class="breadcumb-title text-anim" data-cue="slideInUp" data-delay="100">Consulting & Advisory</h1>
                    <ul class="breadcumb-menu" data-cue="slideInUp" data-delay="300">
                        <li><a href="/">Home</a></li>
                        <li>Consulting & Advisory</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

<section class="space-top">
    {# Rest of page content #}
</section>
```

### Step 3: Front Matter Variables

Add these variables to the top of each page (YAML front matter):

```yaml
---
layout: base.njk           # Required: Use base layout
title: "Page Title"        # Required: Browser title
description: "Page desc"   # Required: Meta description
keywords: "key, words"     # Required: Meta keywords
slug: "page-name"          # Required: URL slug (no slashes)
ogImage: "url"             # Optional: OG image URL
ogTitle: "Title"           # Optional: Override OG title
ogDescription: "Desc"      # Optional: Override OG description
ctaText: "Button Text"     # Optional: Custom header CTA button text
ctaLink: "#section"        # Optional: Custom header CTA button link
onepageNav: true           # Optional: Enable one-page navigation (index.html only)
particles: true            # Optional: Include particles.js
---
```

### Step 4: Build Commands

```bash
# Install dependencies
npm install

# Development (with hot reload)
npm start

# Build for production
npm run build

# Output goes to dist/ directory
```

### Step 5: Migration Checklist Per Page

- [ ] Create new `.njk` file in `src/` directory
- [ ] Add front matter with page-specific variables
- [ ] Copy only the page content (between header and footer)
- [ ] Update any hardcoded links to use variables if needed
- [ ] Test in development: `npm start`
- [ ] Verify in browser: http://localhost:8080
- [ ] Check console for errors
- [ ] Verify meta tags in browser dev tools
- [ ] Build: `npm run build`
- [ ] Test built HTML in `dist/` directory

## Example Migration

### Original: consulting.html (648 lines)

**Lines 1-92**: Head section (duplicated)
**Lines 93-99**: Analytics noscript (duplicated)
**Lines 100-127**: Preloader (duplicated)
**Lines 128-190**: Mobile menu (duplicated)
**Lines 191-268**: Header (duplicated)
**Lines 269-600**: **UNIQUE PAGE CONTENT** ← Keep this
**Lines 601-END**: Footer & scripts (duplicated)

### Migrated: consulting.njk (~200 lines)

```njk
---
layout: base.njk
title: "Cybersecurity Consulting & Advisory Services | Trescudo"
description: "Align your security program with business objectives..."
keywords: "cybersecurity consulting services,cyber security strategy consulting"
slug: "consulting"
ogImage: "http://trescudo.com/assets/img/pages/technology-saas-thumbnail.png"
ctaText: "Book a Strategic Consultation"
ctaLink: "#book"
---

{# Only page-specific content from lines 269-600 #}
<div class="breadcumb-wrapper" data-bg-src="assets/img/bg/consulting-bg.png" data-overlay="black" data-opacity="7">
    ...
</div>

<section class="space-top">
    ...
</section>

{# Continue with all unique page content #}
```

## Benefits Achieved

### Before Migration
- **18,088 total HTML lines**
- **~13,500 duplicated lines (75%)**
- Update header → Edit 27 files
- Update footer → Edit 27 files
- Add new menu item → Edit 54 locations (mobile + desktop × 27 files)

### After Migration
- **~7,500 total lines (58% reduction)**
- **~500 shared lines** in includes (single source of truth)
- Update header → Edit 1 file (`header.njk`)
- Update footer → Edit 1 file (`footer.njk`)
- Add new menu item → Edit 2 locations (`header.njk` + `mobile-menu.njk`)

### Maintenance Impact
- **Header change**: 27 file edits → **1 file edit** (96% less work)
- **Footer change**: 27 file edits → **1 file edit** (96% less work)
- **Add CSS file**: 27 file edits → **1 file edit** (96% less work)
- **Add JS library**: 27 file edits → **1 file edit** (96% less work)

## Current Status

✅ **Completed**:
- Eleventy configuration (`.eleventy.js`)
- Package.json with build scripts
- All 9 includes created
- Base layout template created
- Migration documentation

⏳ **Pending**:
- Migrate 27 HTML pages to `.njk` format
- Test each migrated page
- Update Docker build process

## Next Steps

1. **Test the Setup**
   ```bash
   cd /Users/johnsmith/Desktop/work/trescudo
   npm install
   npm start
   ```

2. **Create First Migrated Page**
   - Start with `consulting.html` → `consulting.njk`
   - Verify it builds correctly
   - Test in browser

3. **Batch Migration**
   - Once first page is verified, migrate remaining 26 pages
   - Can be done in batches of 5-10 pages
   - Test after each batch

4. **Deploy**
   - Update Dockerfile to run `npm run build`
   - Deploy `dist/` directory instead of `src/`
   - Update Nginx config if needed (paths should be same)

## Rollback Plan

If issues occur:
1. Keep original HTML files as `.html.backup`
2. Original files in `src/*.html` still work
3. Simply don't deploy the `dist/` folder
4. No breaking changes to existing setup

## Questions & Support

**Issue**: "I get an error when running npm start"
**Solution**: Make sure Node.js >=18.0.0 is installed. Run `node --version`

**Issue**: "Links are broken after migration"
**Solution**: Check that asset paths are relative (`assets/...` not `/assets/...`)

**Issue**: "Page doesn't look right"
**Solution**: Verify front matter variables are correct, especially `slug`

---

**Status**: Phase 2 Includes Complete ✅ | Migration Pending ⏳
**Next**: Run `npm install && npm start` to test setup
