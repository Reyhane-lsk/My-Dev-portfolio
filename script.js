// Performance and Animation JavaScript for Portfolio Site
// Author: Reyhane Lashkari

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initFadeInOutScroll();
    initLazyLoading();
    initSkillBars();
    initContactForm();
    initDragAndDrop();
    initStorytelling();
    initHorizontalScrollSkills();
    initPerformanceOptimizations();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

// Smooth Fade In/Out Scroll Animations
function initFadeInOutScroll() {
    const fadeElements = document.querySelectorAll('.fade-in, .story-paragraph, .project-card, .stat-item, .contact-item, .skill-item, .smooth-reveal');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Smooth staggered animation with easing
                const delay = index * 150;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('revealed');
                    if (entry.target.classList.contains('fade-out')) {
                        entry.target.classList.remove('hidden');
                    }
                    // Add smooth animation class
                    entry.target.style.willChange = 'auto';
                }, delay);
                
                // Don't observe again once animated
                fadeObserver.unobserve(entry.target);
            } else {
                // Smooth fade out when leaving viewport
                if (entry.target.classList.contains('fade-out')) {
                    entry.target.classList.add('hidden');
                }
            }
        });
    }, observerOptions);

    fadeElements.forEach((el, index) => {
        // Set initial will-change for performance
        el.style.willChange = 'opacity, transform';
        fadeObserver.observe(el);
    });
}

// Scroll animations and intersection observer
function initScrollAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
                
                // Special handling for project cards
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-progress, .stat-item, .contact-item');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth parallax effect for hero section
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        parallaxElements.forEach(element => {
            const speed = 0.3;
            const rotation = scrolled * 0.05;
            element.style.transform = `translateY(${scrolled * speed}px) rotateY(${rotation}deg)`;
            element.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }, 16));
}

// Smooth storytelling scroll effects
function initStorytelling() {
    const storyParagraphs = document.querySelectorAll('.story-paragraph');
    
    const storyObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index * 400;
                setTimeout(() => {
                    const startTime = performance.now();
                    const duration = 1200;
                    
                    function animate(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Smooth easing
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const translateY = 30 * (1 - easeOutCubic);
                        
                        entry.target.style.opacity = easeOutCubic;
                        entry.target.style.transform = `translateY(${translateY}px)`;
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            entry.target.classList.add('visible');
                            entry.target.style.willChange = 'auto';
                        }
                    }
                    
                    entry.target.style.willChange = 'opacity, transform';
                    requestAnimationFrame(animate);
                }, delay);
                
                storyObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    storyParagraphs.forEach(paragraph => {
        paragraph.style.willChange = 'opacity, transform';
        storyObserver.observe(paragraph);
    });
}

// Drag and Drop 3D Elements
function initDragAndDrop() {
    const draggableElements = document.querySelectorAll('.draggable-element');
    const dropZone = document.getElementById('dropZone');
    
    if (!dropZone) return;

    let draggedElement = null;

    // Add drag event listeners to draggable elements
    draggableElements.forEach(element => {
        element.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.outerHTML);
            
            // Create a custom drag image with 3D effect
            const dragImage = this.cloneNode(true);
            dragImage.style.transform = 'rotateY(15deg) rotateX(15deg) scale(1.1)';
            dragImage.style.opacity = '0.8';
            document.body.appendChild(dragImage);
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            e.dataTransfer.setDragImage(dragImage, 0, 0);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        });

        element.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedElement = null;
        });
    });

    // Drop zone events
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        if (draggedElement) {
            // Create a new element in the drop zone with 3D effect
            const droppedElement = draggedElement.cloneNode(true);
            droppedElement.classList.remove('draggable-element', 'dragging');
            droppedElement.classList.add('dropped-element');
            droppedElement.draggable = false;
            
            // Add remove functionality
            droppedElement.addEventListener('click', function() {
                this.style.animation = 'dropAnimation 0.5s ease reverse';
                setTimeout(() => {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                }, 500);
            });

            // Add to drop zone with animation
            this.appendChild(droppedElement);
            
            // Trigger 3D animation
            setTimeout(() => {
                droppedElement.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
            }, 100);
        }
    });

    // Make drop zone elements removable on click
    dropZone.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropped-element') || 
            e.target.closest('.dropped-element')) {
            const element = e.target.closest('.dropped-element') || e.target;
            element.style.animation = 'dropAnimation 0.5s ease reverse';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 500);
        }
    });
}

// Lazy loading implementation
function initLazyLoading() {
    // Lazy load images
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    // Lazy load background images
    const bgObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.bg) {
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.classList.add('bg-loaded');
                }
                observer.unobserve(element);
            }
        });
    });

    const lazyBgs = document.querySelectorAll('[data-bg]');
    lazyBgs.forEach(bg => bgObserver.observe(bg));
}

