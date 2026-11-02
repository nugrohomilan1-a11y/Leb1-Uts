
// =============================
// 1. PROSES LOGIN
// =============================

const formLogin = document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const pengguna = dataPengguna.find(function(user) {
            return user.email === email &&
                   user.password === password;
        });

        if (pengguna) {
            alert("Login berhasil. Selamat datang " + pengguna.nama);

            sessionStorage.setItem("namaPengguna", pengguna.nama);
            sessionStorage.setItem("rolePengguna", pengguna.role);

            window.location.href = "dashboard.html";

        } else {
            alert("email/password yang anda masukkan salah");
        }
    });

}


// =============================
// 2. MODAL LUPA PASSWORD
// =============================

const btnLupa = document.getElementById("btnLupa");
const modalLupa = document.getElementById("modalLupa");

if (btnLupa && modalLupa) {

    btnLupa.addEventListener("click", function() {
        modalLupa.style.display = "flex";
    });

}


// =============================
// 3. MODAL DAFTAR
// =============================

const btnDaftar = document.getElementById("btnDaftar");
const modalDaftar = document.getElementById("modalDaftar");

if (btnDaftar && modalDaftar) {

    btnDaftar.addEventListener("click", function() {
        modalDaftar.style.display = "flex";
    });

}


// =============================
// 4. TOMBOL TUTUP MODAL
// =============================

const tombolTutup = document.querySelectorAll(".btn-tutup");

tombolTutup.forEach(function(tombol) {

    tombol.addEventListener("click", function() {

        if (modalLupa) {
            modalLupa.style.display = "none";
        }

        if (modalDaftar) {
            modalDaftar.style.display = "none";
        }

    });

});


// =============================
// 5. GREETING DASHBOARD
// =============================

const greeting = document.getElementById("greeting");

if (greeting) {

    const jam = new Date().getHours();

    if (jam >= 5 && jam < 11) {
        greeting.textContent = "Selamat Pagi!";
    } 
    else if (jam >= 11 && jam < 15) {
        greeting.textContent = "Selamat Siang!";
    } 
    else if (jam >= 15 && jam < 18) {
        greeting.textContent = "Selamat Sore!";
    } 
    else {
        greeting.textContent = "Selamat Malam!";
    }

    const namaUser = sessionStorage.getItem("namaPengguna");

    document.getElementById("namaUser").textContent =
        "Halo, " + (namaUser || "Pengguna");
}


// =============================
// 6. LOGOUT
// =============================

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {

    btnLogout.addEventListener("click", function() {

        sessionStorage.clear();

        alert("Anda berhasil logout.");

        window.location.href = "login.html";

    });

}


/* =================================
   HALAMAN INFORMASI STOK BUKU
================================= */

const daftarBuku = document.getElementById("daftarBuku");
const formTambahBuku = document.getElementById("formTambahBuku");

