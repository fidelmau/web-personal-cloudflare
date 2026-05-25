document.addEventListener('DOMContentLoaded', async () => {
    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const editForm = document.getElementById('edit-form');
    const logoutBtn = document.getElementById('logout-btn');
    const messageBox = document.getElementById('message-box');

    // Dynamic containers
    const skillsEditor = document.getElementById('skills-editor');
    const addSkillBtn = document.getElementById('add-skill-btn');
    const expEditor = document.getElementById('experience-editor');
    const addExpBtn = document.getElementById('add-exp-btn');

    // Comprobar si ya estamos logueados
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        showDashboard();
    } else {
        loginSection.style.display = 'block';
    }

    // Funciones UI
    function showMessage(text, isError = false) {
        messageBox.innerHTML = `<div class="alert ${isError ? 'error' : 'success'}">${text}</div>`;
        setTimeout(() => { messageBox.innerHTML = ''; }, 5000);
        window.scrollTo(0, 0);
    }

    // Funciones para construir editores JSON
    function createSkillItem(category = '', items = '') {
        const div = document.createElement('div');
        div.className = 'json-item skill-item';
        div.innerHTML = `
            <button type="button" class="remove-btn">X</button>
            <div class="form-group">
                <label>Categoría (Ej: Automation Tools)</label>
                <input type="text" class="form-control skill-cat" value="${category}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Habilidades (Separadas por comas)</label>
                <input type="text" class="form-control skill-list" value="${items}">
            </div>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
        return div;
    }

    function createExpItem(date = '', role = '', company = '', desc = '') {
        const div = document.createElement('div');
        div.className = 'json-item exp-item';
        div.innerHTML = `
            <button type="button" class="remove-btn">X</button>
            <div class="form-group">
                <label>Fecha (Ej: March 2025 - Present)</label>
                <input type="text" class="form-control exp-date" value="${date}">
            </div>
            <div class="form-group">
                <label>Rol / Puesto</label>
                <input type="text" class="form-control exp-role" value="${role}">
            </div>
            <div class="form-group">
                <label>Empresa</label>
                <input type="text" class="form-control exp-company" value="${company}">
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Descripción</label>
                <textarea class="form-control exp-desc" style="min-height:80px;">${desc}</textarea>
            </div>
        `;
        div.querySelector('.remove-btn').addEventListener('click', () => div.remove());
        return div;
    }

    // Add buttons
    addSkillBtn.addEventListener('click', () => {
        skillsEditor.appendChild(createSkillItem());
    });
    addExpBtn.addEventListener('click', () => {
        expEditor.appendChild(createExpItem());
    });

    async function showDashboard() {
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        
        // Cargar datos actuales desde Supabase
        const { data, error } = await supabaseClient
            .from('profile')
            .select('*')
            .single();

        if (error && error.code !== 'PGRST116') {
            showMessage("Error cargando datos: " + error.message, true);
        } else if (data) {
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-title').value = data.title || '';
            document.getElementById('edit-tagline').value = data.tagline || '';
            document.getElementById('edit-about').value = data.about || '';
            document.getElementById('edit-email').value = data.contact_email || '';
            document.getElementById('edit-phone').value = data.contact_phone || '';
            document.getElementById('edit-linkedin').value = data.linkedin_url || '';

            // Load Skills
            skillsEditor.innerHTML = '';
            if (data.skills && Array.isArray(data.skills)) {
                data.skills.forEach(skill => {
                    skillsEditor.appendChild(createSkillItem(skill.category, skill.items.join(', ')));
                });
            }

            // Load Experience
            expEditor.innerHTML = '';
            if (data.experience && Array.isArray(data.experience)) {
                data.experience.forEach(exp => {
                    expEditor.appendChild(createExpItem(exp.date, exp.role, exp.company, exp.description));
                });
            }
        }
    }

    // Eventos
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        btn.textContent = 'Cargando...';

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        btn.textContent = 'Entrar';

        if (error) {
            showMessage(error.message, true);
        } else {
            showDashboard();
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        dashboard.style.display = 'none';
        loginSection.style.display = 'block';
        loginForm.reset();
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-btn');
        btn.textContent = 'Guardando...';

        // Recolectar Skills
        const skills = [];
        document.querySelectorAll('.skill-item').forEach(item => {
            const cat = item.querySelector('.skill-cat').value.trim();
            const list = item.querySelector('.skill-list').value.split(',').map(s => s.trim()).filter(s => s);
            if (cat || list.length > 0) {
                skills.push({ category: cat, items: list });
            }
        });

        // Recolectar Experiencia
        const experience = [];
        document.querySelectorAll('.exp-item').forEach(item => {
            const date = item.querySelector('.exp-date').value.trim();
            const role = item.querySelector('.exp-role').value.trim();
            const comp = item.querySelector('.exp-company').value.trim();
            const desc = item.querySelector('.exp-desc').value.trim();
            if (date || role || comp || desc) {
                experience.push({ date: date, role: role, company: comp, description: desc });
            }
        });

        const profileData = {
            id: 1,
            name: document.getElementById('edit-name').value,
            title: document.getElementById('edit-title').value,
            tagline: document.getElementById('edit-tagline').value,
            about: document.getElementById('edit-about').value,
            contact_email: document.getElementById('edit-email').value,
            contact_phone: document.getElementById('edit-phone').value,
            linkedin_url: document.getElementById('edit-linkedin').value,
            skills: skills,
            experience: experience,
            updated_at: new Date()
        };

        const { data, error } = await supabaseClient
            .from('profile')
            .upsert(profileData)
            .select();

        btn.textContent = 'Guardar Todos Los Cambios';

        if (error) {
            showMessage("Error al guardar: " + error.message, true);
        } else {
            showMessage("¡Cambios guardados correctamente!");
        }
    });
});
