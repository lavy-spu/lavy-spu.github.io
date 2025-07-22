// Dynamic text coverage detection for navbar selector
document.addEventListener('DOMContentLoaded', function() {
    const radioGroup = document.querySelector('.radio-group');
    if (!radioGroup) return;

    const labels = radioGroup.querySelectorAll('label');
    const selector = radioGroup.querySelector('.selection-indicator-wrapper');
    const experienceLabel = labels[1]; // Middle label (Experience)
    
    // Split each character in the Experience label into separate spans
    function initializeCharacterSpans() {
        const originalText = experienceLabel.textContent;
        experienceLabel.innerHTML = '';
        
        // Create a span for each character
        Array.from(originalText).forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('char');
            span.dataset.index = index;
            experienceLabel.appendChild(span);
        });
    }

    // Calculate which characters are covered by the selector
    function updateCharacterCoverage() {
        if (!selector || !experienceLabel) return;

        const selectorRect = selector.getBoundingClientRect();
        const chars = experienceLabel.querySelectorAll('.char');
        
        chars.forEach(char => {
            const charRect = char.getBoundingClientRect();
            
            // Check if character overlaps with selector
            const isOverlapping = !(
                charRect.right < selectorRect.left || 
                charRect.left > selectorRect.right ||
                charRect.bottom < selectorRect.top || 
                charRect.top > selectorRect.bottom
            );
            
            // Calculate coverage percentage
            let coveragePercentage = 0;
            if (isOverlapping) {
                const overlapLeft = Math.max(charRect.left, selectorRect.left);
                const overlapRight = Math.min(charRect.right, selectorRect.right);
                const overlapWidth = overlapRight - overlapLeft;
                const charWidth = charRect.width;
                
                coveragePercentage = charWidth > 0 ? (overlapWidth / charWidth) : 0;
            }
            
            // Apply styling based on coverage
            if (coveragePercentage > 0.5) { // More than 50% covered
                char.style.color = '#222323'; // Dark color for covered
                char.classList.add('covered');
                char.classList.remove('uncovered');
            } else {
                char.style.color = '#f0f6f0'; // Light color for uncovered
                char.classList.add('uncovered');
                char.classList.remove('covered');
            }
        });
    }

    // Initialize character spans
    initializeCharacterSpans();

    // Set up observers and event listeners
    function setupCoverageDetection() {
        // Use MutationObserver to watch for selector position changes
        const observer = new MutationObserver(updateCharacterCoverage);
        observer.observe(selector, {
            attributes: true,
            attributeFilter: ['style', 'class'],
            subtree: true
        });

        // Also listen for CSS transitions
        selector.addEventListener('transitionstart', updateCharacterCoverage);
        selector.addEventListener('transitionend', updateCharacterCoverage);
        
        // Watch for hover events on labels
        labels.forEach((label, index) => {
            label.addEventListener('mouseenter', () => {
                // Delay to allow CSS transitions to start
                setTimeout(updateCharacterCoverage, 10);
                // Continue updating during transition
                const interval = setInterval(updateCharacterCoverage, 16); // ~60fps
                setTimeout(() => clearInterval(interval), 300); // Stop after transition duration
            });
            
            label.addEventListener('mouseleave', () => {
                setTimeout(updateCharacterCoverage, 10);
                const interval = setInterval(updateCharacterCoverage, 16);
                setTimeout(() => clearInterval(interval), 300);
            });
        });

        // Watch for radio button changes
        const inputs = radioGroup.querySelectorAll('input[type="radio"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                setTimeout(updateCharacterCoverage, 10);
                const interval = setInterval(updateCharacterCoverage, 16);
                setTimeout(() => clearInterval(interval), 300);
            });
        });

        // Initial update
        setTimeout(updateCharacterCoverage, 100);
    }

    // Setup after a short delay to ensure all CSS is loaded
    setTimeout(setupCoverageDetection, 200);

    // Also update on window resize
    window.addEventListener('resize', () => {
        setTimeout(updateCharacterCoverage, 100);
    });

    // Fallback: Update coverage periodically during interactions
    let isInteracting = false;
    radioGroup.addEventListener('mouseenter', () => {
        isInteracting = true;
        const updateLoop = () => {
            if (isInteracting) {
                updateCharacterCoverage();
                requestAnimationFrame(updateLoop);
            }
        };
        updateLoop();
    });
    
    radioGroup.addEventListener('mouseleave', () => {
        isInteracting = false;
        // Final update after leaving
        setTimeout(updateCharacterCoverage, 300);
    });
});
