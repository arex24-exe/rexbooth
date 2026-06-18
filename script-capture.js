// ==========================================
// 1. MEMBONGKAR "TAS RANSEL" (LOCAL STORAGE)
// ==========================================
const tema = localStorage.getItem('temaPilihan');
const layout = localStorage.getItem('layoutPilihan');

const frameOverlay = document.getElementById('selected-frame-overlay');
const counterTeks = document.getElementById('photo-counter');
const photoGrid = document.getElementById('photo-grid');

// Sihir untuk memunculkan frame dengan mulus (mencegah FOUC)
frameOverlay.onload = function() {
    frameOverlay.style.opacity = '1';
};

let frameClass = 'frame-powerpuff-a'; // Default
let maxFoto = 4; // Default

// Menentukan gambar frame dan batas foto
if (tema === 'powerpuff') {
    if (layout === 'A') {
        frameOverlay.src = 'src/Powerpuff A.png';
        maxFoto = 4;
        frameClass = 'frame-powerpuff-a';
    } else {
        frameOverlay.src = 'src/Powerpuff B.png';
        maxFoto = 2;
        frameClass = 'frame-powerpuff-b';
    }
} else if (tema === 'mario') {
    if (layout === 'A') {
        frameOverlay.src = 'src/Super Mario A.png';
        maxFoto = 4;
        frameClass = 'frame-mario-a';
    } else {
        frameOverlay.src = 'src/Super Mario B.png';
        maxFoto = 3;
        frameClass = 'frame-mario-b';
    }
} else if (tema === 'lany') {
    frameOverlay.src = 'src/Lany XXL.png';
    maxFoto = 3;
    frameClass = 'frame-lany';
} else if (tema === 'zootopia') {
    frameOverlay.src = 'src/Zootopiaa.png';
    maxFoto = 3;
    frameClass = 'frame-zootopia';
} else {
    // SISTEM PENGAMAN: Kalau user bypass halaman awal, kasih default Powerpuff
    frameOverlay.src = 'src/Powerpuff A.png';
    maxFoto = 4;
    frameClass = 'frame-powerpuff-a';
}

// Set tampilan awal counter dan grid
counterTeks.innerText = `0/${maxFoto}`;
photoGrid.className = frameClass;


// ==========================================
// 2. MENYALAKAN KAMERA (WEBCAM)
// ==========================================
const video = document.getElementById('camera-feed');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        video.srcObject = stream;
    } catch (error) {
        console.error("Oops, kamera tidak bisa diakses:", error);
        alert("Gagal mengakses kamera! Pastikan browser diizinkan untuk memakai webcam.");
    }
}

startCamera();


// ==========================================
// 3. LOGIKA TOMBOL CAPTURE, RETAKE, & UPLOAD
// ==========================================
const btnCapture = document.getElementById('btn-capture');
const btnRetake = document.getElementById('btn-retake');
const btnFinish = document.getElementById('btn-finish'); 
const countdownDisplay = document.getElementById('countdown-display');
const btnUpload = document.getElementById('btn-upload'); 
const inputUpload = document.getElementById('input-upload-file'); 

let fotoSekarang = 0; 

function mulaiJepret() {
    // Sembunyikan semua tombol
    btnCapture.classList.add('hidden');
    btnRetake.classList.add('hidden');
    btnFinish.classList.add('hidden'); 
    btnUpload.classList.add('hidden'); 
    
    let hitungan = 5;
    countdownDisplay.src = `src/${hitungan}.png`; 
    countdownDisplay.classList.remove('hidden');

    const timer = setInterval(function() {
        hitungan--; 

        if (hitungan > 0) {
            countdownDisplay.src = `src/${hitungan}.png`;
        } else {
            // WAKTU HABIS! 
            clearInterval(timer); 
            countdownDisplay.classList.add('hidden'); 

            // --- 📸 SIHIR JEPRET FOTO DARI VIDEO (UKURAN PRESISI) ---
            const canvas = document.createElement('canvas');
            
            // 1. Tentukan Resolusi Target Berdasarkan Frame yang Aktif
            let baseWidth = 270;
            let baseHeight = 160;

            // Menyesuaikan ukuran lubang (pisau potong) sesuai catatan desainmu
            if (frameClass === 'frame-powerpuff-a' || frameClass === 'frame-mario-a' || frameClass === 'frame-powerpuff-b') {
                baseWidth = 270; 
                baseHeight = 160;
            } else if (frameClass === 'frame-lany') {
                baseWidth = 270; 
                baseHeight = 155;
            } else if (frameClass === 'frame-zootopia' || frameClass === 'frame-mario-b') {
                baseWidth = 270; 
                baseHeight = 152;
            }

            // Kalikan dengan 3 agar hasil jepretan menjadi HD (tidak pecah/buram)
            const pengaliHD = 3;
            const targetWidth = baseWidth * pengaliHD; 
            const targetHeight = baseHeight * pengaliHD; 

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            const ctx = canvas.getContext('2d');

            // 2. Menghitung Center Crop (Potong Tengah Presisi)
            const videoRatio = video.videoWidth / video.videoHeight;
            const targetRatio = targetWidth / targetHeight;
            
            let sourceWidth, sourceHeight, sourceX, sourceY;

            if (videoRatio > targetRatio) {
                // Potong kiri & kanan
                sourceHeight = video.videoHeight;
                sourceWidth = sourceHeight * targetRatio;
                sourceX = (video.videoWidth - sourceWidth) / 2;
                sourceY = 0;
            } else {
                // Potong atas & bawah
                sourceWidth = video.videoWidth;
                sourceHeight = sourceWidth / targetRatio;
                sourceX = 0;
                sourceY = (video.videoHeight - sourceHeight) / 2;
            }

            // 3. Terapkan Efek Mirror pada Kanvas 
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            // 4. Gambar Video ke Kanvas 
            ctx.drawImage(
                video,
                sourceX, sourceY, sourceWidth, sourceHeight, 
                0, 0, targetWidth, targetHeight              
            ); 
            
            const imgElement = document.createElement('img');
            imgElement.src = canvas.toDataURL('image/png'); 
            imgElement.classList.add('photo-result');
            // imgElement.style.transform = 'none'; <-- HAPUS BARIS INI SAJA
            
            photoGrid.appendChild(imgElement);
            // -----------------------------------------

            // Tambah counter
            if (fotoSekarang < maxFoto) {
                fotoSekarang++; 
                counterTeks.innerText = `${fotoSekarang}/${maxFoto}`; 
            }

            // Update UI Tombol
            if (fotoSekarang < maxFoto) {
                btnCapture.classList.remove('hidden');
                btnRetake.classList.remove('hidden');
                btnUpload.classList.remove('hidden'); 
            } else {
                btnRetake.classList.remove('hidden');
                btnFinish.classList.remove('hidden');
            }
        }
    }, 1000); 
}
// Event Listeners Tombol
btnCapture.addEventListener('click', mulaiJepret);

