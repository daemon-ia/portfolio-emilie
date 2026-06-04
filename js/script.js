// Année footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Nav scrolled
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    });
}

// ===== BOUTON HAUT DE PAGE =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Retour en haut');
scrollTopBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// Menu burger
const burger = document.querySelector('.nav-burger');
const links = document.querySelector('.nav-links');

function toggleMenu() {
    const isOpen = burger.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (burger) {
    burger.addEventListener('click', toggleMenu);

    // Fermer en cliquant sur un lien
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            if (burger.classList.contains('open')) toggleMenu();
        });
    });

    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burger.classList.contains('open')) toggleMenu();
    });
}

// ===== SECTIONS LUMINEUSES — reveal au scroll =====
const revealSections = document.querySelectorAll('.reveal-section');
if (revealSections.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealSections.forEach(s => revealObserver.observe(s));
}

// ===== NAVIGATION SPA =====
function initPage() {
    // Année footer
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();


    // Sections lumineuses
    const revealSections = document.querySelectorAll('.reveal-section');
    if (revealSections.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealSections.forEach(s => revealObserver.observe(s));
    }

    // Filtre projets
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length && !filterBtns[0].dataset.init) {
        filterBtns.forEach(b => b.dataset.init = '1');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('.project-card').forEach(card => {
                    card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
                });
            });
        });
    }

    // Modal projets
    const modal = document.getElementById('projectModal');
    if (modal && !modal.dataset.init) {
        modal.dataset.init = '1';
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.modal-close');

        let sliderImgs = [];
        let sliderCaptions = [];
        let sliderIndex = 0;

        function updateSlider() {
            const img = document.getElementById('modalImg');
            const dots = document.querySelectorAll('.modal-dot');
            const prev = document.getElementById('modalPrev');
            const next = document.getElementById('modalNext');

            const caption = document.getElementById('modalCaption');
            img.style.opacity = '0';
            if (caption) caption.style.opacity = '0';
            setTimeout(() => {
                img.src = sliderImgs[sliderIndex];
                img.style.opacity = '1';
                if (caption) {
                    caption.textContent = sliderCaptions[sliderIndex] || '';
                    caption.style.opacity = '1';
                }
            }, 300);

            dots.forEach((d, i) => d.classList.toggle('active', i === sliderIndex));
            prev.classList.toggle('hidden', sliderIndex === 0);
            next.classList.toggle('hidden', sliderIndex === sliderImgs.length - 1);
        }

        function openModal(card) {
            const thumb = document.getElementById('modalThumb');
            const img = document.getElementById('modalImg');
            const dotsContainer = document.getElementById('modalDots');

            thumb.style.background = 'var(--bg)';

            const imgsRaw = card.dataset.imgs || card.dataset.img || '';
            sliderImgs = imgsRaw ? imgsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
            const captionsRaw = card.dataset.captions || '';
            sliderCaptions = captionsRaw ? captionsRaw.split(',').map(s => s.trim()) : [];
            sliderIndex = 0;

            dotsContainer.innerHTML = '';
            if (sliderImgs.length > 1) {
                sliderImgs.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.className = 'modal-dot' + (i === 0 ? ' active' : '');
                    dot.addEventListener('click', () => { sliderIndex = i; updateSlider(); });
                    dotsContainer.appendChild(dot);
                });
            }

            if (sliderImgs.length) {
                img.alt = card.dataset.title;
                img.style.display = 'block';
                updateSlider();
            } else {
                img.style.display = 'none';
                document.getElementById('modalPrev').classList.add('hidden');
                document.getElementById('modalNext').classList.add('hidden');
            }

            const logoWrap = document.getElementById('modalLogoWrap');
            const logoEl = document.getElementById('modalLogo');
            if (card.dataset.logo) {
                logoEl.src = card.dataset.logo;
                logoEl.alt = card.dataset.title;
                logoWrap.style.display = 'flex';
            } else {
                logoWrap.style.display = 'none';
            }

            document.getElementById('modalTag').textContent = card.dataset.tag;
            document.getElementById('modalTitle').textContent = card.dataset.title;
            document.getElementById('modalDetail').textContent = card.dataset.detail;
            document.getElementById('modalTools').textContent = card.dataset.tools;

            // Couleurs
            const colorsWrap = document.getElementById('modalColorsWrap');
            const swatchesEl = document.getElementById('modalSwatches');
            const colorsRaw = card.dataset.colors || '';
            swatchesEl.innerHTML = '';
            if (colorsRaw) {
                colorsRaw.split(',').map(c => c.trim()).filter(Boolean).forEach(hex => {
                    const wrap = document.createElement('div');
                    wrap.className = 'modal-swatch';
                    wrap.innerHTML = `<span class="modal-swatch-dot" style="background:${hex};"></span><span class="modal-swatch-hex">${hex}</span>`;
                    swatchesEl.appendChild(wrap);
                });
                colorsWrap.style.display = 'flex';
            } else {
                colorsWrap.style.display = 'none';
            }

            // Typographies
            const fontsWrap = document.getElementById('modalFontsWrap');
            const fontsEl = document.getElementById('modalFonts');
            const fontsRaw = card.dataset.fonts || '';
            if (fontsRaw) {
                fontsEl.textContent = fontsRaw;
                fontsWrap.style.display = 'flex';
            } else {
                fontsWrap.style.display = 'none';
            }

            const link = document.getElementById('modalLink');
            if (card.dataset.url) {
                link.href = card.dataset.url;
                link.style.display = 'inline-flex';
            } else {
                link.style.display = 'none';
            }

            modal.setAttribute('aria-hidden', 'false');
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        }

        function closeModal() {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }

        document.querySelectorAll('.project-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => openModal(card));
            card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(card); });
            card.setAttribute('tabindex', '0');
        });

        document.getElementById('modalPrev').addEventListener('click', () => {
            sliderIndex = (sliderIndex - 1 + sliderImgs.length) % sliderImgs.length;
            updateSlider();
        });
        document.getElementById('modalNext').addEventListener('click', () => {
            sliderIndex = (sliderIndex + 1) % sliderImgs.length;
            updateSlider();
        });

        modal.addEventListener('contextmenu', e => {
            if (e.target.tagName === 'IMG') e.preventDefault();
        });

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });
    }


    // Formulaire contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm && !contactForm.dataset.init) {
        contactForm.dataset.init = '1';
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.getElementById('formStatus');
            const btn = contactForm.querySelector('.btn-contact-submit');
            btn.disabled = true;
            status.className = 'form-status';
            status.textContent = '';

            try {
                const res = await fetch('contact.php', { method: 'POST', body: new FormData(contactForm) });
                const json = await res.json();
                if (json.success) {
                    status.textContent = 'Message envoyé ! Je vous réponds rapidement.';
                    status.className = 'form-status success';
                    contactForm.reset();
                } else {
                    status.textContent = json.error || 'Une erreur est survenue.';
                    status.className = 'form-status error';
                }
            } catch {
                status.textContent = 'Une erreur est survenue. Écrivez-moi directement à emi.roupsard@gmail.com';
                status.className = 'form-status error';
            }

            btn.disabled = false;
        });
    }

}

