// DOM Elements
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('user-name');
const nameSubmit = document.getElementById('name-submit');
const displayName = document.getElementById('display-name');
const finalName = document.getElementById('final-name');
const loveForm = document.getElementById('love-form');
const userAnswer = document.getElementById('user-answer');
const submitAnswer = document.getElementById('submit-answer');

// Website URL for sharing
const WEBSITE_URL = window.location.href;
const SHARE_TEXT = "Check out this beautiful love note I just created! 💖";

// Questions array
const questions = [
    "What's something you love about yourself today?",
    "What makes your heart smile?",
    "What's your favorite love story? (real or fictional)",
    "What's your idea of a perfect date?",
    "What's one thing you're grateful for today?",
    "What's your favorite way to show someone you care?",
    "What's the most thoughtful gift you've ever received or given?",
    "What's your favorite love song and why?",
    "What's your love language and why do you think that is?",
    "What's one thing you'd love to do together in the future?",
    "What's the most romantic thing someone has done for you?",
    "What's your favorite thing about our relationship?",
    "What's your idea of the perfect romantic evening?",
    "What's something you'd love to learn or experience together?",
    "What's your favorite thing about falling in love?",
    "What's the most important quality you look for in a partner?",
    "What's your favorite way to receive love and appreciation?",
    "What's a relationship goal you'd love to achieve together?",
    "What's something you'd love to say to your future self about love?"
];

let userName = '';

// Utility Functions
function hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('hidden');
        screen.classList.remove('visible');
    }
}

function showScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('hidden');
            card.classList.remove('visible');
        });
        setTimeout(() => {
            screen.classList.remove('hidden');
            setTimeout(() => {
                screen.classList.add('visible');
            }, 10);
        }, 300);
    }
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.classList.add('heart-float');
    
    // Set random position within viewport bounds
    const randomOffset = Math.random();
    heart.style.setProperty('--random-offset', randomOffset);
    
    // Random size and animation duration
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 4 + 6; // 6-10 seconds
    
    heart.style.fontSize = `${size}px`;
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    heart.style.animationDuration = `${duration}s`;
    
    document.querySelector('.floating-hearts').appendChild(heart);
    
    // Remove after animation completes
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, duration * 1000);
}

function showRandomQuestion() {
    const questionElement = document.querySelector('.question-text');
    if (questionElement) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        questionElement.textContent = questions[randomIndex];
    }
}

function showFormMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'form-message';
        }, 5000);
    }
}


// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Start with welcome screen
    showScreen('welcome-screen');

    // Start floating hearts animation
    setInterval(createFloatingHeart, 2000);
    for (let i = 0; i < 10; i++) {
        setTimeout(createFloatingHeart, i * 300);
    }

    // Event Listeners
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            hideScreen('welcome-screen');
            showScreen('name-screen');
            if (nameInput) nameInput.focus();
        });
    }

    if (nameInput && nameSubmit && displayName && finalName) {
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                nameSubmit.click();
            }
        });

        nameSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            if (name) {
                userName = name;
                displayName.textContent = name;
                finalName.textContent = name;
                const hiddenName = document.getElementById('hidden-name');
                if (hiddenName) hiddenName.value = name;
                hideScreen('name-screen');
                showScreen('question-screen');
                showRandomQuestion();
            } else {
                nameInput.style.borderColor = '#ff4757';
                setTimeout(() => {
                    nameInput.style.borderColor = '#f0f0f0';
                }, 1000);
            }
        });
    }

    if (userAnswer && submitAnswer && loveForm) {
        // Sync textarea with hidden input
        userAnswer.addEventListener('input', (e) => {
            const hiddenAnswer = document.getElementById('user-answer-hidden');
            if (hiddenAnswer) {
                hiddenAnswer.value = e.target.value;
            }
        });

        userAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitAnswer.click();
            }
        });

        // Update the form action to use Netlify Functions
loveForm.action = '/.netlify/functions/submit-form';

loveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = loveForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    try {
        const response = await fetch('/.netlify/functions/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: document.getElementById('hidden-name').value || 'Anonymous',
                message: userAnswer.value
            })
        });

        const result = await response.json();

        if (response.ok) {
            showScreen('thank-you-screen');
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send your love note. Please try again later.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
        });
    }
});