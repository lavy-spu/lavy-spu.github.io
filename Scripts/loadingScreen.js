// Pixelated Loading Screen Handler - Home Page Only
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const startButton = document.getElementById('startButton');
    
    // Only run on home page
    if (!loadingScreen) {
        return; // Exit if no loading screen element found
    }
    
    let progress = 0;
    let loadingComplete = false;
    
    // Check if user has visited the home page in this session
    const hasVisitedThisSession = sessionStorage.getItem('hasVisitedThisSession');
    
    if (hasVisitedThisSession) {
        // Skip loading screen for same session visits
        loadingScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
        return;
    }
    
    // Mark as visited for this session only (resets when browser/tab is closed)
    sessionStorage.setItem('hasVisitedThisSession', 'true');
    
    // Simulate loading progress
    function updateProgress() {
        if (progress < 100 && !loadingComplete) {
            // Randomize progress increments for more realistic feel
            const increment = Math.random() * 15 + 5; // Random between 5-20
            progress = Math.min(progress + increment, 100);
            
            // Update progress bar
            progressBar.style.width = progress + '%';
            progressPercentage.textContent = Math.floor(progress) + '%';
            
            // Vary timing for more organic feel
            const nextTimeout = Math.random() * 200 + 100; // Random between 100-300ms
            
            if (progress < 100) {
                setTimeout(updateProgress, nextTimeout);
            } else {
                finishLoading();
            }
        }
    }
    
    // Check if all critical resources are loaded
    function checkResourcesLoaded() {
        const images = document.querySelectorAll('img');
        const fonts = document.fonts;
        
        // Check if images are loaded
        let imagesLoaded = 0;
        const totalImages = images.length;
        
        if (totalImages === 0) {
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            function imageLoaded() {
                imagesLoaded++;
                if (imagesLoaded === totalImages) {
                    resolve();
                }
            }
            
            images.forEach(img => {
                if (img.complete) {
                    imageLoaded();
                } else {
                    img.addEventListener('load', imageLoaded);
                    img.addEventListener('error', imageLoaded); // Still count as "loaded" even if error
                }
            });
        });
    }
    
    // Finish loading animation
    function finishLoading() {
        loadingComplete = true;
        progress = 100;
        progressBar.style.width = '100%';
        progressPercentage.textContent = '100%';
        
        // Show start button after a brief delay
        setTimeout(() => {
            startButton.style.display = 'block';
            startButton.style.opacity = '0';
            startButton.style.transform = 'translateY(10px)';
            
            // Animate button appearance
            setTimeout(() => {
                startButton.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                startButton.style.opacity = '1';
                startButton.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }
    
    // Handle start button click
    function handleStartClick() {
        loadingScreen.classList.add('fade-out');
        
        // Remove loading screen from DOM after fade out
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 500);
    }
    
    // Initialize loading
    function initializeLoading() {
        // Disable scrolling during loading
        document.body.style.overflow = 'hidden';
        
        // Add start button click handler
        startButton.addEventListener('click', handleStartClick);
        
        // Start progress animation
        setTimeout(() => {
            updateProgress();
        }, 300);
        
        // Wait for resources to load
        Promise.all([
            checkResourcesLoaded(),
            document.fonts.ready, // Wait for fonts to load
            new Promise(resolve => setTimeout(resolve, 2000)) // Minimum 2 seconds loading time
        ]).then(() => {
            // Force completion if not already done
            if (!loadingComplete) {
                finishLoading();
            }
        });
        
        // Fallback: Force completion after 10 seconds max
        setTimeout(() => {
            if (!loadingComplete) {
                finishLoading();
            }
        }, 10000);
    }
    
    // Start loading process
    initializeLoading();
});
