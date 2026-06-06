const translations = {
    en: {
        "nav-about": "About",
        "nav-skills": "Skills",
        "nav-experience": "Experience",
        "nav-contact": "Contact",
        "hero-greeting": "Hello, I am",
        "btn-contact": "Get In Touch",
        "btn-experience": "View Experience",
        "title-about": "About Me",
        "stat-years": "Years Experience",
        "stat-languages": "Languages Spoken",
        "title-skills": "Top Skills & Tools",
        "title-experience": "Professional Experience",
        "title-contact": "Get In Touch",
        "subtitle-contact": "I am always open to discussing QA strategies, new projects, or opportunities to be part of your vision."
    },
    es: {
        "nav-about": "Sobre mí",
        "nav-skills": "Habilidades",
        "nav-experience": "Experiencia",
        "nav-contact": "Contacto",
        "hero-greeting": "Hola, soy",
        "btn-contact": "Contactar",
        "btn-experience": "Ver Experiencia",
        "title-about": "Sobre Mí",
        "stat-years": "Años de Experiencia",
        "stat-languages": "Idiomas Hablados",
        "title-skills": "Habilidades y Herramientas",
        "title-experience": "Experiencia Profesional",
        "title-contact": "Contacto",
        "subtitle-contact": "Siempre estoy abierto a discutir estrategias de QA, nuevos proyectos u oportunidades para ser parte de tu visión."
    },
    fr: {
        "nav-about": "À propos",
        "nav-skills": "Compétences",
        "nav-experience": "Expérience",
        "nav-contact": "Contact",
        "hero-greeting": "Bonjour, je suis",
        "btn-contact": "Me contacter",
        "btn-experience": "Voir Expérience",
        "title-about": "À Propos",
        "stat-years": "Années d'Expérience",
        "stat-languages": "Langues Parlées",
        "title-skills": "Compétences et Outils",
        "title-experience": "Expérience Professionnelle",
        "title-contact": "Contactez-moi",
        "subtitle-contact": "Je suis toujours ouvert à discuter de stratégies QA, de nouveaux projets ou d'opportunités de faire partie de votre vision."
    },
    ru: {
        "nav-about": "Обо мне",
        "nav-skills": "Навыки",
        "nav-experience": "Опыт",
        "nav-contact": "Контакты",
        "hero-greeting": "Здравствуйте, я",
        "btn-contact": "Связаться",
        "btn-experience": "Смотреть опыт",
        "title-about": "Обо мне",
        "stat-years": "Лет опыта",
        "stat-languages": "Иностранные языки",
        "title-skills": "Навыки и Инструменты",
        "title-experience": "Профессиональный опыт",
        "title-contact": "Свяжитесь со мной",
        "subtitle-contact": "Я всегда открыт для обсуждения стратегий QA, новых проектов или возможностей стать частью вашего видения."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page load and clear hash to prevent jumping
    if (window.location.hash) {
        setTimeout(() => window.scrollTo(0, 0), 10);
        history.replaceState(null, null, window.location.pathname);
    }
    
    // Reveal animations
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Language logic
    let currentLang = localStorage.getItem('siteLang') || 'en';

    function applyStaticTranslations(lang) {
        const dict = translations[lang] || translations['en'];
        for (const [id, text] of Object.entries(dict)) {
            const el = document.getElementById(id);
            if (el) el.innerText = text;
        }
    }

    async function fetchProfileData(lang) {
        try {
            const { data, error } = await supabaseClient
                .from('profile')
                .select('*')
                .eq('locale', lang)
                .single();

            if (error) throw error;

            if (data) {
                if (data.name) document.getElementById('display-name').innerHTML = data.name.replace(' ', '<br>');
                if (data.title) document.getElementById('display-title').innerText = data.title;
                if (data.tagline) document.getElementById('display-tagline').innerText = data.tagline;
                
                if (data.about) {
                    const paragraphs = data.about.split('\n').filter(p => p.trim() !== '');
                    document.getElementById('display-about').innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
                }

                if (data.contact_email) {
                    document.getElementById('display-email').innerText = data.contact_email;
                    document.getElementById('link-email').href = `mailto:${data.contact_email}`;
                }
                if (data.contact_phone) {
                    document.getElementById('display-phone').innerText = data.contact_phone;
                    document.getElementById('link-phone').href = `tel:${data.contact_phone.replace(/\s+/g, '')}`;
                }
                if (data.linkedin_url) {
                    document.getElementById('link-linkedin').href = data.linkedin_url;
                }

                if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
                    const skillsContainer = document.getElementById('display-skills');
                    skillsContainer.innerHTML = data.skills.map(skill => `
                        <div class="skill-category">
                            <h3>${skill.category}</h3>
                            <ul>
                                ${skill.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('');
                }

                if (data.experience && Array.isArray(data.experience) && data.experience.length > 0) {
                    const expContainer = document.getElementById('display-experience');
                    expContainer.innerHTML = data.experience.map(exp => `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content card">
                                <span class="timeline-date">${exp.date}</span>
                                <h3>${exp.role}</h3>
                                <h4 class="company">${exp.company}</h4>
                                <p>${exp.description}</p>
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (err) {
            console.error("Error fetching data from Supabase:", err);
            // Fallback to 'en' if the selected language row doesn't exist yet
            if (lang !== 'en') fetchProfileData('en');
        }
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('siteLang', lang);
        
        // Highlight active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.style.fontWeight = btn.dataset.lang === lang ? 'bold' : 'normal';
            btn.style.color = btn.dataset.lang === lang ? 'var(--accent)' : 'inherit';
        });

        applyStaticTranslations(lang);
        fetchProfileData(lang);
    }

    // Set up language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(btn.dataset.lang);
        });
    });

    // Initialize
    setLanguage(currentLang);
});
