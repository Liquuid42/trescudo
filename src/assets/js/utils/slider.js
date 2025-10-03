/**
 * Slider Module
 * Handles Swiper slider initialization and configuration
 */

export const slider = {
    /**
     * Initialize all sliders
     */
    initSliders() {
        $('.th-slider').each(function () {
            const thSlider = $(this);
            const settings = $(this).data('slider-options') || {};

            // Store references to the navigation buttons
            const prevArrow = thSlider.find('.slider-prev');
            const nextArrow = thSlider.find('.slider-next');
            const paginationEl1 = thSlider.find('.slider-pagination').get(0);
            const paginationEl2 = thSlider.find('.slider-pagination2');
            const progressBarEl = thSlider.find('.slider-pagination-progressbar2 .slider-progressbar-fill');

            const sliderDefault = {
                slidesPerView: 1,
                spaceBetween: settings.spaceBetween || 24,
                loop: settings.loop !== false,
                speed: settings.speed || 1000,
                autoplay: settings.autoplay || { delay: 6000, disableOnInteraction: false },
                navigation: {
                    prevEl: prevArrow.get(0),
                    nextEl: nextArrow.get(0),
                },
                pagination: {
                    el: paginationEl1,
                    type: settings.paginationType || 'bullets',
                    clickable: true,
                    renderBullet: function (index, className) {
                        const number = index + 1;
                        const formattedNumber = number < 10 ? '0' + number : number;
                        return '<span class="' + className + '" aria-label="Go to Slide ' + formattedNumber + '"></span>';
                    },
                },
                on: {
                    init: function () {
                        updatePagination(this);
                        updateProgressBar(this);
                    },
                    slideChange: function () {
                        updatePagination(this);
                        updateProgressBar(this);
                    },
                },
            };

            const options = $.extend({}, sliderDefault, settings);
            const swiperInstance = new Swiper(thSlider.get(0), options);

            // Update Pagination and other UI elements
            function updatePagination(swiper) {
                const activeIndex = swiper.realIndex + 1;
                const totalSlides = swiper.slides.length;
                paginationEl2.html(
                    '<span class="current-slide">' +
                    (activeIndex < 10 ? '0' + activeIndex : activeIndex) +
                    '</span> <span class="divider">/</span> <span class="total-slides">' +
                    (totalSlides < 10 ? '0' + totalSlides : totalSlides) +
                    '</span>'
                );
            }

            function updateProgressBar(swiper) {
                const progress = ((swiper.realIndex + 1) / swiper.slides.length) * 100;
                progressBarEl.css('height', progress + '%');
            }

            if ($('.slider-area').length > 0) {
                $('.slider-area').closest(".container").parent().addClass("arrow-wrap");
            }
        });

        // Function to add animation classes
        function animationProperties() {
            $('[data-ani]').each(function () {
                const animationName = $(this).data('ani');
                $(this).addClass(animationName);
            });

            $('[data-ani-delay]').each(function () {
                const delayTime = $(this).data('ani-delay');
                $(this).css('animation-delay', delayTime);
            });
        }
        animationProperties();

        // Add click event handlers for external slider arrows based on data attributes
        $('[data-slider-prev], [data-slider-next]').on('click', function () {
            const sliderSelector = $(this).data('slider-prev') || $(this).data('slider-next');
            const targetSlider = $(sliderSelector);

            if (targetSlider.length) {
                const swiper = targetSlider[0].swiper;

                if (swiper) {
                    if ($(this).data('slider-prev')) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                }
            }
        });
    },

    /**
     * Check if page has sliders
     * @returns {boolean}
     */
    hasSliders() {
        return $('.th-slider').length > 0;
    }
};
