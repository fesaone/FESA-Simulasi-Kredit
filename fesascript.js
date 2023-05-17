var range = document.getElementById('uangMuka');
range.addEventListener('input', function () {
  var value = (range.value - range.min) / (range.max - range.min);
  range.style.background =
    'linear-gradient(to right, red 0%, red ' +
    value * 100 +
    '%, #f2f2f2 ' +
    value * 100 +
    '%, #f2f2f2 100%)';
});

let kendaraan = [];

fetch('#')
  .then(response => response.json())
  .then(data => {
    kendaraan = data.kendaraan;

    // Ini akan memanggil fungsi setelah data telah dimuat
    initializeApplication();
  })
  .catch(error => console.error('Error:', error));

// Kode lainnya tetap sama seperti sebelumnya

const jenisKendaraan = document.getElementById('jenisKendaraan');
const warna = document.getElementById('warna');
const uangMuka = document.getElementById('uangMuka');
const periodeAngsuran = document.getElementById('periodeAngsuran');
const simulasiForm = document.getElementById('simulasiForm');
const hasilSimulasi = document.getElementById('hasilSimulasi');
const uangMukaValue = document.getElementById('uangMukaValue');

// Fungsi untuk mengubah tampilan angka uang muka (DP)
function updateUangMukaValue() {
  uangMukaValue.textContent = `${uangMuka.value}%`;
}

// Menangani perubahan uang muka (DP)
uangMuka.addEventListener('input', updateUangMukaValue);

// Fungsi untuk menghitung simulasi
function hitungSimulasi(e) {
  e.preventDefault();

  const indexKendaraan = jenisKendaraan.value;
  const indexWarna = warna.value;
  const kendaraanTerpilih = kendaraan[indexKendaraan];
  const warnaTerpilih = kendaraanTerpilih.warna[indexWarna];

  const hargaAsli = warnaTerpilih.harga;
  const periode = parseInt(periodeAngsuran.value);
  const dp = parseInt(uangMuka.value) / 100;

  // DP 10% Rp 2.897.000,00
  const TotalUangMUKA = hargaAsli * dp;

  const pokokBULAN = hargaAsli / periode;
  let bungaMultiplier;

  switch (periode) {
    case 12:
      bungaMultiplier = 1.0;
      break;
    case 24:
      bungaMultiplier = 2.0;
      break;
    case 36:
      bungaMultiplier = 3.0;
      break;
    default:
      bungaMultiplier = 1.0;
  }

  const bungaBULAN = pokokBULAN * dp * bungaMultiplier;
  // Rp 2.414.166,67 Juta
  const AngsuranPokokperBULAN = pokokBULAN;
  // Rp 241.416,67 Ribu
  const AngsuranBungaperBULAN =
    (bungaMultiplier * bungaBULAN) / bungaMultiplier;

  const cicilan = AngsuranPokokperBULAN + AngsuranBungaperBULAN;
  const tahunTOTAL = cicilan * periode;

  // Tampilkan hasil simulasi
  hasilSimulasi.classList.remove('hidden');
  document.getElementById('gambarKendaraan').src = warnaTerpilih.gambar;
  document.getElementById('namaKendaraan').textContent = kendaraanTerpilih.nama;
  document.getElementById('warnaKendaraan').textContent = warnaTerpilih.warna;
  document.getElementById(
    'hargaAsli'
  ).textContent = `Rp ${warnaTerpilih.harga.toLocaleString()}`;
  document.getElementById('tenorCicilan').textContent = `${periode} Bulan`;

  document.getElementById(
    'AngsuranBungaperBULAN'
  ).textContent = `Rp ${AngsuranBungaperBULAN.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  document.getElementById(
    'TotalUangMUKA'
  ).textContent = `Rp ${TotalUangMUKA.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  document.getElementById(
    'AngsuranPokokperBULAN'
  ).textContent = `Rp ${AngsuranPokokperBULAN.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  document.getElementById(
    'cicilanPerBulan'
  ).textContent = `Rp ${cicilan.toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  document.getElementById('dpPersentase').textContent = `${(dp * 100).toFixed(
    0
  )}%`;

  document.getElementById(
    'tahunTOTAL'
  ).textContent = `Rp ${tahunTOTAL.toLocaleString()}`;
}

function initializeApplication() {
  // Fungsi untuk mengisi dropdown kendaraan
  function populateKendaraanDropdown() {
    kendaraan.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = item.nama;
      jenisKendaraan.appendChild(option);
    });
  }

  // Fungsi untuk mengisi dropdown warna
  function populateWarnaDropdown() {
    const indexKendaraan = jenisKendaraan.value;
    const warnaKendaraan = kendaraan[indexKendaraan].warna;

    // Hapus opsi sebelumnya dan isi dengan opsi baru
    warna.innerHTML = '<option value="" disabled selected>Pilih Warna</option>';
    warnaKendaraan.forEach((item, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = item.warna;
      warna.appendChild(option);
    });
  }

  // Memanggil fungsi untuk mengisi dropdown
  populateKendaraanDropdown();
  jenisKendaraan.addEventListener('change', () => {
    populateWarnaDropdown();
  });

  // Menangani perubahan jenis kendaraan
  jenisKendaraan.addEventListener('change', () => {
    populateWarnaDropdown();
  });

  // Menangani submit form
  simulasiForm.addEventListener('submit', hitungSimulasi);

  // Menambahkan event listener pada tombol submit
  simulasiForm.addEventListener('submit', function (event) {
    // Mencegah form untuk melakukan refresh halaman
    event.preventDefault();

    // Menampilkan bagian hasil simulasi
    hasilSimulasi.classList.remove('hidden');

    // Mengambil offsetTop dari elemen hasilSimulasi
    const hasilSimulasiTop = hasilSimulasi.offsetTop;

    // Melakukan scroll halus ke elemen hasilSimulasi
    window.scrollTo({
      top: hasilSimulasiTop,
      behavior: 'smooth',
    });
  });
}
