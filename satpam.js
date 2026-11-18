// Komponen Layar Pantau Pos Ronda 24 Jam & Tugas Lapangan Satpam RT 022 RW 008 DESA CIANTRA
// Implementasi Spesifikasi: Neo-Brutalism Radar Screen & Field Task Execution (UC-05, UC-06, UC-08b)

class SatpamView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeTab = 'sos'; // 'sos' | 'tugas'
        this.isAudioMuted = false;
        this.init();
    }

    init() {
        window.appStore.subscribe(() => {
            this.render();
        });
        this.render();
    }

    setTab(tab) {
        this.activeTab = tab;
        this.render();
    }

    render() {
        const data = window.appStore.data;
        const activeSOS = data.activeEmergency;
        const satpam = data.satpamInfo || { nama_lengkap: "Pak Joko Supardi", regu: "Regu A - Pos Ronda 24 Jam" };
        const assignedTasks = (data.reports || []).filter(r => r.status === 'diproses' || r.status === 'dikirim').length;

        this.container.innerHTML = `
            <div style="padding:24px; max-width:1200px; margin:0 auto;">
                <!-- Header Pos Ronda Neo-Brutalism -->
                <div class="neo-card" style="padding:16px 20px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; background:${activeSOS ? '#fee2e2' : '#ffd93d'}; border-color:${activeSOS ? '#dc2626' : '#000'};">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div class="neo-badge neo-badge-danger" style="font-size:1.1rem; padding:8px 12px; font-weight:900;">PR</div>
                        <div>
                            <h3 style="font-family:'Poppins'; font-size:1.15rem; font-weight:900;">
                                POS RONDA & OPERASIONAL LAPANGAN RT 022 CIANTRA
                            </h3>
                            <p style="font-size:0.8rem; font-weight:700; color:#334155;">
                                ${satpam.nama_lengkap} • ${satpam.regu} • RW 008 Desa Ciantra
                            </p>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="font-family:'Space Mono'; font-size:1.1rem; font-weight:700;" id="satpam-live-clock">
                            ${new Date().toLocaleTimeString('id-ID')} WIB
                        </div>
                        <button class="neo-btn neo-btn-sm ${this.isAudioMuted ? 'neo-btn-warning' : 'neo-btn-danger'}" onclick="window.satpamView.toggleAudioMute()">
                            ${this.isAudioMuted ? 'Audio Dimatikan' : 'Audio Sirene Aktif'}
                        </button>
                    </div>
                </div>

                <!-- Sub-tab Navigation (Radar SOS vs Tugas Lapangan) -->
                <div style="display:flex; gap:8px; margin-bottom:20px;">
                    <button class="neo-btn neo-btn-sm ${this.activeTab === 'sos' ? 'neo-btn-danger' : 'neo-btn-white'}" onclick="window.satpamView.setTab('sos')">
                        Radar Darurat SOS (UC-05, UC-06) ${activeSOS ? '<span class="neo-badge neo-badge-danger" style="margin-left:4px; font-size:10px;">AKTIF</span>' : ''}
                    </button>
                    <button class="neo-btn neo-btn-sm ${this.activeTab === 'tugas' ? 'neo-btn-primary' : 'neo-btn-white'}" onclick="window.satpamView.setTab('tugas')">
                        Tugas Lapangan Fasilitas (UC-08b) ${assignedTasks > 0 ? `<span class="neo-badge neo-badge-warning" style="margin-left:4px; font-size:10px;">${assignedTasks} TUGAS</span>` : ''}
                    </button>
                </div>

                <!-- Content Area -->
                ${this.activeTab === 'tugas' ? this.renderTugasLapangan(data) : (activeSOS ? this.renderActiveSOS(activeSOS) : this.renderStandby(data))}
            </div>
        `;
    }

    renderActiveSOS(activeSOS) {
        return `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <!-- Flashing Siren Banner -->
                <div class="neo-card" style="background:#ef4444; color:#fff; padding:20px; text-align:center;">
                    <div class="neo-badge neo-badge-danger" style="font-size:1.5rem; padding:6px 14px; animation:pulseSOS 1s infinite; display:inline-block; margin-bottom:8px;">DARURAT</div>
                    <h2 style="font-family:'Poppins'; font-size:1.4rem; font-weight:900; margin-top:6px;">
                        ALARM DARURAT BERBUNYI! KATEGORI: ${activeSOS.kategori_darurat.toUpperCase()}
                    </h2>
                    <p style="font-size:0.9rem; font-weight:600;">Warga menekan tombol SOS dari smartphone PWA. Petugas lapangan segera menuju TKP!</p>
                </div>

                <div class="admin-responsive-grid-2col">
                    <!-- Informasi Pelapor -->
                    <div class="neo-card" style="padding:24px;">
                        <div class="card-header-neo">
                            <h4>Identitas Warga Pelapor</h4>
                        </div>
                        <div style="margin-bottom:14px;">
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Nama Pelapor</span>
                            <div style="font-family:'Poppins'; font-size:1.3rem; font-weight:900;">${activeSOS.pelapor_nama}</div>
                        </div>

                        <div style="margin-bottom:14px;">
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Alamat Rumah TKP</span>
                            <div style="font-family:'Poppins'; font-size:1.15rem; font-weight:800; color:#4f46e5;">${activeSOS.pelapor_rumah}</div>
                        </div>

                        <div style="margin-bottom:14px;">
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">No. WhatsApp / HP</span>
                            <div style="font-family:'Space Mono'; font-weight:700;">${activeSOS.pelapor_hp}</div>
                        </div>

                        <div style="margin-bottom:20px;">
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Koordinat GPS</span>
                            <div style="font-family:'Space Mono'; font-size:0.85rem; font-weight:700;">
                                Lat: ${activeSOS.latitude.toFixed(6)}, Lng: ${activeSOS.longitude.toFixed(6)}
                            </div>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <button class="neo-btn neo-btn-warning neo-btn-block" onclick="alert('Petugas lapangan bergerak ke TKP!')">
                                Petugas Lapangan Menuju TKP
                            </button>
                            <button class="neo-btn neo-btn-success neo-btn-block" onclick="window.satpamView.resolveEmergencyAction(${activeSOS.sos_id})">
                                Darurat Ditangani (Clear Area)
                            </button>
                        </div>
                    </div>

                    <!-- Peta Taktis Lokasi GPS -->
                    <div class="neo-card" style="padding:24px;">
                        <div class="card-header-neo">
                            <h4>Peta Taktis Lokasi Pelapor (GPS Desa Ciantra)</h4>
                        </div>

                        <div style="background:#0f172a; border:2.5px solid #000; border-radius:14px; height:260px; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                            <!-- Mock Grid & Roads -->
                            <div style="position:absolute; width:100%; height:20px; background:#334155; top:40%;">
                                <span style="font-size:10px; color:#94a3b8; padding-left:10px;">Jl. Mawar RT 022</span>
                            </div>
                            <div style="position:absolute; width:100%; height:20px; background:#334155; top:70%;">
                                <span style="font-size:10px; color:#94a3b8; padding-left:10px;">Jl. Melati RT 022</span>
                            </div>
                            <div style="position:absolute; width:20px; height:100%; background:#334155; left:35%;"></div>

                            <!-- Titik Pos Satpam -->
                            <div style="position:absolute; bottom:20px; left:20px; background:#3b82f6; color:#fff; border:2px solid #000; padding:4px 8px; border-radius:8px; font-weight:800; font-size:0.75rem;">
                                Pos Ronda
                            </div>

                            <!-- Target SOS -->
                            <div style="position:absolute; top:35%; left:60%; transform:translate(-50%, -50%); text-align:center;">
                                <div class="neo-badge neo-badge-danger" style="font-size:0.9rem; padding:4px 8px; animation:pulseSOS 1s infinite; margin-bottom:4px;">SOS</div>
                                <span style="background:#ef4444; color:#fff; font-weight:800; font-size:0.75rem; padding:2px 8px; border-radius:6px; border:1px solid #000;">
                                    ${activeSOS.pelapor_rumah}
                                </span>
                            </div>
                        </div>

                        <div style="margin-top:12px; font-size:0.8rem; font-weight:700; color:#475569;">
                            Target Penanganan: <b>${activeSOS.pelapor_rumah}</b> (~110 meter dari Pos Ronda)
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStandby(data) {
        return `
            <div class="admin-responsive-grid-2col">
                <!-- Radar Siaga -->
                <div class="neo-card" style="padding:24px; text-align:center;">
                    <div class="card-header-neo">
                        <h4>Pusat Radar Siaga 24 Jam</h4>
                    </div>

                    <div style="width:180px; height:180px; border-radius:50%; border:3px solid #000; margin:20px auto; background:radial-gradient(circle, #dcfce7 0%, #bbf7d0 70%, #86efac 100%); display:flex; align-items:center; justify-content:center; position:relative; box-shadow:3px 3px 0px 0px #000;">
                        <span style="font-family:'Poppins'; font-size:2.2rem; font-weight:900; color:#16a34a;">SIAGA</span>
                    </div>

                    <h4 style="font-family:'Poppins'; font-size:1.1rem; font-weight:900; color:#16a34a;">
                        STATUS POS: AMAN & SIAGA
                    </h4>
                    <p style="font-size:0.82rem; color:#64748b; margin-top:4px;">
                        Memonitor transmisi darurat dari seluruh smartphone warga RT 022 RW 008 Desa Ciantra.
                    </p>
                </div>

                <!-- SOP Pos Ronda -->
                <div class="neo-card" style="padding:24px;">
                    <div class="card-header-neo">
                        <h4>Standar Operasional Prosedur (SOP) Pos Ronda</h4>
                    </div>

                    <ul style="padding-left:18px; font-size:0.82rem; line-height:1.7; color:#334155; font-weight:600;">
                        <li>1. Bila sirene berbunyi, segera cek nama pelapor, nomor rumah, dan rute di peta.</li>
                        <li>2. Minimal 1 petugas lapangan segera mendatangi TKP membawa senter & tongkat.</li>
                        <li>3. Hubungi Pak Anwar Djamaludin (Ketua RT) jika membutuhkan bantuan aparat Desa/Polsek.</li>
                        <li>4. Setelah situasi aman, klik tombol <b>"Darurat Ditangani (Clear Area)"</b> untuk mematikan sirene.</li>
                        <li>5. Cek tab <b>Tugas Lapangan</b> secara berkala untuk tiket perbaikan fasilitas lingkungan yang ditugaskan Ketua RT.</li>
                    </ul>

                    <div style="margin-top:16px; border-top:2px solid #000; padding-top:12px; font-size:0.8rem;">
                        <span>Panggilan Cepat Ketua RT: <b>0811-8822-3344</b></span>
                    </div>
                </div>
            </div>
        `;
    }

    renderTugasLapangan(data) {
        const reports = data.reports || [];

        return `
            <div>
                <div class="neo-card" style="padding:20px; margin-bottom:20px; background:#eef2ff;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h4 style="font-family:'Poppins'; font-size:1.1rem; font-weight:900; color:#1e1b4b;">
                                Daftar Disposisi Tugas Lapangan (Perbaikan Fasilitas RT 022)
                            </h4>
                            <p style="font-size:0.82rem; color:#475569; margin-top:4px;">
                                Tugas pemeliharaan lingkungan yang didisposisikan oleh <b>Ketua RT (Bpk. Anwar Djamaludin)</b> kepada Satpam / Petugas Lapangan.
                            </p>
                        </div>
                        <span class="neo-badge neo-badge-secondary">Modul Citizen Care</span>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr; gap:16px;">
                    ${reports.map(rep => `
                        <div class="neo-card" style="padding:20px; border-left:8px solid ${rep.status === 'selesai' ? '#22c55e' : (rep.status === 'diproses' ? '#f59e0b' : '#3b82f6')};">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                                <div>
                                    <span class="neo-badge ${rep.status === 'selesai' ? 'neo-badge-success' : (rep.status === 'diproses' ? 'neo-badge-warning' : 'neo-badge-primary')}">
                                        STATUS: ${rep.status.toUpperCase()}
                                    </span>
                                    <h4 style="font-family:'Poppins'; font-size:1.05rem; font-weight:900; margin-top:6px;">
                                        ${rep.deskripsi}
                                    </h4>
                                    <div style="font-size:0.8rem; color:#64748b; margin-top:2px;">
                                        <b>Lokasi:</b> ${rep.lokasi} • Pelapor: <b>${rep.pelapor_nama}</b> • Tgl: ${rep.tgl_lapor}
                                    </div>
                                </div>

                                <div style="text-align:right;">
                                    <span style="font-size:0.75rem; font-weight:700; color:#64748b; display:block;">Petugas Disposisi:</span>
                                    <span class="neo-badge neo-badge-secondary" style="font-size:11px;">
                                        ${rep.disposisi_petugas || 'Belum Disposisi'}
                                    </span>
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns: auto 1fr; gap:16px; align-items:center; background:#f8fafc; border:1.5px solid #000; border-radius:10px; padding:12px;">
                                ${rep.foto_url ? `
                                    <img src="${rep.foto_url}" style="width:100px; height:80px; object-fit:cover; border:2px solid #000; border-radius:8px;" alt="Bukti Rusak">
                                ` : ''}

                                <div>
                                    ${rep.status === 'selesai' ? `
                                        <div style="color:#16a34a; font-weight:800; font-size:0.85rem;">
                                            [SELESAI] Pekerjaan Telah Selesai Dikerjakan! (Selesai: ${rep.tgl_selesai || '-'})
                                        </div>
                                        ${rep.foto_bukti_selesai ? `
                                            <div style="margin-top:6px;">
                                                <a href="${rep.foto_bukti_selesai}" target="_blank" style="font-size:0.78rem; font-weight:700; color:#4f46e5; text-decoration:underline;">
                                                    Lihat Foto Bukti Perbaikan Lapangan
                                                </a>
                                            </div>
                                        ` : ''}
                                    ` : `
                                        <div style="font-size:0.8rem; font-weight:600; color:#334155; margin-bottom:8px;">
                                            Tugas ini sedang dalam penanganan petugas lapangan. Setelah pekerjaan fisik selesai, klik tombol di bawah untuk unggah bukti dan selesaikan tiket.
                                        </div>
                                        <button class="neo-btn neo-btn-sm neo-btn-success" onclick="window.satpamView.handleCompleteTaskAction(${rep.report_id})">
                                            Selesaikan Tugas & Unggah Bukti Lapangan
                                        </button>
                                    `}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    handleCompleteTaskAction(reportId) {
        const catatan = prompt('Masukkan catatan pekerjaan lapangan:', 'Lampu PJU telah diganti bohlam LED baru dan kabel diperbaiki. Lampu menyala terang.');
        if (catatan !== null) {
            window.appStore.completeTaskByPetugas(reportId, "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80", catatan);
            alert('[BERHASIL] Tugas lapangan berhasil diselesaikan! Status laporan warga di PWA otomatis berubah menjadi Selesai.');
        }
    }

    resolveEmergencyAction(sosId) {
        const catatan = prompt('Masukkan catatan penanganan lapangan:', 'Situasi di lokasi telah terkendali oleh Satpam. Kondisi aman terkendali.');
        if (catatan !== null) {
            window.appStore.resolveEmergency(sosId, catatan);
            window.soundController.stopEmergencySiren();
            alert('[BERHASIL] Darurat telah ditandai Selesai. Alarm audio pos satpam dimatikan.');
        }
    }

    toggleAudioMute() {
        this.isAudioMuted = window.soundController.toggleMute();
        this.render();
    }
}

window.SatpamView = SatpamView;
