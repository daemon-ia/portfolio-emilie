/* ============================================
   PORTFOLIO EMILIE ROUPSARD — 2026 EDITION
   ============================================ */

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('gone');
        document.body.classList.add('loaded');
    }, 900);
});

// ===== ANNÉE FOOTER =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== HORLOGE LOCALE =====
function updateLocalTime() {
    const el = document.getElementById('local-time');
    if (!el) return;
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    el.textContent = `Toulouse · ${hours}:${minutes}`;
}
updateLocalTime();
setInterval(updateLocalTime, 30000);

// ===== NAVBAR AU SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const current = window.scrollY;
    navbar.classList.toggle('scrolled', current > 30);
    lastScroll = current;
});

// ===== MENU BURGER =====
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ===== CURSOR =====
const cursor = document.querySelector('.cursor');
let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function animateCursor() {
    cursorX += (targetX - cursorX) * 0.2;
    cursorY += (targetY - cursorY) * 0.2;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor expand on hover
document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (el.dataset.cursorText) {
            cursor.classList.add('text-mode');
            cursor.textContent = el.dataset.cursorText;
        } else {
            cursor.classList.add('expand');
        }
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expand', 'text-mode');
        cursor.textContent = '';
    });
});

// ===== MAGNETIC EFFECT =====
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = '';
    });
});

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.section-head, .bento-item, .step').forEach(el => {
    revealObserver.observe(el);
});

// Skill tags reveal staggered
const skillTagsContainer = document.querySelector('.skill-tags');
if (skillTagsContainer) {
    const tags = skillTagsContainer.querySelectorAll('span');
    tags.forEach((tag, i) => {
        tag.style.setProperty('--i', i);
    });
    const tagObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const inTags = entry.target.parentElement.querySelectorAll('span');
                inTags.forEach((t, i) => {
                    setTimeout(() => t.classList.add('visible'), i * 40);
                });
                tagObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    tagObserver.observe(skillTagsContainer);
}

// Bento items staggered reveal
const bentoItems = document.querySelectorAll('.bento-item');
const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const items = Array.from(bentoItems);
            const idx = items.indexOf(entry.target);
            entry.target.style.transitionDelay = `${(idx % 3) * 0.08}s`;
            entry.target.classList.add('visible');
            bentoObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
bentoItems.forEach(item => bentoObserver.observe(item));

// ===== TILT 3D SUR LES CARDS =====
document.querySelectorAll('.bento-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(0)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== PARALLAX HERO SHAPE =====
const shape = document.querySelector('.hero-shape');
if (shape) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        shape.style.translate = `${x}px ${y}px`;
    });
}

// ===== FORMULAIRE CONTACT (AJAX) =====
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formStatus.textContent = 'Envoi en cours…';
        formStatus.className = 'form-status';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json().catch(() => ({}));

            if (response.ok && data.success) {
                formStatus.textContent = '✓ Message envoyé. Je reviens vers vous très vite.';
                formStatus.className = 'form-status success';
                form.reset();
            } else {
                throw new Error(data.error || 'Erreur lors de l\'envoi.');
            }
        } catch (err) {
            formStatus.textContent = err.message || 'Une erreur est survenue. Réessayez plus tard.';
            formStatus.className = 'form-status error';
        }
    });
}

// ===== SMOOTH SCROLL POUR ANCRES =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId.length > 1) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
});
