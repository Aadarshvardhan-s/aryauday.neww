/* ============================================================
   ARYAUDAY - Main JavaScript
   ============================================================ */

'use strict';

// ── Toast System ──────────────────────────────────────────────
const Toast = {
  container: null,
  init() {
    this.container = document.getElementById('toast-container');
  },
  show(msg, type = 'info', duration = 4000) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${msg}</span>
      <button class="toast-close" onclick="Toast.remove(this.parentElement)">✕</button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => this.remove(toast), duration);
    return toast;
  },
  remove(el) {
    if (!el || !el.parentElement) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 300);
  }
};

// ── Loading Screen ─────────────────────────────────────────────
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('hidden'), 1600);
  });
}

// ── Navbar ────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  if (!navbar) return;

  // Scroll effect
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Close mobile on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      mobileMenu?.classList.remove('active');
    });
  });

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

// ── Dark Mode ─────────────────────────────────────────────────
function initDarkMode() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const saved = localStorage.getItem('aryauday-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', saved);
  if (icon) icon.textContent = saved === 'light' ? '🌙' : '☀️';

  btn?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aryauday-theme', next);
    if (icon) icon.textContent = next === 'light' ? '🌙' : '☀️';
  });
}

// ── Hero Particles ────────────────────────────────────────────
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const colors = ['#FF6B00', '#D4A017', '#FF8C38', '#F0C040'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}

// ── Scroll Reveal ─────────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── Counters ──────────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter-number[data-target]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur = 2000;
  const step = dur / 60;
  let current = 0;
  const increment = target / (dur / step);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

// ── PRANV Stat Bars ───────────────────────────────────────────
function initStatBars() {
  const bars = document.querySelectorAll('.stat-bar');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => obs.observe(b));
}

// ── Volunteer Form ────────────────────────────────────────────
function initVolunteerForm() {
  const form = document.getElementById('volunteer-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner">⏳</span> Submitting...';
    btn.disabled = true;

    const data = {
      fullname: form.fullname.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      helping_area: form.helping_area.value,
      message: form.message.value.trim(),
      submitted_at: new Date().toISOString()
    };

    try {
      await DB.insertVolunteer(data);
      Toast.show('🙏 Thank you! Your volunteer registration has been received.', 'success', 5000);
      form.reset();
    } catch (err) {
      console.error(err);
      Toast.show('Failed to submit. Please try again or contact us directly.', 'error');
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  });
}

// ── Contact Form ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner">⏳</span> Sending...';
    btn.disabled = true;

    const data = {
      name: form.cname.value.trim(),
      email: form.cemail.value.trim(),
      subject: form.subject.value.trim(),
      message: form.cmessage.value.trim(),
      created_at: new Date().toISOString()
    };

    try {
      await DB.insertContact(data);
      Toast.show('✉️ Message sent! We will get back to you soon.', 'success', 5000);
      form.reset();
    } catch (err) {
      console.error(err);
      Toast.show('Failed to send. Please try again.', 'error');
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
    }
  });
}