btnRetake.addEventListener('click', function() {
    if (fotoSekarang > 0) {
        fotoSekarang--; 
        counterTeks.innerText = `${fotoSekarang}/${maxFoto}`; 
        
        // Hapus foto terakhir dari grid
        if (photoGrid.lastChild) {
            photoGrid.removeChild(photoGrid.lastChild);
        }
    }
    
    // Perbaiki tombol kalau batal saat foto penuh
    btnCapture.classList.remove('hidden');
    btnUpload.classList.remove('hidden');
    btnFinish.classList.add('hidden');
    
    if(fotoSekarang === 0) {
        btnRetake.classList.add('hidden');
    }
});

btnUpload.addEventListener('click', function() {
    inputUpload.click(); 
});

inputUpload.addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.classList.add('photo-result');
            
            photoGrid.appendChild(imgElement);
            
            if (fotoSekarang < maxFoto) {
                fotoSekarang++; 
                counterTeks.innerText = `${fotoSekarang}/${maxFoto}`; 
            }

            if (fotoSekarang < maxFoto) {
                btnCapture.classList.remove('hidden');
                btnRetake.classList.remove('hidden');
                btnUpload.classList.remove('hidden'); 
            } else {
                btnCapture.classList.add('hidden');
                btnUpload.classList.add('hidden');
                btnRetake.classList.remove('hidden');
                btnFinish.classList.remove('hidden');
            }
        }
        reader.readAsDataURL(file);
        inputUpload.value = ''; 
    }
});

// ==========================================
// 4. PROSES FINISH & MENGGABUNGKAN FRAME (html2canvas)
// ==========================================

btnFinish.addEventListener('click', function() {
    document.body.style.cursor = 'wait';

    const areaCapture = document.querySelector('.frame-wrapper'); 
    const frameImg = document.getElementById('selected-frame-overlay'); // Ambil elemen gambar frame

    // --- SIHIR ANTI-MELAR UNTUK HTML2CANVAS ---
    // 1. Hitung ukuran pasti frame saat ini di layar
    const lebarPasti = frameImg.getBoundingClientRect().width;
    const tinggiPasti = frameImg.getBoundingClientRect().height;
    
    // 2. Kunci ukuran bungkusannya pakai Pixel (px) agar tidak melar saat di-screenshot
    areaCapture.style.width = lebarPasti + 'px';
    areaCapture.style.height = tinggiPasti + 'px';

    // 3. Mulai proses screenshot dengan membawa data ukuran pastinya
    html2canvas(areaCapture, {
        scale: 4, 
        backgroundColor: null,
        width: lebarPasti,   // Kasih tahu ukuran lebarnya ke html2canvas
        height: tinggiPasti  // Kasih tahu ukuran tingginya ke html2canvas
    }).then(canvas => {
        // 4. Buka kembali kunci ukurannya agar responsive seperti semula
        areaCapture.style.width = 'max-content';
        areaCapture.style.height = '100%';

        // 5. Simpan dan Pindah Halaman
        const hasilFinal = canvas.toDataURL('image/png');
        localStorage.setItem('hasilFotoFinal', hasilFinal);

        document.body.style.cursor = 'default';
        window.location.href = 'hasil.html'; 
        
    }).catch(error => {
        console.error("Gagal menggabungkan foto:", error);
        alert("Waduh, ada error pas memproses foto. Coba lagi ya!");
        document.body.style.cursor = 'default';
        
        // Buka kembali kunci ukurannya kalau terjadi error
        areaCapture.style.width = 'max-content';
        areaCapture.style.height = '100%';
    });
});
