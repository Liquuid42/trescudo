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