// ── Auth Modal ────────────────────────────────────────────────
function initAuth() {
  const modal = document.getElementById('auth-modal');
  const openBtns = document.querySelectorAll('[data-open-auth]');
  const closeBtn = document.getElementById('auth-modal-close');
  const tabs = document.querySelectorAll('.modal-tab');
  const loginPanel = document.getElementById('auth-login');
  const signupPanel = document.getElementById('auth-signup');
  const resetPanel = document.getElementById('auth-reset');
  const userNav = document.getElementById('user-nav');
  const authBtn = document.getElementById('auth-btn');

  function openModal(tab = 'login') {
    modal?.classList.add('active');
    switchTab(tab);
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchTab(tab) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    if (loginPanel) loginPanel.classList.toggle('hidden', tab !== 'login');
    if (signupPanel) signupPanel.classList.toggle('hidden', tab !== 'signup');
    if (resetPanel) resetPanel.classList.toggle('hidden', tab !== 'reset');
  }

  openBtns.forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.openAuth || 'login')));
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

  // Login
  document.getElementById('login-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    btn.innerHTML = '<span class="spinner">⏳</span>';
    btn.disabled = true;
    try {
      await Auth.signIn(e.target.lemail.value, e.target.lpassword.value);
      Toast.show('Welcome back! Logged in successfully.', 'success');
      closeModal();
    } catch (err) {
      Toast.show(err.message || 'Login failed. Check credentials.', 'error');
    } finally {
      btn.innerHTML = 'Sign In';
      btn.disabled = false;
    }
  });

  // Signup
  document.getElementById('signup-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    const pw = e.target.spw.value;
    const cpw = e.target.scpw.value;
    if (pw !== cpw) { Toast.show('Passwords do not match.', 'error'); return; }
    btn.innerHTML = '<span class="spinner">⏳</span>';
    btn.disabled = true;
    try {
      await Auth.signUp(e.target.semail.value, pw, e.target.sname.value);
      Toast.show('Account created! Please check your email to verify.', 'success', 6000);
      closeModal();
    } catch (err) {
      Toast.show(err.message || 'Signup failed.', 'error');
    } finally {
      btn.innerHTML = 'Create Account';
      btn.disabled = false;
    }
  });

  // Reset
  document.getElementById('reset-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    btn.innerHTML = '<span class="spinner">⏳</span>';
    btn.disabled = true;
    try {
      await Auth.resetPassword(e.target.remail.value);
      Toast.show('Reset link sent! Check your email.', 'success');
      switchTab('login');
    } catch (err) {
      Toast.show(err.message || 'Failed to send reset email.', 'error');
    } finally {
      btn.innerHTML = 'Send Reset Link';
      btn.disabled = false;
    }
  });

  // Forgot password link
  document.getElementById('forgot-pw-link')?.addEventListener('click', e => {
    e.preventDefault(); switchTab('reset');
  });

  // Auth state
  function updateAuthUI(session) {
    if (session) {
      if (authBtn) authBtn.style.display = 'none';
      if (userNav) { userNav.style.display = 'flex'; userNav.innerHTML = `<span style="font-size:0.8rem;color:var(--text-muted);">${session.user.email}</span>`; }
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) logoutBtn.style.display = 'flex';
      checkAdminAccess(session.user.id);
    } else {
      if (authBtn) authBtn.style.display = 'flex';
      if (userNav) userNav.style.display = 'none';
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) logoutBtn.style.display = 'none';
      const adminSection = document.getElementById('admin-section');
      if (adminSection) adminSection.classList.remove('visible');
    }
  }

  async function checkAdminAccess(userId) {
    try {
      const isAdmin = await DB.isAdmin(userId);
      const adminSection = document.getElementById('admin-section');
      const adminNavLink = document.getElementById('admin-nav-link');
      if (isAdmin) {
        if (adminSection) adminSection.classList.add('visible');
        if (adminNavLink) adminNavLink.style.display = 'block';
        loadAdminData('volunteers');
      }
    } catch(e) { console.log('Admin check error:', e); }
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
      await Auth.signOut();
      Toast.show('Logged out successfully.', 'info');
    } catch(e) {
      Toast.show('Logout error.', 'error');
    }
  });

  // Listen for auth changes
  if (window.Auth) {
    Auth.onAuthStateChange((event, session) => updateAuthUI(session));
    Auth.getSession().then(session => updateAuthUI(session));
  }
}

// ── Admin Dashboard ───────────────────────────────────────────
let adminCurrentTab = 'volunteers';
let adminSearchDebounce = null;

function initAdmin() {
  const tabs = document.querySelectorAll('.admin-tab');
  const searchInput = document.getElementById('admin-search');
  const exportBtn = document.getElementById('export-btn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      adminCurrentTab = tab.dataset.table;
      if (searchInput) searchInput.value = '';
      loadAdminData(adminCurrentTab);
    });
  });

  searchInput?.addEventListener('input', e => {
    clearTimeout(adminSearchDebounce);
    adminSearchDebounce = setTimeout(() => {
      loadAdminData(adminCurrentTab, e.target.value);
    }, 350);
  });

  exportBtn?.addEventListener('click', () => exportData());
}

