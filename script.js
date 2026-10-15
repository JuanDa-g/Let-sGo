window.addEventListener('load', function () {
    setTimeout(function () {
        document.querySelector('.loading-animation').classList.add('hidden');
    }, 2000);

    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 100);
});

document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    document.querySelector('nav').classList.add('active');
});

document.querySelector('.close-menu').addEventListener('click', function () {
    document.querySelector('nav').classList.remove('active');
});

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navItems = document.querySelectorAll('.slider-nav-item');
const totalSlides = slides.length;

function changeSlide() {
    slides.forEach(slide => slide.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    navItems[currentSlide].classList.add('active');

    currentSlide = (currentSlide + 1) % totalSlides;
}

let slideInterval = setInterval(changeSlide, 5000);

navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        clearInterval(slideInterval);
        currentSlide = index;
        changeSlide();
        slideInterval = setInterval(changeSlide, 5000);
    });
});

let currentTestimonial = 0;
const testimonials = document.querySelector('.testimonial-wrapper');
const testimonialItems = document.querySelectorAll('.testimonial');
const testimonialNavItems = document.querySelectorAll('.testimonial-nav-item');
const totalTestimonials = testimonialItems.length;

function changeTestimonial(index) {
    testimonialNavItems.forEach(item => item.classList.remove('active'));
    testimonialNavItems[index].classList.add('active');
    testimonials.style.transform = `translateX(-${index * 100}%)`;
}

testimonialNavItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentTestimonial = index;
        changeTestimonial(index);
    });
});

setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    changeTestimonial(currentTestimonial);
}, 6000);

function animateOnScroll() {
    const elements = document.querySelectorAll('.section-title h2, .about-text p, .about-image, .stat-item, .route-card, .transport-item, .gallery-item, .booking-image, .booking-form');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

function animateStats() {
    const statElements = document.querySelectorAll('.stat-number');

    statElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // milliseconds
        const step = target / (duration / 16); // 60fps
        let count = 0;

        const updateCount = () => {
            count += step;
            if (count < target) {
                element.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCount();
                observer.disconnect();
            }
        });

        observer.observe(element);
    });
}

window.addEventListener('load', animateStats);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            document.querySelector('nav').classList.remove('active');

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