// Horizontal Scroll Skills with Fade In/Out
function initHorizontalScrollSkills() {
    const scrollContainer = document.querySelector('.skills-scroll-container');
    const skillCards = document.querySelectorAll('.skill-card');
    const leftIndicator = document.querySelector('.scroll-indicator-left');
    const rightIndicator = document.querySelector('.scroll-indicator-right');
    
    if (!scrollContainer || skillCards.length === 0) return;
    
    // Initial fade in for visible cards
    const observerOptions = {
        root: scrollContainer,
        rootMargin: '0px',
        threshold: [0, 0.3, 0.7, 1]
    };
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const card = entry.target;
            const ratio = entry.intersectionRatio;
            
            // Fade in when entering viewport
            if (ratio > 0.3) {
                card.classList.remove('fade-out-hidden');
                card.classList.add('fade-in-visible');
                
                // Animate skill bar when card is visible
                const skillBar = card.querySelector('.skill-progress');
                if (skillBar && skillBar.dataset.width) {
                    animateSkillBar(skillBar);
                }
            } else if (ratio < 0.3 && ratio > 0) {
                // Fade out when leaving viewport
                card.classList.remove('fade-in-visible');
                card.classList.add('fade-out-hidden');
            }
        });
    }, observerOptions);
    
    // Observe all skill cards
    skillCards.forEach(card => {
        cardObserver.observe(card);
        
        // Initial check for visible cards
        const cardRect = card.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();
        if (cardRect.left < containerRect.right && cardRect.right > containerRect.left) {
            card.classList.add('fade-in-visible');
            const skillBar = card.querySelector('.skill-progress');
            if (skillBar && skillBar.dataset.width) {
                setTimeout(() => animateSkillBar(skillBar), 300);
            }
        }
    });
    
    // Scroll indicators functionality
    function updateScrollIndicators() {
        const scrollLeft = scrollContainer.scrollLeft;
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        // Show/hide indicators based on scroll position
        if (leftIndicator) {
            leftIndicator.style.opacity = scrollLeft > 10 ? '1' : '0';
            leftIndicator.style.pointerEvents = scrollLeft > 10 ? 'all' : 'none';
        }
        
        if (rightIndicator) {
            rightIndicator.style.opacity = scrollLeft < maxScroll - 10 ? '1' : '0';
            rightIndicator.style.pointerEvents = scrollLeft < maxScroll - 10 ? 'all' : 'none';
        }
    }
    
    // Scroll left
    if (leftIndicator) {
        leftIndicator.addEventListener('click', function() {
            scrollContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll right
    if (rightIndicator) {
        rightIndicator.addEventListener('click', function() {
            scrollContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }
    
    // Update indicators on scroll
    scrollContainer.addEventListener('scroll', throttle(function() {
        updateScrollIndicators();
        
        // Update fade in/out based on scroll position
        skillCards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const containerCenter = containerRect.left + containerRect.width / 2;
            const distance = Math.abs(cardCenter - containerCenter);
            const maxDistance = containerRect.width / 2 + cardRect.width / 2;
            const visibility = 1 - (distance / maxDistance);
            
            if (visibility > 0.3) {
                card.classList.remove('fade-out-hidden');
                card.classList.add('fade-in-visible');
                card.style.opacity = Math.max(0.3, visibility);
            } else {
                card.classList.remove('fade-in-visible');
                card.classList.add('fade-out-hidden');
                card.style.opacity = visibility;
            }
        });
    }, 16));
    
    // Initial update
    updateScrollIndicators();
    
    // Keyboard navigation
    scrollContainer.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
            scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        }
    });
    
    // Make container focusable for keyboard navigation
    scrollContainer.setAttribute('tabindex', '0');
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = '0%';
        bar.dataset.targetWidth = width;
    });
}

function animateSkillBar(bar) {
    const targetWidth = bar.dataset.targetWidth;
    const startTime = performance.now();
    const duration = 1500; // 1.5 seconds for smooth animation
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentWidth = targetWidth * easeOutCubic;
        
        bar.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// Smooth project cards animation
function animateProjectCard(card) {
    const delay = Array.from(card.parentNode.children).indexOf(card) * 150;
    const startTime = performance.now();
    const duration = 800;
    
    setTimeout(() => {
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const translateY = 30 * (1 - easeOutCubic);
            const scale = 0.95 + (0.05 * easeOutCubic);
            
            card.style.opacity = easeOutCubic;
            card.style.transform = `translateY(${translateY}px) scale(${scale})`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                card.style.willChange = 'auto';
            }
        }
        
        card.style.willChange = 'opacity, transform';
        requestAnimationFrame(animate);
    }, delay);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        border: 2px solid #ffffff;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#000000',
        error: '#000000',
        info: '#000000',
        warning: '#000000'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // Scroll-based operations here
        }, 10);
    });
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize images
    optimizeImages();
    
    // Add loading states
    addLoadingStates();
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = 'style';
        link.onload = function() {
            this.rel = 'stylesheet';
        };
        document.head.appendChild(link);
    });
}

// Optimize images
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading attribute for native lazy loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
}

// Add loading states
function addLoadingStates() {
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class when everything is loaded
    window.addEventListener('load', function() {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    });
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = function(target) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.offsetTop - 80;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    };
}

// Add CSS for loading states
const loadingStyles = `
    .loading {
        overflow: hidden;
    }
    
    .loading .hero-content {
        opacity: 0;
    }
    
    .loaded .hero-content {
        opacity: 1;
        transition: opacity 0.8s ease;
    }
    
    .menu-open {
        overflow: hidden;
    }
    
    .nav-link.active {
        color: var(--accent-neon);
        text-shadow: var(--neon-glow);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
    
    .notification {
        font-family: var(--font-primary);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .loading,
        .loaded {
            transition: none;
        }
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for potential external use
window.PortfolioJS = {
    showNotification,
    throttle,
    debounce
};
