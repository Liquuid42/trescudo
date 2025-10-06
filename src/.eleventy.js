module.exports = function(eleventyConfig) {
    // Copy assets directly without processing
    eleventyConfig.addPassthroughCopy("assets/css");
    eleventyConfig.addPassthroughCopy("assets/js");
    eleventyConfig.addPassthroughCopy("assets/img");
    eleventyConfig.addPassthroughCopy("assets/fonts");
    eleventyConfig.addPassthroughCopy("assets/briefs");
    eleventyConfig.addPassthroughCopy("assets/guides");
    eleventyConfig.addPassthroughCopy("assets/reports");
    eleventyConfig.addPassthroughCopy("assets/notices");
    eleventyConfig.addPassthroughCopy("assets/sass");

    // Copy root files
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("sitemap.xml");
    eleventyConfig.addPassthroughCopy("llms.txt");
    eleventyConfig.addPassthroughCopy("_headers");

    // Watch for changes in CSS/JS
    eleventyConfig.addWatchTarget("assets/css/");
    eleventyConfig.addWatchTarget("assets/js/");

    // Enable quiet mode for cleaner output
    eleventyConfig.setQuietMode(true);

    // Image shortcodes for WebP and lazy loading
    eleventyConfig.addShortcode('image', function(src, alt = '', loading = 'lazy', className = '') {
        if (!src) return '';
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return `<picture>
  <source srcset="${webpSrc}" type="image/webp">
  <img src="${src}" alt="${alt}" loading="${loading}"${className ? ` class="${className}"` : ''}>
</picture>`;
    });

    eleventyConfig.addShortcode('bgImage', function(src) {
        if (!src) return '';
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        return `data-bg-src="${src}" data-bg-webp="${webpSrc}"`;
    });

    // Custom permalink processing to flatten pages/ directory structure
    eleventyConfig.addGlobalData("eleventyComputed", {
        permalink: function(data) {
            // For files in pages/ directory, strip the pages/ prefix from URL
            if (data.page.inputPath && data.page.inputPath.includes('/pages/')) {
                let filename = data.page.inputPath.split('/pages/')[1];
                let basename = filename.replace('.html', '').replace('.njk', '');
                return `/${basename}/index.html`;
            }
            // Return default permalink for other files
            return data.permalink;
        }
    });

    return {
        dir: {
            input: "./",
            output: "../dist",
            includes: "_includes",
            layouts: "_layouts",
            data: "_data"
        },
        templateFormats: ["html", "njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};
