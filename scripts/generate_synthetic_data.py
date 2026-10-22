"""
EmployerScan - Synthetic Data Generator v4.1 (GUARANTEED 38 PROVINSI)
Generate 500 companies × 12 months = 6,000 realistic records
Coverage: SELURUH 38 PROVINSI INDONESIA (100% nationwide, GUARANTEED)

Alignment with BPJS Guidelines (workshop 20 Okt 2026):
- Process Mapping: C02 Kolektibilitas (BEA)
- AI Technique: Klasifikasi + Propensity (Peta Peluang AI/ML BPJS)
- Data Principle: Sintetis/Sandbox (UU PDP 27/2022 compliant)
- Target population: 377 ribu Badan Usaha terdaftar BPJS (official 2026)
- Library: Faker (id_ID) + Python random

v4.1 Changes:
- GUARANTEED COVERAGE: Stage 1 ensures every province has >=1 company
- Weighted distribution for remaining companies (realistic Indonesia demography)
"""

import os
import random
from datetime import datetime
from collections import Counter
from faker import Faker
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
fake = Faker('id_ID')
random.seed(42)

BENTUK_BADAN = ['PT', 'CV', 'UD', 'Yayasan', 'Firma', 'Koperasi']
SEKTOR_USAHA = [
    'Logistik & Transportasi', 'Manufaktur Tekstil', 'Makanan & Minuman',
    'Konstruksi', 'Perdagangan Retail', 'Teknologi Informasi',
    'Jasa Keuangan', 'Kesehatan', 'Pendidikan', 'Pariwisata & Perhotelan',
    'Agribisnis', 'Properti', 'Media & Kreatif', 'Pertambangan', 'Energi'
]

