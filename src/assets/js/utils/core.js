/**
 * Core Utilities
 * Shared helper functions used across modules
 */

export const core = {
    /**
     * Convert integer string to number
     * @param {string} str - String to convert
     * @returns {number}
     */
    convertInteger(str) {
        return parseInt(str, 10);
    },

    /**
     * Set background image from data attribute
     */
    setBackgroundImage() {
        if ($("[data-bg-src]").length > 0) {
            $("[data-bg-src]").each(function () {
                const src = $(this).attr("data-bg-src");
                $(this).css("background-image", "url(" + src + ")");
                $(this).removeAttr("data-bg-src").addClass("background-image");
            });
        }
    },

    /**
     * Set background color from data attribute
     */
    setBackgroundColor() {
        if ($('[data-bg-color]').length > 0) {
            $('[data-bg-color]').each(function () {
                const color = $(this).attr('data-bg-color');
                $(this).css('background-color', color);
                $(this).removeAttr('data-bg-color');
            });
        }
    },

    /**
     * Set theme color from data attribute
     */
    setThemeColor() {
        if ($('[data-theme-color]').length > 0) {
            $('[data-theme-color]').each(function () {
                const $color = $(this).attr('data-theme-color');
                $(this).get(0).style.setProperty('--theme-color', $color);
                $(this).removeAttr('data-theme-color');
            });
        }
    },

    /**
     * Set border color from data attribute
     */
    setBorderColor() {
        $('[data-border]').each(function() {
            const borderColor = $(this).data('border');
            $(this).css('--th-border-color', borderColor);
        });
    },

    /**
     * Set mask image from data attribute
     */
    setMaskImage() {
        if ($('[data-mask-src]').length > 0) {
            $('[data-mask-src]').each(function () {
                const mask = $(this).attr('data-mask-src');
                $(this).css({
                    'mask-image': 'url(' + mask + ')',
                    '-webkit-mask-image': 'url(' + mask + ')'
                });
                $(this).addClass('bg-mask');
                $(this).removeAttr('data-mask-src');
            });
        }
    },

    /**
     * Initialize all background utilities
     */
    initBackgrounds() {
        this.setBackgroundImage();
        this.setBackgroundColor();
        this.setThemeColor();
        this.setBorderColor();
        this.setMaskImage();
    }
};
