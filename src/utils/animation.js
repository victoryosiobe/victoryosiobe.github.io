const words = ['Develop', 'Create', 'Design', 'Build', 'Ship', 'Innovate', 'Scale'];
let wordIndex = 0; //set to second word, as first word is in html too.
let charIndex = words[0].length -1;
let isDeleting = true; //delete first word already in html
let isWaiting = false;

const animatedWord = document.getElementById('animated-word');

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isWaiting) {
        setTimeout(() => {
            isWaiting = false;
            isDeleting = true;
            typeEffect();
        }, 2000);
        return;
    }
    
    if (isDeleting) {
        charIndex--;
        animatedWord.textContent = currentWord.substring(0, charIndex);
        
        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 500);
            return;
        }
        
        setTimeout(typeEffect, 200);
    } else {
        charIndex++;
        animatedWord.textContent = currentWord.substring(0, charIndex);
        
        if (charIndex === currentWord.length) {
            isWaiting = true;
            typeEffect();
            return;
        }
        
        setTimeout(typeEffect, 200);
    }
}

// Start animation after a brief delay
setTimeout(typeEffect, 1000);