# ======================================================================
# SELURUH 38 PROVINSI INDONESIA (weighted distribution for 500 companies)
# Format: (provinsi, kota, kecamatan, lat, long, weight)
# ======================================================================
INDONESIA_LOCATIONS = [
    # ========== JAWA ==========
    ('DKI Jakarta', 'Jakarta Pusat', 'Gambir', -6.1700, 106.8300, 100),
    ('DKI Jakarta', 'Jakarta Pusat', 'Menteng', -6.1950, 106.8300, 100),
    ('DKI Jakarta', 'Jakarta Selatan', 'Setiabudi', -6.2100, 106.8300, 100),
    ('DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', -6.2400, 106.8000, 100),
    ('DKI Jakarta', 'Jakarta Barat', 'Kebon Jeruk', -6.1900, 106.7700, 100),
    ('DKI Jakarta', 'Jakarta Timur', 'Pulogadung', -6.1850, 106.9000, 100),
    ('DKI Jakarta', 'Jakarta Utara', 'Kelapa Gading', -6.1550, 106.9100, 100),
    ('Jawa Barat', 'Bandung', 'Bandung Wetan', -6.9100, 107.6100, 75),
    ('Jawa Barat', 'Bandung', 'Coblong', -6.8880, 107.6100, 75),
    ('Jawa Barat', 'Bekasi', 'Bekasi Selatan', -6.2383, 107.0010, 75),
    ('Jawa Barat', 'Bekasi', 'Cikarang Pusat', -6.2600, 107.1500, 75),
    ('Jawa Barat', 'Bogor', 'Bogor Tengah', -6.5950, 106.7900, 75),
    ('Jawa Barat', 'Depok', 'Beji', -6.3800, 106.8300, 75),
    ('Jawa Barat', 'Cimahi', 'Cimahi Tengah', -6.8750, 107.5420, 75),
    ('Jawa Tengah', 'Semarang', 'Semarang Tengah', -6.9900, 110.4200, 40),
    ('Jawa Tengah', 'Semarang', 'Candisari', -7.0130, 110.4320, 40),
    ('Jawa Tengah', 'Surakarta', 'Serengan', -7.5750, 110.8200, 40),
    ('Jawa Tengah', 'Magelang', 'Magelang Utara', -7.4700, 110.2200, 40),
    ('Jawa Timur', 'Surabaya', 'Genteng', -7.2500, 112.7500, 40),
    ('Jawa Timur', 'Surabaya', 'Rungkut', -7.3250, 112.7900, 40),
    ('Jawa Timur', 'Malang', 'Klojen', -7.9800, 112.6300, 40),
    ('Jawa Timur', 'Sidoarjo', 'Sidoarjo', -7.4500, 112.7200, 40),
    ('Banten', 'Tangerang', 'Tangerang', -6.1783, 106.6319, 30),
    ('Banten', 'Tangerang Selatan', 'Serpong', -6.2820, 106.6700, 30),
    ('Banten', 'Serang', 'Serang', -6.1200, 106.1500, 30),
    ('Banten', 'Cilegon', 'Cilegon', -6.0100, 106.0540, 30),
    ('DI Yogyakarta', 'Yogyakarta', 'Gondokusuman', -7.7800, 110.3900, 15),
    ('DI Yogyakarta', 'Sleman', 'Depok', -7.7600, 110.4100, 15),

    # ========== SUMATERA ==========
    ('Sumatera Utara', 'Medan', 'Medan Petisah', 3.5800, 98.6700, 20),
    ('Sumatera Utara', 'Medan', 'Medan Baru', 3.5700, 98.6600, 20),
    ('Sumatera Selatan', 'Palembang', 'Ilir Barat I', -2.9800, 104.7300, 12),
    ('Riau', 'Pekanbaru', 'Sukajadi', 0.5400, 101.4400, 10),
    ('Lampung', 'Bandar Lampung', 'Tanjung Karang Pusat', -5.4300, 105.2700, 8),
    ('Sumatera Barat', 'Padang', 'Padang Barat', -0.9400, 100.3600, 7),
    ('Aceh', 'Banda Aceh', 'Baiturrahman', 5.5500, 95.3200, 5),
    ('Jambi', 'Jambi', 'Pasar Jambi', -1.6100, 103.6100, 4),
    ('Kepulauan Riau', 'Batam', 'Lubuk Baja', 1.1300, 104.0500, 4),
    ('Bengkulu', 'Bengkulu', 'Teluk Segara', -3.8000, 102.2500, 3),
    ('Kepulauan Bangka Belitung', 'Pangkal Pinang', 'Taman Sari', -2.1300, 106.1100, 2),

    # ========== KALIMANTAN ==========
    ('Kalimantan Timur', 'Balikpapan', 'Balikpapan Selatan', -1.2680, 116.8290, 7),
    ('Kalimantan Timur', 'Samarinda', 'Samarinda Ulu', -0.4950, 117.1430, 5),
    ('Kalimantan Selatan', 'Banjarmasin', 'Banjarmasin Tengah', -3.3200, 114.5900, 10),
    ('Kalimantan Barat', 'Pontianak', 'Pontianak Kota', -0.0260, 109.3420, 8),
    ('Kalimantan Tengah', 'Palangka Raya', 'Pahandut', -2.2100, 113.9100, 5),
    ('Kalimantan Utara', 'Tarakan', 'Tarakan Barat', 3.3050, 117.6200, 5),

    # ========== SULAWESI ==========
    ('Sulawesi Selatan', 'Makassar', 'Panakkukang', -5.1500, 119.4400, 18),
    ('Sulawesi Utara', 'Manado', 'Wenang', 1.4890, 124.8420, 7),
    ('Sulawesi Tengah', 'Palu', 'Palu Barat', -0.8900, 119.8500, 5),
    ('Sulawesi Tenggara', 'Kendari', 'Mandonga', -3.9900, 122.5100, 5),
    ('Sulawesi Barat', 'Mamuju', 'Mamuju', -2.6800, 118.8900, 3),
    ('Gorontalo', 'Gorontalo', 'Kota Tengah', 0.5400, 123.0600, 2),

    # ========== BALI & NUSA TENGGARA ==========
    ('Bali', 'Denpasar', 'Denpasar Barat', -8.6700, 115.2000, 14),
    ('Nusa Tenggara Barat', 'Mataram', 'Cakranegara', -8.5800, 116.1200, 6),
    ('Nusa Tenggara Timur', 'Kupang', 'Kota Kupang', -10.1800, 123.5800, 5),

    # ========== MALUKU & PAPUA ==========
    ('Maluku', 'Ambon', 'Nusaniwe', -3.6900, 128.1800, 4),
    ('Maluku Utara', 'Ternate', 'Ternate Tengah', 0.7900, 127.3800, 3),
    ('Papua', 'Jayapura', 'Jayapura Utara', -2.5300, 140.7000, 4),
    ('Papua Barat', 'Manokwari', 'Manokwari Barat', -0.8600, 134.0600, 3),
    ('Papua Selatan', 'Merauke', 'Merauke', -8.4900, 140.4000, 2),
    ('Papua Tengah', 'Nabire', 'Nabire', -3.3700, 135.4900, 2),
    ('Papua Pegunungan', 'Wamena', 'Wamena', -4.0900, 138.9500, 1),
    ('Papua Barat Daya', 'Sorong', 'Sorong Timur', -0.8700, 131.2600, 1),
]

