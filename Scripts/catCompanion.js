// Cat Companion Interactive Chat System
class CatCompanion {
    constructor() {
        this.catButton = document.getElementById('catCompanion');
        this.chatInterface = document.getElementById('chatInterface');
        this.closeChatBtn = document.getElementById('closeChatBtn');
        this.chatContent = document.getElementById('chatContent');
        this.chatOptions = document.getElementById('chatOptions');
        this.catNotification = document.getElementById('catNotification');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.catButton.addEventListener('click', () => this.toggleChat());
        this.closeChatBtn.addEventListener('click', () => this.closeChat());
        
        // Chat option buttons
        const optionButtons = this.chatOptions.querySelectorAll('.chat-option-btn');
        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                this.handleOptionClick(e);
            });
        });
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.chatInterface.contains(e.target) && 
                !this.catButton.contains(e.target)) {
                this.closeChat();
            }
        });
        
        // Initial notification animation
        this.showInitialNotification();
        
        // Random idle animations
        this.startIdleAnimations();
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.chatInterface.classList.remove('hidden');
        this.chatInterface.classList.add('show');
        this.catButton.style.display = 'none';
        this.hideNotification();
        
        // Add opening sound effect (optional)
        this.playSound('meow');
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatInterface.classList.remove('show');
        setTimeout(() => {
            this.chatInterface.classList.add('hidden');
            this.catButton.style.display = 'block';
        }, 400);
    }
    
    handleOptionClick(event) {
        const button = event.target;
        const question = button.getAttribute('data-question');
        const answer = button.getAttribute('data-answer');
        
        // Add user message
        this.addMessage(question, 'user');
        
        // Hide options temporarily
        this.chatOptions.style.display = 'none';
        
        // Add typing indicator
        this.showTypingIndicator();
        
        // Check if this is the Fun Secret button
        if (question === 'Fun Secret') {
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(answer, 'bot');
                this.showMagicWordInput();
            }, 1000 + Math.random() * 1000);
        } else {
            // Simulate typing delay and show response
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(answer, 'bot');
                
                // Show options again after a brief delay
                setTimeout(() => {
                    this.chatOptions.style.display = 'flex';
                }, 500);
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        }
    }
    
    showMagicWordInput() {
        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.classList.add('magic-word-container');
        inputContainer.innerHTML = `
            <input type="text" id="magicWordInput" class="magic-word-input" placeholder="Type the magic word..." maxlength="20">
            <button id="submitMagicWord" class="magic-word-submit">Send</button>
        `;
        
        this.chatContent.appendChild(inputContainer);
        this.chatContent.scrollTop = this.chatContent.scrollHeight;
        
        // Focus on input
        const input = document.getElementById('magicWordInput');
        const submitBtn = document.getElementById('submitMagicWord');
        
        input.focus();
        
        // Handle submit
        const handleSubmit = () => {
            const userInput = input.value.trim().toLowerCase();
            this.addMessage(input.value, 'user');
            inputContainer.remove();
            
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                
                if (userInput === 'woof' || userInput === 'arf' || userInput === 'bark' || userInput === 'mrao') {
                    // Correct answer - show the secret gif
                    this.showSecretGif();
                } else {
                    // Wrong answer - show hint and try again options
                    this.showMagicWordOptions();
                }
            }, 1000);
        };
        
        submitBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            handleSubmit();
        });
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation(); // Prevent event bubbling
                handleSubmit();
            }
        });
    }
    
    showSecretGif() {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', 'bot-message');
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.innerHTML = `
            🎉 Bingo! Here's ouppy: <br>
            <img src="./Content/dog.gif" alt="Secret revealed!" style="max-width: 100%; border-radius: 10px; margin-top: 10px;">
            <br><small>*wink* I know you would get it! 🤫</small>
        `;
        
        messageDiv.appendChild(bubbleDiv);
        this.chatContent.appendChild(messageDiv);
        this.chatContent.scrollTop = this.chatContent.scrollHeight;
        
        // Show original options after delay
        setTimeout(() => {
            this.chatOptions.style.display = 'flex';
        }, 2000);
    }
    
    showMagicWordOptions() {
        this.addMessage("Hmm, that's not quite right! 🤔", 'bot');
        
        // Create hint/try again options
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('magic-word-options');
        optionsContainer.innerHTML = `
            <button class="chat-option-btn magic-option-btn" data-action="hint">Hint</button>
            <button class="chat-option-btn magic-option-btn" data-action="tryagain">Try Again</button>
        `;
        
        this.chatContent.appendChild(optionsContainer);
        this.chatContent.scrollTop = this.chatContent.scrollHeight;
        
        // Handle option clicks
        optionsContainer.querySelectorAll('.magic-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const action = e.target.getAttribute('data-action');
                this.addMessage(e.target.textContent, 'user');
                optionsContainer.remove();
                
                this.showTypingIndicator();
                
                setTimeout(() => {
                    this.hideTypingIndicator();
                    
                    if (action === 'hint') {
                        this.addMessage("What does a puppy say?", 'bot');
                        setTimeout(() => this.showMagicWordInput(), 1000);
                    } else {
                        this.addMessage("Alright, let's try again! What's the magic word? 😸", 'bot');
                        setTimeout(() => this.showMagicWordInput(), 1000);
                    }
                }, 1000);
            });
        });
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `${sender}-message`);
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.textContent = text;
        
        messageDiv.appendChild(bubbleDiv);
        this.chatContent.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatContent.scrollTop = this.chatContent.scrollHeight;
        
        // Add message animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 50);
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'bot-message', 'typing-indicator');
        typingDiv.id = 'typingIndicator';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.innerHTML = '<span class="typing-dots">●●●</span>';
        
        typingDiv.appendChild(bubbleDiv);
        this.chatContent.appendChild(typingDiv);
        this.chatContent.scrollTop = this.chatContent.scrollHeight;
        
        // Animate typing dots
        this.animateTypingDots();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    animateTypingDots() {
        const dots = document.querySelector('.typing-dots');
        if (dots) {
            let count = 0;
            const interval = setInterval(() => {
                const dotCount = (count % 3) + 1;
                let dotString = '';
                for (let i = 0; i < 3; i++) {
                    dotString += i < dotCount ? '●' : '○';
                }
                dots.textContent = dotString;
                count++;
                
                // Stop animation when typing indicator is removed
                if (!document.getElementById('typingIndicator')) {
                    clearInterval(interval);
                }
            }, 500);
        }
    }
    
    showInitialNotification() {
        // Show notification after a delay when page loads
        setTimeout(() => {
            this.catNotification.style.display = 'flex';
            this.catNotification.style.animation = 'bounce 2s infinite';
        }, 3000);
    }
    
    hideNotification() {
        this.catNotification.style.display = 'none';
    }
    
    startIdleAnimations() {
        // Random cat movements and expressions
        setInterval(() => {
            if (!this.isOpen && Math.random() < 0.3) { // 30% chance every interval
                this.doIdleAnimation();
            }
        }, 10000); // Check every 10 seconds
    }
    
    doIdleAnimation() {
        const animations = [
            () => {
                // Quick wiggle
                this.catButton.style.animation = 'none';
                this.catButton.style.transform = 'rotate(5deg)';
                setTimeout(() => {
                    this.catButton.style.transform = 'rotate(-5deg)';
                    setTimeout(() => {
                        this.catButton.style.transform = 'rotate(0deg)';
                        this.catButton.style.animation = 'catFloat 3s ease-in-out infinite';
                    }, 200);
                }, 200);
            },
            () => {
                // Show notification briefly
                if (this.catNotification.style.display === 'none') {
                    this.catNotification.style.display = 'flex';
                    this.catNotification.textContent = '🔔';
                    setTimeout(() => {
                        this.catNotification.style.display = 'none';
                    }, 2000);
                }
            },
            () => {
                // Scale pulse
                this.catButton.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.catButton.style.transform = 'scale(1)';
                }, 300);
            }
        ];
        
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        randomAnimation();
    }
    
    playSound(type) {
        // Optional: Add sound effects
        // You can implement audio feedback here
        console.log(`Playing ${type} sound`);
    }
}

// Initialize cat companion when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CatCompanion();
});

// Export for module usage
export default CatCompanion;
