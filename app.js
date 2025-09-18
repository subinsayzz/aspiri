// Aspiri Proposal Dashboard JavaScript

class ProposalDashboard {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        // Case study data
        this.caseStudies = {
            hidesign: {
                name: 'Hidesign',
                description: 'A comprehensive Shopify website and marketing system implementation for luxury fashion brand Hidesign. We developed a sophisticated ecommerce platform with integrated marketing automation, inventory management, and customer experience optimization.',
                url: 'https://www.hidesign.com/'
            },
            nonormal: {
                name: 'Nonormal',
                description: 'Created a modern lifestyle ecommerce experience featuring advanced product filtering, personalized recommendations, and seamless checkout flow. The platform includes AI-powered search and dynamic content management.',
                url: 'https://www.nonormal.com/'
            },
            pricklee: {
                name: 'Pricklee',
                description: 'Developed a dynamic online store for the innovative beverage brand Pricklee. The platform features interactive product showcases, subscription management, and integrated social commerce capabilities.',
                url: 'https://www.pricklee.com/'
            },
            beastlife: {
                name: 'Beastlife',
                description: 'Built a comprehensive health & wellness platform with AI-powered personalization, workout tracking, nutrition planning, and community features. Includes advanced analytics and user engagement tools.',
                url: 'https://www.beastlife.in/'
            }
        };
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.setupEventListeners();
        this.updateSlideIndicator();
        this.updateNavigationState();
        
        // Set initial state
        this.totalSlidesSpan.textContent = this.totalSlides;
    }
    
    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slideNumber = parseInt(link.dataset.slide);
                this.goToSlide(slideNumber);
            });
        });
        
        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Case study modals
        this.setupCaseStudyModals();
        
        // CTA buttons
        this.setupCTAButtons();
    }
    
    setupCaseStudyModals() {
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        const modal = document.getElementById('caseStudyModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalLink = document.getElementById('modalLink');
        
        caseStudyCards.forEach(card => {
            card.addEventListener('click', () => {
                const clientKey = card.dataset.client;
                const caseStudy = this.caseStudies[clientKey];
                
                if (caseStudy) {
                    modalTitle.textContent = caseStudy.name;
                    modalDescription.textContent = caseStudy.description;
                    modalLink.href = caseStudy.url;
                    
                    modal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Close modal handlers
        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        };
        
        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }
    
    setupCTAButtons() {
        // Add click handlers for CTA buttons
        const ctaButtons = document.querySelectorAll('.btn');
        
        ctaButtons.forEach(button => {
            const buttonText = button.textContent.trim();
            
            // Add appropriate handlers based on button text
            if (buttonText === 'Confirm & Start') {
                button.addEventListener('click', () => {
                    this.showAlert('Thank you for your interest! We will contact you shortly to begin the project setup.', 'success');
                });
            } else if (buttonText === 'Schedule Kickoff Call') {
                button.addEventListener('click', () => {
                    this.showAlert('Redirecting to calendar booking...', 'info');
                    // In a real application, this would redirect to a calendar booking system
                });
            } else if (buttonText === 'Download Proposal PDF') {
                button.addEventListener('click', () => {
                    this.showAlert('PDF download would be triggered here. In a real application, this would generate and download a PDF version of this proposal.', 'info');
                });
            }
        });
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        // Hide current slide
        this.slides[this.currentSlide - 1].classList.remove('active');
        
        // Show new slide
        this.currentSlide = slideNumber;
        this.slides[this.currentSlide - 1].classList.add('active');
        
        // Update navigation
        this.updateNavigation();
        this.updateSlideIndicator();
        this.updateNavigationState();
        
        // Scroll to top of main content
        document.querySelector('.main-content').scrollTo(0, 0);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateNavigation() {
        // Update sidebar navigation
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (parseInt(link.dataset.slide) === this.currentSlide) {
                link.classList.add('active');
            }
        });
    }
    
    updateSlideIndicator() {
        this.currentSlideSpan.textContent = this.currentSlide;
    }
    
    updateNavigationState() {
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update button text for last slide
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.textContent = 'Finish';
        } else {
            this.nextBtn.textContent = 'Next →';
        }
    }
    
    showAlert(message, type = 'info') {
        // Create a simple alert system
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            font-size: 14px;
            line-height: 1.5;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        if (!document.querySelector('#alert-styles')) {
            style.id = 'alert-styles';
            document.head.appendChild(style);
        }
        
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            alertDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 4000);
        
        // Click to dismiss
        alertDiv.addEventListener('click', () => {
            alertDiv.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        });
    }
    
    // Mobile menu functionality (if needed in future)
    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('open');
    }
    
    // Utility method to highlight current section in long slides
    highlightCurrentSection() {
        const sections = document.querySelectorAll('.slide.active .card, .slide.active .scope-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.borderLeft = '4px solid #DC2626';
                    entry.target.style.transition = 'border-left 0.3s ease';
                } else {
                    entry.target.style.borderLeft = '';
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Analytics tracking (placeholder for future implementation)
    trackSlideView(slideNumber) {
        // In a real application, this would send analytics data
        console.log(`Slide ${slideNumber} viewed`);
    }
    
    trackCTAClick(buttonText) {
        // In a real application, this would send analytics data
        console.log(`CTA clicked: ${buttonText}`);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new ProposalDashboard();
    
    // Add some interactive enhancements
    
    // Smooth scroll for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation for cards
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Add hover effects to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add progress indicator
    const createProgressIndicator = () => {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 280px;
            right: 0;
            height: 4px;
            background: rgba(220, 38, 38, 0.1);
            z-index: 1000;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: #DC2626;
            transition: width 0.3s ease;
            width: ${(dashboard.currentSlide / dashboard.totalSlides) * 100}%;
        `;
        
        progressBar.appendChild(progressFill);
        document.body.appendChild(progressBar);
        
        // Update progress on slide change
        const originalGoToSlide = dashboard.goToSlide.bind(dashboard);
        dashboard.goToSlide = function(slideNumber) {
            originalGoToSlide(slideNumber);
            progressFill.style.width = `${(this.currentSlide / this.totalSlides) * 100}%`;
        };
    };
    
    createProgressIndicator();
    
    // Add keyboard shortcuts info
    const addKeyboardShortcuts = () => {
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 300px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 12px;
            color: var(--color-text-secondary);
            z-index: 100;
        `;
        shortcutsInfo.innerHTML = 'Use ← → arrow keys to navigate';
        document.body.appendChild(shortcutsInfo);
        
        // Hide after 5 seconds
        setTimeout(() => {
            shortcutsInfo.style.opacity = '0';
            shortcutsInfo.style.transition = 'opacity 0.5s ease';
        }, 5000);
    };
    
    setTimeout(addKeyboardShortcuts, 2000);
});

// Export for potential use in other scripts
window.ProposalDashboard = ProposalDashboard;