// Menampilkan data buku
function tampilkanBuku() {

    if (!daftarBuku) return;

    daftarBuku.innerHTML = "";

    dataKatalogBuku.forEach(function(buku, index) {

        const baris = document.createElement("tr");

        const gambar = buku.cover
            ? `<img src="${buku.cover}" class="cover-buku"
                alt="Cover ${buku.namaBarang}"
                onerror="this.style.display='none'">`
            : "-";

        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${gambar}</td>
            <td>${buku.kodeBarang}</td>
            <td>${buku.namaBarang}</td>
            <td>${buku.jenisBarang}</td>
            <td>${buku.edisi}</td>
            <td>${buku.stok}</td>
            <td>${buku.harga}</td>
        `;

        daftarBuku.appendChild(baris);

    });
}


// Memanggil data buku saat halaman dibuka
if (daftarBuku) {
    tampilkanBuku();
}


// Menambahkan buku baru menggunakan DOM
if (formTambahBuku) {

    formTambahBuku.addEventListener("submit", function(event) {

        event.preventDefault();

        const kode = document.getElementById("kodeBarang").value.trim();

        // Memeriksa kode barang agar tidak sama
        const kodeSudahAda = dataKatalogBuku.some(function(buku) {
            return buku.kodeBarang.toLowerCase() === kode.toLowerCase();
        });

        if (kodeSudahAda) {
            alert("Kode barang sudah digunakan!");
            return;
        }

        const bukuBaru = {
            kodeBarang: kode,
            namaBarang: document.getElementById("namaBarang").value.trim(),
            jenisBarang: document.getElementById("jenisBarang").value.trim(),
            edisi: document.getElementById("edisi").value.trim(),
            stok: Number(document.getElementById("stok").value),
            harga: "Rp " + Number(
                document.getElementById("harga").value
            ).toLocaleString("id-ID"),
            cover: ""
        };

        // Memasukkan buku ke dalam array
        dataKatalogBuku.push(bukuBaru);

        // Memperbarui tampilan tabel
        tampilkanBuku();

        // Mengosongkan form
        formTambahBuku.reset();

        alert("Buku berhasil ditambahkan!");

    });

}


// =====================================
// HALAMAN CHECKOUT / PEMESANAN BUKU
// =====================================

let keranjangPesanan = [];
let riwayatTransaksi = [];

const pilihBuku = document.getElementById("pilihBuku");
const daftarPesanan = document.getElementById("daftarPesanan");
const totalHarga = document.getElementById("totalHarga");
const formCheckout = document.getElementById("formCheckout");

// Mengubah harga menjadi angka
function ambilHarga(harga) {
    return Number(harga.replace(/[^0-9]/g, ""));
}

// Format rupiah
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}


// Menampilkan pilihan buku
if (pilihBuku) {

    dataKatalogBuku.forEach(function(buku, index) {

        const option = document.createElement("option");

        option.value = index;

        option.textContent =
            buku.namaBarang + " - " + buku.harga;

        pilihBuku.appendChild(option);

    });

}


// Tombol tambah pesanan
const btnTambahPesanan =
    document.getElementById("btnTambahPesanan");

if (btnTambahPesanan) {

    btnTambahPesanan.addEventListener("click", function() {

        const index = pilihBuku.value;
        const jumlah = Number(
            document.getElementById("jumlahPesan").value
        );

        if (index === "") {
            alert("Silakan pilih buku terlebih dahulu!");
            return;
        }

        if (!Number.isInteger(jumlah) || jumlah < 1) {
            alert("Jumlah pesanan tidak valid!");
            return;
        }

        const buku = dataKatalogBuku[Number(index)];

        if (jumlah > buku.stok) {
            alert("Stok buku tidak mencukupi!");
            return;
        }

        const pesananAda = keranjangPesanan.find(function(item) {
            return item.kodeBarang === buku.kodeBarang;
        });

        if (pesananAda) {

            if (pesananAda.jumlah + jumlah > buku.stok) {
                alert("Jumlah pesanan melebihi stok!");
                return;
            }

            pesananAda.jumlah += jumlah;

        } else {

            keranjangPesanan.push({
                kodeBarang: buku.kodeBarang,
                namaBarang: buku.namaBarang,
                harga: ambilHarga(buku.harga),
                jumlah: jumlah
            });

        }

        tampilkanPesanan();

        alert("Buku berhasil ditambahkan ke pesanan!");

    });

}


// Menampilkan daftar pesanan
function tampilkanPesanan() {

    if (!daftarPesanan) return;

    daftarPesanan.innerHTML = "";

    let total = 0;

    keranjangPesanan.forEach(function(item, index) {

        const subtotal = item.harga * item.jumlah;

        total += subtotal;

        const baris = document.createElement("tr");

        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.namaBarang}</td>
            <td>${formatRupiah(item.harga)}</td>
            <td>
                <input type="number"
                    min="1"
                    max="${dataKatalogBuku.find(b => b.kodeBarang === item.kodeBarang).stok}"
                    value="${item.jumlah}"
                    onchange="ubahJumlahPesanan(${index}, this.value)"
                    style="width:65px; padding:5px;">
            </td>
            <td>${formatRupiah(subtotal)}</td>
            <td>
                <button type="button"
                    class="btn-aksi"
                    onclick="hapusPesanan(${index})">
                    Hapus
                </button>
            </td>
        `;

        daftarPesanan.appendChild(baris);

    });

    totalHarga.textContent = formatRupiah(total);

}


// Mengubah jumlah pesanan
function ubahJumlahPesanan(index, jumlahBaru) {

    const jumlah = Number(jumlahBaru);
    const item = keranjangPesanan[index];

    const buku = dataKatalogBuku.find(function(b) {
        return b.kodeBarang === item.kodeBarang;
    });

    if (!Number.isInteger(jumlah) || jumlah < 1 ||
        jumlah > buku.stok) {

        alert("Jumlah pesanan tidak valid atau melebihi stok!");

        tampilkanPesanan();
        return;
    }

    item.jumlah = jumlah;

    tampilkanPesanan();

}


