/**
 * Animations Module
 * Handles GSAP, Lenis smooth scroll, and text animations
 */

export const animations = {
    lenis: null,
    lenisTickerCallback: null,
    lenisScrollHandler: null,
    naturalScrollElements: [],

    /**
     * Initialize smooth scroll with Lenis
     */
    initSmoothScroll() {
        gsap.registerPlugin(ScrollTrigger);

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const initializeLenis = () => {
            this.lenis = new Lenis({
                lerp: 0.07, // Smoothing factor
            });

            // Store scroll handler reference for cleanup
            this.lenisScrollHandler = ScrollTrigger.update;
            this.lenis.on("scroll", this.lenisScrollHandler);

            // Use GSAP's ticker to sync with animations
            this.lenisTickerCallback = (time) => {
                if (this.lenis) this.lenis.raf(time * 1000);
            };
            gsap.ticker.add(this.lenisTickerCallback);

            // Allow native scroll inside specified elements
            this.naturalScrollElements = Array.from(document.querySelectorAll(".allow-natural-scroll"));
            this.naturalScrollElements.forEach((el) => {
                const wheelHandler = (e) => e.stopPropagation();
                const touchHandler = (e) => e.stopPropagation();

                el._wheelHandler = wheelHandler;
                el._touchHandler = touchHandler;

                el.addEventListener("wheel", wheelHandler, { passive: true });
                el.addEventListener("touchmove", touchHandler, { passive: true });
                el.addEventListener("touchstart", touchHandler, { passive: true });
            });
        };

        const enableOrDisableLenis = () => {
            if (prefersReducedMotion) return;

            if (window.innerWidth > 991) {
                if (!this.lenis) initializeLenis();
                this.lenis.start();
            } else {
                if (this.lenis) {
                    this.lenis.stop();

                    // Remove scroll event listener
                    if (this.lenisScrollHandler) {
                        this.lenis.off("scroll", this.lenisScrollHandler);
                        this.lenisScrollHandler = null;
                    }

                    // Remove ticker callback
                    if (this.lenisTickerCallback) {
                        gsap.ticker.remove(this.lenisTickerCallback);
                        this.lenisTickerCallback = null;
                    }

                    // Remove natural scroll element listeners
                    this.naturalScrollElements.forEach((el) => {
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
                    this.naturalScrollElements = [];

                    this.lenis = null;
                }
            }
        };

        // Initial call
        enableOrDisableLenis();
        window.addEventListener("resize", enableOrDisableLenis);
    },

    /**
     * Animate text with GSAP
     */
    animateText(selector, config) {
        const elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        elements.forEach((el) => {
            const split = new SplitText(el, { type: "chars, words" });
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
    },

    /**
     * Initialize GSAP text animations
     */
    initTextAnimations() {
        this.animateText(".text-anim", {
            duration: 1,
            delay: 0.5,
            x: 20,
            stagger: 0.05,
            ease: "power2.out",
        });

        this.animateText(".text-anim2", {
            duration: 1,
            delay: 0.1,
            x: 20,
            stagger: 0.03,
            ease: "power2.out",
        });
    },

    /**
     * Initialize lettering.js for circle titles
     */
    initLettering() {
        function injector(t, splitter, klass, after) {
            const a = t.text().split(splitter);
            let inject = '';
            if (a.length) {
                $(a).each(function(i, item) {
                    inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
                });
                t.empty().append(inject);
            }
        }

        const methods = {
            init: function() {
                return this.each(function() {
                    injector($(this), '', 'char', '');
                });
            },

            words: function() {
                return this.each(function() {
                    injector($(this), ' ', 'word', ' ');
                });
            },

            lines: function() {
                return this.each(function() {
                    const r = "eefec303079ad17405c889e092e105b0";
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
    },

    /**
     * Check if page needs animations
     * @returns {boolean}
     */
    hasAnimations() {
        return document.querySelector('[data-cue]') !== null ||
               document.querySelector('.text-anim') !== null ||
               document.querySelector('.text-anim2') !== null;
    },

    /**
     * Initialize all animations
     */
    init() {
        this.initSmoothScroll();
        this.initTextAnimations();
        this.initLettering();
    }
};
