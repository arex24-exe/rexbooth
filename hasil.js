// ==========================================
// 1. MENGAMBIL GAMBAR DARI LOCAL STORAGE
// ==========================================

// Buka ransel dan cari item 'hasilFotoFinal'
const fotoDariCapture = localStorage.getItem('hasilFotoFinal');
const elemenGambar = document.getElementById('final-image');

// Kalau datanya ada, ganti sumber gambar dengan yang baru
if (fotoDariCapture) {
    elemenGambar.src = fotoDariCapture;
} else {
    // SISTEM PENGAMAN: Kalau tidak ada data (user langsung buka hasil.html)
    console.log("Tidak ada foto yang ditemukan di memori.");
    elemenGambar.src = "Tampilan Hasil Frame A.png"; // Gambar default cadangan
}

// ==========================================
// 2. FUNGSI TOMBOL DOWNLOAD (SAVE TO GALLERY)
// ==========================================

const btnSave = document.getElementById('btn-save');

btnSave.addEventListener('click', function() {
    // Hanya bisa download kalau fotonya benar-benar ada
    if (fotoDariCapture) {
        // Buat elemen link <a> rahasia
        const linkDownload = document.createElement('a');
        linkDownload.href = fotoDariCapture;
        
        // Beri nama file otomatis
        const timestamp = new Date().getTime();
        linkDownload.download = `MyPhotobooth_${timestamp}.png`;
        
        // Pura-pura klik link tersebut untuk memicu download
        document.body.appendChild(linkDownload);
        linkDownload.click();
        document.body.removeChild(linkDownload);
    } else {
        alert("Oops! Tidak ada gambar untuk disimpan.");
    }
});

// ==========================================
// 3. FUNGSI TOMBOL HOME
// ==========================================

const btnHome = document.getElementById('btn-home');

btnHome.addEventListener('click', function() {
    // Hapus memori foto supaya tidak menumpuk
    localStorage.removeItem('hasilFotoFinal'); 
    
    // Kembali ke halaman utama (sesuaikan nama file halaman utamamu)
    window.location.href = 'index.html'; 
});

// ==========================================
// 4. FUNGSI TOMBOL SEND TO EMAIL (CUSTOM MODAL)
// ==========================================
const btnEmail = document.getElementById('btn-email');
const emailModal = document.getElementById('email-modal');
const btnCancelEmail = document.getElementById('btn-cancel-email');
const btnSendEmail = document.getElementById('btn-send-email');
const emailInput = document.getElementById('email-input');

// Menampilkan Pop-up saat tombol 'Send to Email' diklik
btnEmail.addEventListener('click', function() {
    emailModal.classList.add('show');
    emailInput.focus(); // Langsung aktifkan kursor di kolom ketik
});

// Menyembunyikan Pop-up saat tombol 'Batal' diklik
btnCancelEmail.addEventListener('click', function() {
    emailModal.classList.remove('show');
    emailInput.value = ''; // Kosongkan inputan
});

// Menjalankan fungsi kirim email saat tombol 'Kirim' diklik
btnSendEmail.addEventListener('click', function() {
    const emailTujuan = emailInput.value.trim();
    
    // Cek apakah email kosong atau tidak ada huruf '@'
    if (emailTujuan === "" || !emailTujuan.includes("@")) {
        alert("Tolong masukkan alamat email yang valid ya!");
        return; 
    }
    
    const subject = "Hasil Foto Photobooth Keren Kamu!";
    const body = "Halo!\n\nTerima kasih sudah menggunakan Photobooth kami.\n\nPENTING: Jangan lupa klik ikon 'Attachment / Lampirkan (klip kertas)' dan pilih foto yang baru saja kamu download dari tombol Save to Gallery ya!";
    
    // Tutup pop-up
    emailModal.classList.remove('show');
    emailInput.value = '';
    
    // Buka aplikasi email
    window.location.href = `mailto:${emailTujuan}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});