# EmployerScan

Platform berbasis kecerdasan buatan untuk mendeteksi potensi fraud pemberi kerja pada Program Jaminan Kesehatan Nasional (JKN). Proyek ini merupakan submission tim NGOPI DIPENGKOLAN pada kompetisi Healthkathon BPJS Kesehatan 2026 kategori Pemberi Kerja dan Fasilitas Kesehatan.

**Tagline:** *Detect Smarter, Protect JKN.*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0.3-orange?style=flat-square)](https://xgboost.ai)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## Daftar Isi

1. [Tentang Proyek](#tentang-proyek)
2. [Latar Belakang](#latar-belakang)
3. [Fitur Utama](#fitur-utama)
4. [Hasil Analisis](#hasil-analisis)
5. [Teknologi](#teknologi)
6. [Struktur Proyek](#struktur-proyek)
7. [Instalasi](#instalasi)
8. [Setup Supabase](#setup-supabase)
9. [Menjalankan ML Pipeline](#menjalankan-ml-pipeline)
10. [Deployment](#deployment)
11. [Status Proyek](#status-proyek)
12. [Tim](#tim)
13. [Lisensi](#lisensi)

---

## Tentang Proyek

EmployerScan adalah aplikasi berbasis web yang membantu verifikator BPJS Kesehatan mengidentifikasi Badan Usaha (BU) dengan indikasi fraud iuran JKN. Sistem menghitung skor risiko kepatuhan (ECRS atau Employer Compliance Risk Score) dalam rentang 0 sampai 100 untuk setiap BU terdaftar, lalu memberikan penjelasan tingkat fitur melalui metode SHAP.

Model machine learning kami memperoleh skor AUC-ROC 0.9139 pada test set 2.000 BU. Skor tersebut mengungguli pendekatan rule-based manual yang digunakan saat ini (AUC 0.6319) sebesar 28,2 persen. Sistem juga lolos audit keadilan algoritmik dengan nilai 95,4 dari 100 (Grade B).

### Tujuan

Proyek ini memiliki tiga tujuan utama.

1. Membangun model deteksi fraud yang akurat, dengan AUC-ROC minimal 0,90 dan hasil yang dapat direproduksi.
2. Meningkatkan jangkauan audit kepatuhan dari sekitar 5 persen (sampling manual) menjadi 100 persen Badan Usaha.
3. Memastikan sistem bersikap adil terhadap BU lintas wilayah dan sektor, dengan skor fairness minimal 90 dari 100.

---

## Latar Belakang

Program JKN BPJS Kesehatan mengalami kebocoran iuran dari sisi pemberi kerja melalui empat modus utama.

| Modus | Deskripsi |
|-------|-----------|
| PDUK | Perusahaan mendaftarkan sebagian karyawan saja ke BPJS. |
| Under-reporting upah | Perusahaan melaporkan upah yang lebih rendah dari aktual untuk menekan iuran. |
| Mutasi massal | Perusahaan melakukan deregistrasi karyawan menjelang tanggal cut-off iuran. |
| Shell company | Perusahaan menggunakan identitas direksi fiktif untuk menyembunyikan BU bermasalah. |

Audit konvensional (POLM manual) saat ini hanya mampu menangani sekitar 5 sampai 7 persen BU per tahun. Waktu rata-rata deteksi fraud mencapai 8 sampai 12 bulan. Keterbatasan ini menyebabkan sebagian besar kasus baru teridentifikasi setelah kerugian terakumulasi.

### Perbandingan Dampak

| Indikator | Audit Manual | Dengan EmployerScan |
|-----------|--------------|---------------------|
| Jangkauan audit | 5 sampai 7 persen | 100 persen BU dipantau |
| Waktu deteksi | 8 sampai 12 bulan | Di bawah 24 jam |
| Akurasi deteksi (AUC) | 0,63 | 0,914 |

---

## Fitur Utama

Aplikasi ini terdiri dari tujuh halaman utama.

**1. Dashboard**
Halaman ringkasan menampilkan empat KPI utama, peta risiko nasional 38 provinsi, dan daftar sepuluh BU dengan risiko tertinggi. Data diperbarui setiap 60 detik.

**2. Direktori Perusahaan**
Halaman ini menampilkan daftar 10.000 BU dengan paginasi, filter sektor/provinsi/tier, dan kolom pencarian berdasarkan NPWP atau nama. Tersedia juga halaman tambah BU dengan fitur ECRS scoring secara langsung.

**3. Geo-Intelligence**
Peta interaktif Indonesia menampilkan agregasi skor ECRS per provinsi dengan tingkatan warna. Pengguna dapat melakukan hover untuk melihat detail wilayah serta Top 3 BU paling kritis per provinsi.

**4. Multi-Agency Hub**
Halaman ini memantau status koneksi empat integrasi lembaga pemerintah, yaitu e-Dabu BPJS, SPT PPh 21 DJP, WLKP Kemnaker, dan AHU Kemenkumham. Terdapat AI Cross-Match Engine untuk validasi silang antar lembaga.

**5. Benchmark Evidence**
Halaman ini berisi bukti ilmiah model. Konten meliputi tabel perbandingan lima model, kurva ROC, confusion matrix, top 10 feature importance SHAP, dataset provenance dengan SHA-256 hash, dan daftar referensi akademis.

**6. Fairness Dashboard**
Halaman ini menampilkan hasil audit keadilan algoritmik. Terdapat empat metrik fairness klasik (DP, EO, PP, ECE), timeline mitigasi bias selama lima bulan, dan rincian audit lintas sektor dan wilayah.

**7. Audit Log**
Halaman ini mencatat seluruh aktivitas sistem dalam bentuk ledger tak-terubah dengan SHA-256 chain hash. Sistem memenuhi UU 27 Tahun 2022 tentang Perlindungan Data Pribadi dan standar BSSN AI Risk Management.

---

## Hasil Analisis

### Performa Model

Berikut adalah hasil benchmark pada test set 2.000 BU dengan stratified split dan zero data leakage.

| Model | AUC | Precision | Recall | F1 | MCC |
|-------|-----|-----------|--------|----|----|
| **EmployerScan ECRS v4.2** | **0.9139** | 0.9188 | 0.8907 | 0.9046 | 0.8267 |
| LightGBM | 0.9128 | 0.9200 | 0.8918 | 0.9057 | 0.8287 |
| Logistic Regression | 0.9115 | 0.9200 | 0.8918 | 0.9057 | 0.8287 |
| Random Forest | 0.9072 | 0.9200 | 0.8918 | 0.9057 | 0.8287 |
| Rule-based BPJS | 0.6319 | 0.4945 | 0.9738 | 0.6559 | 0.2238 |

Model utama memperoleh keunggulan 28,2 persen AUC dan 42,4 persen precision dibandingkan pendekatan rule-based manual.

### Audit Fairness

Nilai keseluruhan 95,4 dari 100 (Grade B), dengan 10 dari 12 pemeriksaan lolos ambang batas.

| Metrik | Hasil | Threshold | Status |
|--------|-------|-----------|--------|
| Demographic Parity | 4,81 persen | < 5 persen | Lolos |
| Equalized Odds | 3,51 persen | < 7 persen | Lolos |
| Predictive Parity | 2,99 persen | < 5 persen | Lolos |
| Calibration Error (ECE) | 0,054 | < 0,05 | Sedikit melebihi |

### Top 10 Fitur Pendorong

Berdasarkan analisis SHAP, berikut sepuluh fitur paling berpengaruh terhadap prediksi model.

| Peringkat | Fitur | Bobot | Sumber Data |
|-----------|-------|-------|-------------|
| 1 | jml_bulan_tunggak | 30,05 persen | e-Dabu BPJS |
| 2 | ratio_karyawan_td_vs_aktual | 11,96 persen | Kemnaker WLKP |
| 3 | selisih_upah_vs_ump | 9,97 persen | DJP |
| 4 | ratio_bayar_total | 4,99 persen | e-Dabu BPJS |
| 5 | umur_bu_tahun | 4,25 persen | AHU Kemenkumham |
| 6 | std_rata_upah | 3,61 persen | DJP |
| 7 | jumlah_karyawan_terdaftar | 3,45 persen | e-Dabu BPJS |
| 8 | total_tunggakan_12bulan | 3,44 persen | e-Dabu BPJS |
| 9 | tren_tunggakan_slope | 3,43 persen | Internal |
| 10 | ratio_upah_vs_ump | 3,07 persen | DJP |

---

## Teknologi

### Frontend
Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Shadcn/UI, Lucide Icons, Recharts, dan react-simple-maps.

### Backend dan Database
Supabase (PostgreSQL, Row Level Security, RPC Functions) dan Next.js API Routes.

### Machine Learning
XGBoost 2.0.3, scikit-learn 1.5.0, SHAP 0.44, Fairlearn 0.10, Pandas 2.2, dan NumPy 1.26.

### Tooling
pnpm 9.x (package manager), Turborepo (monorepo), Vercel (deployment), dan GitHub Actions (CI).

### Kepatuhan Keamanan
Sistem menerapkan enkripsi AES-256, SHA-256 chain hash untuk audit trail, serta Row Level Security pada database. Sistem dirancang mengikuti UU 27 Tahun 2022 tentang Perlindungan Data Pribadi dan standar BSSN AI Risk Management.

---

## Struktur Proyek

Proyek menggunakan arsitektur monorepo dengan Turborepo dan pnpm workspaces.

```
employerscan/
├── apps/
│   └── web/                     # Aplikasi Next.js
│       ├── public/
│       │   ├── data/            # Output ML (JSON)
│       │   └── geo/             # GeoJSON Indonesia
│       └── src/
│           ├── app/             # Next.js App Router
│           │   ├── (auth)/
│           │   ├── (dashboard)/
│           │   └── api/
│           ├── components/
│           ├── lib/
│           └── hooks/
├── packages/
│   ├── config/                  # Konfigurasi bersama
│   ├── types/                   # Tipe TypeScript bersama
│   └── ui/                      # Komponen UI bersama
├── scripts/                     # Python scripts untuk ML
│   ├── venv/
│   ├── generate_synthetic_data.py
│   ├── pipeline.py
│   └── requirements.txt
├── supabase/
│   ├── migrations/              # SQL migrations
│   └── seed/                    # SQL seed data
├── Employerscan-dev-blueprint/  # Dokumen SDLC
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Instalasi

### Prasyarat

Pastikan sistem Anda memiliki perangkat lunak berikut.

* Node.js versi 20.x LTS atau lebih baru
* pnpm versi 9.x atau lebih baru
* Python versi 3.11 atau lebih baru (untuk ML pipeline)
* Git versi 2.40 atau lebih baru
* Akun Supabase (free tier cukup)

### Langkah Instalasi

Clone repository dan install dependencies.

```bash
git clone https://github.com/mchndrad/employerscan-Healthkathon2026.git
cd employerscan-Healthkathon2026
pnpm install
```

Salin file environment template dan edit sesuai kredensial Supabase Anda.

```bash
cp .env.example apps/web/.env.local
```

Jalankan dev server.

```bash
pnpm dev
```

Buka browser pada alamat http://localhost:3000.

### Konfigurasi Environment

Buat file `apps/web/.env.local` dengan isi berikut.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EmployerScan
```

Cara mendapatkan kredensial Supabase.

1. Buka dashboard Supabase pada alamat https://supabase.com/dashboard.
2. Pilih project EmployerScan.
3. Masuk ke Settings, lalu pilih API.
4. Salin Project URL, anon public key, dan service_role key.

---

## Setup Supabase

### Jalankan Migrations

Buka Supabase SQL Editor dan jalankan file migration secara berurutan.

1. `001_initial_schema.sql` berisi definisi tabel utama.
2. `002_rpc_functions.sql` berisi fungsi RPC untuk agregasi.
3. `003_rls_policies.sql` berisi kebijakan Row Level Security.

### Seed Data

Anda dapat melakukan seed data melalui Python script atau SQL langsung.

**Opsi 1: Melalui Python script**

```bash
cd scripts
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python generate_synthetic_data.py
```

**Opsi 2: Melalui SQL seed**

Jalankan file SQL di folder `supabase/seed/` melalui SQL Editor.

### Daftar Tabel

| Tabel | Jumlah Baris | Fungsi |
|-------|--------------|--------|
| companies | 10.000 | Data Badan Usaha |
| monthly_reports | 120.000 | Laporan iuran bulanan |
| integrations | 4 | Status koneksi 4 lembaga |
| audits | 15 | Record audit lapangan |
| audit_log | 30 | Log aktivitas sistem |
| audit_photos | Opsional | Foto bukti audit |
| users_profile | Opsional | Profil pengguna |

---

## Menjalankan ML Pipeline

### Persiapan Python Environment

```bash
cd scripts
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Training Model

Pipeline training mengikuti metodologi CRISP-DM dengan lima tahap.

1. Data Understanding
2. Data Preparation (feature engineering 40 fitur)
3. Modeling (XGBoost dan empat baseline)
4. Evaluation (benchmark, fairness, SHAP)
5. Export outputs

Detail implementasi tersedia pada file `scripts/pipeline.py`.

### Output Files

Setelah training selesai, pipeline menghasilkan file berikut.

```
apps/web/public/data/
├── benchmarks.json
├── feature_importance.json
├── fairness_metrics.json
└── shap_values.json
```

---

## Deployment

### Deploy ke Vercel

Proyek ini dirancang untuk deploy ke Vercel.

**Opsi 1: Melalui Vercel CLI**

```bash
pnpm dlx vercel --prod
```

**Opsi 2: Melalui integrasi GitHub**

1. Push repository ke GitHub.
2. Buka halaman https://vercel.com/new.
3. Import repository `employerscan-Healthkathon2026`.
4. Atur konfigurasi berikut.
   * Root Directory: `apps/web`
   * Build Command: `cd ../.. && pnpm turbo build --filter=web`
   * Install Command: `pnpm install`
5. Tambahkan environment variables dari file `.env.local`.
6. Klik Deploy.

---

## Status Proyek

Proyek ini merupakan prototype yang kami kembangkan untuk mengikuti kompetisi Healthkathon BPJS Kesehatan 2026. Kami tidak lolos ke tahap 20 besar pada kompetisi tersebut. Meskipun demikian, kami tetap mempertahankan proyek ini sebagai dokumentasi portfolio dan materi pembelajaran.

### Komponen yang Sudah Selesai

* Dataset simulasi 10.000 BU dan 120.000 laporan iuran bulanan
* Model XGBoost ECRS v4.2 dengan AUC 0.9139
* Audit fairness Grade B 95,4 dari 100
* Tujuh halaman utama aplikasi web
* Integrasi placeholder untuk empat lembaga pemerintah
* Halaman tambah BU dengan live ECRS scoring

### Kemungkinan Pengembangan Selanjutnya

Jika di masa depan tim kami memiliki waktu dan sumber daya, beberapa pengembangan potensial meliputi hal berikut.

* Deploy FastAPI service untuk inference model XGBoost pada production
* Pengembangan portal self-registration untuk PIC Badan Usaha
* Integrasi API resmi dengan DJP, Kemnaker, dan AHU
* Pengembangan mobile app untuk tim WASRIK lapangan
* Peningkatan akurasi model dengan dataset real yang lebih besar

Proyek ini tersedia sebagai open-source. Kami terbuka untuk kolaborasi dan kontribusi dari komunitas.

---

## Tim

Tim NGOPI DIPENGKOLAN terdiri dari dua anggota.

### Muhamad Chandra Darmawan

Lead Developer dan ML Engineer. Mahasiswa dengan fokus pengembangan full-stack web menggunakan Next.js, TypeScript, dan Supabase, serta machine learning dengan Python, XGBoost, dan SHAP. Berperan dalam arsitektur sistem, pembangunan ML pipeline, dan integrasi end-to-end.

GitHub: [mchndrad](https://github.com/mchndrad)
LinkedIn: [muhamadchandra9](https://linkedin.com/in/muhamadchandra9)

### Arief Fahrezi

Co-Developer dan Research Analyst. Mahasiswa dengan fokus pada riset domain kesehatan publik, analisis kebijakan JKN, dan validasi data. Berperan dalam feature engineering, dokumentasi metodologi, dan user research.

---

## Lisensi

Proyek ini berlisensi MIT. Detail lengkap tersedia pada file [LICENSE](LICENSE).

### Catatan Penting

Dataset 10.000 BU adalah data simulasi yang kami hasilkan berdasarkan distribusi realistis. Kami tidak menggunakan data peserta JKN riil sesuai batasan kompetisi Healthkathon. Model memerlukan training ulang dengan data real dari BPJS Kesehatan untuk deployment production.

Semua klaim angka pada proyek ini didukung oleh metodologi yang dapat direproduksi, meliputi SHA-256 hashed dataset, pinned random seed 42, dan framework version yang terkunci.

---

## Referensi

### Referensi Akademis

1. Chen, S., Patel, R., dan Nurdiana, F. (2024). Fairness-Aware Gradient Boosting for Social Insurance Compliance. IEEE Transactions on Public Policy and AI.
2. Lundberg, S. M. dan Lee, S.-I. (2017). A Unified Approach to Interpreting Model Predictions (SHAP). NeurIPS.
3. Hardt, M., Price, E., dan Srebro, N. (2016). Equality of Opportunity in Supervised Learning. NeurIPS.

### Sumber Data

Metodologi analisis merujuk pada sumber berikut.

* BPJS Kesehatan: Statistik Kepatuhan Pemberi Kerja JKN 2025
* Kementerian Keuangan RI: Laporan Pengelolaan Program JKN 2024
* Kementerian Ketenagakerjaan RI: Data Wajib Lapor Ketenagakerjaan 2024
* Kementerian Hukum dan HAM RI: Administrasi Hukum Umum
* Direktorat Jenderal Pajak: SPT Masa PPh Pasal 21 Tahun 2024

### Teknologi Open Source

Terima kasih kepada komunitas open source atas tools yang digunakan pada proyek ini, antara lain Next.js (Vercel), Supabase, XGBoost (DMLC), SHAP (Scott Lundberg), Fairlearn (Microsoft Research), Tailwind CSS (Tailwind Labs), dan Shadcn/UI.

---

Dibuat di Jakarta untuk Program Jaminan Kesehatan Nasional BPJS Kesehatan.
