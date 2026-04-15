// ================= NAVBAR SCROLL =================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ================= REVEAL ON SCROLL =================
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ================= COUNTDOWN =================
const endDate = new Date();
endDate.setDate(endDate.getDate() + 5);

function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val).padStart(2, '0');
    };

    setText('days', d);
    setText('hours', h);
    setText('minutes', m);
    setText('seconds', s);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ================= LIGHTBOX =================
const portfolioItems = document.querySelectorAll('.portfolio-item');
let currentIndex = 0;

function getImageSrc(item) {
    const img = item?.querySelector('img');
    return img ? img.src : null;
}

function openLightbox(index) {
    const src = getImageSrc(portfolioItems[index]);
    if (!src) return;

    currentIndex = index;

    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');

    if (lightbox && img) {
        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox(e) {
    if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

function navLightbox(e, dir) {
    e.stopPropagation();

    const total = portfolioItems.length;
    currentIndex = (currentIndex + dir + total) % total;

    const src = getImageSrc(portfolioItems[currentIndex]);
    const img = document.getElementById('lightbox-img');

    if (src && img) {
        img.src = src;
    }
}

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');

    if (e.key === 'Escape' && lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (e.key === 'ArrowLeft') navLightbox(e, 1);
    if (e.key === 'ArrowRight') navLightbox(e, -1);
});

// ================= TESTIMONIALS SLIDER =================
function initTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    if (!slider) return;

    let currentSlide = 0;
    const slides = slider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    const progressFill = document.getElementById('progressFill');

    let cardsPerView = 3;

    function updateCardsPerView() {
        if (window.innerWidth <= 768) cardsPerView = 1;
        else if (window.innerWidth <= 1024) cardsPerView = 2;
        else cardsPerView = 3;
    }

    updateCardsPerView();

    const maxSlide = () => Math.max(0, totalSlides - cardsPerView);

    function updateSlider() {
        const slideWidth = 100 / cardsPerView;
        slider.style.transform = `translateX(${currentSlide * slideWidth}%)`;

        if (progressFill) {
            const progress = maxSlide() > 0 ? (currentSlide / maxSlide()) * 100 : 0;
            progressFill.style.width = `${progress}%`;
        }
    }

    function moveSlider(dir) {
        const max = maxSlide();

        if (dir === 1) {
            currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
        } else {
            currentSlide = currentSlide <= 0 ? max : currentSlide - 1;
        }

        updateSlider();
    }

    let autoSlide = setInterval(() => moveSlider(1), 3000);

    function resetAuto() {
        clearInterval(autoSlide);
        autoSlide = setInterval(() => moveSlider(1), 3000);
    }

    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (prevBtn) prevBtn.addEventListener('click', () => {
        moveSlider(-1);
        resetAuto();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        moveSlider(1);
        resetAuto();
    });

    const container = document.querySelector('.testimonials-slider-container');

    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(autoSlide));
        container.addEventListener('mouseleave', resetAuto);
    }

    let touchStartX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;

        if (Math.abs(diff) > 50) {
            moveSlider(diff > 0 ? 1 : -1);
            resetAuto();
        }
    });

    window.addEventListener('resize', () => {
        updateCardsPerView();
        updateSlider();
    });

    updateSlider();
}

// INIT
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialsSlider);
} else {
    initTestimonialsSlider();
}
