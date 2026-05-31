// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Send email via mailto
        const mailtoLink = `mailto:adinathkirage106@gmail.com?subject=New Contact Form Submission from ${name}&body=Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`;
        window.location.href = mailtoLink;
        
        // Reset form
        this.reset();
    });
}

// Shop Button Actions
const shopButtons = document.querySelectorAll('.shop-btn');
shopButtons.forEach(button => {
    button.addEventListener('click', function() {
        const category = this.textContent;
        alert(`Redirecting to ${category}...`);
    });
});

// CTA Button Click
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const ordersSection = document.querySelector('#order');
        ordersSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const cards = document.querySelectorAll('.product-card, .feature, .platform-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add active state to navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Platform Card Click Handlers
const platformCards = document.querySelectorAll('.platform-card');
platformCards.forEach(card => {
    card.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href) {
            window.open(href, '_blank');
        }
    });
});

// Contact Info Click Handlers
const phoneLink = document.querySelector('a[href^="tel:"]');
const emailLink = document.querySelector('a[href^="mailto:"]');

if (phoneLink) {
    phoneLink.addEventListener('click', function(e) {
        // Allow default behavior for tel: links
    });
}

if (emailLink) {
    emailLink.addEventListener('click', function(e) {
        // Allow default behavior for mailto: links
    });
}

console.log('Website loaded successfully!');