PREFIXES = ['Nusantara', 'Sumber', 'Mitra', 'Graha', 'Karya', 'Jaya', 'Sentosa',
            'Mandiri', 'Berkah', 'Cahaya', 'Harapan', 'Prima', 'Sejahtera',
            'Makmur', 'Abadi', 'Lestari', 'Mulia', 'Amanah', 'Agung', 'Arta',
            'Bintang', 'Dharma', 'Eka', 'Gemilang', 'Insan', 'Kencana']

SUFFIXES = ['Megah', 'Perkasa', 'Utama', 'Indonesia', 'Nusantara', 'Group',
            'Internasional', 'Tbk', 'Mandiri', 'Bersama', 'Sejahtera', 'Jaya',
            'Prima', 'Sentosa', 'Global', 'Pratama', 'Lestari', 'Makmur',
            'Raya', 'Persada', 'Sentral', 'Nasional']

# UMP per 38 Provinsi 2026 (estimasi berdasarkan trend 2025 + inflasi 5%)
UMP_MAP = {
    'DKI Jakarta': 5_500_000, 'Jawa Barat': 4_500_000, 'Jawa Tengah': 2_500_000,
    'Jawa Timur': 2_800_000, 'Banten': 4_800_000, 'DI Yogyakarta': 2_300_000,
    'Sumatera Utara': 3_200_000, 'Sumatera Selatan': 3_600_000, 'Riau': 3_800_000,
    'Lampung': 2_900_000, 'Sumatera Barat': 2_900_000, 'Aceh': 3_600_000,
    'Jambi': 3_300_000, 'Kepulauan Riau': 3_900_000, 'Bengkulu': 2_600_000,
    'Kepulauan Bangka Belitung': 3_500_000,
    'Kalimantan Timur': 3_600_000, 'Kalimantan Selatan': 3_500_000,
    'Kalimantan Barat': 2_700_000, 'Kalimantan Tengah': 3_600_000,
    'Kalimantan Utara': 3_500_000,
    'Sulawesi Selatan': 3_650_000, 'Sulawesi Utara': 3_770_000,
    'Sulawesi Tengah': 2_900_000, 'Sulawesi Tenggara': 3_200_000,
    'Sulawesi Barat': 2_900_000, 'Gorontalo': 3_100_000,
    'Bali': 2_900_000, 'Nusa Tenggara Barat': 2_500_000,
    'Nusa Tenggara Timur': 2_200_000,
    'Maluku': 3_000_000, 'Maluku Utara': 3_200_000,
    'Papua': 4_200_000, 'Papua Barat': 3_600_000,
    'Papua Selatan': 4_100_000, 'Papua Tengah': 4_000_000,
    'Papua Pegunungan': 4_000_000, 'Papua Barat Daya': 4_100_000,
}


def generate_npwp():
    digits = ''.join([str(random.randint(0, 9)) for _ in range(15)])
    return f"{digits[0:2]}.{digits[2:5]}.{digits[5:8]}.{digits[8]}-{digits[9:12]}.{digits[12:15]}"


def generate_company_name(sektor):
    prefix = random.choice(PREFIXES)
    suffix = random.choice(SUFFIXES)
    sektor_word = sektor.split()[0]
    return f"{prefix} {sektor_word} {suffix}"


