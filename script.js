document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // Fetch dynamic data from Supabase
    async function fetchProfileData() {
        if (!window.supabaseClient) return;
        
        try {
            const { data, error } = await supabaseClient
                .from('profile')
                .select('*')
                .single();
                
            if (data && !error) {
                // Update text contents
                if (data.name) document.getElementById('display-name').innerHTML = data.name.replace('\n', '<br>');
                if (data.title) document.getElementById('display-title').innerText = data.title;
                if (data.tagline) document.getElementById('display-tagline').innerText = data.tagline;
                if (data.about) document.getElementById('display-about').innerHTML = `<p>${data.about.replace(/\n\n/g, '</p><p>')}</p>`;
                
                // Update contact links and text
                if (data.contact_email) {
                    document.getElementById('display-email').innerText = data.contact_email;
                    document.getElementById('link-email').href = `mailto:${data.contact_email}`;
                }
                if (data.contact_phone) {
                    document.getElementById('display-phone').innerText = data.contact_phone;
                    document.getElementById('link-phone').href = `tel:${data.contact_phone.replace(/\s+/g, '')}`;
                }
            }
        } catch (err) {
            console.error("Error fetching data from Supabase:", err);
        }
    }

    fetchProfileData();
});
