// Komponen Autentikasi: Login Sistem (UC-01) & Registrasi Warga (UC-02)
// Implementasi Spesifikasi: Neo-Brutalism + Bento Grid (design.md)
// SMART RT 022 RW 008 DESA CIANTRA

class LoginView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentMode = 'login'; // 'login' | 'register'
        this.selectedRole = 'warga'; // 'warga' | 'admin' | 'satpam'
        this.init();
    }

    init() {
        this.render();
    }

    setMode(mode) {
        this.currentMode = mode;
        this.render();
    }

    setRole(role) {
        this.selectedRole = (role === 'bendahara') ? 'admin' : role;
        const identInput = document.getElementById('login-identifier');
        const passInput = document.getElementById('login-password');

        if (this.selectedRole === 'warga') {
            if (identInput) identInput.value = '3216061208920003';
            if (passInput) passInput.value = '123';
        } else if (this.selectedRole === 'admin' || this.selectedRole === 'admin_rt') {
            if (identInput) identInput.value = 'admin';
            if (passInput) passInput.value = '123';
        } else if (this.selectedRole === 'satpam') {
            if (identInput) identInput.value = 'satpam';
            if (passInput) passInput.value = '123';
        }

        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="login-wrapper">
                <div class="login-card">
                    <!-- Brand Header Neo-Brutalism -->
                    <div class="login-header">
                        <div class="login-logo-box">22</div>
                        <h2>SMART RT 022 DESA CIANTRA</h2>
                        <p>RW 008 • Kecamatan Cikarang Selatan • Kabupaten Bekasi</p>
                        <div style="margin-top:8px;">
                            <span class="neo-badge neo-badge-secondary">Ketua RT: Bapak Anwar Djamaludin (2024-2027)</span>
                        </div>
                    </div>

                    <!-- Tab Switcher (Login / Registrasi) -->
                    <div style="display:flex; background:#f1f5f9; border:2.5px solid #000; border-radius:12px; padding:4px; margin-bottom:20px; gap:4px;">
                        <button type="button" class="neo-btn neo-btn-sm ${this.currentMode === 'login' ? 'neo-btn-primary' : ''}" style="flex:1; border-width:${this.currentMode === 'login' ? '2.5px' : '0'}; box-shadow:${this.currentMode === 'login' ? '2px 2px 0 #000' : 'none'};" onclick="window.loginView.setMode('login')">
                            Masuk Sistem (UC-01)
                        </button>
                        <button type="button" class="neo-btn neo-btn-sm ${this.currentMode === 'register' ? 'neo-btn-primary' : ''}" style="flex:1; border-width:${this.currentMode === 'register' ? '2.5px' : '0'}; box-shadow:${this.currentMode === 'register' ? '2px 2px 0 #000' : 'none'};" onclick="window.loginView.setMode('register')">
                            Daftar Warga (UC-02)
                        </button>
                    </div>

                    ${this.currentMode === 'login' ? this.renderLoginForm() : this.renderRegisterForm()}
                </div>
            </div>
        `;
    }

    renderLoginForm() {
        const roleInfo = {
            warga: {
                title: "Warga RT 022",
                desc: "Akses PWA Mobile: SOS Darurat, Lapor Fasilitas, E-Surat TTD QR, Iuran IPL Rp 50.000 QRIS, Katalog UMKM & Buku Kas.",
                color: "#ffd93d",
                icon: "WRG",
                defaultUser: "Bpk. Budi Santoso (Blok C No. 12)",
                badge: "neo-badge-primary"
            },
            admin: {
                title: "Ketua RT (Admin & Keuangan RT)",
                desc: "Akses Penuh: Approval Surat Ber-TTD Digital QR Pak Anwar, Verifikasi 84 KK Warga, Pengelolaan Buku Kas & Tagihan Massal IPL Rp 50.000 (UC-17), Input Pembukuan Kas (UC-20), Rekonsiliasi Kas Terbuka (UC-21), Disposisi Lapangan, Siar & Aset.",
                color: "#4f46e5",
                icon: "KRT",
                defaultUser: "Bapak Anwar Djamaludin",
                badge: "neo-badge-secondary"
            },
            satpam: {
                title: "Satpam / Petugas Lapangan",
                desc: "Akses Pos Ronda 24 Jam: Pantau Radar GPS & Sirene Audio Alarm SOS (UC-05), Clear Area (UC-06), dan Eksekusi Tugas Lapangan (UC-08b).",
                color: "#ef4444",
                icon: "STP",
                defaultUser: "Pak Joko Supardi (Pos 1)",
                badge: "neo-badge-danger"
            }
        };

        const current = roleInfo[this.selectedRole] || roleInfo['warga'];

        return `
            <div>
                <!-- 3 Role Selector Pills: Warga, Ketua RT (Admin & Kas), Satpam -->
                <div style="margin-bottom:14px;">
                    <span style="font-family:'Plus Jakarta Sans'; font-size:0.75rem; font-weight:800; color:#64748b; text-transform:uppercase; display:block; margin-bottom:8px;">
                        Pilih Role Pengguna (3 Peran Resmi):
                    </span>
                    <div class="login-role-pills" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:6px;">
                        <button type="button" class="role-pill-btn ${this.selectedRole === 'warga' ? 'active-warga' : ''}" onclick="window.loginView.setRole('warga')">
                            Warga
                        </button>
                        <button type="button" class="role-pill-btn ${this.selectedRole === 'admin' ? 'active-admin' : ''}" onclick="window.loginView.setRole('admin')">
                            Ketua RT (Admin &amp; Kas)
                        </button>
                        <button type="button" class="role-pill-btn ${this.selectedRole === 'satpam' ? 'active-satpam' : ''}" onclick="window.loginView.setRole('satpam')">
                            Satpam
                        </button>
                    </div>

                    <!-- Role Scope Card -->
                    <div style="background:#f8fafc; border:2px solid #000; border-radius:12px; padding:12px; margin-bottom:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <strong style="font-family:'Poppins'; font-size:0.85rem;">
                                <span class="neo-badge neo-badge-sm" style="margin-right:6px;">${current.icon}</span> ${current.title}
                            </strong>
                            <span class="neo-badge ${current.badge}">${current.defaultUser}</span>
                        </div>
                        <p style="font-size:0.75rem; color:#475569; line-height:1.4;">${current.desc}</p>
                    </div>
                </div>

                <!-- Form Login -->
                <form id="form-login-system" onsubmit="window.loginView.handleLoginSubmit(event)">
                    <div class="m3-field">
                        <label>NIK KTP / Username / No WhatsApp</label>
                        <input type="text" id="login-identifier" required value="${this.selectedRole === 'warga' ? '3216061208920003' : this.selectedRole}">
                    </div>

                    <div class="m3-field">
                        <label>Kata Sandi (Password Demo: 123)</label>
                        <input type="password" id="login-password" required value="123">
                    </div>

                    <div id="login-error-msg" style="display:none; background:#fee2e2; border:2px solid #dc2626; color:#991b1b; padding:10px; border-radius:10px; font-size:0.78rem; font-weight:700; margin-bottom:12px;"></div>

                    <button type="submit" class="neo-btn neo-btn-primary neo-btn-block neo-btn-lg" style="margin-top:4px;">
                        Masuk sebagai ${current.title}
                    </button>
                </form>

                <div style="text-align:center; font-size:0.78rem; color:#64748b; margin-top:16px; font-weight:600;">
                    Warga baru belum terdaftar? <a href="javascript:void(0)" onclick="window.loginView.setMode('register')" style="color:#4f46e5; font-weight:800; text-decoration:underline;">Daftar Akun Warga (UC-02)</a>
                </div>
            </div>
        `;
    }

    renderRegisterForm() {
        return `
            <div>
                <div style="background:#e0e7ff; border:2px solid #000; border-radius:12px; padding:12px; margin-bottom:16px; font-size:0.78rem; color:#1e1b4b; line-height:1.4;">
                    <b>Registrasi Akun Warga Baru (UC-02)</b>: Sesuai alur sistem, data pendaftaran warga akan dikirimkan ke <b>Ketua RT (Bapak Anwar Djamaludin)</b> untuk diverifikasi (UC-03) sebelum akun aktif.
                </div>

                <form id="form-register-warga" onsubmit="window.loginView.handleRegisterSubmit(event)">
                    <div class="m3-field">
                        <label>NIK Kependudukan (16 Digit KTP) *</label>
                        <input type="text" id="reg-nik" maxlength="16" placeholder="Contoh: 3216061508950005" required>
                    </div>

                    <div class="m3-field">
                        <label>Nama Lengkap Kepala Keluarga / Warga *</label>
                        <input type="text" id="reg-nama" placeholder="Sesuai KTP..." required>
                    </div>

                    <div class="m3-field">
                        <label>Blok & Nomor Rumah *</label>
                        <input type="text" id="reg-rumah" placeholder="Contoh: Blok C No. 12" required>
                    </div>

                    <div class="m3-field">
                        <label>Nomor WhatsApp Aktif *</label>
                        <input type="tel" id="reg-hp" placeholder="Contoh: 081234567890" required>
                    </div>

                    <div class="m3-field">
                        <label>Kata Sandi Akun Baru *</label>
                        <input type="password" id="reg-password" placeholder="Minimal 3 karakter (demo: 123)" required>
                    </div>

                    <div id="reg-error-msg" style="display:none; background:#fee2e2; border:2px solid #dc2626; color:#991b1b; padding:10px; border-radius:10px; font-size:0.78rem; font-weight:700; margin-bottom:12px;"></div>

                    <button type="submit" class="neo-btn neo-btn-success neo-btn-block neo-btn-lg">
                        Kirim Pendaftaran Warga (UC-02)
                    </button>
                </form>

                <div style="text-align:center; font-size:0.78rem; color:#64748b; margin-top:16px; font-weight:600;">
                    Sudah memiliki akun? <a href="javascript:void(0)" onclick="window.loginView.setMode('login')" style="color:#4f46e5; font-weight:800; text-decoration:underline;">Kembali ke Login</a>
                </div>
            </div>
        `;
    }

    handleLoginSubmit(e) {
        e.preventDefault();
        const ident = document.getElementById('login-identifier').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        const errorEl = document.getElementById('login-error-msg');
        if (errorEl) errorEl.style.display = 'none';

        const result = window.appStore.login(ident, pass);

        if (result.success) {
            window.soundController.playSuccessChime();
            window.appController.handleLoginSuccess(result.user);
        } else {
            if (errorEl) {
                errorEl.innerText = result.message;
                errorEl.style.display = 'block';
            } else {
                alert(result.message);
            }
        }
    }

    handleRegisterSubmit(e) {
        e.preventDefault();
        const nik = document.getElementById('reg-nik').value.trim();
        const nama = document.getElementById('reg-nama').value.trim();
        const rumah = document.getElementById('reg-rumah').value.trim();
        const hp = document.getElementById('reg-hp').value.trim();
        const pass = document.getElementById('reg-password').value.trim();

        const errorEl = document.getElementById('reg-error-msg');
        if (errorEl) errorEl.style.display = 'none';

        const result = window.appStore.registerWarga({ nik, nama, rumah, hp, password: pass });

        if (result.success) {
            window.soundController.playSuccessChime();
            alert(`[BERHASIL] PENDAFTARAN (UC-02)!\nData atas nama "${nama}" telah dikirim.\nStatus: Menunggu verifikasi (UC-03) dari Bapak Anwar Djamaludin (Ketua RT 022 Desa Ciantra).`);
            this.setMode('login');
        } else {
            if (errorEl) {
                errorEl.innerText = result.message;
                errorEl.style.display = 'block';
            } else {
                alert(result.message);
            }
        }
    }
}

window.LoginView = LoginView;
