module.exports = {
  // Scan all built HTML files
  content: ['../dist/**/*.html'],

  // CSS files to purge
  css: ['assets/css/style.css'],

  // Output directory
  output: 'assets/css/',

  // Safelist: Classes that may be added dynamically by JavaScript
  safelist: {
    // Standard safelisting
    standard: [
      'active',
      'show',
      'open',
      'visible',
      'hidden',
      'collapsed',
      'item-active',
      'hover-item',
      'onepage-nav'
    ],
    // Pattern-based safelisting for dynamic classes
    greedy: [
      /^swiper-/,        // Swiper.js classes
      /^scrollCue/,      // ScrollCue animation classes
      /^text-anim/,      // Text animation classes
      /^data-/,          // Data attributes
      /^cue-/,           // Animation cue classes
      /^th-/,            // Theme prefix classes
      /^box-/,           // Box component classes
      /^btn/,            // Button variants
      /^slider-/,        // Slider component classes
      /^popup/,          // Magnific popup classes
      /^mfp/             // Magnific popup prefix
    ]
  },

  // Custom extractor to match Tailwind-style classes and dynamic patterns
  defaultExtractor: content => {
    // Match any word characters, hyphens, colons, and forward slashes
    // This catches classes like: hover:text-blue-500, lg:flex, data-cue="slideInUp"
    return content.match(/[\w-/:]+(?<!:)/g) || []
  }
};
