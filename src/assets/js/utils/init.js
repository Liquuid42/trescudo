/**
 * Initialization Module
 * Orchestrates conditional loading and initialization of all modules
 */

import { core } from './core.js';
import { navigation } from './navigation.js';
import { slider } from './slider.js';
import { forms } from './forms.js';
import { ui } from './ui.js';
import { filters } from './filters.js';
import { misc } from './misc.js';

export const init = {
    /**
     * Initialize core features (always loaded)
     */
    initCore() {
        // Preloader and SVG conversion
        misc.init();

        // Navigation (mobile menu, sticky header, scroll to top)
        navigation.init();

        // Background utilities
        core.initBackgrounds();

        // UI components (popups, modals, hover effects)
        ui.init();

        // Filters and counters
        filters.init();
    },

    /**
     * Initialize animations (lazy loaded if needed)
     */
    async initAnimations() {
        const { animations } = await import('./animations.js');
        animations.init();
    },

    /**
     * Initialize sliders (lazy loaded if needed)
     */
    initSliders() {
        if (slider.hasSliders()) {
            slider.initSliders();
        }
    },

    /**
     * Initialize forms (lazy loaded if needed)
     */
    initForms() {
        if (forms.hasContactForm()) {
            forms.initContactForm();
        }
    },

    /**
     * Detect page features and conditionally load modules
     */
    detectPageFeatures() {
        return {
            hasSliders: slider.hasSliders(),
            hasAnimations: document.querySelector('[data-cue]') !== null ||
                          document.querySelector('.text-anim') !== null,
            hasContactForm: forms.hasContactForm(),
        };
    },

    /**
     * Main initialization function
     */
    initApp() {
        // Always load core features
        this.initCore();

        // Detect what features this page needs
        const features = this.detectPageFeatures();

        // Conditionally initialize features
        if (features.hasSliders) {
            this.initSliders();
        }

        if (features.hasAnimations) {
            // Lazy load animations module (heavy GSAP/Lenis code)
            this.initAnimations().catch(err => {
                console.error('Failed to load animations module:', err);
            });
        }

        if (features.hasContactForm) {
            this.initForms();
        }
    }
};
