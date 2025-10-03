/**
 * Miscellaneous Utilities
 * Image to SVG conversion, preloader, and other small utilities
 */

export const misc = {
    /**
     * Initialize preloader
     */
    initPreloader() {
        $(window).on("load", function () {
            $(".preloader").fadeOut();
        });

        if ($(".preloader").length > 0) {
            $(".preloaderCls").each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    $(".preloader").css("display", "none");
                });
            });
        }
    },

    /**
     * Convert images to inline SVG
     */
    initInlineSvg() {
        const cache = {};

        $.fn.inlineSvg = function fnInlineSvg() {
            this.each(imgToSvg);
            return this;
        };

        function imgToSvg() {
            const $img = $(this);
            const src = $img.attr("src");

            // fill cache by src with promise
            if (!cache[src]) {
                const d = $.Deferred();
                $.get(src, (data) => {
                    d.resolve($(data).find("svg"));
                });
                cache[src] = d.promise();
            }

            // replace img with svg when cached promise resolves
            cache[src].then((svg) => {
                const $svg = $(svg).clone();

                if ($img.attr("id")) $svg.attr("id", $img.attr("id"));
                if ($img.attr("class")) $svg.attr("class", $img.attr("class"));
                if ($img.attr("style")) $svg.attr("style", $img.attr("style"));

                if ($img.attr("width")) {
                    $svg.attr("width", $img.attr("width"));
                    if (!$img.attr("height")) $svg.removeAttr("height");
                }
                if ($img.attr("height")) {
                    $svg.attr("height", $img.attr("height"));
                    if (!$img.attr("width")) $svg.removeAttr("width");
                }

                $svg.insertAfter($img);
                $img.trigger("svgInlined", $svg[0]);
                $img.remove();
            });
        }

        $(".svg-img").inlineSvg();
    },

    /**
     * Initialize scrollCue animations
     */
    initScrollCue() {
        if (typeof scrollCue !== 'undefined') {
            scrollCue.init({
                percentage: 0.99,
                duration: 900,
            });
        }
    },

    /**
     * Initialize all miscellaneous features
     */
    init() {
        this.initPreloader();
        this.initInlineSvg();
        this.initScrollCue();
    }
};
