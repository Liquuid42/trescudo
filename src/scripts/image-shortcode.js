/**
 * Eleventy Image Shortcode
 * Generates responsive <picture> tags with WebP and lazy loading
 */

module.exports = function(eleventyConfig) {
  /**
   * Responsive image shortcode
   * Usage: {% image "/assets/img/hero/hero-bg.jpg", "Hero background", "eager" %}
   */
  eleventyConfig.addShortcode('image', function(src, alt = '', loading = 'lazy', className = '') {
    if (!src) return '';

    // Convert to WebP path
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return `<picture>
  <source srcset="${webpSrc}" type="image/webp">
  <img src="${src}" alt="${alt}" loading="${loading}"${className ? ` class="${className}"` : ''}>
</picture>`;
  });

  /**
   * Background image with WebP support
   * Usage: {% bgImage "/assets/img/bg/about-bg.png" %}
   */
  eleventyConfig.addShortcode('bgImage', function(src) {
    if (!src) return '';

    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    // Returns data attribute for CSS background with WebP fallback
    return `data-bg-src="${src}" data-bg-webp="${webpSrc}"`;
  });
};
