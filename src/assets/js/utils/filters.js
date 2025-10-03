/**
 * Filters Module
 * Handles Isotope filtering, counters, progress bars, and circular progress
 */

export const filters = {
    /**
     * Initialize Isotope filter
     */
    initIsotopeFilter() {
        $(".filter-active").imagesLoaded(function () {
            const $filter = ".filter-active",
                $filterItem = ".filter-item",
                $filterMenu = ".filter-menu-active";

            if ($($filter).length > 0) {
                const $grid = $($filter).isotope({
                    itemSelector: $filterItem,
                    filter: "*",
                    masonry: {},
                });

                // filter items on button click
                $($filterMenu).on("click", "button", function () {
                    const filterValue = $(this).attr("data-filter");
                    $grid.isotope({
                        filter: filterValue,
                    });
                });

                // Menu Active Class
                $($filterMenu).on("click", "button", function (event) {
                    event.preventDefault();
                    $(this).addClass("active");
                    $(this).siblings(".active").removeClass("active");
                });
            }
        });

        $(".masonary-active, .woocommerce-Reviews .comment-list").imagesLoaded(function () {
            const $filter = ".masonary-active, .woocommerce-Reviews .comment-list",
                $filterItem = ".filter-item, .woocommerce-Reviews .comment-list li";

            if ($($filter).length > 0) {
                $($filter).isotope({
                    itemSelector: $filterItem,
                    filter: "*",
                    masonry: {
                        columnWidth: 1,
                    },
                });
            }
            $('[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
                $($filter).isotope({
                    filter: "*",
                });
            });
        });
    },

    /**
     * Initialize counter up
     */
    initCounterUp() {
        $(".counter-number").counterUp({
            delay: 10,
            time: 1000,
        });
    },

    /**
     * Initialize progress bar animation
     */
    initProgressBar() {
        $('.progress-bar').waypoint(function() {
            $('.progress-bar').css({
                animation: "animate-positive 1.8s",
                opacity: "1"
            });
        }, { offset: '100%' });
    },

    /**
     * Initialize circular progress
     */
    initCircularProgress() {
        document.addEventListener("DOMContentLoaded", function () {
            const progressBars = document.querySelectorAll('.circular-progress');

            progressBars.forEach(progressBar => {
                const circle = progressBar.querySelector('.circle');
                const percentageDisplay = progressBar.querySelector('.percentage');
                const target = parseInt(progressBar.getAttribute('data-target'), 10);
                let progressValue = 0;

                const animateProgress = () => {
                    if (progressValue <= target) {
                        const offset = 100 - (progressValue * 100) / 100;
                        circle.style.strokeDashoffset = offset;
                        percentageDisplay.textContent = progressValue + "%";
                        progressValue++;
                        requestAnimationFrame(animateProgress);
                    }
                };

                animateProgress();
            });
        });
    },

    /**
     * Initialize price slider
     */
    initPriceSlider() {
        $(".price_slider").slider({
            range: true,
            min: 0,
            max: 350,
            values: [0, 350],
            slide: function (event, ui) {
                $(".from").text("$" + ui.values[0]);
                $(".to").text("$" + ui.values[1]);
            }
        });
        $(".from").text("$" + $(".price_slider").slider("values", 0));
        $(".to").text("$" + $(".price_slider").slider("values", 1));
    },

    /**
     * Check if page needs filter functionality
     * @returns {boolean}
     */
    hasFilters() {
        return $(".filter-active").length > 0 || $(".masonary-active").length > 0;
    },

    /**
     * Initialize all filter features
     */
    init() {
        if (this.hasFilters()) {
            this.initIsotopeFilter();
        }
        this.initCounterUp();
        this.initProgressBar();
        this.initCircularProgress();

        // Only init price slider if it exists
        if ($(".price_slider").length > 0) {
            this.initPriceSlider();
        }
    }
};
