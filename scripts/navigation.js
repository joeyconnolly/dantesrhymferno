/**
 * navigation.js - Interactive navigation system for "The Depths of Poetry"
 * 
 * This script handles core navigation interactions including:
 * - Week content expansion/collapse
 * - Mobile menu toggling
 * - Smooth scrolling to anchors
 * - Active state management
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            header.classList.toggle('mobile-menu-open');
        });
    }
    
    // Week content expansion
    function toggleWeek(contentId) {
        const content = document.getElementById(contentId);
        const header = content.previousElementSibling;
        const arrow = header.querySelector('.arrow');
        
        content.classList.toggle('active');
        
        if (arrow) {
            arrow.classList.toggle('up');
        }
    }
    
    // Expose toggleWeek to global scope for inline onclick handlers
    window.toggleWeek = toggleWeek;
    
    // Initialize week headers with click handlers
    const weekHeaders = document.querySelectorAll('.week-header');
    weekHeaders.forEach(header => {
        const contentId = header.nextElementSibling.id;
        header.addEventListener('click', () => toggleWeek(contentId));
    });
    
    // Smooth scroll to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return; // Skip if href is just "#"
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                header.classList.remove('mobile-menu-open');
                
                // Scroll to target with offset for header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = targetPosition + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // If target is a week card, expand it after scrolling
                if (targetElement.classList.contains('week-card')) {
                    setTimeout(() => {
                        const contentId = targetElement.querySelector('.week-content').id;
                        const content = document.getElementById(contentId);
                        
                        if (!content.classList.contains('active')) {
                            toggleWeek(contentId);
                        }
                    }, 800);
                }
            }
        });
    });
    
    // Update active navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    function setActiveNavItem() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial call to set active nav item
    setActiveNavItem();
    
    // Update active nav item on scroll
    window.addEventListener('scroll', setActiveNavItem);
    
    // Open week content if linked directly via URL hash
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        
        if (targetElement && targetElement.classList.contains('week-card')) {
            setTimeout(() => {
                const contentId = targetElement.querySelector('.week-content').id;
                toggleWeek(contentId);
                
                // Smooth scroll to target
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = targetPosition + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }
});