async function loadAdminData(table, search = '') {
  const body = document.getElementById('admin-table-body');
  const head = document.getElementById('admin-table-head');
  if (!body || !head) return;

  body.innerHTML = `<tr><td colspan="10" class="table-loading">⏳ Loading...</td></tr>`;

  try {
    let result, headers, rows;

    if (table === 'volunteers') {
      result = await DB.getVolunteers(search);
      headers = ['Name', 'Email', 'Phone', 'Area', 'Submitted', 'Action'];
      rows = (result.data || []).map(v => `
        <tr>
          <td>${esc(v.fullname)}</td>
          <td>${esc(v.email)}</td>
          <td>${esc(v.phone)}</td>
          <td>${esc(v.helping_area)}</td>
          <td>${formatDate(v.submitted_at)}</td>
          <td><button class="btn-delete" onclick="deleteEntry('volunteers','${v.id}')">Delete</button></td>
        </tr>`).join('');
    } else if (table === 'contacts') {
      result = await DB.getContacts(search);
      headers = ['Name', 'Email', 'Subject', 'Message', 'Date', 'Action'];
      rows = (result.data || []).map(c => `
        <tr>
          <td>${esc(c.name)}</td>
          <td>${esc(c.email)}</td>
          <td>${esc(c.subject)}</td>
          <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.message)}</td>
          <td>${formatDate(c.created_at)}</td>
          <td><button class="btn-delete" onclick="deleteEntry('contacts','${c.id}')">Delete</button></td>
        </tr>`).join('');
    } else if (table === 'users') {
      result = await DB.getUsers(search);
      headers = ['Name', 'Email', 'Role', 'Joined', 'Action'];
      rows = (result.data || []).map(u => `
        <tr>
          <td>${esc(u.full_name)}</td>
          <td>${esc(u.email)}</td>
          <td><span class="badge badge-${u.role}">${u.role}</span></td>
          <td>${formatDate(u.created_at)}</td>
          <td><button class="btn-delete" onclick="deleteEntry('users','${u.id}')">Delete</button></td>
        </tr>`).join('');
    } else if (table === 'donations') {
      result = await DB.getDonations(search);
      headers = ['Donor', 'Email', 'Amount', 'Status', 'Date', 'Action'];
      rows = (result.data || []).map(d => `
        <tr>
          <td>${esc(d.donor_name)}</td>
          <td>${esc(d.email)}</td>
          <td>₹${Number(d.amount).toLocaleString()}</td>
          <td><span class="badge badge-${d.payment_status}">${d.payment_status}</span></td>
          <td>${formatDate(d.created_at)}</td>
          <td><button class="btn-delete" onclick="deleteEntry('donations','${d.id}')">Delete</button></td>
        </tr>`).join('');
    }

    head.innerHTML = headers.map(h => `<th>${h}</th>`).join('');

    if (!rows || rows === '') {
      body.innerHTML = `<tr><td colspan="10" class="admin-empty"><span class="empty-icon">📂</span>No records found</td></tr>`;
    } else {
      body.innerHTML = rows;
    }

    const countEl = document.getElementById('admin-count');
    if (countEl) countEl.textContent = `${result.count || 0} records`;

  } catch (err) {
    console.error(err);
    body.innerHTML = `<tr><td colspan="10" class="admin-empty"><span class="empty-icon">❌</span>Error loading data: ${esc(err.message)}</td></tr>`;
  }
}

window.deleteEntry = async function(table, id) {
  if (!confirm('Are you sure you want to delete this entry?')) return;
  try {
    if (table === 'volunteers') await DB.deleteVolunteer(id);
    else if (table === 'contacts') await DB.deleteContact(id);
    else if (table === 'users') await DB.deleteUser(id);
    Toast.show('Entry deleted successfully.', 'success');
    loadAdminData(adminCurrentTab);
  } catch (err) {
    Toast.show('Delete failed: ' + err.message, 'error');
  }
};

async function exportData() {
  try {
    let result;
    const search = document.getElementById('admin-search')?.value || '';
    if (adminCurrentTab === 'volunteers') result = await DB.getVolunteers(search, 1000);
    else if (adminCurrentTab === 'contacts') result = await DB.getContacts(search, 1000);
    else if (adminCurrentTab === 'users') result = await DB.getUsers(search, 1000);
    else if (adminCurrentTab === 'donations') result = await DB.getDonations(search, 1000);

    const data = result.data || [];
    if (!data.length) { Toast.show('No data to export.', 'info'); return; }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${(row[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aryauday-${adminCurrentTab}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    Toast.show('Data exported successfully!', 'success');
  } catch (err) {
    Toast.show('Export failed: ' + err.message, 'error');
  }
}

// ── Helpers ───────────────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

// ── Gallery Lightbox ──────────────────────────────────────────
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-item-label')?.textContent || '';
      const icon = item.querySelector('.gallery-item-inner')?.textContent?.trim() || '';
      Toast.show(`📸 ${label}`, 'info', 2500);
    });
  });
}

// ── Donation Modal ────────────────────────────────────────────
function initDonation() {
  const modal = document.getElementById('donate-modal');
  const openBtns = document.querySelectorAll('[data-open-donate]');
  const closeBtn = document.getElementById('donate-modal-close');
  const form = document.getElementById('donate-form');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  });
  modal?.addEventListener('click', e => {
    if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
  });

  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amountField = document.getElementById('donate-amount');
      if (amountField) amountField.value = btn.dataset.amount;
    });
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.innerHTML = '<span class="spinner">⏳</span> Processing...';
    btn.disabled = true;

    const data = {
      donor_name: form.dname.value.trim(),
      email: form.demail.value.trim(),
      amount: parseFloat(form.damount.value),
      payment_status: 'pending',
      created_at: new Date().toISOString()
    };

    try {
      await DB.insertDonation(data);
      Toast.show('🙏 Donation initiated! We will process it shortly. Thank you!', 'success', 6000);
      modal?.classList.remove('active');
      document.body.style.overflow = '';
      form.reset();
    } catch (err) {
      Toast.show('Donation submission failed: ' + err.message, 'error');
    } finally {
      btn.innerHTML = '🙏 Donate Now';
      btn.disabled = false;
    }
  });
}

// ── Init All ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initLoadingScreen();
  initNavbar();
  initDarkMode();
  initParticles();
  initScrollReveal();
  initCounters();
  initStatBars();
  initVolunteerForm();
  initContactForm();
  initAuth();
  initAdmin();
  initGallery();
  initDonation();

  // Back to top
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});