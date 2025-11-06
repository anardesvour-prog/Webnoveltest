document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMEN DOM ---
    const homeBtn = document.getElementById('home-btn');
    const writeBtn = document.getElementById('write-btn');
    const collectionBtn = document.getElementById('collection-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const homeSection = document.getElementById('home-section');
    const writeSection = document.getElementById('write-section');
    const collectionSection = document.getElementById('collection-section');

    const authModal = document.getElementById('auth-modal');
    const authTitle = document.getElementById('auth-title');
    const authForm = document.getElementById('auth-form');
    const toggleAuth = document.getElementById('toggle-auth');
    const closeBtn = document.querySelector('.close-btn');

    const writingForm = document.getElementById('writing-form');
    const storyList = document.getElementById('story-list');

    // --- STATE APLIKASI ---
    let isLoggedIn = false;
    let stories = JSON.parse(localStorage.getItem('stories')) || [];

    // --- FUNGSI NAVIGASI HALAMAN ---
    function showSection(sectionToShow) {
        const sections = [homeSection, writeSection, collectionSection];
        sections.forEach(section => section.classList.remove('active'));
        sectionToShow.classList.add('active');
    }

    // --- FUNGSI AUTH (SIMULASI) ---
    function openModal(isLoginMode = true) {
        authModal.style.display = 'block';
        authTitle.textContent = isLoginMode ? 'Masuk' : 'Daftar';
        authForm.querySelector('button[type="submit"]').textContent = isLoginMode ? 'Masuk' : 'Daftar';
    }

    function closeModal() {
        authModal.style.display = 'none';
    }

    function handleAuth(event) {
        event.preventDefault();
        // Simulasi login berhasil
        isLoggedIn = true;
        alert('Selamat! Anda berhasil masuk.');
        closeModal();
        updateUI();
        showSection(homeSection); // Kembali ke beranda
    }

    function handleLogout() {
        isLoggedIn = false;
        alert('Anda telah keluar.');
        updateUI();
        showSection(homeSection);
    }

    // --- FUNGSI MENULIS & MENYIMPAN CERITA ---
    function saveStory(event) {
        event.preventDefault();
        if (!isLoggedIn) {
            alert('Anda harus masuk terlebih dahulu untuk menyimpan cerita.');
            openModal();
            return;
        }

        const title = document.getElementById('story-title').value;
        const content = document.getElementById('story-content').value;

        const newStory = {
            id: Date.now(), // ID unik sederhana
            title: title,
            content: content,
        };

        stories.push(newStory);
        localStorage.setItem('stories', JSON.stringify(stories));
        
        writingForm.reset();
        alert('Cerita berhasil disimpan!');
        showCollection(); // Tampilkan koleksi yang sudah diperbarui
    }

    // --- FUNGSI MENAMPILKAN KOLEKSI ---
    function showCollection() {
        if (!isLoggedIn) {
            alert('Anda harus masuk untuk melihat koleksi.');
            return;
        }
        storyList.innerHTML = ''; // Kosongkan daftar lama

        if (stories.length === 0) {
            storyList.innerHTML = '<p>Belum ada cerita. Mulai menulis sekarang!</p>';
        } else {
            stories.forEach(story => {
                const storyItem = document.createElement('div');
                storyItem.classList.add('story-item');
                storyItem.innerHTML = `
                    <h3>${story.title}</h3>
                    <p>${story.content.substring(0, 200)}...</p>
                    <button class="delete-btn" data-id="${story.id}">Hapus</button>
                `;
                storyList.appendChild(storyItem);
            });
        }
        showSection(collectionSection);
    }
    
    // --- FUNGSI HAPUS CERITA ---
    function deleteStory(event) {
        if (event.target.classList.contains('delete-btn')) {
            const storyId = parseInt(event.target.getAttribute('data-id'));
            stories = stories.filter(story => story.id !== storyId);
            localStorage.setItem('stories', JSON.stringify(stories));
            alert('Cerita berhasil dihapus.');
            showCollection(); // Perbarui tampilan
        }
    }

    // --- FUNGSI UPDATE UI BERDASARKAN STATUS LOGIN ---
    function updateUI() {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            collectionBtn.style.display = 'inline-block';
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            collectionBtn.style.display = 'none';
        }
    }


    // --- EVENT LISTENER ---
    homeBtn.addEventListener('click', () => showSection(homeSection));
    writeBtn.addEventListener('click', () => showSection(writeSection));
    collectionBtn.addEventListener('click', showCollection);
    loginBtn.addEventListener('click', () => openModal(true));
    logoutBtn.addEventListener('click', handleLogout);

    authForm.addEventListener('submit', handleAuth);
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(authTitle.textContent === 'Masuk');
    });
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == authModal) {
            closeModal();
        }
    });

    writingForm.addEventListener('submit', saveStory);
    storyList.addEventListener('click', deleteStory);

    // --- INISIALISASI ---
    updateUI();
});