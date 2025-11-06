document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMEN DOM ---
    const homeBtn = document.getElementById('home-btn');
    const writeBtn = document.getElementById('write-btn');
    const collectionBtn = document.getElementById('collection-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplay = document.getElementById('user-display');

    const homeSection = document.getElementById('home-section');
    const writeSection = document.getElementById('write-section');
    const collectionSection = document.getElementById('collection-section');
    const storyDetailSection = document.getElementById('story-detail-section');

    const authModal = document.getElementById('auth-modal');
    const authTitle = document.getElementById('auth-title');
    const authForm = document.getElementById('auth-form');
    const toggleAuth = document.getElementById('toggle-auth');
    const closeBtn = document.querySelector('.close-btn');

    const writingForm = document.getElementById('writing-form');
    const storyList = document.getElementById('story-list');
    const backToCollectionBtn = document.getElementById('back-to-collection-btn');
    const detailTitle = document.getElementById('detail-title');
    const detailContent = document.getElementById('detail-content');

    // --- STATE APLIKASI ---
    let currentUser = null;
    let isLoginMode = true; // true untuk login, false untuk register

    // --- INISIALISASI & LOCAL STORAGE ---
    // Fungsi untuk mendapatkan data pengguna dari localStorage
    function getUsers() {
        const usersData = localStorage.getItem('users');
        return usersData ? JSON.parse(usersData) : {};
    }

    // Fungsi untuk menyimpan data pengguna ke localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Fungsi untuk memeriksa apakah ada pengguna yang login sebelumnya
    function checkLoggedInUser() {
        const loggedInUsername = localStorage.getItem('currentUser');
        if (loggedInUsername) {
            const users = getUsers();
            if (users[loggedInUsername]) {
                currentUser = { username: loggedInUsername };
                updateUI();
            }
        }
    }

    // --- FUNGSI UTAMA ---
    function showSection(sectionToShow) {
        const sections = [homeSection, writeSection, collectionSection, storyDetailSection];
        sections.forEach(section => section.classList.remove('active'));
        sectionToShow.classList.add('active');
    }

    function updateUI() {
        if (currentUser) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            collectionBtn.style.display = 'inline-block';
            userDisplay.textContent = `Halo, ${currentUser.username}!`;
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            collectionBtn.style.display = 'none';
            userDisplay.textContent = '';
        }
    }

    // --- FUNGSI AUTH (LOGIN & REGISTER) ---
    function openModal(mode = true) {
        isLoginMode = mode;
        authModal.style.display = 'block';
        authTitle.textContent = isLoginMode ? 'Masuk' : 'Daftar';
        authForm.querySelector('button[type="submit"]').textContent = isLoginMode ? 'Masuk' : 'Daftar';
        toggleAuth.textContent = isLoginMode ? 'Daftar di sini' : 'Masuk di sini';
    }

    function closeModal() {
        authModal.style.display = 'none';
        authForm.reset();
    }

    function handleAuth(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const users = getUsers();

        if (isLoginMode) {
            // Proses Login
            if (users[username] && users[username].password === password) {
                currentUser = { username: username };
                localStorage.setItem('currentUser', username);
                alert(`Selamat datang kembali, ${username}!`);
                closeModal();
                updateUI();
                showSection(homeSection);
            } else {
                alert('Username atau password salah!');
            }
        } else {
            // Proses Register
            if (users[username]) {
                alert('Username sudah ada! Silakan pilih username lain.');
            } else {
                users[username] = { password: password, stories: [] };
                saveUsers(users);
                alert('Akun berhasil dibuat! Silakan masuk.');
                openModal(true); // Beralih ke mode login
            }
        }
    }

    function handleLogout() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        alert('Anda telah keluar.');
        updateUI();
        showSection(homeSection);
    }

    // --- FUNGSI MENULIS, MENAMPILKAN, & MENGHAPUS CERITA ---
    function saveStory(event) {
        event.preventDefault();
        if (!currentUser) {
            alert('Anda harus masuk terlebih dahulu untuk menyimpan cerita.');
            openModal();
            return;
        }

        const title = document.getElementById('story-title').value;
        const content = document.getElementById('story-content').value;
        const users = getUsers();

        const newStory = {
            id: Date.now(),
            title: title,
            content: content,
        };

        users[currentUser.username].stories.push(newStory);
        saveUsers(users);
        
        writingForm.reset();
        alert('Cerita berhasil disimpan!');
        showCollection();
    }

    function showCollection() {
        if (!currentUser) {
            alert('Anda harus masuk untuk melihat koleksi.');
            return;
        }
        const users = getUsers();
        const stories = users[currentUser.username].stories;
        storyList.innerHTML = '';

        if (stories.length === 0) {
            storyList.innerHTML = '<p>Belum ada cerita. Mulai menulis sekarang!</p>';
        } else {
            stories.forEach(story => {
                const storyItem = document.createElement('div');
                storyItem.classList.add('story-item');
                storyItem.innerHTML = `
                    <h3>${story.title}</h3>
                    <p>${story.content.substring(0, 150)}...</p>
                    <button class="delete-btn" data-id="${story.id}">Hapus</button>
                `;
                storyList.appendChild(storyItem);
            });
        }
        showSection(collectionSection);
    }

    function showStoryDetail(storyId) {
        const users = getUsers();
        const stories = users[currentUser.username].stories;
        const story = stories.find(s => s.id === parseInt(storyId));

        if (story) {
            detailTitle.textContent = story.title;
            detailContent.textContent = story.content;
            showSection(storyDetailSection);
        }
    }

    function deleteStory(event) {
        if (event.target.classList.contains('delete-btn')) {
            const storyId = parseInt(event.target.getAttribute('data-id'));
            if (confirm('Apakah kamu yakin ingin menghapus cerita ini?')) {
                const users = getUsers();
                users[currentUser.username].stories = users[currentUser.username].stories.filter(story => story.id !== storyId);
                saveUsers(users);
                alert('Cerita berhasil dihapus.');
                showCollection(); // Perbarui tampilan
            }
        }
    }
    
    // --- EVENT LISTENER ---
    homeBtn.addEventListener('click', () => showSection(homeSection));
    writeBtn.addEventListener('click', () => showSection(writeSection));
    collectionBtn.addEventListener('click', showCollection);
    backToCollectionBtn.addEventListener('click', showCollection);
    loginBtn.addEventListener('click', () => openModal(true));
    logoutBtn.addEventListener('click', handleLogout);

    authForm.addEventListener('submit', handleAuth);
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(!isLoginMode);
    });
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == authModal) {
            closeModal();
        }
    });

    writingForm.addEventListener('submit', saveStory);
    
    // Event delegation untuk klik di story list
    storyList.addEventListener('click', (event) => {
        // Jika yang diklik adalah tombol hapus
        if (event.target.classList.contains('delete-btn')) {
            deleteStory(event);
        } 
        // Jika yang diklik adalah item cerita (bukan tombol)
        else if (event.target.closest('.story-item')) {
            const storyItem = event.target.closest('.story-item');
            const storyId = storyItem.querySelector('.delete-btn').getAttribute('data-id');
            showStoryDetail(storyId);
        }
    });

    // --- INISIALISASI AWAL ---
    checkLoggedInUser();
});