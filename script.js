// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Update Greeting Message
    const greetingMessage = document.getElementById('greeting-message');

    function updateGreeting() {
        const now = new Date();
        const currentHour = now.getHours();

        let message = "";

        if (currentHour >= 4 && currentHour < 12) {
            message = "Good Morning 😀🌄";
        } else if (currentHour >= 12 && currentHour < 16) {
            message = "Good Afternoon 🌞";
        } else if (currentHour >= 16 && currentHour < 20) {
            message = "Good Evening 🌆";
        } else {
            message = "Good Night ⭐🌠🌃";
        }

        // Update the greeting message element with the greeting text
        if (greetingMessage) {
            greetingMessage.textContent = `${message}`;
        }
    }

    // Call the function to update the greeting message when the page loads
    updateGreeting();

    // Handle Start Test Button Click
    const startButton = document.getElementById('start-test-button');
    if (startButton) {
        startButton.addEventListener('click', function() {
            window.location.href = "test.html"; // Adjust this URL as needed
        });
    }

    // Improved dropdown behavior
    const accountBtn = document.getElementById('accountBtn');
    const dropdownContent = document.getElementById('dropdownContent');
    
    if (accountBtn && dropdownContent) {
        accountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        });
        
        // Prevent closing when clicking inside dropdown
        dropdownContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.trait-score-tile, .overall-score-container, .job-recommendation');
        
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animate-in')) {
                element.classList.add('animate-in');
            }
        });
    }
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Trigger animations on page load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (document.querySelector('.nav-links.active')) {
                    document.querySelector('.nav-links').classList.remove('active');
                    document.querySelector('.mobile-menu-toggle').innerHTML = '☰';
                }
            }
        });
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Show mobile menu button only on smaller screens
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuToggle.style.display = 'block';
        } else {
            mobileMenuToggle.style.display = 'none';
            navLinks.classList.remove('active');
        }
    }
    
    // Initialize on page load
    checkScreenSize();
    
    // Check when window resizes
    window.addEventListener('resize', checkScreenSize);
    
    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }
});

// Add this to your test.js if you have animations for test results
function animateResults() {
    const tiles = document.querySelectorAll('.trait-score-tile');
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('animate-in');
        }, 200 * index);
    });
    
    setTimeout(() => {
        document.querySelector('.overall-score-container').classList.add('animate-in');
    }, 200 * tiles.length);
    
    setTimeout(() => {
        document.querySelector('.job-recommendation').classList.add('animate-in');
    }, 200 * tiles.length + 300);
}
