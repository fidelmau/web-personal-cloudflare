document.addEventListener('DOMContentLoaded', async () => {
    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('login-form');
    const editForm = document.getElementById('edit-form');
    const logoutBtn = document.getElementById('logout-btn');
    const messageBox = document.getElementById('message-box');

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
    }

    async function showDashboard() {
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        
        // Cargar datos actuales desde Supabase (tabla 'profile')
        const { data, error } = await supabaseClient
            .from('profile')
            .select('*')
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                showMessage("Aviso: No hay datos en la base de datos todavía. Crea tu perfil.", false);
            } else {
                showMessage("Error cargando datos: " + error.message, true);
            }
        } else if (data) {
            document.getElementById('edit-name').value = data.name || '';
            document.getElementById('edit-title').value = data.title || '';
            document.getElementById('edit-tagline').value = data.tagline || '';
            document.getElementById('edit-about').value = data.about || '';
            document.getElementById('edit-email').value = data.contact_email || '';
            document.getElementById('edit-phone').value = data.contact_phone || '';
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
            showMessage("Login exitoso");
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

        const profileData = {
            id: 1, // Asumimos una fila única con ID 1
            name: document.getElementById('edit-name').value,
            title: document.getElementById('edit-title').value,
            tagline: document.getElementById('edit-tagline').value,
            about: document.getElementById('edit-about').value,
            contact_email: document.getElementById('edit-email').value,
            contact_phone: document.getElementById('edit-phone').value,
            updated_at: new Date()
        };

        const { data, error } = await supabaseClient
            .from('profile')
            .upsert(profileData) // Inserta o actualiza
            .select();

        btn.textContent = 'Guardar Cambios';

        if (error) {
            showMessage("Error al guardar: " + error.message, true);
        } else {
            showMessage("¡Cambios guardados correctamente!");
        }
    });
});
