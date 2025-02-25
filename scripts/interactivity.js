/**
 * interactivity.js - Interactive elements for "The Depths of Poetry"
 * 
 * This script manages interactive course elements including:
 * - Exercise input validation and feedback
 * - Animation triggers on scroll
 * - Content filter functionality
 * - Reading mode toggle
 */

document.addEventListener('DOMContentLoaded', () => {
    // Exercise feedback system
    const exerciseSubmissions = document.querySelectorAll('.exercise-submit');
    
    exerciseSubmissions.forEach(button => {
        button.addEventListener('click', function() {
            const exerciseContainer = this.closest('.exercise-item');
            const inputElement = exerciseContainer.querySelector('.poem-input');
            const feedbackElement = exerciseContainer.querySelector('.feedback-area');
            
            if (!inputElement || !feedbackElement) return;
            
            const userInput = inputElement.value.trim();
            
            if (userInput.length < 10) {
                // Show constructive feedback for insufficient input
                feedbackElement.className = 'feedback-area feedback-constructive';
                feedbackElement.textContent = 'Please provide a more substantial response to engage with the exercise fully.';
                feedbackElement.style.display = 'block';
                return;
            }
            
            // Show positive feedback for sufficient input
            feedbackElement.className = 'feedback-area feedback-positive';
            feedbackElement.innerHTML = '<strong>Thank you for your submission.</strong> Your engagement with the exercise demonstrates thoughtful consideration of the poetic principles being explored.';
            feedbackElement.style.display = 'block';
            
            // Enable next section navigation if applicable
            const nextButton = document.querySelector('.nav-btn[data-target="next"]');
            if (nextButton) {
                nextButton.classList.add('active');
                nextButton.disabled = false;
            }
        });
    });
    
    // Animation triggers on scroll for content elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.9;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                if (element.classList.contains('fade-in')) {
                    element.style.opacity = 1;
                } else if (element.classList.contains('slide-up')) {
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = 1;
                }
            }
        });
    }
    
    // Initialize animations
    animateElements.forEach(element => {
        if (element.classList.contains('fade-in')) {
            element.style.opacity = 0;
            element.style.transition = 'opacity 0.5s ease-in';
        } else if (element.classList.contains('slide-up')) {
            element.style.transform = 'translateY(20px)';
            element.style.opacity = 0;
            element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        }
    });
    
    // Check for animations on initial load
    checkScroll();
    
    // Check for animations on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Focused reading mode toggle
    const readingModeToggle = document.querySelector('.reading-mode-toggle');
    
    if (readingModeToggle) {
        readingModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('focused-reading-mode');
            
            // Update toggle text
            if (document.body.classList.contains('focused-reading-mode')) {
                readingModeToggle.innerHTML = '<i class="fas fa-compress"></i> Exit Reading Mode';
            } else {
                readingModeToggle.innerHTML = '<i class="fas fa-book-reader"></i> Enter Reading Mode';
            }
        });
    }
    
    // Resource filtering system
    const resourceFilters = document.querySelectorAll('.resource-filter');
    
    resourceFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            const resourceItems = document.querySelectorAll('.resource-card');
            
            // Update active filter status
            resourceFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter resources
            resourceItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'flex';
                    return;
                }
                
                const itemType = item.getAttribute('data-type');
                item.style.display = itemType === filterValue ? 'flex' : 'none';
            });
        });
    });
    
    // Poetic device tooltips
    const poeticDevices = document.querySelectorAll('.poetic-device');
    
    poeticDevices.forEach(device => {
        // Add keyboard accessibility
        device.setAttribute('tabindex', '0');
        
        // Add events for keyboard users
        device.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.classList.toggle('active-tooltip');
            }
        });
    });
    
    // Fix for iOS touch events on poetry devices
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        poeticDevices.forEach(device => {
            device.addEventListener('touchend', function(e) {
                e.preventDefault();
                
                // Manually control tooltip behavior for touch
                const wasActive = this.classList.contains('active-tooltip');
                
                // Remove active class from all devices
                poeticDevices.forEach(d => d.classList.remove('active-tooltip'));
                
                // Toggle for this device only if not previously active
                if (!wasActive) {
                    this.classList.add('active-tooltip');
                }
            });
        });
    }
});
