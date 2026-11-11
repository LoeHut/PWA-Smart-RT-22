// Komponen Tampilan Dashboard Web Admin RT (Bpk. Anwar Djamaludin - Ketua RT 022 RW 008 Desa Ciantra)
// Implementasi Spesifikasi: Neo-Brutalism + Bento Grid 4 Metrics (design.md)

class AdminView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeMenu = 'ringkasan';
        this.init();
    }

    init() {
        window.appStore.subscribe(() => {
            this.render();
        });
        this.render();
    }

    setMenu(menu) {
        this.activeMenu = menu;
        this.closeSidebar();
        this.render();
    }

    toggleSidebar() {
        const sb = document.getElementById('admin-sidebar-drawer');
        const bd = document.getElementById('admin-sidebar-backdrop');
        if (sb) sb.classList.toggle('open');
        if (bd) bd.classList.toggle('open');
    }

    closeSidebar() {
        const sb = document.getElementById('admin-sidebar-drawer');
        const bd = document.getElementById('admin-sidebar-backdrop');
        if (sb) sb.classList.remove('open');
        if (bd) bd.classList.remove('open');
    }

    render() {
        const data = window.appStore.data;
        const adminPerson = data.adminInfo || { nama_lengkap: "Bapak Anwar Djamaludin", jabatan: "Ketua RT 022 RW 008" };
        const panelTitle = "PANEL KETUA RT";
        const panelSubtitle = "Administrasi & Keuangan Kas";

        const totalSaldo = window.appStore.getCurrentCashBalance();
        const activeSOS = data.activeEmergency;
        const pendingReports = (data.reports || []).filter(r => r.status !== 'selesai').length;
        const pendingSurat = (data.documents || []).filter(d => d.status_approval === 'menunggu').length;

        this.container.innerHTML = `
            <div class="admin-dashboard-layout">
                <!-- Backdrop Drawer for Mobile / Tablet -->
                <div class="admin-sidebar-backdrop" id="admin-sidebar-backdrop" onclick="window.adminView.closeSidebar()"></div>

                <!-- Sidebar Navigasi Neo-Brutalism -->
                <aside class="admin-sidebar" id="admin-sidebar-drawer">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                        <div class="sidebar-brand-box" style="flex:1;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <div class="neo-badge neo-badge-primary" style="font-size:1.1rem; padding:6px 10px; font-weight:900;">KRT</div>
                                <div>
                                    <h2>${panelTitle}</h2>
                                    <p>${panelSubtitle}</p>
                                </div>
                            </div>
                            <div style="margin-top:8px; font-size:0.75rem; font-weight:700; color:#1e293b; border-top:1.5px dashed #000; padding-top:4px;">
                                ${adminPerson.nama_lengkap} (Ketua RT 2024-2027)
                            </div>
                        </div>
                        <button class="neo-btn neo-btn-sm sidebar-close-btn" onclick="window.adminView.closeSidebar()" title="Tutup Menu">
                            &times;
                        </button>
                    </div>

                    <nav class="sidebar-menu-list">
                        <button class="side-btn ${this.activeMenu === 'ringkasan' ? 'active' : ''}" onclick="window.adminView.setMenu('ringkasan')">
                            <span>Ringkasan & Metrik</span>
                        </button>
                        <button class="side-btn ${this.activeMenu === 'surat' ? 'active' : ''}" onclick="window.adminView.setMenu('surat')">
                            <span>Persetujuan TTD</span>
                            ${pendingSurat > 0 ? `<span class="count-bubble">${pendingSurat}</span>` : ''}
                        </button>
                        <button class="side-btn ${this.activeMenu === 'laporan' ? 'active' : ''}" onclick="window.adminView.setMenu('laporan')">
                            <span>Tiket Laporan</span>
                            ${pendingReports > 0 ? `<span class="count-bubble">${pendingReports}</span>` : ''}
                        </button>
                        <button class="side-btn ${this.activeMenu === 'keuangan' ? 'active' : ''}" onclick="window.adminView.setMenu('keuangan')">
                            <span>Buku Kas & IPL (Keuangan)</span>
                        </button>
                        <button class="side-btn ${this.activeMenu === 'warga' ? 'active' : ''}" onclick="window.adminView.setMenu('warga')">
                            <span>Data 84 KK Warga</span>
                        </button>
                        <button class="side-btn ${this.activeMenu === 'pengumuman' ? 'active' : ''}" onclick="window.adminView.setMenu('pengumuman')">
                            <span>Siar Pengumuman</span>
                        </button>
                        <button class="side-btn ${this.activeMenu === 'aset' ? 'active' : ''}" onclick="window.adminView.setMenu('aset')">
                            <span>Inventaris & QR</span>
                        </button>
                        <button class="side-btn ${this.activeMenu === 'sos' ? 'active' : ''}" onclick="window.adminView.setMenu('sos')">
                            <span>Pos Ronda 24 Jam</span>
                            ${activeSOS ? '<span class="count-bubble">DARURAT</span>' : ''}
                        </button>
                    </nav>

                    <div style="border-top:2px solid #000; padding-top:14px;">
                        <button class="neo-btn neo-btn-sm neo-btn-danger neo-btn-block" onclick="window.appStore.resetData()">
                            Reset Database Demo
                        </button>
                    </div>
                </aside>

                <!-- Konten Utama Dashboard Admin -->
                <main class="admin-main-content">
                    <!-- Quick Horizontal Navigation Pills for Mobile / Tablet -->
                    <div class="admin-quick-pills">
                        <button class="quick-pill ${this.activeMenu === 'ringkasan' ? 'active' : ''}" onclick="window.adminView.setMenu('ringkasan')">
                            Ringkasan
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'surat' ? 'active' : ''}" onclick="window.adminView.setMenu('surat')">
                            Surat ${pendingSurat > 0 ? `(${pendingSurat})` : ''}
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'laporan' ? 'active' : ''}" onclick="window.adminView.setMenu('laporan')">
                            Laporan ${pendingReports > 0 ? `(${pendingReports})` : ''}
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'keuangan' ? 'active' : ''}" onclick="window.adminView.setMenu('keuangan')">
                            Kas & IPL
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'warga' ? 'active' : ''}" onclick="window.adminView.setMenu('warga')">
                            84 KK
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'pengumuman' ? 'active' : ''}" onclick="window.adminView.setMenu('pengumuman')">
                            Siar
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'aset' ? 'active' : ''}" onclick="window.adminView.setMenu('aset')">
                            Aset QR
                        </button>
                        <button class="quick-pill ${this.activeMenu === 'sos' ? 'active' : ''}" onclick="window.adminView.setMenu('sos')">
                            Pos Ronda
                        </button>
                    </div>

                    <!-- Top Strip Info -->
                    <header class="admin-header-strip">
                        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; width:100%; justify-content:space-between;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <button class="neo-btn neo-btn-sm admin-mobile-toggle-btn" onclick="window.adminView.toggleSidebar()" title="Buka Menu Lengkap">
                                    Menu
                                </button>
                                <div>
                                    <h2>${this.getMenuTitle()}</h2>
                                    <p>Dashboard Terpadu Administrasi Lingkungan & Kas Keuangan RT 022 RW 008 Desa Ciantra</p>
                                </div>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span class="neo-badge neo-badge-success">TTD QR: AKTIF</span>
                                <span class="neo-badge neo-badge-primary">KAS & IPL: TERPADU</span>
                                ${activeSOS ? `
                                    <span class="neo-badge neo-badge-danger">DARURAT AKTIF: ${activeSOS.pelapor_rumah}</span>
                                ` : `
                                    <span class="neo-badge neo-badge-white">LINGKUNGAN AMAN</span>
                                `}
                            </div>
                        </div>
                    </header>

                    <!-- Render Sesuai Menu -->
                    ${this.renderActiveMenu(data, totalSaldo, pendingSurat, pendingReports)}
                </main>

                <!-- Admin Modal Container -->
                <div id="admin-modal-container"></div>
            </div>
        `;
    }

    getMenuTitle() {
        switch (this.activeMenu) {
            case 'ringkasan': return 'Dashboard Manajemen RT 022 Desa Ciantra';
            case 'surat': return 'Antrean Persetujuan Surat Pengantar Warga';
            case 'laporan': return 'Kontrol Tiket Laporan & Penanganan Fasilitas';
            case 'keuangan': return 'Arus Kas Terbuka & Tagihan Iuran IPL';
            case 'warga': return 'Master Data Kependudukan 84 KK Warga';
            case 'pengumuman': return 'Siarkan Pengumuman & Agenda ke Seluruh HP Warga';
            case 'aset': return 'Katalog Inventaris & Cetak Stiker QR Barang';
            case 'sos': return 'Pusat Komando & Pemantauan Alarm Darurat SOS';
            default: return 'Dashboard RT 022 Ciantra';
        }
    }

    renderActiveMenu(data, totalSaldo, pendingSurat, pendingReports) {
        switch (this.activeMenu) {
            case 'ringkasan': return this.renderRingkasan(data, totalSaldo, pendingSurat, pendingReports);
            case 'surat': return this.renderSurat(data);
            case 'laporan': return this.renderLaporan(data);
            case 'keuangan': return this.renderKeuangan(data, totalSaldo);
            case 'warga': return this.renderWarga(data);
            case 'pengumuman': return this.renderPengumuman(data);
            case 'aset': return this.renderAset(data);
            case 'sos': return this.renderSOS(data);
            default: return this.renderRingkasan(data, totalSaldo, pendingSurat, pendingReports);
        }
    }

    // 1. RINGKASAN: 4 METRIC CARDS BENTO + ASYMMETRIC BENTO GRID (SESUAI WIREFRAME 4.2)
    renderRingkasan(data, totalSaldo, pendingSurat, pendingReports) {
        const lunasKK = (data.invoices || []).filter(i => i.status_bayar === 'lunas').length;
        const totalWarga = 84; // Sesuai spesifikasi wireframe 84 KK

        return `
            <!-- [4 METRIC CARDS BENTO GRID] -->
            <div class="admin-metrics-grid">
                <div class="metric-bento-tile" style="border-top:6px solid #4f46e5;">
                    <div class="metric-icon-sq" style="background:#e0e7ff; color:#4f46e5; font-size:1rem; font-weight:900;">SP</div>
                    <div class="metric-data">
                        <span>Surat Pending</span>
                        <h3>${pendingSurat} Surat</h3>
                        <small style="color:#64748b; font-weight:600;">Menunggu TTD QR</small>
                    </div>
                </div>

                <div class="metric-bento-tile" style="border-top:6px solid #ef4444;">
                    <div class="metric-icon-sq" style="background:#fee2e2; color:#ef4444; font-size:1rem; font-weight:900;">LK</div>
                    <div class="metric-data">
                        <span>Laporan Aktif</span>
                        <h3>${pendingReports} Tiket</h3>
                        <small style="color:#64748b; font-weight:600;">Fasilitas perlu teknisi</small>
                    </div>
                </div>

                <div class="metric-bento-tile" style="border-top:6px solid #22c55e;">
                    <div class="metric-icon-sq" style="background:#dcfce7; color:#16a34a; font-size:1rem; font-weight:900;">KK</div>
                    <div class="metric-data">
                        <span>IPL Lunas</span>
                        <h3>${lunasKK} / ${totalWarga} KK</h3>
                        <small style="color:#16a34a; font-weight:700;">Tagihan Rp 50.000</small>
                    </div>
                </div>

                <div class="metric-bento-tile" style="border-top:6px solid #ffd93d;">
                    <div class="metric-icon-sq" style="background:#fef08a; color:#854d0e; font-size:1rem; font-weight:900;">KAS</div>
                    <div class="metric-data">
                        <span>Kas Terbuka RT</span>
                        <h3 style="font-family:'Space Mono'; font-size:1.2rem;">Rp ${totalSaldo.toLocaleString('id-ID')}</h3>
                        <small style="color:#64748b; font-weight:600;">Transparan & Real-Time</small>
                    </div>
                </div>
            </div>

            <!-- === ASYMMETRIC 2-COLUMN BENTO GRID === -->
            <div class="admin-bento-split">
                <!-- Kolom Kiri: Antrean Persetujuan Surat & Arus Kas Terbuka -->
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <!-- Tile A: Antrean Persetujuan Surat Warga -->
                    <div class="neo-card" style="padding:20px;">
                        <div class="card-header-neo">
                            <h4>Antrean Persetujuan Surat Warga</h4>
                            <button class="neo-btn neo-btn-sm" onclick="window.adminView.setMenu('surat')">Lihat Semua</button>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:12px;">
                            ${(data.documents || []).map(d => `
                                <div style="background:#f8fafc; border:2px solid #000; border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <strong style="font-family:'Poppins'; font-size:0.9rem;">${d.pemohon_nama}</strong>
                                            <span class="neo-badge neo-badge-primary" style="font-size:10px;">${d.jenis_surat.toUpperCase()}</span>
                                        </div>
                                        <small style="color:#64748b; display:block; margin-top:2px;">${d.keperluan.substring(0, 55)}...</small>
                                    </div>
                                    <div>
                                        ${d.status_approval === 'menunggu' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-success" onclick="window.adminView.approveSurat(${d.doc_id})">
                                                Setujui & Buat QR
                                            </button>
                                        ` : `
                                            <span class="neo-badge neo-badge-success">VALID TTD QR</span>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Tile B: Arus Kas Terbuka Bulan Oktober -->
                    <div class="neo-card" style="padding:20px;">
                        <div class="card-header-neo">
                            <h4>Arus Kas Terbuka Bulan Oktober</h4>
                            <span class="neo-badge neo-badge-primary">Rp 4.25 JUTA</span>
                        </div>
                        <p style="font-size:0.8rem; color:#64748b; margin-bottom:12px;">
                            Pemasukan iuran IPL Rp 50.000 otomatis tercatat ke buku kas via QRIS.
                        </p>
                        <div class="neo-table-wrapper">
                            <table class="neo-table">
                                <thead>
                                    <tr>
                                        <th>Waktu</th>
                                        <th>Kategori</th>
                                        <th>Uraian</th>
                                        <th>Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(data.cash_books || []).slice(0, 4).map(c => `
                                        <tr>
                                            <td><small>${c.tgl_transaksi.substring(5, 16)}</small></td>
                                            <td><span class="neo-badge neo-badge-white">${c.kategori}</span></td>
                                            <td>${c.deskripsi}</td>
                                            <td style="font-family:'Space Mono'; font-weight:700; color:${c.jenis_transaksi === 'masuk' ? '#16a34a' : '#dc2626'};">
                                                ${c.jenis_transaksi === 'masuk' ? '+' : '-'} Rp ${Number(c.nominal).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Kolom Kanan: Form Siarkan Pengumuman Baru & Tiket Laporan Fasilitas -->
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <!-- Tile C: Siarkan Pengumuman Baru (Material 3 Form) -->
                    <div class="neo-card" style="padding:20px; background:#fff;">
                        <div class="card-header-neo">
                            <h4>Siarkan Pengumuman Baru</h4>
                            <span class="neo-badge neo-badge-secondary">PUSH NOTIF HP</span>
                        </div>

                        <form onsubmit="window.adminView.handleBroadcast(event)">
                            <div class="m3-field">
                                <label>Judul Pengumuman</label>
                                <input type="text" id="ann-title" placeholder="Contoh: Kerja Bakti Pembersihan Saluran" required>
                            </div>

                            <div class="m3-field">
                                <label>Isi Pesan Siaran Warga</label>
                                <textarea id="ann-content" rows="3" placeholder="Tuliskan detail jadwal, instruksi, dan informasi untuk warga..." required></textarea>
                            </div>

                            <button type="submit" class="neo-btn neo-btn-primary neo-btn-block">
                                Terbitkan ke Seluruh HP Warga
                            </button>
                        </form>
                    </div>

                    <!-- Tile D: Kontrol Tiket Laporan Fasilitas -->
                    <div class="neo-card" style="padding:20px;">
                        <div class="card-header-neo">
                            <h4>Kontrol Tiket Laporan Fasilitas</h4>
                            <button class="neo-btn neo-btn-sm" onclick="window.adminView.setMenu('laporan')">Kelola Tiket</button>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${(data.reports || []).map(r => `
                                <div style="background:#f8fafc; border:2px solid #000; border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <span class="neo-badge ${r.status === 'selesai' ? 'neo-badge-success' : 'neo-badge-danger'}">${r.status.toUpperCase()}</span>
                                            <strong style="font-family:'Poppins'; font-size:0.85rem;">${r.lokasi}</strong>
                                        </div>
                                        <small style="color:#64748b; display:block; margin-top:2px;">${r.deskripsi.substring(0, 50)}...</small>
                                    </div>
                                    <div>
                                        ${r.status === 'dikirim' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-warning" onclick="window.adminView.quickDisposisi(${r.report_id})">
                                                Tugaskan
                                            </button>
                                        ` : (r.status === 'diproses' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-success" onclick="window.adminView.quickSelesai(${r.report_id})">
                                                Selesai
                                            </button>
                                        ` : `
                                            <span style="font-size:0.75rem; color:#16a34a; font-weight:700;">Tuntas</span>
                                        `)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 2. PERSETUJUAN TTD SURAT PENGANTAR DIGITAL
    renderSurat(data) {
        return `
            <div class="neo-card" style="padding:24px;">
                <div class="card-header-neo">
                    <div>
                        <h4>Permohonan Surat Pengantar Warga Desa Ciantra</h4>
                        <p style="font-size:0.8rem; color:#64748b;">Setiap persetujuan otomatis membangkitkan Nomor Surat Resmi & TTD Digital QR Bapak Anwar Djamaludin</p>
                    </div>
                </div>

                <div class="neo-table-wrapper">
                    <table class="neo-table">
                        <thead>
                            <tr>
                                <th>Tgl Pengajuan</th>
                                <th>Pemohon</th>
                                <th>Rumah</th>
                                <th>Jenis Surat</th>
                                <th>Keperluan</th>
                                <th>Status</th>
                                <th>Nomor & TTD QR</th>
                                <th>Aksi Ketua RT</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.documents || []).map(d => `
                                <tr>
                                    <td><small>${d.tgl_pengajuan}</small></td>
                                    <td><b>${d.pemohon_nama}</b><br><small style="color:#64748b;">NIK: ${d.pemohon_nik}</small></td>
                                    <td>${d.pemohon_rumah}</td>
                                    <td><span class="neo-badge neo-badge-primary">${d.jenis_surat.toUpperCase()}</span></td>
                                    <td style="max-width:240px;">${d.keperluan}</td>
                                    <td>
                                        <span class="neo-badge ${d.status_approval === 'disetujui' ? 'neo-badge-success' : (d.status_approval === 'menunggu' ? 'neo-badge-warning' : 'neo-badge-danger')}">
                                            ${d.status_approval.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        ${d.nomor_surat ? `
                                            <code style="font-family:'Space Mono'; font-weight:700;">${d.nomor_surat}</code><br>
                                            <small style="color:#16a34a; font-weight:700;">TTD Digital Sah</small>
                                        ` : '<span style="color:#94a3b8;">-</span>'}
                                    </td>
                                    <td>
                                        ${d.status_approval === 'menunggu' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-success" onclick="window.adminView.approveSurat(${d.doc_id})">
                                                Setujui & Buat QR
                                            </button>
                                            <button class="neo-btn neo-btn-sm neo-btn-danger" style="margin-left:4px;" onclick="window.adminView.rejectSurat(${d.doc_id})">
                                                Tolak
                                            </button>
                                        ` : `
                                            <button class="neo-btn neo-btn-sm" onclick="window.wargaView.viewOfficialPDF(${d.doc_id})">
                                                Lihat PDF
                                            </button>
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 3. TIKET LAPORAN FASILITAS
    renderLaporan(data) {
        return `
            <div class="neo-card" style="padding:24px;">
                <div class="card-header-neo">
                    <div>
                        <h4>Tiket Laporan Kerusakan Fasilitas Warga</h4>
                        <p style="font-size:0.8rem; color:#64748b;">Disposisikan teknisi, pantau proses pengerjaan, dan unggah bukti selesai</p>
                    </div>
                </div>

                <div class="neo-table-wrapper">
                    <table class="neo-table">
                        <thead>
                            <tr>
                                <th>Waktu</th>
                                <th>Pelapor</th>
                                <th>Lokasi</th>
                                <th>Uraian Kerusakan</th>
                                <th>Petugas / Teknisi</th>
                                <th>Status</th>
                                <th>Aksi Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.reports || []).map(r => `
                                <tr>
                                    <td><small>${r.tgl_lapor.substring(0, 16)}</small></td>
                                    <td><b>${r.pelapor_nama}</b></td>
                                    <td>${r.lokasi}</td>
                                    <td style="max-width:220px;">${r.deskripsi}</td>
                                    <td><b>${r.disposisi_petugas || '<span style="color:#94a3b8;">Belum ditugaskan</span>'}</b></td>
                                    <td>
                                        <span class="neo-badge ${r.status === 'selesai' ? 'neo-badge-success' : (r.status === 'diproses' ? 'neo-badge-warning' : 'neo-badge-primary')}">
                                            ${r.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        ${r.status === 'dikirim' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-warning" onclick="window.adminView.quickDisposisi(${r.report_id})">
                                                Tugaskan Teknisi
                                            </button>
                                        ` : (r.status === 'diproses' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-success" onclick="window.adminView.quickSelesai(${r.report_id})">
                                                Tandai Selesai
                                            </button>
                                        ` : `
                                            <small style="color:#16a34a; font-weight:700;">Perbaikan Tuntas</small>
                                        `)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 4. BUKU KAS & IURAN IPL
    renderKeuangan(data, totalSaldo) {
        return `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="admin-metrics-grid">
                    <div class="metric-bento-tile" style="border-top:6px solid #ffd93d;">
                        <div class="metric-icon-sq" style="background:#fef08a; font-size:1rem; font-weight:900;">KAS</div>
                        <div class="metric-data">
                            <span>Saldo Kas Berjalan</span>
                            <h3 style="font-family:'Space Mono'; font-size:1.35rem;">Rp ${totalSaldo.toLocaleString('id-ID')}</h3>
                        </div>
                    </div>

                    <div class="metric-bento-tile" style="border-top:6px solid #4f46e5;">
                        <div class="metric-icon-sq" style="background:#e0e7ff; font-size:1rem; font-weight:900;">IPL</div>
                        <div class="metric-data">
                            <span>Tagihan IPL Terbit</span>
                            <h3>${(data.invoices || []).length} Tagihan</h3>
                            <small style="color:#64748b;">Rp 50.000 / KK / Bulan</small>
                        </div>
                    </div>

                    <div class="metric-bento-tile" style="border-top:6px solid #22c55e;">
                        <div class="metric-icon-sq" style="background:#dcfce7; font-size:1rem; font-weight:900;">MSL</div>
                        <div class="metric-data">
                            <span>Aksi Massal IPL</span>
                            <button class="neo-btn neo-btn-sm neo-btn-primary" style="margin-top:4px;" onclick="window.adminView.generateMassiveIPL()">
                                Kirim Tagihan Massal
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Input Transaksi Kas Manual -->
                <div class="neo-card" style="padding:20px;">
                    <div class="card-header-neo">
                        <h4>Input Pembukuan Kas Manual (In / Out)</h4>
                    </div>
                    <form onsubmit="window.adminView.handleManualCash(event)" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; align-items:end;">
                        <div class="m3-field" style="margin:0;">
                            <label>Jenis Mutasi</label>
                            <select id="cash-type">
                                <option value="masuk">Pemasukan (+)</option>
                                <option value="keluar">Pengeluaran (-)</option>
                            </select>
                        </div>
                        <div class="m3-field" style="margin:0;">
                            <label>Nominal (Rp)</label>
                            <input type="number" id="cash-nominal" placeholder="Contoh: 150000" required>
                        </div>
                        <div class="m3-field" style="margin:0;">
                            <label>Kategori</label>
                            <input type="text" id="cash-cat" placeholder="Misal: Perbaikan PJU" required>
                        </div>
                        <div class="m3-field" style="margin:0;">
                            <label>Uraian Transaksi</label>
                            <input type="text" id="cash-desc" placeholder="Keterangan rincian..." required>
                        </div>
                        <div>
                            <button type="submit" class="neo-btn neo-btn-primary neo-btn-block">Simpan Kas</button>
                        </div>
                    </form>
                </div>

                <!-- Tabel Riwayat Buku Kas -->
                <div class="neo-card" style="padding:20px;">
                    <div class="card-header-neo">
                        <h4>Buku Kas Terbuka RT 022 RW 008 Desa Ciantra</h4>
                    </div>
                    <div class="neo-table-wrapper">
                        <table class="neo-table">
                            <thead>
                                <tr>
                                    <th>Kode TRX</th>
                                    <th>Waktu</th>
                                    <th>Kategori</th>
                                    <th>Uraian</th>
                                    <th>Pemasukan</th>
                                    <th>Pengeluaran</th>
                                    <th>Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(data.cash_books || []).slice().reverse().map(c => `
                                    <tr>
                                        <td><code>${c.kode_transaksi}</code></td>
                                        <td>${c.tgl_transaksi.substring(0, 16)}</td>
                                        <td><span class="neo-badge neo-badge-white">${c.kategori}</span></td>
                                        <td>${c.deskripsi}</td>
                                        <td style="font-family:'Space Mono'; font-weight:700; color:#16a34a;">
                                            ${c.jenis_transaksi === 'masuk' ? `+ Rp ${Number(c.nominal).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td style="font-family:'Space Mono'; font-weight:700; color:#dc2626;">
                                            ${c.jenis_transaksi === 'keluar' ? `- Rp ${Number(c.nominal).toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td style="font-family:'Space Mono'; font-weight:700;">
                                            Rp ${Number(c.saldo_berjalan).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // 5. MASTER DATA 84 KK WARGA
    renderWarga(data) {
        return `
            <div class="neo-card" style="padding:24px;">
                <div class="card-header-neo">
                    <div>
                        <h4>Master Data Kependudukan (84 KK Terdata)</h4>
                        <p style="font-size:0.8rem; color:#64748b;">Kelola verifikasi NIK KTP, blok rumah, dan status aktif akun warga</p>
                    </div>
                </div>

                <div class="neo-table-wrapper">
                    <table class="neo-table">
                        <thead>
                            <tr>
                                <th>Nama Lengkap</th>
                                <th>NIK KTP</th>
                                <th>Alamat Rumah</th>
                                <th>No WhatsApp</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Aksi Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.users || []).map(u => `
                                <tr>
                                    <td><b>${u.nama_lengkap}</b></td>
                                    <td><code style="font-family:'Space Mono';">${u.nik}</code></td>
                                    <td>${u.no_rumah}</td>
                                    <td>${u.no_hp}</td>
                                    <td><span class="neo-badge neo-badge-secondary">${u.role.toUpperCase()}</span></td>
                                    <td>
                                        <span class="neo-badge ${u.status_aktif === 'aktif' ? 'neo-badge-success' : 'neo-badge-warning'}">
                                            ${u.status_aktif.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        ${u.status_aktif === 'menunggu' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-success" onclick="window.adminView.verifyUser(${u.user_id}, 'aktif')">
                                                Verifikasi
                                            </button>
                                        ` : (u.role !== 'admin' ? `
                                            <button class="neo-btn neo-btn-sm neo-btn-danger" onclick="window.adminView.verifyUser(${u.user_id}, u.status_aktif === 'aktif' ? 'diblokir' : 'aktif')">
                                                ${u.status_aktif === 'aktif' ? 'Blokir' : 'Aktifkan'}
                                            </button>
                                        ` : '<small style="color:#64748b;">Akun Ketua RT</small>')}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 6. SIAR PENGUMUMAN BARU
    renderPengumuman(data) {
        return `
            <div class="admin-responsive-grid-2col">
                <div class="neo-card" style="padding:24px;">
                    <div class="card-header-neo">
                        <h4>Terbitkan Siaran Pengumuman Baru</h4>
                    </div>

                    <form onsubmit="window.adminView.handleBroadcast(event)">
                        <div class="m3-field">
                            <label>Judul Pengumuman</label>
                            <input type="text" id="ann-title" placeholder="Misal: Kerja Bakti / Jadwal Posyandu" required>
                        </div>

                        <div class="m3-field">
                            <label>Isi Pesan Siaran Warga</label>
                            <textarea id="ann-content" rows="4" placeholder="Tuliskan isi informasi selengkapnya..." required></textarea>
                        </div>

                        <button type="submit" class="neo-btn neo-btn-primary neo-btn-block">
                            Terbitkan ke Seluruh HP Warga
                        </button>
                    </form>
                </div>

                <div class="neo-card" style="padding:24px;">
                    <div class="card-header-neo">
                        <h4>Arsip Siaran Pengumuman</h4>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${(data.announcements || []).map(a => `
                            <div style="background:#f8fafc; border:2px solid #000; border-radius:12px; padding:14px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span class="neo-badge neo-badge-primary">${a.badge || 'INFO'}</span>
                                    <small style="color:#64748b; font-weight:700;">${a.tanggal}</small>
                                </div>
                                <h4 style="font-family:'Poppins'; font-size:0.95rem; font-weight:800; margin:6px 0 2px;">${a.judul}</h4>
                                <p style="font-size:0.8rem; color:#334155;">${a.isi}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // 7. INVENTARIS ASET & CETAK QR
    renderAset(data) {
        return `
            <div class="neo-card" style="padding:24px;">
                <div class="card-header-neo">
                    <h4>Inventaris Pintar & Cetak Stiker QR Code</h4>
                </div>

                <div class="neo-table-wrapper">
                    <table class="neo-table">
                        <thead>
                            <tr>
                                <th>Kode Barang</th>
                                <th>Nama Barang</th>
                                <th>Lokasi Penyimpanan</th>
                                <th>Kondisi</th>
                                <th>Status Pinjam</th>
                                <th>Cetak Label QR</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.assets || []).map(a => `
                                <tr>
                                    <td><code>${a.kode_barang}</code></td>
                                    <td><b>${a.nama_barang}</b></td>
                                    <td>${a.keterangan}</td>
                                    <td><span class="neo-badge neo-badge-white">${a.kondisi_barang.toUpperCase()}</span></td>
                                    <td>
                                        <span class="neo-badge ${a.status_pinjam ? 'neo-badge-danger' : 'neo-badge-success'}">
                                            ${a.status_pinjam ? 'SEDANG DIPINJAM' : 'TERSEDIA'}
                                        </span>
                                    </td>
                                    <td>
                                        <button class="neo-btn neo-btn-sm neo-btn-primary" onclick="window.adminView.previewQRSticker('${a.kode_barang}', '${a.nama_barang}', '${a.qr_code}')">
                                            Cetak Stiker QR
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // 8. MONITOR SOS
    renderSOS(data) {
        const active = data.activeEmergency;
        return `
            <div class="neo-card" style="padding:24px;">
                <div class="card-header-neo">
                    <h4>Pusat Pantau Alarm SOS Pos Ronda 24 Jam</h4>
                </div>

                ${active ? `
                    <div style="background:#fee2e2; border:3px solid #dc2626; border-radius:14px; padding:20px; margin-bottom:20px;">
                        <h3 style="color:#dc2626; font-family:'Poppins'; font-size:1.2rem; font-weight:900;">
                            PERINGATAN: DARURAT SOS SEDANG AKTIF!
                        </h3>
                        <p style="font-weight:700; color:#334155; margin-top:4px;">
                            Pelapor: ${active.pelapor_nama} (${active.pelapor_rumah}) • Kategori: <b>${active.kategori_darurat.toUpperCase()}</b>
                        </p>
                        <div style="margin-top:14px;">
                            <button class="neo-btn neo-btn-success" onclick="window.adminView.resolveSOS(${active.sos_id})">
                                Konfirmasi Situasi Terkendali (Clear Area)
                            </button>
                        </div>
                    </div>
                ` : `
                    <div style="background:#dcfce7; border:2.5px solid #16a34a; border-radius:14px; padding:18px; margin-bottom:20px;">
                        <h4 style="color:#16a34a; font-family:'Poppins'; font-weight:900;">Kondisi Lingkungan Aman & Kondusif</h4>
                        <p style="font-size:0.82rem; color:#334155;">Pos Ronda 24 Jam Regu Jaga Desa Ciantra aktif memonitor sinyal darurat warga.</p>
                    </div>
                `}

                <h4 style="font-family:'Poppins'; font-size:0.95rem; font-weight:800; margin-bottom:8px;">
                    Riwayat Insiden Darurat SOS
                </h4>

                <div class="neo-table-wrapper">
                    <table class="neo-table">
                        <thead>
                            <tr>
                                <th>Waktu</th>
                                <th>Pelapor</th>
                                <th>Alamat</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th>Catatan Tindak Lanjut</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.emergencies || []).map(e => `
                                <tr>
                                    <td><small>${e.waktu_kejadian}</small></td>
                                    <td><b>${e.pelapor_nama}</b></td>
                                    <td>${e.pelapor_rumah}</td>
                                    <td><span class="neo-badge neo-badge-danger">${e.kategori_darurat.toUpperCase()}</span></td>
                                    <td><span class="neo-badge neo-badge-success">${e.status.toUpperCase()}</span></td>
                                    <td>${e.catatan_penanganan || 'Situasi aman terkendali'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ACTIONS
    handleBroadcast(e) {
        e.preventDefault();
        const judul = document.getElementById('ann-title').value;
        const isi = document.getElementById('ann-content').value;

        window.appStore.broadcastAnnouncement({ judul, isi });
        window.soundController.playSuccessChime();
        this.render();
        alert('[BERHASIL] Pengumuman berhasil diterbitkan ke seluruh smartphone warga RT 022 Desa Ciantra!');
    }

    approveSurat(docId) {
        window.appStore.approveDocument(docId);
        window.soundController.playSuccessChime();
        this.render();
        alert('[BERHASIL] Surat berhasil disetujui! Dokumen resmi dengan Kop RT & TTD Digital QR Bapak Anwar Djamaludin telah terbit.');
    }

    rejectSurat(docId) {
        const alasan = prompt('Alasan penolakan surat:', 'Berkas permohonan belum lengkap.');
        if (alasan) {
            window.appStore.rejectDocument(docId, alasan);
            this.render();
        }
    }

    quickDisposisi(reportId) {
        const petugas = prompt('Pilih teknisi/tukang penanganan:', 'Pak Slamet (Teknisi Listrik)');
        if (petugas) {
            window.appStore.updateReportStatus(reportId, 'diproses', petugas);
            this.render();
        }
    }

    quickSelesai(reportId) {
        window.appStore.updateReportStatus(reportId, 'selesai', null, "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80");
        window.soundController.playSuccessChime();
        this.render();
        alert('[BERHASIL] Laporan fasilitas ditandai Selesai!');
    }

    handleManualCash(e) {
        e.preventDefault();
        const jenis_transaksi = document.getElementById('cash-type').value;
        const nominal = document.getElementById('cash-nominal').value;
        const kategori = document.getElementById('cash-cat').value;
        const deskripsi = document.getElementById('cash-desc').value;

        window.appStore.addManualCash({ jenis_transaksi, nominal, kategori, deskripsi });
        window.soundController.playSuccessChime();
        this.render();
        alert('[BERHASIL] Mutasi kas manual berhasil disimpan ke Buku Kas!');
    }

    generateMassiveIPL() {
        const count = window.appStore.generateMassiveInvoices("November 2026", 50000);
        this.render();
        alert(`[BERHASIL] Berhasil menerbitkan tagihan IPL Rp 50.000 untuk ${count} Kepala Keluarga!`);
    }

    verifyUser(userId, status) {
        window.appStore.verifyUser(userId, status);
        this.render();
    }

    resolveSOS(sosId) {
        window.appStore.resolveEmergency(sosId);
        window.soundController.stopEmergencySiren();
        this.render();
        alert('[BERHASIL] Situasi darurat ditandai Clear Area. Sirene alarm pos ronda dimatikan.');
    }

    previewQRSticker(kode, nama, qrStr) {
        const qrSVG = window.QRCodeGenerator.generateSVG(qrStr, 140);
        const modal = document.getElementById('admin-modal-container');
        modal.innerHTML = `
            <div class="neo-modal-overlay">
                <div class="neo-modal-box" style="text-align:center;">
                    <div class="modal-header-neo">
                        <h4>Stiker Label QR Barang Fisik</h4>
                        <button class="modal-close-btn" onclick="document.getElementById('admin-modal-container').innerHTML=''">&times;</button>
                    </div>

                    <div style="background:#fff; border:3px dashed #000; padding:20px; border-radius:12px; display:inline-block; margin-bottom:14px;">
                        <strong style="font-family:'Poppins'; font-size:0.95rem; display:block;">INVENTARIS RT 022 RW 008</strong>
                        <small style="color:#64748b; font-weight:700;">DESA CIANTRA - KABUPATEN BEKASI</small>
                        <div style="margin:12px auto;">${qrSVG}</div>
                        <div style="font-family:'Poppins'; font-size:1.1rem; font-weight:900;">${nama}</div>
                        <div style="font-family:'Space Mono'; font-weight:700;">${kode}</div>
                    </div>

                    <div>
                        <button class="neo-btn neo-btn-primary" onclick="window.print()">Cetak Stiker Label</button>
                    </div>
                </div>
            </div>
        `;
    }
}

window.AdminView = AdminView;