def generate_company_from_location(loc, ecrs_tier_target):
    """Generate company dari lokasi spesifik - untuk guaranteed coverage."""
    provinsi, kota, kecamatan, lat_base, long_base, _ = loc
    sektor = random.choice(SEKTOR_USAHA)

    if ecrs_tier_target == 'KRITIS':
        ecrs_score = random.randint(80, 100)
    elif ecrs_tier_target == 'TINGGI':
        ecrs_score = random.randint(60, 79)
    elif ecrs_tier_target == 'SEDANG':
        ecrs_score = random.randint(40, 59)
    else:
        ecrs_score = random.randint(0, 39)

    jumlah_karyawan_terdaftar = random.randint(20, 2000)
    if ecrs_tier_target in ['KRITIS', 'TINGGI']:
        jumlah_karyawan_aktual = int(jumlah_karyawan_terdaftar * random.uniform(1.3, 2.5))
    else:
        jumlah_karyawan_aktual = int(jumlah_karyawan_terdaftar * random.uniform(1.0, 1.1))

    return {
        'npwp': generate_npwp(),
        'nama': f"PT {generate_company_name(sektor)}",
        'bentuk_badan': random.choice(BENTUK_BADAN),
        'alamat': fake.street_address(),
        'kota': kota, 'provinsi': provinsi,
        'kelurahan': fake.street_name().replace('Jalan ', '').replace('Gang ', ''),
        'kecamatan': kecamatan,
        'lat': round(lat_base + random.uniform(-0.02, 0.02), 8),
        'long': round(long_base + random.uniform(-0.02, 0.02), 8),
        'sektor_usaha': sektor,
        'tanggal_berdiri': fake.date_between(start_date='-20y', end_date='-1y').isoformat(),
        'pic_name': fake.name(),
        'pic_phone': fake.phone_number(),
        'pic_email': fake.email(),
        'jumlah_karyawan_terdaftar': jumlah_karyawan_terdaftar,
        'jumlah_karyawan_aktual': jumlah_karyawan_aktual,
        'ecrs_score': ecrs_score,
        'ecrs_last_computed_at': datetime.now().isoformat(),
        'status': 'AKTIF',
    }


def generate_monthly_report(company_id, company, tahun, bulan):
    karyawan_dilaporkan = company['jumlah_karyawan_terdaftar']
    ump = UMP_MAP.get(company['provinsi'], 3_500_000)

    if company['ecrs_score'] >= 60:
        rata_upah = int(ump * random.uniform(0.6, 0.9))
    else:
        rata_upah = int(ump * random.uniform(0.95, 1.3))

    total_upah = karyawan_dilaporkan * rata_upah
    iuran_wajib = int(total_upah * 0.05)

    if company['ecrs_score'] >= 60:
        iuran_dibayar = int(iuran_wajib * random.uniform(0.3, 0.7))
        status_bayar = 'SEBAGIAN' if iuran_dibayar > 0 else 'TUNGGAK'
    else:
        iuran_dibayar = int(iuran_wajib * random.uniform(0.95, 1.0))
        status_bayar = 'LUNAS'

    tunggakan = max(0, iuran_wajib - iuran_dibayar)
    anomaly_flag = company['ecrs_score'] >= 70 and random.random() > 0.3
    anomaly_reason = None
    if anomaly_flag:
        anomaly_reason = random.choice([
            'Selisih upah dilaporkan vs upah aktual signifikan',
            'Jumlah karyawan dilaporkan jauh lebih rendah dari data WLKP',
            'Pola pembayaran tidak konsisten',
            'Tunggakan iuran > 3 bulan',
            'Discrepancy dengan SPT PPh 21 DJP',
        ])

    return {
        'company_id': company_id, 'tahun': tahun, 'bulan': bulan,
        'jumlah_karyawan_dilaporkan': karyawan_dilaporkan,
        'total_upah_dilaporkan': total_upah,
        'rata_upah_dilaporkan': rata_upah,
        'iuran_jkn_dibayar': iuran_dibayar,
        'iuran_jkn_wajib': iuran_wajib,
        'tunggakan': tunggakan, 'status_bayar': status_bayar,
        'tanggal_lapor': f"{tahun}-{bulan:02d}-15",
        'source': 'E_DABU',
        'anomaly_flag': anomaly_flag, 'anomaly_reason': anomaly_reason,
    }


