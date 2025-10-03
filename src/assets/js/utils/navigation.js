/**
 * Navigation Module
 * Handles mobile menu and sticky header functionality
 */

export const navigation = {
    /**
     * Initialize mobile menu
     */
    initMobileMenu() {
        $.fn.thmobilemenu = function (options) {
            const opt = $.extend(
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
                const menu = $(this);

                // Menu Show & Hide
                function menuToggle() {
                    menu.toggleClass(opt.bodyToggleClass);

                    // collapse submenu on menu hide or show
                    const subMenu = "." + opt.subMenuClass;
                    $(subMenu).each(function () {
                        if ($(this).hasClass(opt.subMenuToggleClass)) {
                            $(this).removeClass(opt.subMenuToggleClass);
                            $(this).css("display", "none");
                            $(this).parent().removeClass(opt.subMenuParentToggle);
                        }
                    });
                }

                // Class Set Up for every submenu
                menu.find("." + opt.subMenuParent).each(function () {
                    const submenu = $(this).find("ul");
                    submenu.addClass(opt.subMenuClass);
                    submenu.css("display", "none");
                    $(this).addClass(opt.subMenuParent);
                    $(this).addClass(opt.thSubMenuParent);
                    $(this).children("a").append(opt.appendElement);
                });

                // Toggle Submenu
                function toggleDropDown($element) {
                    const submenu = $element.children("ul");
                    if (submenu.length > 0) {
                        $element.toggleClass(opt.subMenuParentToggle);
                        submenu.slideToggle(opt.toggleSpeed);
                        submenu.toggleClass(opt.subMenuToggleClass);
                    }
                }

                // Submenu toggle Button
                const itemHasChildren = "." + opt.thSubMenuParent + " > a";
                $(itemHasChildren).each(function () {
                    $(this).on("click", function (e) {
                        e.preventDefault();
                        toggleDropDown($(this).parent());
                    });
                });

                // Menu Show & Hide On Toggle Btn click
                $(opt.menuToggleBtn).each(function () {
                    $(this).on("click", function () {
                        menuToggle();
                    });
                });

                // Hide Menu On outside click
                menu.on("click", function (e) {
                    e.stopPropagation();
                    menuToggle();
                });

                // Stop Hide full menu on menu click
                menu.find("div").on("click", function (e) {
                    e.stopPropagation();
                });
            });
        };

        $(".th-menu-wrapper").thmobilemenu();
    },

    /**
     * Initialize sticky header
     */
    initStickyHeader() {
        $(window).scroll(function () {
            const topPos = $(this).scrollTop();
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
    },

    /**
     * Initialize one-page navigation
     */
    initOnePageNav() {
        function onePageNav(element) {
            if ($(element).length > 0) {
                $(element).each(function () {
                    const link = $(this).find('a');
                    $(this).find(link).each(function () {
                        $(this).on('click', function () {
                            const target = $(this.getAttribute('href'));
                            if (target.length) {
                                event.preventDefault();
                                $('html, body').stop().animate({
                                    scrollTop: target.offset().top - 10
                                }, 1000);
                            }
                        });
                    });
                });
            }
        }

        onePageNav('.onepage-nav');
        onePageNav('.scroll-down');
    },

    /**
     * Initialize scroll to top button
     */
    initScrollToTop() {
        if ($('.scroll-top').length > 0) {
            const scrollTopbtn = document.querySelector('.scroll-top');
            const progressPath = document.querySelector('.scroll-top path');
            const pathLength = progressPath.getTotalLength();

            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

            const updateProgress = function () {
                const scroll = $(window).scrollTop();
                const height = $(document).height() - $(window).height();
                const progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            }

            updateProgress();
            $(window).scroll(updateProgress);

            const offset = 50;
            const duration = 750;

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
            });
        }
    },

    /**
     * Initialize all navigation features
     */
    init() {
        this.initMobileMenu();
        this.initStickyHeader();
        this.initOnePageNav();
        this.initScrollToTop();
    }
};
