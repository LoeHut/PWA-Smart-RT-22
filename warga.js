// Komponen Tampilan PWA Warga RT 022 RW 008 DESA CIANTRA
// Implementasi Spesifikasi: Neo-Brutalism + Bento Grid + Gojek-Style Squircle Grid (design.md)

class WargaView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentTab = 'beranda';
        this.sosHoldTimer = null;
        this.sosProgress = 0;
        this.init();
    }

    init() {
        window.appStore.subscribe(() => {
            this.render();
        });
        this.render();
    }

    setTab(tab) {
        this.currentTab = tab;
        this.render();
    }

    render() {
        const data = window.appStore.data;
        const user = data.currentUser || { nama_lengkap: "Bpk. Budi Santoso", no_rumah: "Blok C No. 12" };
        const activeSOS = data.activeEmergency;
        const pendingSurat = (data.documents || []).filter(d => d.status_approval === 'menunggu').length;
        const unpaidBills = (data.invoices || []).filter(i => i.status_bayar === 'belum');

        this.container.innerHTML = `
            <div class="pwa-phone-frame">
                <!-- Sticky Top App Bar -->
                <header class="pwa-header-sticky">
                    <div class="pwa-header-brand">
                        <span class="pwa-badge-22">22</span>
                        <div>
                            <div class="pwa-brand-title">SMART RT 022 CIANTRA</div>
                            <small style="font-size:0.65rem; color:#64748b; font-weight:700;">RW 008 • DESA CIANTRA</small>
                        </div>
                    </div>
                    <div>
                        <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('info')" title="Lihat Notifikasi Pengumuman">
                            <span style="font-weight:800; font-size:0.75rem;">INFO</span> <span class="neo-badge neo-badge-danger" style="padding:1px 6px; font-size:10px; margin-left:4px;">${(data.announcements || []).length}</span>
                        </button>
                    </div>
                </header>

                <!-- SOS Emergency Active Banner -->
                ${activeSOS ? `
                    <div style="background:#ef4444; color:#fff; border-bottom:3px solid #000; padding:10px 14px; display:flex; align-items:center; gap:10px;">
                        <div class="neo-badge neo-badge-danger" style="font-weight:900; font-size:0.85rem; padding:4px 8px;">SOS</div>
                        <div style="flex:1;">
                            <strong style="font-family:'Poppins'; font-size:0.85rem; display:block;">STATUS DARURAT AKTIF</strong>
                            <span style="font-size:0.72rem;">Kategori: <b>${activeSOS.kategori_darurat.toUpperCase()}</b> • Satpam sedang menuju lokasi (${activeSOS.pelapor_rumah})</span>
                        </div>
                    </div>
                ` : ''}

                <!-- Scrollable Body Content -->
                <main class="pwa-body-scroll">
                    ${this.renderCurrentTab(data, user, pendingSurat, unpaidBills)}
                </main>

                <!-- Floating Bottom Bar (Beranda, Surat, Iuran, Profil) -->
                <nav class="pwa-floating-bottom">
                    <button class="pwa-nav-btn ${this.currentTab === 'beranda' ? 'active' : ''}" onclick="window.wargaView.setTab('beranda')">
                        <span class="nav-icon" style="font-size:0.78rem; font-weight:900;">BRD</span>
                        <span>Beranda</span>
                    </button>
                    <button class="pwa-nav-btn ${this.currentTab === 'surat' ? 'active' : ''}" onclick="window.wargaView.setTab('surat')">
                        <span class="nav-icon" style="font-size:0.78rem; font-weight:900;">SRT</span>
                        <span>Surat</span>
                    </button>
                    <button class="pwa-nav-btn ${this.currentTab === 'iuran' ? 'active' : ''}" onclick="window.wargaView.setTab('iuran')">
                        <span class="nav-icon" style="font-size:0.78rem; font-weight:900;">IPL</span>
                        <span>Iuran</span>
                    </button>
                    <button class="pwa-nav-btn ${this.currentTab === 'profil' ? 'active' : ''}" onclick="window.wargaView.setTab('profil')">
                        <span class="nav-icon" style="font-size:0.78rem; font-weight:900;">PRO</span>
                        <span>Profil</span>
                    </button>
                </nav>

                <!-- Modal Container -->
                <div id="pwa-modal-container"></div>
            </div>
        `;

        this.bindEvents();
    }

    renderCurrentTab(data, user, pendingSurat, unpaidBills) {
        switch (this.currentTab) {
            case 'beranda':
                return this.renderBerandaTab(data, user, pendingSurat, unpaidBills);
            case 'info':
                return this.renderInfoTab(data);
            case 'surat':
                return this.renderSuratTab(data);
            case 'iuran':
                return this.renderIuranTab(data);
            case 'lapor':
                return this.renderLaporTab(data);
            case 'jadwal':
                return this.renderJadwalTab(data);
            case 'umkm':
                return this.renderUmkmTab(data);
            case 'aset':
                return this.renderAsetTab(data);
            case 'profil':
                return this.renderProfilTab(data, user);
            default:
                return this.renderBerandaTab(data, user, pendingSurat, unpaidBills);
        }
    }

    // 1. TAB BERANDA: BENTO GRID + GOJEK SQUIRCLE GRID + AGENDA (SESUAI WIREFRAME 4.1)
    renderBerandaTab(data, user, pendingSurat, unpaidBills) {
        const saldoKas = window.appStore.getCurrentCashBalance();
        const firstUnpaid = unpaidBills[0];
        const nextAgenda = (data.agendas && data.agendas[0]) || { tanggal_badge: "25 OKT", judul: "Pembersihan Saluran Drainase", waktu: "07:00 WIB" };
        const totalUmkm = (data.umkm || []).length;

        return `
            <!-- User Profile Greeting Card -->
            <div class="pwa-user-tile">
                <div>
                    <h3>Halo, ${user.nama_lengkap}</h3>
                    <p>Warga Sah RT 022 RW 008 Desa Ciantra</p>
                </div>
                <div>
                    <span class="neo-badge neo-badge-secondary">${user.no_rumah}</span>
                </div>
            </div>

            <!-- === 2-COLUMN BENTO GRID === -->
            <div class="bento-grid">
                <!-- Bento 1 (Span 2): Tagihan IPL & Kas RT -->
                <div class="bento-tile bento-span-2 bento-ipl-kas">
                    <div class="bento-ipl-header">
                        <div>
                            <span style="font-family:'Plus Jakarta Sans'; font-size:0.75rem; font-weight:800; color:#64748b; text-transform:uppercase;">
                                Tagihan IPL Bulan Ini
                            </span>
                            <div class="ipl-amount">Rp 50.000</div>
                        </div>
                        <div>
                            ${firstUnpaid ? `
                                <span class="neo-badge neo-badge-danger">BELUM LUNAS</span>
                            ` : `
                                <span class="neo-badge neo-badge-success">LUNAS</span>
                            `}
                        </div>
                    </div>
                    
                    <div class="kas-pill-strip">
                        <span>Kas Terbuka RT: <strong>Rp ${saldoKas.toLocaleString('id-ID')}</strong></span>
                        ${firstUnpaid ? `
                            <button class="neo-btn neo-btn-sm neo-btn-primary" onclick="window.wargaView.openQRISPaymentModal(${firstUnpaid.invoice_id}, 50000, '${firstUnpaid.bulan_tagihan}')">
                                Bayar QRIS
                            </button>
                        ` : `
                            <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('iuran')">
                                Cek Kas
                            </button>
                        `}
                    </div>
                </div>

                <!-- Bento 2: Info Kerja Bakti -->
                <div class="bento-tile bento-info" onclick="window.wargaView.setTab('info')" style="cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="neo-badge neo-badge-warning" style="font-size:10px;">INFO WARGA</span>
                        <span class="neo-badge neo-badge-primary" style="font-size:10px;">INFO</span>
                    </div>
                    <div>
                        <h4>Kerja Bakti</h4>
                        <p>25 Okt • 07:00 WIB<br>Pembersihan got Blok A-C</p>
                    </div>
                </div>

                <!-- Bento 3: [!] TOMBOL SOS (Sentuh 2-3 Detik) -->
                <div class="bento-tile bento-sos" id="pwa-sos-neo-btn">
                    <div class="sos-mini-flex">
                        <div class="sos-neo-icon" style="font-size:1.2rem; font-weight:900;">SOS</div>
                        <div>
                            <strong style="font-family:'Poppins'; font-size:0.95rem; color:#dc2626; display:block;">TOMBOL SOS</strong>
                            <small id="sos-btn-hint" style="font-size:0.7rem; font-weight:700; color:#991b1b;">Tahan 2 Detik</small>
                        </div>
                    </div>
                    <div style="font-size:0.68rem; color:#b91c1c; font-weight:600; margin-top:6px;">
                        Bunyikan sirene Pos Satpam
                    </div>
                </div>

                <!-- Bento 4: Status Surat Pengantar -->
                <div class="bento-tile bento-surat" onclick="window.wargaView.setTab('surat')" style="cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="neo-badge neo-badge-secondary" style="font-size:10px;">E-SURAT</span>
                        <span class="neo-badge neo-badge-secondary" style="font-size:10px;">SRT</span>
                    </div>
                    <div style="margin-top:6px;">
                        <strong style="font-family:'Poppins'; font-size:0.95rem; display:block;">
                            ${pendingSurat > 0 ? `${pendingSurat} Menunggu` : 'Buat Surat'}
                        </strong>
                        <p style="font-size:0.72rem; color:#64748b;">TTD Digital QR Ketua RT</p>
                    </div>
                </div>

                <!-- Bento 5: UMKM Warga -->
                <div class="bento-tile bento-umkm" onclick="window.wargaView.setTab('umkm')" style="cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span class="neo-badge neo-badge-success" style="font-size:10px;">BELANJA</span>
                        <span class="neo-badge neo-badge-warning" style="font-size:10px;">UMKM</span>
                    </div>
                    <div style="margin-top:6px;">
                        <strong style="font-family:'Poppins'; font-size:0.95rem; display:block;">UMKM: ${totalUmkm} Lapak</strong>
                        <p style="font-size:0.72rem; color:#64748b;">Katering, Kopi, Jasa dll</p>
                    </div>
                </div>
            </div>

            <!-- === 8-MENU GOJEK SQUIRCLE GRID === -->
            <div class="gojek-menu-section">
                <div class="gojek-section-title">
                    <span>Layanan Mandiri Warga</span>
                    <small style="font-size:0.7rem; color:#64748b; font-weight:600;">8 Akses Cepat</small>
                </div>

                <div class="gojek-grid-8">
                    <!-- Row 1: Beranda, Info, Surat, Iuran -->
                    <button class="gojek-item" onclick="window.wargaView.setTab('beranda')">
                        <div class="squircle-box sq-yellow" style="font-weight:900; font-size:0.85rem;">RT</div>
                        <span class="gojek-label">Beranda</span>
                    </button>
                    <button class="gojek-item" onclick="window.wargaView.setTab('info')">
                        <div class="squircle-box sq-indigo" style="font-weight:900; font-size:0.85rem;">INFO</div>
                        <span class="gojek-label">Info</span>
                    </button>
                    <button class="gojek-item" onclick="window.wargaView.setTab('surat')">
                        <div class="squircle-box sq-green" style="font-weight:900; font-size:0.85rem;">SURAT</div>
                        <span class="gojek-label">Surat</span>
                    </button>
                    <button class="gojek-item" onclick="window.wargaView.setTab('iuran')">
                        <div class="squircle-box sq-amber" style="font-weight:900; font-size:0.85rem;">IPL</div>
                        <span class="gojek-label">Iuran</span>
                    </button>

                    <!-- Row 2: Lapor, Jadwal, UMKM, Profil -->
                    <button class="gojek-item" onclick="window.wargaView.setTab('lapor')">
                        <div class="squircle-box sq-red" style="font-weight:900; font-size:0.85rem;">LAPOR</div>
                        <span class="gojek-label">Lapor</span>
                    </button>
                    <button class="gojek-item" onclick="window.wargaView.setTab('jadwal')">
                        <div class="squircle-box sq-cyan" style="font-weight:900; font-size:0.85rem;">AGENDA</div>
                        <span class="gojek-label">Jadwal</span>
                    </button>
                    <button class="gojek-item" onclick="window.wargaView.setTab('umkm')">
                        <div class="squircle-box sq-pink" style="font-weight:900; font-size:0.85rem;">UMKM</div>
                        <span class="gojek-label">UMKM</span>
                    </button>
                    <button class="gojek-item" onclick="window.wargaView.setTab('profil')">
                        <div class="squircle-box sq-purple" style="font-weight:900; font-size:0.85rem;">PROFIL</div>
                        <span class="gojek-label">Profil</span>
                    </button>
                </div>
            </div>

            <!-- Agenda Strip Banner -->
            <div class="agenda-strip-card" onclick="window.wargaView.setTab('jadwal')" style="cursor:pointer;">
                <div class="agenda-date-box">
                    <span>${nextAgenda.tanggal_badge}</span>
                </div>
                <div class="agenda-content">
                    <strong>Agenda: ${nextAgenda.judul}</strong>
                    <small>${nextAgenda.waktu} • RT 022 Desa Ciantra</small>
                </div>
            </div>
        `;
    }

    // 2. TAB INFO & PENGUMUMAN RESMI RT 022
    renderInfoTab(data) {
        const announcements = data.announcements || [];
        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Pengumuman Resmi RT 022</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Kembali</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${announcements.map(a => `
                        <div class="neo-card" style="padding:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <span class="neo-badge neo-badge-primary">${a.badge || 'INFO'}</span>
                                <small style="font-weight:700; color:#64748b;">${a.tanggal} • ${a.jam}</small>
                            </div>
                            <h4 style="font-family:'Poppins'; font-size:1rem; font-weight:800; margin-bottom:6px;">${a.judul}</h4>
                            <p style="font-size:0.82rem; color:#334155; line-height:1.5;">${a.isi}</p>
                            <div style="margin-top:10px; font-size:0.75rem; color:#4f46e5; font-weight:700;">
                                Lokasi: ${a.lokasi} • Pengirim: ${a.penulis}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 3. TAB SURAT PENGANTAR DIGITAL (TTD DIGITAL QR BAPAK ANWAR DJAMALUDIN)
    renderSuratTab(data) {
        const myDocs = (data.documents || []).filter(d => d.user_id === data.currentUser.user_id);

        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Surat Pengantar Digital</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <!-- Form Permohonan Surat Baru (Material 3 Field) -->
                <div class="neo-card" style="padding:16px; margin-bottom:16px;">
                    <h4 style="font-family:'Poppins'; font-size:0.95rem; font-weight:800; margin-bottom:12px;">
                        Ajukan Surat Pengantar Baru
                    </h4>
                    <form onsubmit="window.wargaView.handleSuratSubmit(event)">
                        <div class="m3-field">
                            <label>Jenis Surat Pengantar</label>
                            <select id="surat-jenis">
                                <option value="domisili">Surat Pengantar Domisili Tempat Tinggal</option>
                                <option value="usaha">Surat Keterangan Usaha (SKU) UMKM</option>
                                <option value="kelakuan_baik">Surat Keterangan Pengantar SKCK / Kelakuan Baik</option>
                                <option value="kematian">Surat Pengantar Keterangan Kematian</option>
                            </select>
                        </div>

                        <div class="m3-field">
                            <label>Uraian Keperluan Surat</label>
                            <textarea id="surat-keperluan" rows="3" placeholder="Contoh: Pembukaan rekening tabungan Bank BCA / Pengurusan izin usaha di Kelurahan..." required></textarea>
                        </div>

                        <button type="submit" class="neo-btn neo-btn-secondary neo-btn-block">
                            Kirim Permohonan ke Ketua RT
                        </button>
                    </form>
                </div>

                <!-- Daftar Riwayat Pengajuan Surat -->
                <h4 style="font-family:'Poppins'; font-size:0.9rem; font-weight:800; margin-bottom:10px;">
                    Daftar Pengajuan Surat Saya
                </h4>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${myDocs.length === 0 ? '<div class="neo-card" style="padding:16px; text-align:center; color:#64748b;">Belum ada surat yang diajukan.</div>' : ''}
                    ${myDocs.map(d => `
                        <div class="neo-card" style="padding:14px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span class="neo-badge ${d.status_approval === 'disetujui' ? 'neo-badge-success' : (d.status_approval === 'menunggu' ? 'neo-badge-warning' : 'neo-badge-danger')}">
                                    ${d.status_approval.toUpperCase()}
                                </span>
                                <small style="font-weight:700; color:#64748b;">${d.tgl_pengajuan}</small>
                            </div>
                            <strong style="font-family:'Poppins'; font-size:0.9rem; display:block;">Surat Pengantar ${d.jenis_surat.toUpperCase()}</strong>
                            <p style="font-size:0.78rem; color:#334155; margin-top:2px;">${d.keperluan}</p>
                            
                            <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                                <small style="font-family:'Space Mono'; font-weight:700;">${d.nomor_surat || 'Menunggu No. Surat'}</small>
                                ${d.status_approval === 'disetujui' ? `
                                    <button class="neo-btn neo-btn-sm neo-btn-primary" onclick="window.wargaView.viewOfficialPDF(${d.doc_id})">
                                        Unduh PDF (TTD QR)
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 4. TAB IURAN IPL & BUKU KAS TERBUKA
    renderIuranTab(data) {
        const invoices = (data.invoices || []).filter(i => i.user_id === data.currentUser.user_id);
        const cashBooks = data.cash_books || [];
        const saldoKas = window.appStore.getCurrentCashBalance();

        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Iuran IPL & Kas Terbuka</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <!-- Saldo Kas Banner -->
                <div class="neo-card" style="background:#ffd93d; padding:16px; margin-bottom:14px;">
                    <span style="font-family:'Plus Jakarta Sans'; font-size:0.75rem; font-weight:800; text-transform:uppercase;">Saldo Kas Terbuka RT 022</span>
                    <h2 style="font-family:'Space Mono'; font-size:1.8rem; font-weight:700; margin:4px 0;">
                        Rp ${saldoKas.toLocaleString('id-ID')}
                    </h2>
                    <small style="font-weight:700; color:#334155;">Transparansi kas Desa Ciantra ter-update real-time</small>
                </div>

                <!-- Tagihan Saya -->
                <h4 style="font-family:'Poppins'; font-size:0.9rem; font-weight:800; margin-bottom:8px;">
                    Daftar Tagihan Iuran Lingkungan (IPL Rp 50.000)
                </h4>

                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    ${invoices.map(inv => `
                        <div class="neo-card" style="padding:14px; border-left:6px solid ${inv.status_bayar === 'lunas' ? '#22c55e' : '#ef4444'};">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <strong style="font-family:'Poppins'; font-size:0.9rem;">${inv.bulan_tagihan}</strong>
                                    <div style="font-family:'Space Mono'; font-size:1.1rem; font-weight:700;">
                                        Rp ${Number(inv.nominal).toLocaleString('id-ID')}
                                    </div>
                                </div>
                                <div>
                                    ${inv.status_bayar === 'lunas' ? `
                                        <span class="neo-badge neo-badge-success">LUNAS via QRIS</span>
                                    ` : `
                                        <button class="neo-btn neo-btn-sm neo-btn-primary" onclick="window.wargaView.openQRISPaymentModal(${inv.invoice_id}, ${inv.nominal}, '${inv.bulan_tagihan}')">
                                            Bayar QRIS
                                        </button>
                                    `}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Rekap Pembukuan Kas Terbuka -->
                <h4 style="font-family:'Poppins'; font-size:0.9rem; font-weight:800; margin-bottom:8px;">
                    Riwayat Pembukuan Kas Terbuka
                </h4>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${cashBooks.slice().reverse().map(c => `
                        <div class="neo-card" style="padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="font-size:0.82rem; display:block;">${c.deskripsi}</strong>
                                <small style="color:#64748b; font-weight:600;">${c.tgl_transaksi.substring(0, 16)} • ${c.kategori}</small>
                            </div>
                            <div style="font-family:'Space Mono'; font-weight:700; color:${c.jenis_transaksi === 'masuk' ? '#16a34a' : '#dc2626'};">
                                ${c.jenis_transaksi === 'masuk' ? '+' : '-'} Rp ${Number(c.nominal).toLocaleString('id-ID')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 5. TAB LAPOR FASILITAS RUSAK
    renderLaporTab(data) {
        const myReports = (data.reports || []).filter(r => r.user_id === data.currentUser.user_id);

        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Lapor Fasilitas Lingkungan</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <div class="neo-card" style="padding:16px; margin-bottom:16px;">
                    <h4 style="font-family:'Poppins'; font-size:0.95rem; font-weight:800; margin-bottom:12px;">
                        Kirim Laporan Kerusakan Baru
                    </h4>
                    <form onsubmit="window.wargaView.handleLaporSubmit(event)">
                        <div class="m3-field">
                            <label>Lokasi Kerusakan</label>
                            <input type="text" id="lapor-lokasi" placeholder="Misal: Depan Tiang PJU Blok C10 / Saluran Got A4" required>
                        </div>

                        <div class="m3-field">
                            <label>Uraian Kerusakan Fisik</label>
                            <textarea id="lapor-deskripsi" rows="3" placeholder="Jelaskan detail kendala fasilitas..." required></textarea>
                        </div>

                        <div class="m3-field">
                            <label>Pilih Foto Bukti Kerusakan</label>
                            <select id="lapor-foto">
                                <option value="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=600&q=80">Lampu Jalan / PJU Padam</option>
                                <option value="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80">Tutup Saluran Got Pecah / Banjir</option>
                                <option value="https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80">Aspal Jalan Rusak / Berlubang</option>
                            </select>
                        </div>

                        <button type="submit" class="neo-btn neo-btn-danger neo-btn-block">
                            Kirim Laporan ke Pengurus RT
                        </button>
                    </form>
                </div>

                <h4 style="font-family:'Poppins'; font-size:0.9rem; font-weight:800; margin-bottom:8px;">
                    Riwayat Laporan Saya
                </h4>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${myReports.map(r => `
                        <div class="neo-card" style="padding:14px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span class="neo-badge ${r.status === 'selesai' ? 'neo-badge-success' : (r.status === 'diproses' ? 'neo-badge-warning' : 'neo-badge-primary')}">
                                    ${r.status.toUpperCase()}
                                </span>
                                <small style="font-weight:700; color:#64748b;">${r.tgl_lapor.substring(0, 16)}</small>
                            </div>
                            <strong style="font-family:'Poppins'; font-size:0.9rem; display:block;">${r.lokasi}</strong>
                            <p style="font-size:0.8rem; color:#334155; margin-top:2px;">${r.deskripsi}</p>
                            ${r.disposisi_petugas ? `
                                <div style="margin-top:6px; font-size:0.75rem; color:#4f46e5; font-weight:700;">
                                    Petugas: ${r.disposisi_petugas}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 6. TAB JADWAL & AGENDA LINGKUNGAN
    renderJadwalTab(data) {
        const agendas = data.agendas || [];
        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Agenda Kegiatan RT 022</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${agendas.map(ag => `
                        <div class="agenda-strip-card" style="padding:14px;">
                            <div class="agenda-date-box" style="font-size:0.9rem; padding:8px 12px;">
                                <span>${ag.tanggal_badge}</span>
                            </div>
                            <div class="agenda-content">
                                <strong style="font-size:0.95rem;">${ag.judul}</strong>
                                <p style="font-size:0.78rem; color:#4f46e5; font-weight:700; margin:2px 0;">${ag.waktu}</p>
                                <small style="color:#64748b;">${ag.keterangan}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 7. TAB UMKM WARGA DESA CIANTRA
    renderUmkmTab(data) {
        const umkmList = data.umkm || [];
        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Lapak UMKM Warga Ciantra</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <p style="font-size:0.78rem; color:#64748b; margin-bottom:14px; font-weight:600;">
                    Dukung ekonomi tetangga dengan berbelanja produk lokal warga RT 022 RW 008.
                </p>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${umkmList.map(u => `
                        <div class="neo-card" style="padding:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span class="neo-badge neo-badge-success">${u.kategori}</span>
                                <span style="font-size:0.75rem; font-weight:800; color:#854d0e;">Rating: ${u.rating}</span>
                            </div>
                            <h4 style="font-family:'Poppins'; font-size:1.05rem; font-weight:900;">${u.nama_toko}</h4>
                            <p style="font-size:0.8rem; color:#334155; margin-top:2px;">${u.deskripsi}</p>
                            
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                                <small style="font-weight:700; color:#64748b;">${u.alamat}</small>
                                <a href="https://wa.me/62${u.wa.replace(/^0/, '')}" target="_blank" class="neo-btn neo-btn-sm neo-btn-primary">
                                    Chat WhatsApp
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 8. TAB INVENTARIS ASET
    renderAsetTab(data) {
        const assets = data.assets || [];
        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Inventaris Aset RT 022</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${assets.map(a => `
                        <div class="neo-card" style="padding:14px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <span class="neo-badge ${a.status_pinjam ? 'neo-badge-danger' : 'neo-badge-success'}">
                                    ${a.status_pinjam ? 'DIPINJAM' : 'TERSEDIA'}
                                </span>
                                <small style="font-family:'Space Mono'; font-weight:700;">${a.kode_barang}</small>
                            </div>
                            <h4 style="font-family:'Poppins'; font-size:0.95rem; font-weight:800;">${a.nama_barang}</h4>
                            <p style="font-size:0.75rem; color:#64748b;">${a.keterangan}</p>

                            <div style="margin-top:10px;">
                                ${!a.status_pinjam ? `
                                    <button class="neo-btn neo-btn-sm neo-btn-primary neo-btn-block" onclick="window.wargaView.openBorrowQRScanner(${a.asset_id}, '${a.nama_barang}', '${a.qr_code}')">
                                        Scan QR Pinjam Barang
                                    </button>
                                ` : `
                                    <button class="neo-btn neo-btn-sm neo-btn-warning neo-btn-block" onclick="window.wargaView.openReturnQRScanner(${a.asset_id}, '${a.nama_barang}')">
                                        Scan QR Kembalikan Barang
                                    </button>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 9. TAB PROFIL & KONTAK PENGURUS RT
    renderProfilTab(data, user) {
        const admin = data.adminInfo;
        const satpam = data.satpamInfo;

        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-family:'Poppins'; font-weight:800; font-size:1.1rem;">Profil Akun Warga</h3>
                    <button class="neo-btn neo-btn-sm" onclick="window.wargaView.setTab('beranda')">← Beranda</button>
                </div>

                <div class="neo-card" style="padding:16px; margin-bottom:14px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="width:50px; height:50px; background:#4f46e5; color:#fff; border:2.5px solid #000; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:900;">
                            KK
                        </div>
                        <div>
                            <h4 style="font-family:'Poppins'; font-size:1.05rem; font-weight:900;">${user.nama_lengkap}</h4>
                            <span class="neo-badge neo-badge-success">WARGA AKTIF TERVERIFIKASI</span>
                        </div>
                    </div>

                    <table style="width:100%; font-size:0.82rem; font-family:'Plus Jakarta Sans';">
                        <tr><td style="color:#64748b; padding:4px 0;">NIK KTP</td><td>: <b>${user.nik}</b></td></tr>
                        <tr><td style="color:#64748b; padding:4px 0;">Alamat Rumah</td><td>: <b>${user.no_rumah}, RT 022 RW 008</b></td></tr>
                        <tr><td style="color:#64748b; padding:4px 0;">Desa / Wilayah</td><td>: <b>Desa Ciantra, Cikarang Selatan</b></td></tr>
                        <tr><td style="color:#64748b; padding:4px 0;">No. WhatsApp</td><td>: <b>${user.no_hp}</b></td></tr>
                    </table>
                </div>

                <h4 style="font-family:'Poppins'; font-size:0.9rem; font-weight:800; margin-bottom:8px;">
                    Kontak Pelayanan Pengurus RT
                </h4>

                <div class="neo-card" style="padding:14px; margin-bottom:10px;">
                    <strong style="font-family:'Poppins'; font-size:0.85rem; display:block;">Ketua RT 022: ${admin.nama_lengkap}</strong>
                    <small style="color:#64748b;">${admin.jabatan} (Periode 2024 - 2027)</small>
                    <div style="margin-top:8px;">
                        <a href="https://wa.me/62${admin.no_hp.replace(/^0/, '')}" target="_blank" class="neo-btn neo-btn-sm neo-btn-primary">
                            Chat Ketua RT
                        </a>
                    </div>
                </div>

                <div class="neo-card" style="padding:14px;">
                    <strong style="font-family:'Poppins'; font-size:0.85rem; display:block;">Pos Ronda 24 Jam: ${satpam.nama_lengkap}</strong>
                    <small style="color:#64748b;">${satpam.regu} • Status Siaga</small>
                    <div style="margin-top:8px;">
                        <a href="tel:${satpam.no_hp}" class="neo-btn neo-btn-sm neo-btn-danger">
                            Panggilan Darurat Pos
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // --- EVENT BINDINGS (SOS 2-DETIK HOLD PHYSICS) ---
    bindEvents() {
        const sosBtn = document.getElementById('pwa-sos-neo-btn');
        const hintText = document.getElementById('sos-btn-hint');
        if (!sosBtn) return;

        let startTime = null;
        let timer = null;

        const startHold = (e) => {
            e.preventDefault();
            startTime = Date.now();
            if (hintText) hintText.innerText = "Tahan 2 Detik...";
            window.soundController.init();

            timer = setTimeout(() => {
                this.triggerSOSAction();
            }, 2000); // 2 Detik sesuai design.md wireframe
        };

        const endHold = () => {
            if (timer) clearTimeout(timer);
            if (hintText) hintText.innerText = "Tahan 2 Detik";
        };

        sosBtn.addEventListener('mousedown', startHold);
        sosBtn.addEventListener('touchstart', startHold, { passive: false });
        window.addEventListener('mouseup', endHold);
        window.addEventListener('touchend', endHold);
        sosBtn.addEventListener('mouseleave', endHold);
    }

    triggerSOSAction() {
        const modalContainer = document.getElementById('pwa-modal-container');
        modalContainer.innerHTML = `
            <div class="neo-modal-overlay">
                <div class="neo-modal-box">
                    <div class="modal-header-neo">
                        <h4 style="color:#dc2626;">KONFIRMASI SINYAL DARURAT</h4>
                        <button class="modal-close-btn" onclick="window.wargaView.closeModal()">&times;</button>
                    </div>

                    <p style="font-size:0.85rem; color:#334155; margin-bottom:14px; font-weight:600;">
                        Pilih kategori darurat untuk mengaktifkan sirene alarm di Pos Satpam RT 022 Desa Ciantra:
                    </p>

                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <button class="neo-btn neo-btn-danger neo-btn-block" onclick="window.wargaView.confirmSendSOS('keamanan')">
                            Keamanan (Pencurian / Tawuran / Orang Asing)
                        </button>
                        <button class="neo-btn neo-btn-warning neo-btn-block" onclick="window.wargaView.confirmSendSOS('medis')">
                            Medis (Kecelakaan / Serangan Sakit)
                        </button>
                        <button class="neo-btn neo-btn-danger neo-btn-block" style="background:#b91c1c;" onclick="window.wargaView.confirmSendSOS('kebakaran')">
                            Kebakaran / Kebocoran Tabung Gas
                        </button>
                    </div>

                    <button class="neo-btn neo-btn-block" style="margin-top:14px;" onclick="window.wargaView.closeModal()">
                        Batal
                    </button>
                </div>
            </div>
        `;
    }

    confirmSendSOS(kategori) {
        const lat = -6.328400 + (Math.random() - 0.5) * 0.0005;
        const lng = 107.135600 + (Math.random() - 0.5) * 0.0005;

        window.appStore.triggerEmergency({ kategori, lat, lng });
        window.soundController.startEmergencySiren();

        this.closeModal();
        this.render();

        alert(`[STATUS: DARURAT] Sinyal ${kategori.toUpperCase()} berhasil dikirim!\nSirene berbunyi keras di Pos Satpam RT 022 Desa Ciantra.`);
    }

    // MODAL BAYAR QRIS
    openQRISPaymentModal(invoiceId, nominal, bulan) {
        const modalContainer = document.getElementById('pwa-modal-container');
        const qrisPayload = `00020101021226680014ID.LINKAJA.WWW01189360099900000000000215RT022CIANTRASMART520458125303360540${nominal}5802ID5918RT 022 RW 008 DESA CIANTRA6007BEKASI62070703A016304ABCD`;
        const qrisSVG = window.QRCodeGenerator.generateSVG(qrisPayload, 200);

        modalContainer.innerHTML = `
            <div class="neo-modal-overlay">
                <div class="neo-modal-box" style="text-align:center;">
                    <div class="modal-header-neo">
                        <h4>Pembayaran QRIS Nasional</h4>
                        <button class="modal-close-btn" onclick="window.wargaView.closeModal()">&times;</button>
                    </div>

                    <div style="background:#f1f5f9; border:2px solid #000; border-radius:12px; padding:12px; margin-bottom:14px;">
                        <span class="neo-badge neo-badge-primary">QRIS RESMI RT 022</span>
                        <div style="margin:12px auto; display:flex; justify-content:center;">
                            ${qrisSVG}
                        </div>
                        <div style="font-family:'Space Mono'; font-size:1.4rem; font-weight:700;">
                            Rp ${Number(nominal).toLocaleString('id-ID')}
                        </div>
                        <small style="color:#64748b; font-weight:700;">Merchant: <b>KAS RT 022 RW 008 DESA CIANTRA</b></small>
                    </div>

                    <button class="neo-btn neo-btn-success neo-btn-block" onclick="window.wargaView.simulatePaymentSuccess(${invoiceId})">
                        [Simulasi] Konfirmasi Bayar via M-Banking
                    </button>
                </div>
            </div>
        `;
    }

    simulatePaymentSuccess(invoiceId) {
        window.appStore.payInvoice(invoiceId, "QRIS");
        window.soundController.playSuccessChime();
        this.closeModal();
        alert('[BERHASIL] PEMBAYARAN QRIS BERHASIL!\nStatus tagihan otomatis Lunas dan dana telah dibukukan langsung ke Kas RT 022 Desa Ciantra.');
    }

    // MODAL PREVIEW SURAT RESMI DENGAN KOP RT & TTD DIGITAL QR PAK ANWAR DJAMALUDIN
    viewOfficialPDF(docId) {
        const doc = window.appStore.data.documents.find(d => d.doc_id == docId);
        if (!doc) return;

        const qrTtdSVG = window.QRCodeGenerator.generateSVG(doc.qr_ttd_token || "RT022-CIANTRA-VERIFIED", 110);
        const modalContainer = document.getElementById('pwa-modal-container');

        modalContainer.innerHTML = `
            <div class="neo-modal-overlay">
                <div class="neo-modal-box" style="max-width:560px;">
                    <div class="modal-header-neo">
                        <h4>Dokumen Resmi Surat Pengantar</h4>
                        <button class="modal-close-btn" onclick="window.wargaView.closeModal()">&times;</button>
                    </div>

                    <div class="official-paper-preview">
                        <div class="letter-kop">
                            <div class="letter-kop-logo">22</div>
                            <div class="letter-kop-text">
                                <h3>RUKUN TETANGGA 022 / RUKUN WARGA 008</h3>
                                <h4>DESA CIANTRA • KECAMATAN CIKARANG SELATAN</h4>
                                <p>KABUPATEN BEKASI - JAWA BARAT 17530</p>
                            </div>
                        </div>

                        <div class="letter-title">
                            <u>SURAT PENGANTAR KETUA RT</u>
                            <div style="font-family:'Space Mono'; font-size:0.8rem; margin-top:2px;">
                                Nomor: ${doc.nomor_surat || '470/022/SP-DOM/X/2026-108'}
                            </div>
                        </div>

                        <div style="font-size:0.82rem; line-height:1.6; margin-bottom:14px;">
                            <p>Yang bertanda tangan di bawah ini, Ketua RT 022 RW 008 Desa Ciantra, menerangkan bahwa:</p>
                            <table class="letter-table" style="margin:8px 0;">
                                <tr><td width="35%">Nama Lengkap</td><td>: <b>${doc.pemohon_nama}</b></td></tr>
                                <tr><td>NIK Kependudukan</td><td>: ${doc.pemohon_nik}</td></tr>
                                <tr><td>Alamat Rumah</td><td>: ${doc.pemohon_rumah}, RT 022 RW 008</td></tr>
                                <tr><td>Keperluan</td><td>: ${doc.keperluan}</td></tr>
                            </table>
                            <p>Adalah benar warga berdomisili sah di lingkungan RT 022 RW 008 Desa Ciantra dan memiliki kelakuan baik. Surat pengantar ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
                        </div>

                        <div class="letter-ttd-row">
                            <div class="letter-ttd-box">
                                <div>Ciantra, ${doc.tgl_approval ? doc.tgl_approval.substring(0, 10) : '27 Oktober 2026'}</div>
                                <div style="font-weight:bold; margin-bottom:4px;">Ketua RT 022 RW 008</div>
                                <div class="qr-ttd-container">
                                    ${qrTtdSVG}
                                    <small style="color:#16a34a; font-weight:bold; font-size:0.65rem;">Tanda Tangan Digital Sah</small>
                                </div>
                                <div><u><b>BAPAK ANWAR DJAMALUDIN</b></u></div>
                                <small style="color:#64748b;">NIP/Reg: RT022-CIANTRA-2024</small>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:8px;">
                        <button class="neo-btn" onclick="window.wargaView.closeModal()">Tutup</button>
                        <button class="neo-btn neo-btn-primary" onclick="window.print()">Cetak / Simpan PDF</button>
                    </div>
                </div>
            </div>
        `;
    }

    // MODAL SCAN QR PINJAM ASET
    openBorrowQRScanner(assetId, namaBarang, qrCodeStr) {
        const modalContainer = document.getElementById('pwa-modal-container');
        const qrSVG = window.QRCodeGenerator.generateSVG(qrCodeStr, 140);

        modalContainer.innerHTML = `
            <div class="neo-modal-overlay">
                <div class="neo-modal-box">
                    <div class="modal-header-neo">
                        <h4>Scan QR Peminjaman Aset</h4>
                        <button class="modal-close-btn" onclick="window.wargaView.closeModal()">&times;</button>
                    </div>
                    <div style="background:#000; border:2px solid #000; border-radius:12px; padding:20px; text-align:center; color:#fff;">
                        <div style="background:#fff; padding:10px; border-radius:8px; display:inline-block;">
                            ${qrSVG}
                        </div>
                        <p style="font-size:0.75rem; color:#cbd5e1; margin-top:8px;">Arahkan kamera ke stiker QR fisik pada <b>${namaBarang}</b></p>
                    </div>
                    
                    <form onsubmit="window.wargaView.handleConfirmBorrow(event, ${assetId})">
                        <div class="m3-field" style="margin-top:14px;">
                            <label>Rencana Tanggal Pengembalian</label>
                            <input type="date" id="borrow-return-date" required value="${new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10)}">
                        </div>
                        <button type="submit" class="neo-btn neo-btn-primary neo-btn-block">Konfirmasi & Ambil Barang</button>
                    </form>
                </div>
            </div>
        `;
    }

    handleConfirmBorrow(e, assetId) {
        e.preventDefault();
        const dateInput = document.getElementById('borrow-return-date').value;
        window.appStore.borrowAsset(assetId, dateInput);
        window.soundController.playSuccessChime();
        this.closeModal();
        alert('[BERHASIL] Peminjaman aset berhasil diverifikasi via Scan QR! Status barang di gudang telah berubah.');
    }

    // MODAL SCAN QR KEMBALIKAN ASET
    openReturnQRScanner(assetId, namaBarang) {
        const modalContainer = document.getElementById('pwa-modal-container');
        const qrSVG = window.QRCodeGenerator.generateSVG(`RETURN-AST-${assetId}`, 130);

        modalContainer.innerHTML = `
            <div class="neo-modal-overlay">
                <div class="neo-modal-box">
                    <div class="modal-header-neo">
                        <h4>Scan QR Pengembalian Aset</h4>
                        <button class="modal-close-btn" onclick="window.wargaView.closeModal()">&times;</button>
                    </div>
                    <div style="background:#000; border:2px solid #000; border-radius:12px; padding:20px; text-align:center; color:#fff;">
                        <div style="background:#fff; padding:10px; border-radius:8px; display:inline-block;">
                            ${qrSVG}
                        </div>
                        <p style="font-size:0.75rem; color:#cbd5e1; margin-top:8px;">Scan QR barang <b>${namaBarang}</b> di gudang RT</p>
                    </div>
                    
                    <form onsubmit="window.wargaView.handleConfirmReturn(event, ${assetId})">
                        <div class="m3-field" style="margin-top:14px;">
                            <label>Kondisi Barang Saat Dikembalikan</label>
                            <select id="return-condition">
                                <option value="baik">Kondisi Baik & Lengkap</option>
                                <option value="rusak_ringan">Ada Kerusakan Ringan / Baret</option>
                            </select>
                        </div>
                        <button type="submit" class="neo-btn neo-btn-warning neo-btn-block">Konfirmasi Pengembalian</button>
                    </form>
                </div>
            </div>
        `;
    }

    handleConfirmReturn(e, assetId) {
        e.preventDefault();
        const cond = document.getElementById('return-condition').value;
        window.appStore.returnAsset(assetId, cond);
        window.soundController.playSuccessChime();
        this.closeModal();
        alert('[BERHASIL] Barang berhasil dikembalikan ke gudang RT 022 Desa Ciantra!');
    }

    handleLaporSubmit(e) {
        e.preventDefault();
        const lokasi = document.getElementById('lapor-lokasi').value;
        const deskripsi = document.getElementById('lapor-deskripsi').value;
        const fotoUrl = document.getElementById('lapor-foto').value;

        window.appStore.submitFacilityReport({ lokasi, deskripsi, fotoUrl });
        window.soundController.playSuccessChime();
        this.render();
        alert('[BERHASIL] Laporan fasilitas berhasil dikirim ke Pengurus RT 022!');
    }

    handleSuratSubmit(e) {
        e.preventDefault();
        const jenis_surat = document.getElementById('surat-jenis').value;
        const keperluan = document.getElementById('surat-keperluan').value;

        window.appStore.requestDocument({ jenis_surat, keperluan });
        window.soundController.playSuccessChime();
        this.render();
        alert('[BERHASIL] Permohonan surat berhasil diajukan! Menunggu persetujuan Ketua RT Bapak Anwar Djamaludin.');
    }

    closeModal() {
        const modalContainer = document.getElementById('pwa-modal-container');
        if (modalContainer) modalContainer.innerHTML = '';
    }
}

window.WargaView = WargaView;