// Menghapus pesanan
function hapusPesanan(index) {

    keranjangPesanan.splice(index, 1);

    tampilkanPesanan();

}


// Proses checkout
if (formCheckout) {

    formCheckout.addEventListener("submit", function(event) {

        event.preventDefault();

        if (keranjangPesanan.length === 0) {
            alert("Silakan tambahkan buku ke pesanan!");
            return;
        }

        let total = 0;

        keranjangPesanan.forEach(function(item) {
            total += item.harga * item.jumlah;
        });

        const transaksi = {
            nama: document.getElementById("namaPemesan").value.trim(),
            email: document.getElementById("emailPemesan").value.trim(),
            telepon: document.getElementById("teleponPemesan").value.trim(),
            alamat: document.getElementById("alamatPemesan").value.trim(),
            pembayaran: document.getElementById("metodePembayaran").value,
            total: total
        };

        // Menambahkan transaksi ke riwayat
        riwayatTransaksi.push(transaksi);

        tampilkanRiwayat();

        // Mengurangi stok buku
        keranjangPesanan.forEach(function(item) {

            const buku = dataKatalogBuku.find(function(b) {
                return b.kodeBarang === item.kodeBarang;
            });

            buku.stok -= item.jumlah;

        });

        alert(
            "Pesanan berhasil dibuat!\nTotal pembayaran: " +
            formatRupiah(total)
        );

        keranjangPesanan = [];

        tampilkanPesanan();

        formCheckout.reset();

    });

}


// Menampilkan riwayat transaksi
function tampilkanRiwayat() {

    const daftarRiwayat =
        document.getElementById("daftarRiwayat");

    if (!daftarRiwayat) return;

    daftarRiwayat.innerHTML = "";

    riwayatTransaksi.forEach(function(item, index) {

        const baris = document.createElement("tr");

        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.email}</td>
            <td>${formatRupiah(item.total)}</td>
            <td>${item.pembayaran}</td>
        `;

        daftarRiwayat.appendChild(baris);

    });

}


// =====================================
// HALAMAN TRACKING PENGIRIMAN
// =====================================

const formTracking = document.getElementById("formTracking");

if (formTracking) {

    formTracking.addEventListener("submit", function(event) {

        event.preventDefault();

        const nomorDO = document.getElementById("nomorDO").value.trim();

        // Mencari data pengiriman berdasarkan nomor DO
        const pengiriman = dataTracking[nomorDO];

        if (!pengiriman) {

            alert("Nomor Delivery Order tidak ditemukan!");

            document.getElementById("hasilTracking").hidden = true;

            return;
        }

        // Menampilkan informasi pengiriman
        document.getElementById("hasilTracking").hidden = false;

        document.getElementById("hasilDO").textContent =
            pengiriman.nomorDO;

        document.getElementById("hasilNama").textContent =
            pengiriman.nama;

        document.getElementById("hasilStatus").textContent =
            pengiriman.status;

        document.getElementById("hasilEkspedisi").textContent =
            pengiriman.ekspedisi;

        document.getElementById("hasilTanggal").textContent =
            pengiriman.tanggalKirim;

        document.getElementById("hasilPaket").textContent =
            pengiriman.paket;

        document.getElementById("hasilTotal").textContent =
            pengiriman.total;


        // Mengatur progress bar berdasarkan status
        let progress = 0;

        if (pengiriman.status === "Dalam Perjalanan") {
            progress = 60;
        }
        else if (pengiriman.status === "Dikirim") {
            progress = 100;
        }

        const progressBar = document.getElementById("progressBar");

        progressBar.style.width = progress + "%";
        progressBar.textContent = progress + "%";


        // Menampilkan riwayat perjalanan
        const riwayat = document.getElementById("riwayatPerjalanan");

        riwayat.innerHTML = "";

        pengiriman.perjalanan.forEach(function(perjalanan, index) {

            const baris = document.createElement("tr");

            baris.innerHTML = `
                <td>${index + 1}</td>
                <td>${perjalanan.waktu}</td>
                <td>${perjalanan.keterangan}</td>
            `;

            riwayat.appendChild(baris);

        });

    });

}
