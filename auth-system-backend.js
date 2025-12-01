// Authentication System with Backend API

(function() {
  const CURRENT_USER_KEY = 'myshop_current_user_v1';

  // Get current user
  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch (e) {
      return null;
    }
  }

  // Save current user
  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      localStorage.setItem('currentUser', user.name || user.user?.name); // For reviews
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('currentUser');
    }
  }

  // Register new user
  async function register(userData) {
    try {
      showLoading('Ro\'yxatdan o\'tmoqda...');

      const result = await window.API.Auth.register(userData);

      hideLoading();

      if (result.success) {
        // Sync local cart to server
        const userId = result.data.user?.id;
        if (userId) {
          await window.API.Cart.syncLocalCart(userId);
        }

        return { 
          success: true, 
          message: 'Ro\'yxatdan o\'tish muvaffaqiyatli!', 
          user: result.data.user 
        };
      } else {
        return { 
          success: false, 
          message: result.message || 'Xatolik yuz berdi!' 
        };
      }
    } catch (error) {
      hideLoading();
      return { 
        success: false, 
        message: 'Server bilan bog\'lanishda xatolik!' 
      };
    }
  }

  // Login user
  async function login(email, password) {
    try {
      showLoading('Tizimga kirmoqda...');

      const result = await window.API.Auth.login(email, password);

      hideLoading();

      if (result.success) {
        // Sync local cart to server
        const userId = result.data.user?.id;
        if (userId) {
          await window.API.Cart.syncLocalCart(userId);
        }

        return { 
          success: true, 
          message: 'Xush kelibsiz!', 
          user: result.data.user 
        };
      } else {
        return { 
          success: false, 
          message: result.message || 'Email yoki parol noto\'g\'ri!' 
        };
      }
    } catch (error) {
      hideLoading();
      return { 
        success: false, 
        message: 'Server bilan bog\'lanishda xatolik!' 
      };
    }
  }

  // Logout
  function logout() {
    setCurrentUser(null);
    showNotification('Tizimdan chiqdingiz', 'info');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Setup login modal
  function setupLoginModal() {
    const modal = document.getElementById("loginModal");
    const openBtn = document.getElementById("openLogin");
    const closeBtn = document.getElementById("closeLogin");
    const form = document.getElementById("loginForm");
    const msgEl = document.getElementById("loginMsg");

    if (!modal || !form) return;

    // Open modal
    if (openBtn) {
      openBtn.onclick = () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
          showUserMenu(openBtn);
        } else {
          modal.style.display = "flex";
        }
      };
    }

    // Close modal
    if (closeBtn) {
      closeBtn.onclick = () => modal.style.display = "none";
    }

    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };

    // Handle form submission
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      msgEl.style.color = "red";

      if (!email || !password) {
        msgEl.textContent = "Barcha maydonlarni to'ldiring!";
        return;
      }

      // Try to login
      const result = await login(email, password);

      if (result.success) {
        msgEl.style.color = "green";
        msgEl.textContent = result.message;
        
        setCurrentUser(result.user);
        
        setTimeout(() => {
          modal.style.display = "none";
          msgEl.textContent = "";
          form.reset();
          updateUserInterface();
          window.location.reload();
        }, 1000);
      } else {
        msgEl.textContent = result.message;
      }
    });

    // Add "Register" link to login modal
    addRegisterLink();
  }

  // Add register link to login modal
  function addRegisterLink() {
    const modalContent = document.querySelector('#loginModal .modal-content');
    if (!modalContent) return;

    const existingLink = modalContent.querySelector('.register-link');
    if (existingLink) return;

    const registerLink = document.createElement('div');
    registerLink.className = 'register-link';
    registerLink.style.cssText = 'text-align: center; margin-top: 15px; color: #666; font-size: 14px;';
    registerLink.innerHTML = `
      Akkauntingiz yo'qmi? 
      <a href="#" id="showRegisterModal" style="color: #c2925e; font-weight: 600; text-decoration: none;">
        Ro'yxatdan o'tish
      </a>
    `;

    modalContent.appendChild(registerLink);

    // Show register modal
    document.getElementById('showRegisterModal').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginModal').style.display = 'none';
      showRegisterModal();
    });
  }

  // Show register modal
  function showRegisterModal() {
    let registerModal = document.getElementById('registerModal');
    
    if (!registerModal) {
      registerModal = document.createElement('div');
      registerModal.id = 'registerModal';
      registerModal.className = 'modal';
      registerModal.style.display = 'flex';
      registerModal.innerHTML = `
        <div class="modal-content">
          <span class="close" id="closeRegister">&times;</span>
          <h2>Ro'yxatdan o'tish</h2>
          <form id="registerForm">
            <label>Ism</label>
            <input type="text" id="regName" required placeholder="Ismingiz">

            <label>Email</label>
            <input type="email" id="regEmail" required placeholder="you@mail.com">

            <label>Parol</label>
            <input type="password" id="regPassword" required placeholder="••••••••" minlength="6">

            <label>Parolni tasdiqlash</label>
            <input type="password" id="regPasswordConfirm" required placeholder="••••••••">

            <button class="login-btn" type="submit">Ro'yxatdan o'tish</button>
          </form>
          <div id="registerMsg" class="msg"></div>
          <div style="text-align: center; margin-top: 15px; color: #666; font-size: 14px;">
            Akkauntingiz bormi? 
            <a href="#" id="showLoginModal" style="color: #c2925e; font-weight: 600; text-decoration: none;">
              Kirish
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(registerModal);
    } else {
      registerModal.style.display = 'flex';
    }

    setupRegisterModalHandlers(registerModal);
  }

  // Setup register modal handlers
  function setupRegisterModalHandlers(modal) {
    const closeBtn = modal.querySelector('#closeRegister');
    const form = modal.querySelector('#registerForm');
    const msgEl = modal.querySelector('#registerMsg');

    // Close
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };

    // Switch to login
    const loginLink = modal.querySelector('#showLoginModal');
    if (loginLink) {
      loginLink.onclick = (e) => {
        e.preventDefault();
        modal.style.display = 'none';
        document.getElementById('loginModal').style.display = 'flex';
      };
    }

    // Handle form submission
    form.onsubmit = async (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const passwordConfirm = document.getElementById('regPasswordConfirm').value;

      msgEl.style.color = 'red';

      // Validation
      if (!name || !email || !password || !passwordConfirm) {
        msgEl.textContent = 'Barcha maydonlarni to\'ldiring!';
        return;
      }

      if (password.length < 6) {
        msgEl.textContent = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak!';
        return;
      }

      if (password !== passwordConfirm) {
        msgEl.textContent = 'Parollar mos kelmadi!';
        return;
      }

      // Register
      const result = await register({ name, email, password });

      if (result.success) {
        msgEl.style.color = 'green';
        msgEl.textContent = result.message;
        
        setCurrentUser(result.user);
        
        setTimeout(() => {
          modal.style.display = 'none';
          form.reset();
          updateUserInterface();
          window.location.reload();
        }, 1000);
      } else {
        msgEl.textContent = result.message;
      }
    };
  }

  // Show user menu
  function showUserMenu(button) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    let menu = document.getElementById('userMenu');
    
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'userMenu';
      menu.style.cssText = `
        position: absolute;
        top: 60px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 10px 0;
        min-width: 200px;
        z-index: 1000;
        display: none;
      `;
      document.body.appendChild(menu);
    }

    const userName = currentUser.name || currentUser.user?.name || 'Foydalanuvchi';
    const userEmail = currentUser.email || currentUser.user?.email || '';

    menu.innerHTML = `
      <div style="padding: 15px; border-bottom: 1px solid #eee;">
        <div style="font-weight: 600; color: #111; margin-bottom: 5px;">${userName}</div>
        <div style="font-size: 13px; color: #666;">${userEmail}</div>
      </div>
      <a href="#" id="logoutBtn" style="display: block; padding: 12px 15px; color: #e84a5f; text-decoration: none; transition: background 0.3s;">
        🚪 Chiqish
      </a>
    `;

    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Tizimdan chiqmoqchimisiz?')) {
        logout();
      }
    });

    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target !== button) {
          menu.style.display = 'none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 0);
  }

  // Update user interface
  function updateUserInterface() {
    const currentUser = getCurrentUser();
    const openLoginBtn = document.getElementById('openLogin');

    if (currentUser && openLoginBtn) {
      openLoginBtn.innerHTML = '👤';
      const userName = currentUser.name || currentUser.user?.name || 'User';
      openLoginBtn.title = userName;
    }
  }

  // Helper functions
  function showLoading(message) {
    if (window.loadingSystem) {
      window.loadingSystem.showLoading(message);
    }
  }

  function hideLoading() {
    if (window.loadingSystem) {
      window.loadingSystem.hideLoading();
    }
  }

  function showNotification(message, type) {
    if (window.loadingSystem) {
      window.loadingSystem.showToast(message, type);
    }
  }

  // Initialize
  function init() {
    setupLoginModal();
    updateUserInterface();
  }

  // Expose to global
  window.authSystem = {
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn: () => getCurrentUser() !== null
  };

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
