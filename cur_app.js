class PresentationDashboard {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.modal = document.getElementById('caseStudyModal');
        this.modalBody = document.getElementById('modalBody');
        this.closeModalBtn = document.getElementById('closeModal');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideIndicator();
        this.updateNavigationButtons();
        
        // Set total slides in indicator
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }

        // Ensure first slide is active
        this.goToSlide(0);
    }

    setupEventListeners() {
        // Navigation links with proper event handling
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const slideIndex = parseInt(link.dataset.slide, 10);
                console.log('Nav link clicked, targeting slide:', slideIndex, 'link index:', index);
                if (!isNaN(slideIndex) && slideIndex >= 0 && slideIndex < this.totalSlides) {
                    this.goToSlide(slideIndex);
                } else {
                    console.warn('Invalid slide index from nav link:', slideIndex);
                }
            });
        });

        // Previous/Next buttons with proper event handling
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.previousSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.nextSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Case study cards - Fixed event handling
        document.addEventListener('click', (e) => {
            // Check if the clicked element is within a case study card
            const caseStudyCard = e.target.closest('.case-study-card');
            if (caseStudyCard) {
                // Check if we clicked on a button within the card
                const button = e.target.closest('.btn');
                if (button && button.textContent.trim().includes('View Details')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const client = caseStudyCard.dataset.client;
                    console.log('Case study card clicked, client:', client);
                    if (client) {
                        this.openCaseStudyModal(client);
                    }
                    return; // Important: prevent other click handlers from running
                }
            }
        });

        // Modal close functionality
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // CTA buttons functionality
        document.addEventListener('click', (e) => {
            // Make sure we're not handling case study buttons or modal buttons
            if (e.target.classList.contains('btn') && 
                !e.target.id && 
                !e.target.classList.contains('modal-close') &&
                !e.target.closest('.case-study-card') &&
                !e.target.classList.contains('modal-close-btn') &&
                !e.target.classList.contains('cta-confirm-btn') &&
                !e.target.classList.contains('cta-cancel-btn') &&
                !e.target.classList.contains('success-close-btn')) {
                
                const buttonText = e.target.textContent.trim();
                if (buttonText.includes('Schedule Discovery Call') || 
                    buttonText.includes('Start Your Journey') ||
                    buttonText.includes('Download Proposal')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleCTAAction(buttonText);
                }
            }
        });

        // Touch/swipe support for mobile
        this.setupTouchNavigation();
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        mainContent.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        mainContent.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }

    goToSlide(slideIndex) {
        console.log('goToSlide called with index:', slideIndex, 'current:', this.currentSlide);
        
        if (slideIndex < 0 || slideIndex >= this.totalSlides) {
            console.warn('Invalid slide index:', slideIndex, 'valid range: 0-', this.totalSlides - 1);
            return;
        }

        // Hide all slides and remove all active nav links
        this.slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        this.navLinks.forEach((link) => {
            link.classList.remove('active');
        });

        // Update current slide index
        this.currentSlide = slideIndex;

        // Show new slide and activate corresponding nav link
        if (this.slides[slideIndex]) {
            this.slides[slideIndex].classList.add('active');
            console.log('Activated slide:', slideIndex);
        }

        if (this.navLinks[slideIndex]) {
            this.navLinks[slideIndex].classList.add('active');
            console.log('Activated nav link:', slideIndex);
        }

        this.updateSlideIndicator();
        this.updateNavigationButtons();

        // Smooth scroll to top of content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Track slide view
        this.trackSlideView(slideIndex);
    }

    nextSlide() {
        console.log('nextSlide called, current:', this.currentSlide, 'total:', this.totalSlides);
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        } else {
            // Handle special action for last slide
            this.handleFinalSlideAction();
        }
    }

    previousSlide() {
        console.log('previousSlide called, current:', this.currentSlide);
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    handleFinalSlideAction() {
        // Special action when on final slide and "Get Started" is clicked
        this.handleCTAAction('Start Your Journey');
    }

    updateSlideIndicator() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide + 1;
        }
        console.log('Updated slide indicator to:', this.currentSlide + 1);
    }

    updateNavigationButtons() {
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = false;
            
            // Update button text for last slide
            if (this.currentSlide === this.totalSlides - 1) {
                this.nextBtn.textContent = 'Get Started →';
                this.nextBtn.classList.remove('btn--outline');
                this.nextBtn.classList.add('btn--primary');
            } else {
                this.nextBtn.textContent = 'Next →';
                this.nextBtn.classList.add('btn--outline');
                this.nextBtn.classList.remove('btn--primary');
            }
        }
        console.log('Updated navigation buttons, current slide:', this.currentSlide);
    }

    openCaseStudyModal(client) {
        console.log('Opening case study modal for client:', client);
        if (!this.modal || !this.modalBody) {
            console.warn('Modal elements not found');
            return;
        }

        const caseStudies = {
            'hidesign': {
                name: 'Hidesign',
                url: 'https://www.hidesign.com/',
                description: 'Shopify website & marketing systems for luxury fashion',
                details: 'We transformed Hidesign\'s digital presence with a comprehensive Shopify solution, integrating advanced marketing automation and customer journey optimization for their luxury leather goods brand.',
                achievements: [
                    '150% increase in online conversions',
                    'Streamlined inventory management across 50+ retail locations',
                    'Automated email marketing campaigns with 35% open rates',
                    'Mobile-first responsive design with 90+ PageSpeed score'
                ]
            },
            'nonormal': {
                name: 'Nonormal',
                url: 'https://www.nonormal.com/',
                description: 'Lifestyle ecommerce experience with advanced filters',
                details: 'Created a sophisticated lifestyle ecommerce platform with AI-powered product discovery, advanced filtering systems, and personalized shopping experiences.',
                achievements: [
                    'Advanced product filtering with 20+ parameters',
                    'AI-powered product recommendations increasing AOV by 40%',
                    'Seamless mobile shopping experience',
                    'Integration with social media platforms for viral marketing'
                ]
            },
            'pricklee': {
                name: 'Pricklee',
                url: 'https://www.pricklee.com/',
                description: 'Beverage brand\'s dynamic online store',
                details: 'Built a vibrant, dynamic ecommerce store for this innovative beverage brand with subscription management, influencer integration, and viral marketing features.',
                achievements: [
                    'Subscription management system with 80% retention rate',
                    'Influencer partnership platform integration',
                    'Dynamic pricing and promotional campaigns',
                    'Social commerce integration driving 60% of traffic'
                ]
            },
            'beastlife': {
                name: 'Beastlife',
                url: 'https://www.beastlife.in/',
                description: 'Health & wellness platform with AI personalization',
                details: 'Developed a comprehensive health and wellness platform featuring AI-driven personalization, workout tracking, nutrition planning, and community engagement.',
                achievements: [
                    'AI-powered personalized workout and nutrition plans',
                    'Community platform with 10,000+ active members',
                    'Wearable device integration for real-time tracking',
                    'Gamification features increasing user engagement by 200%'
                ]
            }
        };

        const study = caseStudies[client];
        if (!study) {
            console.warn('Case study not found:', client);
            return;
        }

        this.modalBody.innerHTML = `
            <h3 style="color: #DC2626; margin-bottom: 16px; font-size: 24px;">${study.name}</h3>
            <p style="margin-bottom: 20px; font-size: 16px; color: var(--color-text-secondary);">${study.description}</p>
            <p style="margin-bottom: 24px; line-height: 1.6;">${study.details}</p>
            
            <h4 style="color: #DC2626; margin-bottom: 12px;">Key Achievements:</h4>
            <ul style="list-style: none; padding: 0; margin-bottom: 24px;">
                ${study.achievements.map(achievement => 
                    `<li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); font-size: 14px;">✓ ${achievement}</li>`
                ).join('')}
            </ul>
            
            <div style="text-align: center;">
                <a href="${study.url}" target="_blank" class="btn btn--primary" style="display: inline-block; margin-right: 12px; text-decoration: none; color: white !important;">
                    Visit Website
                </a>
                <button class="btn btn--outline modal-close-btn">
                    Close
                </button>
            </div>
        `;

        // Add event listener for the close button in modal
        const modalCloseBtn = this.modalBody.querySelector('.modal-close-btn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        this.modal.classList.remove('hidden');
        
        // Focus trap
        if (this.closeModalBtn) {
            this.closeModalBtn.focus();
        }
        
        console.log('Case study modal opened successfully for:', client);
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            console.log('Modal closed');
        }
    }

    handleCTAAction(buttonText) {
        let message = '';
        let action = '';

        switch (true) {
            case buttonText.includes('Schedule Discovery Call'):
                message = 'Ready to schedule your discovery call?';
                action = 'We\'ll reach out within 24 hours to discuss your project requirements and answer any questions.';
                break;
            case buttonText.includes('Download Proposal'):
                message = 'Download complete proposal?';
                action = 'The full PDF proposal will be prepared and sent to your email within 2 hours.';
                break;
            case buttonText.includes('Start Your Journey'):
                message = 'Ready to start your digital transformation?';
                action = 'Let\'s begin with a comprehensive consultation to map out your success strategy.';
                break;
            default:
                message = 'Get in touch with us?';
                action = 'We\'ll contact you soon to discuss your requirements.';
        }

        this.showCTAModal(message, action, buttonText);
    }

    showCTAModal(message, action, buttonText) {
        if (!this.modal || !this.modalBody) return;

        this.modalBody.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #DC2626, #B91C1C); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h3 style="color: #DC2626; margin-bottom: 16px; font-size: 24px;">${message}</h3>
                <p style="margin-bottom: 24px; line-height: 1.6; color: var(--color-text-secondary);">${action}</p>
                
                <div style="background: var(--color-bg-1); padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h4 style="margin-bottom: 12px; color: #DC2626;">Contact Information:</h4>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Email:</strong> subinsayzz4u@gmail.com</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Phone:</strong> +91 98187 13787</p>
                    <p style="margin: 8px 0; font-size: 14px;"><strong>Response Time:</strong> Within 4 hours</p>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
                    <button class="btn btn--primary cta-confirm-btn">
                        Confirm & Proceed
                    </button>
                    <button class="btn btn--outline cta-cancel-btn">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;

        // Add event listeners for modal buttons
        const confirmBtn = this.modalBody.querySelector('.cta-confirm-btn');
        const cancelBtn = this.modalBody.querySelector('.cta-cancel-btn');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmCTAAction(buttonText));
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        this.modal.classList.remove('hidden');
        if (this.closeModalBtn) {
            this.closeModalBtn.focus();
        }
    }

    confirmCTAAction(buttonText) {
        if (!this.modalBody) return;

        this.modalBody.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981, #059669); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h3 style="color: #10B981; margin-bottom: 16px; font-size: 24px;">Request Submitted Successfully!</h3>
                <p style="margin-bottom: 24px; line-height: 1.6;">Thank you for your interest in working with Socially Pivot Marketing Inc.</p>
                <p style="margin-bottom: 24px; font-size: 14px; color: var(--color-text-secondary);">
                    We've received your ${buttonText.toLowerCase()} request and will get back to you within 4 hours with next steps.
                </p>
                
                <div style="background: var(--color-bg-3); padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <h4 style="margin-bottom: 12px; color: #059669;">What happens next?</h4>
                    <ul style="list-style: none; padding: 0; text-align: left; font-size: 14px;">
                        <li style="padding: 4px 0;">✓ Confirmation email sent to your inbox</li>
                        <li style="padding: 4px 0;">✓ Account manager assigned to your project</li>
                        <li style="padding: 4px 0;">✓ Initial consultation scheduled</li>
                        <li style="padding: 4px 0;">✓ Custom proposal prepared</li>
                    </ul>
                </div>
                
                <button class="btn btn--primary success-close-btn">
                    Continue Exploring
                </button>
            </div>
        `;

        // Add event listener for success close button
        const successCloseBtn = this.modalBody.querySelector('.success-close-btn');
        if (successCloseBtn) {
            successCloseBtn.addEventListener('click', () => this.closeModal());
        }

        // Auto close after 8 seconds
        setTimeout(() => {
            if (this.modal && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        }, 8000);
    }

    // Analytics tracking
    trackSlideView(slideIndex) {
        console.log(`Slide ${slideIndex + 1} viewed: ${this.getSlideTitle(slideIndex)}`);
        
        // Example: Google Analytics event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'slide_view', {
                'slide_number': slideIndex + 1,
                'slide_name': this.getSlideTitle(slideIndex)
            });
        }
    }

    getSlideTitle(slideIndex) {
        const titles = [
            'Cover', 'About Us', 'Requirements', 'Our Approach', 'What We Offer',
            'LaunchPad', 'Packages Overview', 'Ecom Care', 'Growth Tech', 'Ignite360',
            'How It Works', 'Case Studies', 'Pricing', 'Next Steps', 'Closing'
        ];
        return titles[slideIndex] || `Slide ${slideIndex + 1}`;
    }

    // Export presentation data
    exportPresentationData() {
        const data = {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        console.log('Presentation Data:', data);
        return data;
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Presentation Dashboard...');
    
    // Add small delay to ensure all elements are rendered
    setTimeout(() => {
        window.dashboard = new PresentationDashboard();
        console.log('Dashboard initialized successfully');
        
        // Handle initial hash in URL
        const hash = window.location.hash;
        if (hash.startsWith('#slide-')) {
            const slideNumber = parseInt(hash.replace('#slide-', '')) - 1;
            if (slideNumber >= 0 && slideNumber < window.dashboard.totalSlides) {
                window.dashboard.goToSlide(slideNumber);
            }
        }
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        console.log('Window resized:', window.innerWidth, 'x', window.innerHeight);
    }, 250);
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (window.dashboard && e.state && e.state.slide !== undefined) {
        window.dashboard.goToSlide(e.state.slide);
    }
});