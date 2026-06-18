const musik = document.getElementById('lagu-background');
const btnStart = document.getElementById('btn-start');

if (musik !== null) {
    document.body.addEventListener('click', function() {
        if (musik.paused) {
            musik.play();
        }
    });
}

if (btnStart !== null) {
    btnStart.addEventListener('click', function(event) {
        event.stopPropagation();
        musik.pause();
        musik.currentTime = 0;
        console.log("Tombol start ditekan, lagu dimatikan!");
    });
}

const judulTema = document.getElementById('selected-theme-title');
const previewFrame = document.getElementById('preview-frame-img');

const btnLayoutA = document.getElementById('btn-layout-a');
const btnLayoutB = document.getElementById('btn-layout-b');

const btnLany = document.getElementById('theme-lany');
const btnZootopia = document.getElementById('theme-zootopia');
const btnPowerpuff = document.getElementById('theme-powerpuff');
const btnMario = document.getElementById('theme-mario');

let temaAktif = 'powerpuff';
let layoutAktif = 'A';

btnPowerpuff.addEventListener('click', function() {
    temaAktif = 'powerpuff';
    judulTema.src = 'src/The Powerpuff Girls.png';
    if (layoutAktif === 'A') {
        previewFrame.src = 'src/Powerpuff A.png';
    } else {
        previewFrame.src = 'src/Powerpuff B.png';
    }
});

btnMario.addEventListener('click', function() {
    temaAktif = 'mario';
    judulTema.src = 'src/SuperMario.png';
    if (layoutAktif === 'A') {
        previewFrame.src = 'src/Super Mario A.png';
    } else {
        previewFrame.src = 'src/Super Mario B.png';
    }
});

btnLany.addEventListener('click', function() {
    temaAktif = 'lany';
    judulTema.src = 'src/Lany-XXL.png';
    previewFrame.src = 'src/Lany XXL.png';
});

btnZootopia.addEventListener('click', function() {
    temaAktif = 'zootopia';
    judulTema.src = 'src/Zootopiaaa.png';
    previewFrame.src = 'src/Zootopiaa.png';
});

btnLayoutA.addEventListener('click', function() {
    layoutAktif = 'A';
    btnLayoutA.src = 'src/A1.png';
    btnLayoutB.src = 'src/B1.png';
    if (temaAktif === 'powerpuff') {
        previewFrame.src = 'src/Powerpuff A.png';
    } else if (temaAktif === 'mario') {
        previewFrame.src = 'src/Super Mario A.png';
    }
});

btnLayoutB.addEventListener('click', function() {
    layoutAktif = 'B';
    btnLayoutA.src = 'src/A2.png';
    btnLayoutB.src = 'src/B2.png';
    if (temaAktif === 'powerpuff') {
        previewFrame.src = 'src/Powerpuff B.png';
    } else if (temaAktif === 'mario') {
        previewFrame.src = 'src/Super Mario B.png';
    }
});

// ==========================================
// LOGIKA TOMBOL "USE THIS FRAME"
// ==========================================

// Ambil elemen tombol Use This Frame
const btnUseFrame = document.getElementById('btn-use-frame');

// Cek apakah tombolnya ada di halaman ini
if (btnUseFrame !== null) {
    btnUseFrame.addEventListener('click', function() {
        
        // 1. Masukkan pilihan user ke dalam "tas ransel" (localStorage)
        localStorage.setItem('temaPilihan', temaAktif);
        localStorage.setItem('layoutPilihan', layoutAktif);
        
        // 2. Pindah ke halaman kamera!
        window.location.href = 'capture.html';
        
    });
}

