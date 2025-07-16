// Handle radio-based navigation
document.addEventListener('DOMContentLoaded', function() {
    const radioGroup = document.querySelector('.radio-group');
    if (radioGroup) {
        const labels = radioGroup.querySelectorAll('label');
        const inputs = radioGroup.querySelectorAll('input[type="radio"]');
        
        // Add hover handlers to detect stretching
        labels.forEach((label, index) => {
            label.addEventListener('mouseenter', function() {
                // Check if we're stretching (hovering non-adjacent item)
                const activeIndex = Array.from(inputs).findIndex(input => input.checked);
                if (Math.abs(index - activeIndex) > 1) {
                    radioGroup.setAttribute('data-stretch', 'true');
                }
            });
            
            label.addEventListener('mouseleave', function() {
                radioGroup.removeAttribute('data-stretch');
            });
        });
        
        // Add click handlers to navigate to different pages
        labels.forEach((label, index) => {
            label.addEventListener('click', function(e) {
                // Allow the radio button to be checked first
                setTimeout(() => {
                    switch(index) {
                        case 0: // About
                            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                                // If already on index page, scroll to about section
                                document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                // Navigate to index page with about anchor
                                window.location.href = 'index.html#about';
                            }
                            break;
                        case 1: // Experience
                            if (!window.location.pathname.includes('experience.html')) {
                                window.location.href = 'experience.html';
                            }
                            break;
                        case 2: // Projects
                            if (!window.location.pathname.includes('projects.html')) {
                                window.location.href = 'projects.html';
                            }
                            break;
                    }
                }, 100); // Small delay to allow the radio transition to show
            });
        });
    }

    // Mobile dropdown navigation
    const mobileDropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownToggle = document.querySelector('.dropdown [tabindex="0"]');
    
    if (mobileDropdown && dropdownContent && dropdownToggle) {
        // Toggle dropdown on button click
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileDropdown.classList.toggle('dropdown-open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileDropdown.contains(e.target)) {
                mobileDropdown.classList.remove('dropdown-open');
            }
        });
        
        // Handle mobile menu navigation clicks
        const mobileMenuLinks = dropdownContent.querySelectorAll('a[href^="#"], a[href$=".html"]');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Close dropdown after navigation
                setTimeout(() => {
                    mobileDropdown.classList.remove('dropdown-open');
                }, 100);
                
                // Handle different navigation types
                if (href === '#about') {
                    e.preventDefault();
                    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                        // If already on index page, scroll to about section
                        const aboutSection = document.querySelector('#about');
                        if (aboutSection) {
                            aboutSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else {
                        // Navigate to index page with about anchor
                        window.location.href = 'index.html#about';
                    }
                } else if (href.includes('.html')) {
                    // Let normal navigation happen for other pages
                    // The click will proceed normally
                }
            });
        });
    }
});