def main():
    print("=" * 70)
    print("EmployerScan - Synthetic Data Generator v4.1 (GUARANTEED 38 PROVINSI)")
    print("Coverage: SELURUH 38 PROVINSI INDONESIA (100% nationwide, GUARANTEED)")
    print("Alignment: BPJS Peta Peluang AI/ML C02 Kolektibilitas")
    print("Target population: 377 ribu Badan Usaha terdaftar BPJS")
    print("=" * 70)

    # ====================================================================
    # TIER DISTRIBUTION (500 companies)
    # ====================================================================
    tier_distribution = (
        ['RENDAH'] * 125 + ['SEDANG'] * 150 +
        ['TINGGI'] * 150 + ['KRITIS'] * 75
    )
    random.shuffle(tier_distribution)

    print(f"\n[1/4] Generating {len(tier_distribution)} companies (GUARANTEED 38 PROVINSI)...")

    # ====================================================================
    # STAGE 1: GUARANTEED COVERAGE - minimum 1 company per province
    # ====================================================================
    unique_provinces = sorted(set(loc[0] for loc in INDONESIA_LOCATIONS))
    companies = []
    tier_idx = 0

    print(f"   Stage 1: Guaranteed coverage ({len(unique_provinces)} provinsi, 1 base each)...")
    for provinsi in unique_provinces:
        locs_in_prov = [loc for loc in INDONESIA_LOCATIONS if loc[0] == provinsi]
        chosen_loc = random.choice(locs_in_prov)
        company = generate_company_from_location(chosen_loc, tier_distribution[tier_idx])
        companies.append(company)
        tier_idx += 1

    # ====================================================================
    # STAGE 2: WEIGHTED DISTRIBUTION - remaining companies
    # ====================================================================
    remaining = 500 - len(companies)
    print(f"   Stage 2: Weighted distribution ({remaining} companies)...")
    for i in range(remaining):
        tier = tier_distribution[tier_idx + i]
        loc = random.choices(INDONESIA_LOCATIONS,
                             weights=[l[5] for l in INDONESIA_LOCATIONS], k=1)[0]
        companies.append(generate_company_from_location(loc, tier))

    random.shuffle(companies)

    # ====================================================================
    # SHOW DISTRIBUTION
    # ====================================================================
    prov_count = Counter(c['provinsi'] for c in companies)
    print(f"\nDistribution per Provinsi ({len(prov_count)} provinsi):")
    for prov, count in sorted(prov_count.items(), key=lambda x: -x[1]):
        print(f"   - {prov}: {count} ({count/len(companies)*100:.1f}%)")

    print(f"\n[2/4] Inserting companies to Supabase (batches of 100)...")
    inserted_companies = []
    for i in range(0, len(companies), 100):
        batch = companies[i:i+100]
        response = supabase.table('companies').insert(batch).execute()
        inserted_companies.extend(response.data)
        print(f"   OK Inserted {len(inserted_companies)}/{len(companies)}")

    print(f"\n[3/4] Generating monthly reports (12 months x {len(inserted_companies)} companies)...")
    reports = []
    for company_row in inserted_companies:
        original = next(c for c in companies if c['npwp'] == company_row['npwp'])
        for bulan in range(1, 13):
            reports.append(generate_monthly_report(
                company_id=company_row['id'],
                company=original, tahun=2026, bulan=bulan
            ))

    print(f"   Inserting {len(reports)} monthly reports (batches of 500)...")
    for i in range(0, len(reports), 500):
        batch = reports[i:i+500]
        supabase.table('monthly_reports').insert(batch).execute()
        print(f"   OK Inserted {i + len(batch)}/{len(reports)}")

    print(f"\n[4/4] Setting up 4 external integrations (Multi-Agency Hub)...")
    integrations = [
        {'source': 'E_DABU', 'display_name': 'e-Dabu BPJS Kesehatan',
         'endpoint_url': 'https://edabu.bpjs-kesehatan.go.id/api/v1',
         'status': 'CONNECTED', 'last_sync_at': datetime.now().isoformat(),
         'rate_limit_current': 234, 'rate_limit_max': 1000},
        {'source': 'DJP_SPT_PPH21', 'display_name': 'DJP SPT PPh 21',
         'endpoint_url': 'https://djp.pajak.go.id/api/spt-pph21',
         'status': 'CONNECTED', 'last_sync_at': datetime.now().isoformat(),
         'rate_limit_current': 456, 'rate_limit_max': 1000},
        {'source': 'WLKP_KEMNAKER', 'display_name': 'WLKP Kemnaker',
         'endpoint_url': 'https://wlkp.kemnaker.go.id/api',
         'status': 'RATE_LIMITED', 'last_sync_at': datetime.now().isoformat(),
         'rate_limit_current': 870, 'rate_limit_max': 1000},
        {'source': 'AHU_KEMENKUMHAM', 'display_name': 'AHU Kemenkumham',
         'endpoint_url': 'https://ahu.go.id/api',
         'status': 'CONNECTED', 'last_sync_at': datetime.now().isoformat(),
         'rate_limit_current': 123, 'rate_limit_max': 1000},
    ]
    supabase.table('integrations').insert(integrations).execute()
    print(f"   OK Inserted 4 integrations")

    print("\n" + "=" * 70)
    print("SEEDING COMPLETE!")
    print(f"   - {len(inserted_companies)} companies (38 PROVINSI INDONESIA)")
    print(f"   - {len(reports)} monthly reports (2026 full year)")
    print(f"   - 4 Multi-Agency integrations")
    print("=" * 70)


if __name__ == "__main__":
    main()