// Overlay de transition — keyframes CSS (plus fiable que les transitions)
const overlay = document.createElement('div');
overlay.className = 'page-overlay';
const overlayLogo = document.createElement('img');
overlayLogo.src = 'assets/Logo-Emilie.png';
overlayLogo.className = 'page-overlay-logo';
overlayLogo.setAttribute('aria-hidden', 'true');
overlay.appendChild(overlayLogo);
document.body.appendChild(overlay);

let isNavigating = false;

function overlayShow() {
    return new Promise(resolve => {
        overlay.classList.add('show');
        setTimeout(resolve, 950);
    });
}

function overlayHide() {
    overlay.classList.remove('show');
    setTimeout(() => { isNavigating = false; }, 950);
}

async function navigateTo(url) {
    if (isNavigating) return;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const targetPage  = url.split('/').pop() || 'index.html';
    if (currentPage === targetPage) return;
    isNavigating = true;

    const burgerEl = document.querySelector('.nav-burger');
    const linksEl  = document.querySelector('.nav-links');

    if (burgerEl && burgerEl.classList.contains('open')) {
        // Fermer le menu sans animation — la transition de page prend le relais
        if (linksEl) linksEl.style.transition = 'none';
        burgerEl.classList.remove('open');
        if (linksEl) linksEl.classList.remove('open');
        document.body.style.overflow = '';
        requestAnimationFrame(() => { if (linksEl) linksEl.style.transition = ''; });
    }

    const isMobile = true; // Transition de page désactivée
    const [, response] = await Promise.all([
        Promise.resolve(),
        fetch(url).catch(() => null)
    ]);

    if (!response || !response.ok) {
        isNavigating = false;
        window.location.href = url;
        return;
    }

    let newDoc;
    try {
        newDoc = new DOMParser().parseFromString(await response.text(), 'text/html');
    } catch {
        isNavigating = false;
        window.location.href = url;
        return;
    }

    const oldMain = document.querySelector('main');
    const newMain = newDoc.querySelector('main');
    if (newMain && oldMain) oldMain.replaceWith(newMain);

    document.title = newDoc.title;
    history.pushState({ url }, '', url);
    document.body.className = newDoc.body.className;

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').split('/').pop() === targetPage) a.classList.add('active');
    });

    // Gérer la classe nav-logo-inner selon la page (home = logo masqué dans nav)
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        if (targetPage === 'index.html' || targetPage === '') {
            navLogo.classList.add('nav-logo-inner');
        } else {
            navLogo.classList.remove('nav-logo-inner');
        }
    }

    window.scrollTo(0, 0);
    initPage();
    document.querySelectorAll('.reveal-section').forEach(s => s.classList.add('visible'));

    // Attendre que le navigateur rende le nouveau contenu avant de lever l'overlay
    if (isMobile) {
        isNavigating = false;
    } else {
        requestAnimationFrame(() => requestAnimationFrame(() => overlayHide()));
    }
}

// Intercepter tous les clics sur liens internes
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('//') ||
        href.includes('://') ||
        link.target === '_blank') return;
    e.preventDefault();
    navigateTo(href);
});

// Bouton précédent/suivant du navigateur
window.addEventListener('popstate', (e) => {
    navigateTo(window.location.pathname.split('/').pop() || 'index.html');
});

// Bloquer clic droit sur toutes les images
document.addEventListener('contextmenu', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
});

// Init au chargement direct de la page
initPage();
