/**
 * UI Module
 * Handles popups, search, modals, and other UI interactions
 */

export const ui = {
    /**
     * Initialize search box popup
     */
    initSearchBox() {
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
    },

    /**
     * Initialize popup sidemenu
     */
    initPopupSidemenu() {
        function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
            $($sideMunuOpen).on('click', function (e) {
                e.preventDefault();
                $($sideMenu).addClass($toggleCls);
            });
            $($sideMenu).on('click', function (e) {
                e.stopPropagation();
                $($sideMenu).removeClass($toggleCls)
            });
            const sideMenuChild = $sideMenu + ' > div';
            $(sideMenuChild).on('click', function (e) {
                e.stopPropagation();
                $($sideMenu).addClass($toggleCls)
            });
            $($sideMenuCls).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $($sideMenu).removeClass($toggleCls);
            });
        }
        popupSideMenu('.sidemenu-cart', '.sideMenuToggler', '.sideMenuCls', 'show');
        popupSideMenu('.sidemenu-info', '.sideMenuInfo', '.sideMenuCls', 'show');
    },

    /**
     * Initialize Magnific Popup for images
     */
    initMagnificPopup() {
        // Image popup
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

        // Video popup
        $(".popup-video").magnificPopup({
            type: "iframe",
            mainClass: 'mfp-zoom-in',
        });

        // Content popup
        $(".popup-content").magnificPopup({
            type: "inline",
            midClick: true,
        });
    },

    /**
     * Initialize hover item active class
     */
    initHoverItem() {
        $(document).on('mouseover', '.hover-item', function () {
            $(this).addClass('item-active').siblings('.hover-item').removeClass('item-active');
        });
    },

    /**
     * Initialize shape mockup positioning
     */
    initShapeMockup() {
        $.fn.shapeMockup = function () {
            const $shape = $(this);
            $shape.each(function () {
                const $currentShape = $(this),
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
    },

    /**
     * Initialize section positioning
     */
    initSectionPosition() {
        $.fn.sectionPosition = function (mainAttr, posAttr) {
            $(this).each(function () {
                const section = $(this);

                function setPosition() {
                    const sectionHeight = Math.floor(section.height() / 2),
                        posData = section.attr(mainAttr),
                        posFor = section.attr(posAttr),
                        topMark = "top-half",
                        bottomMark = "bottom-half",
                        parentPT = parseInt($(posFor).css("padding-top"), 10),
                        parentPB = parseInt($(posFor).css("padding-bottom"), 10);

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

        const postionHandler = "[data-sec-pos]";
        if ($(postionHandler).length) {
            $(postionHandler).imagesLoaded(function () {
                $(postionHandler).sectionPosition("data-sec-pos", "data-pos-for");
            });
        }
    },

    /**
     * Initialize all UI features
     */
    init() {
        this.initSearchBox();
        this.initPopupSidemenu();
        this.initMagnificPopup();
        this.initHoverItem();
        this.initShapeMockup();
        this.initSectionPosition();
    }
};
