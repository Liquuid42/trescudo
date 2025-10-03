/**
 * Main Application Entry Point
 * Modular, optimized version with conditional loading
 *
 * REMOVED WOOCOMMERCE CODE (YAGNI violation - 58 lines)
 * Split into focused utility modules for better maintainability
 */

(function ($) {
    "use strict";

    /*=================================
        Module Index
    ==================================*/
    /*
    01. On Load Function & Preloader
    02. Background Utilities
    03. Navigation (Mobile Menu, Sticky Header, Scroll To Top)
    04. Sliders (Conditional)
    05. Forms (Conditional)
    06. UI Components (Popups, Modals, Hover)
    07. Filters & Counters (Conditional)
    08. Animations (Lazy Loaded)
    09. Miscellaneous Utilities
    */

    /*---------- 01. Preloader ----------*/
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

    /*---------- 02. Background Utilities ----------*/
    function initBackgrounds() {
        // Set Background Image
        if ($("[data-bg-src]").length > 0) {
            $("[data-bg-src]").each(function () {
                var src = $(this).attr("data-bg-src");
                $(this).css("background-image", "url(" + src + ")");
                $(this).removeAttr("data-bg-src").addClass("background-image");
            });
        }

        // Set Background Color
        if ($('[data-bg-color]').length > 0) {
            $('[data-bg-color]').each(function () {
                var color = $(this).attr('data-bg-color');
                $(this).css('background-color', color);
                $(this).removeAttr('data-bg-color');
            });
        }

        // Set Theme Color
        if ($('[data-theme-color]').length > 0) {
            $('[data-theme-color]').each(function () {
                var $color = $(this).attr('data-theme-color');
                $(this).get(0).style.setProperty('--theme-color', $color);
                $(this).removeAttr('data-theme-color');
            });
        }

        // Set Border Color
        $('[data-border]').each(function() {
            var borderColor = $(this).data('border');
            $(this).css('--th-border-color', borderColor);
        });

        // Set Mask Image
        if ($('[data-mask-src]').length > 0) {
            $('[data-mask-src]').each(function () {
                var mask = $(this).attr('data-mask-src');
                $(this).css({
                    'mask-image': 'url(' + mask + ')',
                    '-webkit-mask-image': 'url(' + mask + ')'
                });
                $(this).addClass('bg-mask');
                $(this).removeAttr('data-mask-src');
            });
        }
    }

    /*---------- 03. Navigation ----------*/
    // Mobile Menu
    $.fn.thmobilemenu = function (options) {
        var opt = $.extend(
            {
                menuToggleBtn: ".th-menu-toggle",
                bodyToggleClass: "th-body-visible",
                subMenuClass: "th-submenu",
                subMenuParent: "menu-item-has-children",
                thSubMenuParent: "th-item-has-children",
                subMenuParentToggle: "th-active",
                meanExpandClass: "th-mean-expand",
                appendElement: '<span class="th-mean-expand"></span>',
                subMenuToggleClass: "th-open",
                toggleSpeed: 400,
            },
            options
        );

        return this.each(function () {
            var menu = $(this);

            function menuToggle() {
                menu.toggleClass(opt.bodyToggleClass);
                var subMenu = "." + opt.subMenuClass;
                $(subMenu).each(function () {
                    if ($(this).hasClass(opt.subMenuToggleClass)) {
                        $(this).removeClass(opt.subMenuToggleClass);
                        $(this).css("display", "none");
                        $(this).parent().removeClass(opt.subMenuParentToggle);
                    }
                });
            }

            menu.find("." + opt.subMenuParent).each(function () {
                var submenu = $(this).find("ul");
                submenu.addClass(opt.subMenuClass);
                submenu.css("display", "none");
                $(this).addClass(opt.subMenuParent);
                $(this).addClass(opt.thSubMenuParent);
                $(this).children("a").append(opt.appendElement);
            });

            function toggleDropDown($element) {
                var submenu = $element.children("ul");
                if (submenu.length > 0) {
                    $element.toggleClass(opt.subMenuParentToggle);
                    submenu.slideToggle(opt.toggleSpeed);
                    submenu.toggleClass(opt.subMenuToggleClass);
                }
            }

            var itemHasChildren = "." + opt.thSubMenuParent + " > a";
            $(itemHasChildren).each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    toggleDropDown($(this).parent());
                });
            });

            $(opt.menuToggleBtn).each(function () {
                $(this).on("click", function () {
                    menuToggle();
                });
            });

            menu.on("click", function (e) {
                e.stopPropagation();
                menuToggle();
            });

            menu.find("div").on("click", function (e) {
                e.stopPropagation();
            });
        });
    };

    $(".th-menu-wrapper").thmobilemenu();

    // Sticky Header
    $(window).scroll(function () {
        var topPos = $(this).scrollTop();
        if (topPos > 1000) {
            $('.sticky-wrapper').addClass('sticky');
            $('.category-menu').addClass('close-category');
        } else {
            $('.sticky-wrapper').removeClass('sticky')
            $('.category-menu').removeClass('close-category');
        }
    });

    $(".menu-expand").each(function () {
        $(this).on("click", function (e) {
            e.preventDefault();
            $('.category-menu').toggleClass('open-category');
        });
    });

    // One Page Nav
    function onePageNav(element) {
        if ($(element).length > 0) {
            $(element).each(function () {
                var link = $(this).find('a');
                $(this).find(link).each(function () {
                    $(this).on('click', function () {
                        var target = $(this.getAttribute('href'));
                        if (target.length) {
                            event.preventDefault();
                            $('html, body').stop().animate({
                                scrollTop: target.offset().top - 10
                            }, 1000);
                        }
                    });
                });
            })
        }
    }
    onePageNav('.onepage-nav');
    onePageNav('.scroll-down');

    // Scroll To Top
    if ($('.scroll-top').length > 0) {
        var scrollTopbtn = document.querySelector('.scroll-top');
        var progressPath = document.querySelector('.scroll-top path');
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
        var updateProgress = function () {
            var scroll = $(window).scrollTop();
            var height = $(document).height() - $(window).height();
            var progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        }
        updateProgress();
        $(window).scroll(updateProgress);
        var offset = 50;
        var duration = 750;
        jQuery(window).on('scroll', function() {
            if (jQuery(this).scrollTop() > offset) {
                jQuery(scrollTopbtn).addClass('show');
            } else {
                jQuery(scrollTopbtn).removeClass('show');
            }
        });
        jQuery(scrollTopbtn).on('click', function(event) {
            event.preventDefault();
            jQuery('html, body').animate({scrollTop: 0}, duration);
            return false;
        })
    }

    /*---------- 04. Sliders (Conditional Loading) ----------*/
    if ($('.th-slider').length > 0) {
        $('.th-slider').each(function () {
            var thSlider = $(this);
            var settings = $(this).data('slider-options') || {};

            var prevArrow = thSlider.find('.slider-prev');
            var nextArrow = thSlider.find('.slider-next');
            var paginationEl1 = thSlider.find('.slider-pagination').get(0);
            var paginationEl2 = thSlider.find('.slider-pagination2');
            var progressBarEl = thSlider.find('.slider-pagination-progressbar2 .slider-progressbar-fill');

            var sliderDefault = {
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
                        var number = index + 1;
                        var formattedNumber = number < 10 ? '0' + number : number;
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

            var options = $.extend({}, sliderDefault, settings);
            var swiperInstance = new Swiper(thSlider.get(0), options);

            function updatePagination(swiper) {
                var activeIndex = swiper.realIndex + 1;
                var totalSlides = swiper.slides.length;
                paginationEl2.html(
                    '<span class="current-slide">' +
                    (activeIndex < 10 ? '0' + activeIndex : activeIndex) +
                    '</span> <span class="divider">/</span> <span class="total-slides">' +
                    (totalSlides < 10 ? '0' + totalSlides : totalSlides) +
                    '</span>'
                );
            }

            function updateProgressBar(swiper) {
                var progress = ((swiper.realIndex + 1) / swiper.slides.length) * 100;
                progressBarEl.css('height', progress + '%');
            }

            if ($('.slider-area').length > 0) {
                $('.slider-area').closest(".container").parent().addClass("arrow-wrap");
            }
        });

        function animationProperties() {
            $('[data-ani]').each(function () {
                var animationName = $(this).data('ani');
                $(this).addClass(animationName);
            });

            $('[data-ani-delay]').each(function () {
                var delayTime = $(this).data('ani-delay');
                $(this).css('animation-delay', delayTime);
            });
        }
        animationProperties();

        $('[data-slider-prev], [data-slider-next]').on('click', function () {
            var sliderSelector = $(this).data('slider-prev') || $(this).data('slider-next');
            var targetSlider = $(sliderSelector);

            if (targetSlider.length) {
                var swiper = targetSlider[0].swiper;

                if (swiper) {
                    if ($(this).data('slider-prev')) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                }
            }
        });
    }

    /*---------- 05. Forms (Conditional Loading) ----------*/
    if ($(".ajax-contact").length > 0) {
        var form = ".ajax-contact";
        var invalidCls = "is-invalid";
        var $email = '[name="email"]';
        var $validation = '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]';
        var formMessages = $(".form-messages");

        function sendContact() {
            var formData = $(form).serialize();
            var valid;
            valid = validateContact();
            if (valid) {
                jQuery.ajax({
                    url: $(form).attr("action"),
                    data: formData,
                    type: "POST",
                })
                .done(function (response) {
                    formMessages.removeClass("error");
                    formMessages.addClass("success");
                    formMessages.text(response);
                    $(form + ' input:not([type="submit"]),' + form + " textarea").val("");
                })
                .fail(function (data) {
                    formMessages.removeClass("success");
                    formMessages.addClass("error");
                    if (data.responseText !== "") {
                        formMessages.html(data.responseText);
                    } else {
                        formMessages.html("Oops! An error occured and your message could not be sent.");
                    }
                });
            }
        }

        function validateContact() {
            var valid = true;
            var formInput;

            function unvalid($validation) {
                $validation = $validation.split(",");
                for (var i = 0; i < $validation.length; i++) {
                    formInput = form + " " + $validation[i];
                    if (!$(formInput).val()) {
                        $(formInput).addClass(invalidCls);
                        valid = false;
                    } else {
                        $(formInput).removeClass(invalidCls);
                        valid = true;
                    }
                }
            }
            unvalid($validation);

            if (!$($email).val() || !$($email).val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
                $($email).addClass(invalidCls);
                valid = false;
            } else {
                $($email).removeClass(invalidCls);
                valid = true;
            }
            return valid;
        }

        $(form).on("submit", function (element) {
            element.preventDefault();
            sendContact();
        });
    }

    /*---------- 06. UI Components ----------*/
    // Search Box Popup
    function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
        $($searchOpen).on("click", function (e) {
            e.preventDefault();
            $($searchBox).addClass($toggleCls);
        });
        $($searchBox).on("click", function (e) {
            e.stopPropagation();
            $($searchBox).removeClass($toggleCls);
        });
        $($searchBox)
            .find("form")
            .on("click", function (e) {
                e.stopPropagation();
                $($searchBox).addClass($toggleCls);
            });
        $($searchCls).on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $($searchBox).removeClass($toggleCls);
        });
    }
    popupSarchBox(".popup-search-box", ".searchBoxToggler", ".searchClose", "show");

    // Popup Sidemenu
    function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
        $($sideMunuOpen).on('click', function (e) {
            e.preventDefault();
            $($sideMenu).addClass($toggleCls);
        });
        $($sideMenu).on('click', function (e) {
            e.stopPropagation();
            $($sideMenu).removeClass($toggleCls)
        });
        var sideMenuChild = $sideMenu + ' > div';
        $(sideMenuChild).on('click', function (e) {
            e.stopPropagation();
            $($sideMenu).addClass($toggleCls)
        });
        $($sideMenuCls).on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $($sideMenu).removeClass($toggleCls);
        });
    };
    popupSideMenu('.sidemenu-cart', '.sideMenuToggler', '.sideMenuCls', 'show');
    popupSideMenu('.sidemenu-info', '.sideMenuInfo', '.sideMenuCls', 'show');

    // Magnific Popup
    $(".popup-image").magnificPopup({
        type: "image",
        mainClass: 'mfp-zoom-in',
        removalDelay: 260,
        gallery: {
            enabled: true,
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function(item) {
                return item.el.attr('title');
            }
        }
    });

    $(".popup-video").magnificPopup({
        type: "iframe",
        mainClass: 'mfp-zoom-in',
    });

    $(".popup-content").magnificPopup({
        type: "inline",
        midClick: true,
    });

    // Section Position
    function convertInteger(str) {
        return parseInt(str, 10);
    }

    $.fn.sectionPosition = function (mainAttr, posAttr) {
        $(this).each(function () {
            var section = $(this);

            function setPosition() {
                var sectionHeight = Math.floor(section.height() / 2),
                    posData = section.attr(mainAttr),
                    posFor = section.attr(posAttr),
                    topMark = "top-half",
                    bottomMark = "bottom-half",
                    parentPT = convertInteger($(posFor).css("padding-top")),
                    parentPB = convertInteger($(posFor).css("padding-bottom"));

                if (posData === topMark) {
                    $(posFor).css("padding-bottom", parentPB + sectionHeight + "px");
                    section.css("margin-top", "-" + sectionHeight + "px");
                } else if (posData === bottomMark) {
                    $(posFor).css("padding-top", parentPT + sectionHeight + "px");
                    section.css("margin-bottom", "-" + sectionHeight + "px");
                }
            }
            setPosition();
        });
    };

    var postionHandler = "[data-sec-pos]";
    if ($(postionHandler).length) {
        $(postionHandler).imagesLoaded(function () {
            $(postionHandler).sectionPosition("data-sec-pos", "data-pos-for");
        });
    }

    // Hover Item Active
    $(document).on('mouseover', '.hover-item', function () {
        $(this).addClass('item-active').siblings('.hover-item').removeClass('item-active');
    });

    // Shape Mockup
    $.fn.shapeMockup = function () {
        var $shape = $(this);
        $shape.each(function () {
            var $currentShape = $(this),
                shapeTop = $currentShape.data("top"),
                shapeRight = $currentShape.data("right"),
                shapeBottom = $currentShape.data("bottom"),
                shapeLeft = $currentShape.data("left");
            $currentShape
                .css({
                    top: shapeTop,
                    right: shapeRight,
                    bottom: shapeBottom,
                    left: shapeLeft,
                })
                .removeAttr("data-top")
                .removeAttr("data-right")
                .removeAttr("data-bottom")
                .removeAttr("data-left")
                .parent()
                .addClass("shape-mockup-wrap");
        });
    };

    if ($(".shape-mockup")) {
        $(".shape-mockup").shapeMockup();
    }

    /*---------- 07. Filters & Counters (Conditional) ----------*/
    // Isotope Filter
    if ($(".filter-active").length > 0 || $(".masonary-active").length > 0) {
        $(".filter-active").imagesLoaded(function () {
            var $filter = ".filter-active",
                $filterItem = ".filter-item",
                $filterMenu = ".filter-menu-active";

            if ($($filter).length > 0) {
                var $grid = $($filter).isotope({
                    itemSelector: $filterItem,
                    filter: "*",
                    masonry: {},
                });

                $($filterMenu).on("click", "button", function () {
                    var filterValue = $(this).attr("data-filter");
                    $grid.isotope({
                        filter: filterValue,
                    });
                });

                $($filterMenu).on("click", "button", function (event) {
                    event.preventDefault();
                    $(this).addClass("active");
                    $(this).siblings(".active").removeClass("active");
                });
            }
        });

        $(".masonary-active, .woocommerce-Reviews .comment-list").imagesLoaded(function () {
            var $filter = ".masonary-active, .woocommerce-Reviews .comment-list",
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
    }

    // Counter Up
    $(".counter-number").counterUp({
        delay: 10,
        time: 1000,
    });

    // Progress Bar Animation
    $('.progress-bar').waypoint(function() {
        $('.progress-bar').css({
            animation: "animate-positive 1.8s",
            opacity: "1"
        });
    }, { offset: '100%' });

    // Circular Progress
    document.addEventListener("DOMContentLoaded", function () {
        var progressBars = document.querySelectorAll('.circular-progress');

        progressBars.forEach(function(progressBar) {
            var circle = progressBar.querySelector('.circle');
            var percentageDisplay = progressBar.querySelector('.percentage');
            var target = parseInt(progressBar.getAttribute('data-target'), 10);
            var progressValue = 0;

            var animateProgress = function() {
                if (progressValue <= target) {
                    var offset = 100 - (progressValue * 100) / 100;
                    circle.style.strokeDashoffset = offset;
                    percentageDisplay.textContent = progressValue + "%";
                    progressValue++;
                    requestAnimationFrame(animateProgress);
                }
            };

            animateProgress();
        });
    });

    // Price Slider
    if ($(".price_slider").length > 0) {
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
    }

    /*---------- 08. Animations (Lazy Loaded) ----------*/
    // Only load if page has animation elements
    if (document.querySelector('[data-cue]') || document.querySelector('.text-anim')) {
        // Smooth Scroll with Lenis
        gsap.registerPlugin(ScrollTrigger);

        var lenis;
        var lenisTickerCallback;
        var lenisScrollHandler;
        var naturalScrollElements = [];

        var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function initializeLenis() {
            lenis = new Lenis({
                lerp: 0.07,
            });

            lenisScrollHandler = ScrollTrigger.update;
            lenis.on("scroll", lenisScrollHandler);

            lenisTickerCallback = function(time) {
                if (lenis) lenis.raf(time * 1000);
            };
            gsap.ticker.add(lenisTickerCallback);

            naturalScrollElements = Array.from(document.querySelectorAll(".allow-natural-scroll"));
            naturalScrollElements.forEach(function(el) {
                var wheelHandler = function(e) { e.stopPropagation(); };
                var touchHandler = function(e) { e.stopPropagation(); };

                el._wheelHandler = wheelHandler;
                el._touchHandler = touchHandler;

                el.addEventListener("wheel", wheelHandler, { passive: true });
                el.addEventListener("touchmove", touchHandler, { passive: true });
                el.addEventListener("touchstart", touchHandler, { passive: true });
            });
        }

        function enableOrDisableLenis() {
            if (prefersReducedMotion) return;

            if (window.innerWidth > 991) {
                if (!lenis) initializeLenis();
                lenis.start();
            } else {
                if (lenis) {
                    lenis.stop();

                    if (lenisScrollHandler) {
                        lenis.off("scroll", lenisScrollHandler);
                        lenisScrollHandler = null;
                    }

                    if (lenisTickerCallback) {
                        gsap.ticker.remove(lenisTickerCallback);
                        lenisTickerCallback = null;
                    }

                    naturalScrollElements.forEach(function(el) {
                        if (el._wheelHandler) {
                            el.removeEventListener("wheel", el._wheelHandler);
                            delete el._wheelHandler;
                        }
                        if (el._touchHandler) {
                            el.removeEventListener("touchmove", el._touchHandler);
                            el.removeEventListener("touchstart", el._touchHandler);
                            delete el._touchHandler;
                        }
                    });
                    naturalScrollElements = [];

                    lenis = null;
                }
            }
        }

        enableOrDisableLenis();
        window.addEventListener("resize", enableOrDisableLenis);

        // GSAP Text Animation
        function animateText(selector, config) {
            var elements = document.querySelectorAll(selector);
            if (!elements.length) return;

            elements.forEach(function(el) {
                var split = new SplitText(el, { type: "chars, words" });
                gsap.from(split.chars, {
                    duration: config.duration,
                    delay: config.delay,
                    x: config.x,
                    autoAlpha: 0,
                    stagger: config.stagger,
                    ease: config.ease,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                    },
                });
            });
        }

        animateText(".text-anim", {
            duration: 1,
            delay: 0.5,
            x: 20,
            stagger: 0.05,
            ease: "power2.out",
        });

        animateText(".text-anim2", {
            duration: 1,
            delay: 0.1,
            x: 20,
            stagger: 0.03,
            ease: "power2.out",
        });
    }

    /*---------- 09. Miscellaneous Utilities ----------*/
    // Lettering.js for Circle Titles
    function injector(t, splitter, klass, after) {
        var a = t.text().split(splitter), inject = '';
        if (a.length) {
            $(a).each(function(i, item) {
                inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
            });
            t.empty().append(inject);
        }
    }

    var methods = {
        init : function() {
            return this.each(function() {
                injector($(this), '', 'char', '');
            });
        },

        words : function() {
            return this.each(function() {
                injector($(this), ' ', 'word', ' ');
            });
        },

        lines : function() {
            return this.each(function() {
                var r = "eefec303079ad17405c889e092e105b0";
                injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
            });
        }
    };

    $.fn.lettering = function( method ) {
        if ( method && methods[method] ) {
            return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
        } else if ( method === 'letters' || ! method ) {
            return methods.init.apply( this, [].slice.call( arguments, 0 ) );
        }
        $.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
        return this;
    };
    $(".circle-title-anime").lettering();

    // Image to SVG Converter
    var cache = {};

    $.fn.inlineSvg = function fnInlineSvg() {
        this.each(imgToSvg);
        return this;
    };

    function imgToSvg() {
        var $img = $(this);
        var src = $img.attr("src");

        if (!cache[src]) {
            var d = $.Deferred();
            $.get(src, function(data) {
                d.resolve($(data).find("svg"));
            });
            cache[src] = d.promise();
        }

        cache[src].then(function(svg) {
            var $svg = $(svg).clone();

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

    // Initialize backgrounds
    initBackgrounds();

})(jQuery);

// ScrollCue
scrollCue.init({
    percentage: 0.99,
    duration: 900,
});
