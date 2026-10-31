DESIGN — Visual & Motion System for Pholio
	
Status	v3.2, 2026-10-31. Visual and motion direction for a starter template, not a final per-client design; scroll-led motion is the defining characteristic at M2/M3
Contains	Visual identity, tokens, typography, layout, components, motion (Lenis, GSAP), accessibility
Visual references	Per Appelgren and Gogoko Foto
Motion technology references	Wappalyzer analysis of locomotive.ca (Lenis, GSAP, Three.js detected together). Only inspiration for technology task division, not an implementation copy
Related documents	PRD.md (scope, packages), ARCHITECTURE.md (data, routes, code structure, checkout), TASKS.md (work order), AGENTS.md (AI rules)


Reference rule: adopt general UX principles and patterns. Do not copy compositions, text, identity, logos, photos, or assets from any reference site.

Priority rule: if DESIGN conflicts with PRD.md or ARCHITECTURE.md, the latter two win. Items needing alignment are in §15.

Changes in v3.2 (2026-10-31)
1. Rewritten for Next.js App Router, TypeScript, and Tailwind CSS v4. Removed all Astro-specific implementation assumptions (`.astro` components, `astro:page-load`, `astro:before-swap`, `ClientRouter`, `@tailwindcss/vite`, `astro.config.mjs`).
2. MVP motion target is **M2** (scroll-led with GSAP, ScrollTrigger, Lenis). Three.js is deferred and not part of MVP.
3. Primary navigation is **Work, About, Contact**. Shop (when enabled) has a contextual entry point elsewhere, not in primary navigation.
4. Motion implementation uses Next.js Client Components with `useEffect` lifecycle; shared Lenis/GSAP context via React Context.
5. Preserved visual direction, design tokens, typography, layouts, responsive behavior, and interaction intent from v3.1 where still relevant.a masuk, keluar, atau bergerak melewati viewport; gerak mengikuti progres scroll melalui GSAP ScrollTrigger, bukan animasi otomatis yang berjalan tanpa kendali pengunjung.
2. M3 selalu dibangun di atas M2. Three.js tidak berdiri sendiri sebagai efek 3D; scene hero menerima progres scroll yang sama dari GSAP/ScrollTrigger, sementara Lenis menangani rasa scroll.
3. Cakupan scroll ditentukan per jenis halaman. Section editorial mendapat scroll choreography; galeri fungsional, toko, dan detail produk hanya mendapat reveal ringan, tanpa pin, parallax, atau WebGL yang mengganggu penggunaan.
4. Scroll mobile tetap interaktif. Lenis menghaluskan wheel/trackpad desktop, sedangkan sentuhan tetap memakai scroll native; ScrollTrigger tetap merespons scroll native pada perangkat sentuh.
Perubahan dari v2
1. Motion ditulis ulang (§9): tiga level lama (M0 sampai M2) menjadi empat (M0 sampai M3). Lenis, GSAP, dan Three.js kini disetujui sebagai teknologi resmi, masing-masing dengan batas tugas, aturan siklus hidup, anggaran performa, dan fallback. Aturan v2 "jangan memuat library animasi" dicabut untuk level M1 ke atas.
2. Preset ketiga noir (tema gelap, P2) ditambahkan karena scene 3D dan nuansa sinematik paling cocok di latar gelap. Kontras semua preset dihitung ulang (§3.3).
3. Nilai tipografi diseragamkan. v2 punya dua set angka yang berbeda untuk display dan heading (§3.3.4 dan §4.2 lama). Kini hanya ada satu set (§4.2), sama dengan nilai yang sudah dipakai di global.css.
4. Penomoran dirapikan. Bagian bernomor 3.3 sampai 3.5, 7.11, dan 16 di v2 digabung menjadi Lampiran A (Tailwind CSS v4). Nomor baris kode yang cepat basi dihapus. Peta nomor lama ke baru ada di Lampiran B.
5. Dari dokumen DESIGN draf Inggris diambil: prinsip "cepat adalah bagian dari desain", suara teks UI, tabel state interaksi, detail lightbox (indikator posisi, tap latar untuk menutup), tautan sebelumnya/berikutnya, skip link, dan daftar lebar uji.
6. Aturan baru terkait motion: foto kandidat LCP tidak boleh dianimasikan dari opacity: 0; konten tidak tersembunyi bila JS gagal; gerak otomatis lebih dari 5 detik harus bisa dihentikan (WCAG 2.2.2); warna foto di WebGL harus sama dengan foto di DOM.
1. Prinsip desain
1.1 Arah visual
Konsepnya: etalase editorial dengan satu momen tipografi yang berani dan scroll choreography yang terasa disengaja. Foto dan satu elemen tipografi raksasa memegang halaman. Saat pengunjung menggulir, setiap section utama merespons secara halus—melalui reveal, pergeseran kedalaman, atau perubahan komposisi yang terikat progres scroll. Semua yang lain tetap tenang dan disiplin; motion memberi ritme dan kedalaman, bukan hiasan.

Dua referensi visual punya peran berbeda:
- Per Appelgren: struktur dan keheningan. Header tiga zona yang sangat ringkas, latar netral, teks display raksasa yang ditimpa foto, foto berukuran bervariasi tanpa crop seragam, halaman arsip dengan filter berhitung dan pengalih tampilan.
- Gogoko Foto: kejelasan katalog dan keberanian warna. Headline raksasa bertingkat dalam satu warna jenuh, garis grid tipis yang terlihat, tombol outline dengan bayangan keras, caption judul di atas foto, tombol toko yang menonjol, tombol WhatsApp melayang.
Tiga teknologi motion punya peran berbeda pula (rincian di §9.3):
- Lenis: rasa scroll. Scroll yang halus dan konsisten.
- GSAP: karakter gerak. Masuk, tersingkap, bertingkat, terhubung scroll.
- Three.js: dimensi. Satu momen 3D terukur yang tidak bisa dicapai animasi DOM biasa.
Hasil yang diinginkan: terasa seperti portofolio fotografer yang dikurasi dan hidup, bukan template toko generik, tetapi pengunjung tetap tahu di mana koleksinya dan bagaimana cara membeli.
1.2 Prinsip utama
1. Foto adalah konten utama. Elemen dekoratif dan efek tidak boleh bersaing dengan karya.
2. Satu momen berani. Hero memegang seluruh keberanian tipografi dan (bila aktif) satu-satunya scene 3D. Halaman lain memakai skala biasa. Jika semua bagian dibuat besar, berwarna, dan bergerak, tidak ada yang terasa istimewa.
3. Katalog jelas. Harga, nama karya, kategori, lisensi atau spesifikasi, dan CTA tidak boleh tersembunyi, juga tidak boleh menunggu animasi selesai.
4. Ritme visual. Variasikan ukuran dan posisi foto secara terarah. Hindari kumpulan thumbnail seragam bila materinya tidak cocok.
5. Struktur visual membawa informasi. Garis, border, dan penanda harus berarti sesuatu (pemisah section, penunjuk aktif). Jangan menambah nomor urut, label kecil di atas heading, atau badge hanya sebagai hiasan.
6. Setiap animasi punya tujuan. Tiap animasi harus bisa dijawab: apa yang dibantu (fokus, urutan baca, umpan balik, kedalaman)? Bila tidak ada jawaban, hapus. Jangan mengejar situs yang penuh animasi.
7. Cepat adalah bagian dari desain. Layout stabil, gambar responsif, dan JavaScript seminimal mungkin adalah kualitas visual. Efek yang merusak LCP, CLS, atau INP dianggap cacat desain.
8. Konten dulu, efek sebagai peningkatan. Tanpa JavaScript, tanpa WebGL, atau dengan reduced motion, halaman tetap lengkap dan indah.
9. Identitas fleksibel. Warna, font, dan level motion dikonfigurasi per klien tanpa mengubah komponen inti.
10. Interaksi sederhana dan jujur. Tidak ada keranjang, status stok, atau status pembayaran palsu. Semua CTA mengarah ke checkout eksternal per produk atau WhatsApp.
1.3 Suara teks UI
- Pendek, tenang, tanpa tanda seru, tanpa bahasa pemasaran di area portofolio.
- Label navigasi dan filter ditulis huruf biasa di konten; kapital dihasilkan CSS (§4.3).
- CTA menyebut tindakan: "Beli foto", "Pesan cetak", "Lihat semua foto". Bukan "Klik di sini".
- Pesan galat menjelaskan apa yang terjadi dan langkah berikutnya.
2. Analisis referensi
Tabel ini menerjemahkan pola yang terlihat pada tangkapan layar kedua situs referensi menjadi keputusan desain. Prioritas: P0 wajib ada di starter, P1 diaktifkan sesuai paket, P2 opsional atau add-on.
#	Pola yang teramati	Sumber	Keputusan di starter	Prioritas
1	Header tiga zona: tautan kecil di kiri, nama fotografer di tengah, tautan di kanan; tanpa dekorasi	Per	Varian header centered-wordmark (default preset Editorial)	P0
2	Logo di kiri, navigasi di tengah, tombol toko menonjol di kanan	Gogoko	Varian header split-nav (default preset Bold), tanpa ikon keranjang	P1
3	Foto potret di tengah menimpa kata display raksasa yang terpotong tepi layar; caption kecil di margin kiri	Per	Hero overlap	P0
4	Headline raksasa tiga baris dengan indentasi bertingkat, melintasi garis grid; foto unggulan di sisi kiri	Gogoko	Hero stagger	P0
5	Garis grid tipis (vertikal dan horizontal) terlihat di seluruh halaman	Gogoko	Komponen dekoratif GridLines, hanya desktop	P1
6	Tombol dengan border tebal, bayangan keras bergeser, teks bergaris bawah dan panah	Gogoko	Gaya CTA preset Bold (§7.4)	P0
7	Judul karya dan nama pemilik di kiri bawah foto, di atas gradien gelap	Gogoko	Caption overlay pada kartu galeri dan hero	P0
8	Foto berukuran berbeda, posisi asimetris, rasio asli dipertahankan	Per, Gogoko	Dasar layout galeri: CSS Grid dengan rasio asli	P0
9	Foto masuk dari tepi kiri dan kanan layar, teks display tertutup sebagian oleh foto (efek scroll)	Per	Komposisi statis di M0 dan M1. Versi terhubung scroll di M2 (§9.5)	P1
10	Filter dengan jumlah per kategori: "ALL (48) FASHION (34) BEAUTY (14)"	Per	FilterBar berhitung, dihitung saat build	P1
11	Baris indeks: tahun di kiri, judul proyek di kolom berikutnya	Per	Tampilan daftar opsional (§7.6)	P2
12	Pil melayang di tengah bawah untuk berganti tampilan BOARD / STACK / GRID	Per	Hanya grid dan stack; pengalih muncul bila minimal dua tampilan aktif	P2
13	Tombol WhatsApp bulat hijau dengan label pertanyaan di kiri bawah	Gogoko	Varian floating pada WhatsAppButton	P1
14	Ikon keranjang dengan badge jumlah	Gogoko	Tidak diadopsi (tidak ada cart)	n/a
15	Logo wordmark outline berkotak	Gogoko	Tidak diadopsi (identitas milik Gogoko)	n/a


2.1 Batas penggunaan
- Jangan menyalin: headline, caption, nama kampanye atau merek pada foto, susunan halaman, logo, dan seluruh foto situs referensi.
- Jangan memakai foto referensi sebagai placeholder, termasuk saat pengembangan lokal. Foto pada tangkapan layar adalah karya pihak ketiga dan kampanye merek. Gunakan kotak abu netral, gradien polos, atau foto milik klien.
- Jangan menyalin kata kunci headline dari referensi, termasuk terjemahannya. Copy hero ditulis dari identitas klien.
- Efek scroll Per Appelgren adalah pekerjaan kustom. Starter membangun efek yang setara secara konsep (M2) dengan kode sendiri, bukan meniru urutan animasi persisnya.
2.2 Referensi teknologi: apa yang boleh disimpulkan dari locomotive.ca
Wappalyzer mendeteksi Lenis (smooth scroll), GSAP (animasi dan timeline), dan Three.js (WebGL) bersamaan pada locomotive.ca. Kesimpulan yang sah dari data itu hanya satu: kombinasi ketiganya lazim dipakai bersama pada situs agensi yang berfokus pada motion.

Yang tidak bisa disimpulkan: versi, konfigurasi, struktur kode, atau halaman mana yang memakai masing-masing. Pembagian tugas di §9.3 adalah rekomendasi untuk Pholio, bukan klaim tentang implementasi internal situs tersebut.
3. Preset tema dan token
Starter menyediakan tiga preset. Pilih satu per proyek lewat konfigurasi. Semuanya memakai nama token yang sama sehingga komponen tidak berubah.
	Editorial (default)	Bold	Noir (P2)
Karakter	Netral, monokrom, tenang; foto menjadi satu-satunya warna	Putih bersih + satu warna merek jenuh untuk teks, garis, dan tombol	Hitam hangat, sinematik; foto dan scene 3D menyala di atas latar gelap
Cocok untuk	Fashion, potret, komersial, fine-art	Fotografi komunitas, travel, katalog ramai, merek yang ingin lantang	Fine-art, sinematografi, malam, merek premium; paling serasi dengan M3
Hero bawaan	overlap	stagger	overlap
Header bawaan	centered-wordmark	split-nav	centered-wordmark
Gaya CTA	Tombol solid warna tinta	Tombol outline dengan bayangan keras	Tombol solid terang (kebalikan Editorial)
Status	P0	P0	P2, tidak ada pengalih tema oleh pengunjung


3.1 Token warna
:root[data-theme-preset="editorial"] {
  --color-bg: #F3F3F1;
  --color-surface: #FFFFFF;
  --color-text: #0A0B10;
  --color-muted: #62625E;
  --color-border: #D9D9D5;
  --color-brand: #0A0B10;      /* teks display, garis, tombol */
  --color-on-brand: #FFFFFF;
  --color-focus: #1D5FCC;
  --color-whatsapp: #167D48;
  --color-grid-line: rgb(10 11 16 / 0.08);
  --color-scrim: rgb(0 0 0 / 0.55);
}

:root[data-theme-preset="bold"] {
  --color-bg: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-text: #1B1111;
  --color-muted: #6A6060;
  --color-border: #EBC9C9;
  --color-brand: #D40000;
  --color-on-brand: #FFFFFF;
  --color-focus: #1D5FCC;
  --color-whatsapp: #167D48;
  --color-grid-line: rgb(212 0 0 / 0.22);
  --color-scrim: rgb(0 0 0 / 0.55);
}

:root[data-theme-preset="noir"] {
  --color-bg: #0B0B0C;
  --color-surface: #151516;
  --color-text: #F1F0EC;
  --color-muted: #A3A29D;
  --color-border: #2A2A28;
  --color-brand: #F1F0EC;
  --color-on-brand: #0B0B0C;
  --color-focus: #7AA7FF;
  --color-whatsapp: #167D48;
  --color-grid-line: rgb(241 240 236 / 0.10);
  --color-scrim: rgb(0 0 0 / 0.60);
}

/* Kompatibilitas dengan v1 */
:root {
  --color-accent: var(--color-brand);
  --color-on-accent: var(--color-on-brand);
}
Token	Penggunaan
--color-bg	Latar utama. Juga warna clearColor kanvas WebGL (dibaca dari CSS saat scene dibuat)
--color-surface	Panel atau kartu yang perlu dipisahkan dari latar; latar letterbox foto
--color-text	Teks utama
--color-muted	Teks sekunder, metadata, caption di luar foto
--color-border	Pemisah halus dan hairline dekoratif
--color-brand	Teks display, tautan aktif, garis, border dan isi tombol utama
--color-on-brand	Teks di atas --color-brand
--color-focus	Indikator fokus keyboard
--color-whatsapp	Tombol WhatsApp saja
--color-grid-line	Garis grid dekoratif (§5.3)
--color-scrim	Gradien gelap di bawah foto untuk caption


3.2 Token motion
Token ini dipakai CSS (transisi M0) dan dibaca GSAP lewat tabel padanan, supaya satu "rasa gerak" berlaku di seluruh situs.
:root {
  --duration-fast: 120ms;     /* hover, press */
  --duration-base: 200ms;     /* fokus, toggle, filter */
  --duration-reveal: 600ms;   /* masuk gambar dan teks, batas atas M1 */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);       /* elemen masuk */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);    /* perpindahan posisi */
}
Peran	CSS	GSAP
Elemen masuk	var(--ease-out)	power3.out
Perpindahan posisi, transisi section	var(--ease-in-out)	power2.inOut
Animasi terhubung scroll (scrub)	n/a	none (linear; kehalusan datang dari Lenis)
Elemen keluar	ease-in	power2.in


3.3 Kontras yang sudah dihitung
Dihitung dengan rumus kontras WCAG 2.x dan diverifikasi ulang untuk v3. Hitung ulang untuk setiap warna merek klien.
Pasangan	Rasio
Editorial: teks pada latar	17,7 : 1
Editorial: teks muted pada latar	5,5 : 1
Editorial: putih pada tombol tinta	19,7 : 1
Editorial: fokus pada latar	5,3 : 1
Bold: merah #D40000 pada putih (dan sebaliknya)	5,5 : 1
Bold: teks pada putih	18,5 : 1
Bold: teks muted pada putih	6,1 : 1
Bold: fokus pada putih	5,9 : 1
Noir: teks pada latar	17,3 : 1
Noir: teks muted pada latar	7,7 : 1
Noir: teks muted pada surface	7,1 : 1
Noir: --color-on-brand pada --color-brand	17,3 : 1
Noir: fokus pada latar	8,2 : 1
Putih pada hijau WhatsApp (semua preset)	5,2 : 1
Putih pada scrim 55% di atas foto putih murni (kasus terburuk)	4,7 : 1
Merah murni #FF0000 pada putih	4,0 : 1


Ketentuan:
- Merah murni #FF0000 gagal untuk teks kecil (di bawah 4,5 : 1). Preset Bold memakai #D40000. Warna yang lebih terang hanya boleh untuk teks display besar (minimal 24 px, atau 18,66 px tebal) dan harus tetap mencapai 3 : 1.
- --color-border dan --color-grid-line bersifat dekoratif (kontras jauh di bawah 3 : 1; Editorial 1,3 : 1). Jangan memakainya untuk menandai elemen yang harus dikenali; beri petunjuk lain (garis bawah, teks, bentuk).
- Teks biasa minimal 4,5 : 1. Teks besar, batas kontrol, dan indikator fokus minimal 3 : 1.
- Jangan menerapkan semua token sekaligus. Warna fotografi sudah menjadi sumber variasi utama.
- Warna WhatsApp hanya untuk CTA WhatsApp agar maknanya konsisten.
- Preset noir adalah pilihan per proyek. Pengalih tema terang/gelap oleh pengunjung tidak termasuk cakupan.
4. Tipografi
4.1 Arah
Satu keluarga sans-serif per proyek sudah cukup; maksimal dua. Karakter tipografi dibawa oleh skala, bobot, dan penempatan, bukan oleh banyaknya font.
Preset	Karakter huruf	Pilihan starter	Alternatif (bukan kewajiban)
Editorial	Grotesk netral, lebar normal, bobot tebal untuk display	Hanken Grotesk (variable)	Geist, Instrument Sans
Bold	Sans geometris dengan bukaan bulat, bobot tebal	Outfit (variable)	Red Hat Display
Noir	Sama dengan Editorial	Hanken Grotesk (variable)	Geist


Pasangan serif opsional untuk klien fine-art atau kuratorial (diambil dari draf DESIGN sebelumnya): Fraunces atau Cormorant Garamond, hanya untuk satu peran (pull quote atau judul karya), bukan sebagai default dan tidak untuk display raksasa. Total tetap dua keluarga.
4.2 Skala (satu sumber kebenaran)
Peran	Ukuran	Line-height	Tracking	Bobot	Catatan
Display overlap	clamp(4rem, 18vw, 16rem)	0.85	-0.02em	800	Satu kata atau frasa pendek, kapital lewat CSS
Display stagger	clamp(2.75rem, 6vw, 6.5rem)	0.96	-0.03em	800	Tiga baris pendek, kapital lewat CSS
Heading halaman	clamp(2.25rem, 4.5vw, 4.25rem)	1.05	-0.02em	800	Hierarki utama halaman dalam
Heading section	clamp(1.75rem, 2.8vw, 2.75rem)	1.1	-0.01em	800	Judul galeri atau produk pilihan
Body	clamp(1rem, 1.2vw, 1.125rem)	1.7	0	400	Panjang baris maksimal sekitar 68 karakter
Navigasi dan filter	clamp(0.8125rem, 1vw, 0.9375rem)	1.3	0.08em	700	Kapital lewat CSS
Caption dan metadata	clamp(0.8125rem, 1.1vw, 0.875rem)	1.5	0	400	Informasi penting tidak boleh hanya di caption


Per Appelgren memakai label navigasi sekitar 11 px. Starter menaikkannya ke minimal 13 px agar tetap terbaca.
4.3 Aturan
- Huruf kapital hanya untuk tiga hal: display hero, navigasi, dan filter. Paragraf, caption, judul produk, dan label kecil di atas heading tidak dikapitalkan. Gunakan text-transform: uppercase di CSS, bukan menulis kapital di konten.
- Display besar memakai letter-spacing sedikit negatif dan bobot 700 sampai 800.
- Teks display yang terpotong tepi layar boleh hanya jika teks yang sama tersedia sebagai teks biasa yang terbaca (judul h1 atau caption). Salinan raksasa yang terpotong ditandai aria-hidden="true".
- Teks display tidak boleh menyebabkan scroll horizontal pada 360 px. Bungkus dengan overflow-x: clip.
- Jangan menonjolkan satu kata di dalam headline dengan warna atau italic berbeda sebagai kebiasaan.
- Italic dan serif editorial hanya bila cocok dengan klien (§4.1).
4.4 Pemuatan font
- Self-hosted lewat Fontsource varian variable (mis. @fontsource-variable/hanken-grotesk, @fontsource-variable/outfit), subset Latin, font-display: swap.
- Preload hanya file font display yang dipakai di atas lipatan. Jangan preload semua bobot.
- Fallback: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif. Sesuaikan metrik fallback (size-adjust, ascent-override) agar pergantian font tidak menggeser layout.
- Terkait motion: animasi teks yang memecah huruf atau baris (SplitText) harus menunggu font siap (document.fonts.ready) atau memakai autoSplit: true, kalau tidak pemecahan memakai metrik fallback dan hasilnya salah (§9.5).
- Hindari unduhan font besar yang tidak menambah nilai visual.
5. Layout dan spacing
5.1 Grid dan kontainer
- Dasar: CSS Grid 12 kolom. Layout tidak simetris diperbolehkan bila rasio foto dan urutan baca tetap jelas.
- Kontainer lebar: width: min(100% - 2 * var(--gutter), 1600px) dengan --gutter: clamp(16px, 3vw, 48px). Foto besar membutuhkan ruang; kedua referensi memakai ruang tepi yang kecil. (Draf Inggris memakai 1440 px; starter memilih 1600 px untuk fotografi.)
- Jaga jarak kiri dan kanan pada mobile. Foto tidak menempel ke tepi tanpa alasan desain. Foto yang sengaja terpotong tepi layar hanya pada komposisi dekoratif (hero atau kolase), bukan pada galeri fungsional.
- Hindari masonry kompleks bila menyebabkan urutan keyboard, layout shift, atau perilaku responsif yang sulit diprediksi. (Draf Inggris memakai CSS multi-column masonry; starter memilih CSS Grid dengan rasio asli karena urutan baca tetap kiri ke kanan.)
- Jangan memaksa semua foto ke crop yang sama bila merusak karya. Boleh menyatukan tinggi baris dan membiarkan lebar mengikuti rasio.
- Dua foto yang saling melengkapi boleh bersentuhan tanpa celah. Default tetap celah 8 sampai 24 px.
Spacing: skala berbasis 4 px: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Jarak vertikal antar-section: 64 px di mobile, 96 sampai 128 px di layar besar. Jarak antar-section harus lebih lega daripada jarak antar-elemen di dalam komponen. Spacing diatur oleh kontainer dan section, bukan margin ad-hoc pada konten.
5.2 Responsivitas dan breakpoint
Breakpoint tidak sepenuhnya sama dengan default Tailwind. Nilai xl sengaja 1200 px agar cocok dengan media query yang sudah ada di kode.
Nama	Nilai	Perilaku	Tailwind default
base	0	Mobile (360 sampai 767 px): satu atau dua kolom sesuai orientasi foto. Hero overlap: foto 70 sampai 80% lebar, kata display diskalakan dan boleh terpotong di tepi. Hero stagger: indentasi dihapus, rata kiri. Navigasi ringkas	n/a
sm	640 px	Galeri dua kolom, grid hero overlap	640 px (sama)
md	768 px	Tablet: dua atau tiga kolom. Indentasi stagger dikurangi separuh. Header, CTA lengket produk, kontak, dan about berubah ke dua kolom	768 px (sama)
lg	1024 px	GridLines aktif, hero stagger dua kolom, produk dua kolom. Efek pointer dan pin M2/M3 baru boleh aktif (§9)	1024 px (sama)
xl	1200 px	Desktop: tiga atau empat kolom, komposisi editorial penuh, grid unggulan 12 kolom, toko tiga kolom	1280 px (beda)


- Jangan menentukan jumlah kolom hanya dari breakpoint; cek lebar aktual kartu, panjang judul, dan proporsi gambar.
- Gunakan aspect-ratio, width/`height`, atau mekanisme reservasi ruang agar tidak ada layout shift.
- Lebar uji: 360 px (minimum yang wajib), 320 px (uji tekanan), 375, 768, 1024, 1200, dan 1440 px. Tidak ada scroll horizontal di lebar mana pun.
- Pada layar sentuh, jangan menggantungkan fungsi pada hover (@media (hover: hover) untuk peningkatan saja).
5.3 Garis grid terlihat (opsional, preset Bold dan Noir)
Meniru pola Gogoko: garis hairline yang tampak melewati section, dengan foto dan teks ditempatkan mengikuti garis.
- Komponen GridLines: lapisan position: absolute, pointer-events: none, aria-hidden="true", berada di belakang foto dan di belakang teks.
- Garis vertikal mengikuti kolom (misalnya setiap dua dari dua belas kolom). Garis horizontal berupa border-top: 1px solid var(--color-grid-line) pada section.
- Aktif hanya mulai 1024 px. Tidak ditampilkan di mobile.
- Jangan membuat penempatan foto bergantung pada garis; garis mengikuti tata letak, bukan sebaliknya.
.grid-lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to right,
    var(--color-grid-line) 0 1px,
    transparent 1px calc(100% / 6)
  );
}
6. Pola halaman
Rute mengikuti ARCHITECTURE.md. Paket menentukan halaman yang benar-benar aktif.
6.1 / Beranda
1. Hero (satu varian per proyek, lihat di bawah). Bila M3 aktif, scene 3D menjadi lapisan peningkatan pada hero yang sama.
2. Karya pilihan: 4 sampai 6 foto featured, komposisi asimetris dengan ukuran bervariasi, caption overlay. Di M2, kelompok karya bereveal saat memasuki viewport; foto dekoratif terpilih boleh mendapat parallax halus (§9.5).
3. Jalur ke galeri dan toko: dua CTA yang jelas.
4. Pengantar fotografer: singkat, dua sampai tiga kalimat.
Hero overlap (default Editorial dan Noir):
┌────────────────────────────────────────────────────┐
│ ARSIP                Nama Fotografer       KONTAK  │
│                                                    │
│                    ┌────────────┐                  │
│ Judul karya        │            │                  │
│ (caption kecil)    │    FOTO    │                  │
│                    │            │                  │
│                    │            │                  │
│ JUDUL RAKSASA ─────┼────────────┼───── TERPOTONG   │
└────────────────────────────────────────────────────┘
  kata display di belakang foto, rata bawah, bleed ke tepi
- Foto berada di atas teks (z-index lebih tinggi). Teks raksasa selalu salinan dekoratif dari judul yang terbaca di caption.
- Foto hero adalah kandidat LCP: jangan lazy-load, beri fetchpriority="high", dan jangan dianimasikan dari opacity: 0 (§9.2). Yang bergerak masuk adalah teks display dan caption.
- Tidak ada slideshow otomatis.
- M2: foto dan kata display bergerak berlawanan arah dengan offset kecil saat scroll, kata display tersingkap sebagian oleh foto (setara konsep pola #9, kode sendiri).
Hero stagger (default Bold):
┌────────────────────────────────────────────────────┐
│ LOGO      Galeri  Toko  Tentang  Kontak   [ Toko ] │
├────────┬───────────────────────────────────────────┤
│ ┌────┐ │ JUDUL HERO                                │
│ │FOTO│ │         BARIS KEDUA                       │
│ │    │ │    BARIS KETIGA                           │
│ │cap │ │                                           │
│ └────┘ │         [ LIHAT SEMUA FOTO ↓ ]            │
└────────┴───────────────────────────────────────────┘
  garis grid di belakang; foto dan teks mengikuti kolom
- Maksimal tiga baris pendek. Indentasi tiap baris kelipatan satu kolom grid.
- Satu h1 dengan tiga span blok; bukan tiga heading.
- Satu foto unggulan dengan caption overlay, bukan kolase.
- M1: tiga baris judul masuk bergantian (§9.5).
Hero dengan scene (M3, add-on). Scene adalah lapisan peningkatan di atas hero overlap atau stagger, bukan varian ketiga.
- Hero statis (foto <img> + teks) selalu ada di DOM dan adalah fallback sekaligus kandidat LCP.
- Kanvas WebGL ditumpuk di atas foto setelah halaman interaktif, memuat foto yang sama, lalu muncul dengan fade pendek setelah frame pertama selesai dirender. Tidak ada pergeseran layout.
- Katalog scene ada di §9.6. Hanya satu scene aktif per halaman.
6.2 /gallery
- Judul halaman, lalu FilterBar berhitung bila masuk paket.
- Grid dengan rasio asli. Caption overlay atau caption di bawah foto, konsisten di seluruh halaman.
- Lightbox bila masuk paket (§7.7). Foto yang punya productId menampilkan tautan ke detail produk.
- Tampilan stack (strip horizontal) hanya bila diminta (§7.6).
- Filter menukar foto yang terlihat tanpa memuat ulang halaman; fokus tetap di kontrol; jumlah hasil diumumkan dengan sopan ke pembaca layar (aria-live="polite").
- Di M2, kelompok kartu foto mendapat reveal saat masuk viewport dan kembali ke state awal secara konsisten saat discroll ke atas. Tidak ada pin atau parallax pada galeri fungsional.
- Setelah filter mengubah tinggi dokumen, panggil ScrollTrigger.refresh() bila M2 aktif.
- Galeri fungsional selalu DOM biasa, tidak pernah dirender di WebGL (§9.6).
6.3 /shop
Lebih tertib daripada galeri. Kartu seragam dalam ukuran, grid yang rapi, informasi harga selalu terlihat. Foto tetap mempertahankan rasio aslinya di dalam bingkai tinggi yang sama (gunakan object-fit: contain pada latar --color-surface bila crop merusak karya). Motion memakai reveal ringan M1; pada M2, kartu atau kelompok produk bereveal ketika memasuki viewport. Tidak ada parallax, pin, atau efek scene di toko.
6.4 /products/[id]
┌───────────────────────────────┬───────────────────────┐
│                               │ Judul                 │
│                               │ Kategori · Jenis      │
│            FOTO               │ Rp 350.000            │
│          (preview)            │ Lisensi / spesifikasi │
│                               │ [ Beli foto ]         │
│                               │ [ Tanya via WhatsApp ]│
└───────────────────────────────┴───────────────────────┘
- Desktop: foto sekitar 7 dari 12 kolom, panel info sticky di kanan. Mobile: foto, lalu info, lalu CTA.
- CTA utama menyebut tindakan: "Beli foto" atau "Pesan cetak".
- Panel tidak menampilkan stok, diskon, rating, atau status "terjual" bila datanya tidak dikelola.
- Untuk produk digital, tulis jelas bahwa pratinjau berwatermark dan file yang dibeli adalah resolusi penuh (bila watermark dipakai).
- Pada mobile, bar CTA lengket di bawah boleh dipakai; jika dipakai, tombol WhatsApp melayang disembunyikan di halaman itu.
- Tautan "Sebelumnya / Berikutnya" antar produk boleh ditambahkan di bawah panel.
- Pada M1/M2, foto lanjutan dan metadata boleh reveal saat masuk viewport; tanpa parallax, pin, atau scene 3D. Tidak ada gerak yang mengganggu pembacaan lisensi dan CTA.
- Tidak ada scene 3D dan tidak ada pin scroll di halaman ini.
6.5 /about, /contact, /404
- About: satu foto potret atau karya, teks singkat, tautan kontak. M1 memakai reveal sederhana; M2 menambahkan reveal terikat scroll dan parallax sangat halus pada foto potret dekoratif.
- Contact: CTA WhatsApp sebagai jalur utama, media sosial, email bila ada. Pada M2, teks dan CTA merespons saat section contact memasuki viewport; tombol tetap langsung dapat digunakan.
- 404: pesan yang menjelaskan apa yang terjadi dan dua tautan: galeri dan beranda.
7. Komponen dan pola UI
7.1 Header dan navigasi
- centered-wordmark: tiga zona. Kiri: satu tautan (Galeri atau Arsip). Tengah: nama fotografer. Kanan: Toko atau Kontak. Tanpa border dan tanpa dekorasi.
- split-nav: logo atau nama di kiri, navigasi di tengah, satu tombol menonjol (Toko) di kanan. Tidak ada ikon keranjang.
- Urutan tetap: Toko (bila ada) berada sebelum Kontak, sehingga Kontak selalu terakhir. Item navigasi dihasilkan dari data (mis. getNavItems()); jangan menganggap jumlah item tetap. Tanpa toko, tata letak mengencang tanpa celah atau slot kosong.
- Tautan aktif harus dikenali tanpa warna saja (garis bawah atau bobot).
- Area sentuh minimal 44 × 44 px walaupun teksnya kecil (tambahkan padding, bukan memperbesar huruf).
- Mobile: tiga tautan pada centered-wordmark cukup tetap terlihat. split-nav memakai menu ringkas (overlay layar penuh, fokus terkunci di dalamnya, Escape menutup, target sentuh besar) yang bisa dioperasikan keyboard dan sentuh. Saat menu terbuka, Lenis dihentikan (§9.4).
- Header boleh sticky dan minimal. Satu-satunya efek M2 pada header: bersembunyi saat scroll turun dan muncul saat scroll naik, dengan transform, tidak pernah menutupi fokus keyboard.
- Logo klien menggantikan teks nama; jangan meniru logo outline Gogoko atau wordmark Per Appelgren.
- Skip link "Lewati ke konten" adalah elemen pertama yang dapat difokuskan (§10).
7.2 Hero
Lihat §6.1. Aturan umum: satu foto kuat atau satu komposisi, headline ringkas, satu atau dua CTA. Tanpa slideshow otomatis. Tidak ada teks panjang di atas foto bila kontras buruk.
7.3 Kartu galeri
- Foto adalah elemen utama.
- Caption overlay: judul (tebal) dan satu baris metadata (kategori atau tahun) di kiri bawah, di atas gradien --color-scrim (linear-gradient(to top, var(--color-scrim), transparent 55%)). Teks putih. Periksa kontras pada foto paling terang (kasus terburuk terhitung 4,7 : 1, §3.3).
- Pada perangkat sentuh, caption selalu terlihat. Efek hover hanya peningkatan progresif (@media (hover: hover)): zoom halus 1,00 sampai 1,02 dan caption sedikit naik. Hover tidak pernah menjadi satu-satunya cara melihat informasi.
- Seluruh kartu boleh menjadi tautan hanya bila tujuannya jelas (lightbox atau detail produk), dengan nama aksesibel yang menyebut judul foto.
- Caption tidak memuat nama pemilik foto kecuali klien adalah kolektif atau marketplace beberapa fotografer (butuh field credit, §15).
- Foto memudar masuk (opacity saja) setelah selesai dimuat; tidak ada pergeseran layout. Foto di bawah lipatan: lazy-load.
7.4 Tombol dan tautan
Tentukan satu gaya primary dan satu secondary per proyek. CTA harus spesifik (§1.3).

Editorial dan Noir:
- Primary: isi --color-brand, teks --color-on-brand, sudut persegi atau pil sesuai merek, tinggi minimal 44 px.
- Secondary: teks dengan garis bawah, tanpa kotak.
Bold (outline dengan bayangan keras):
.btn-hard {
  min-height: 44px;
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--color-brand);
  background: var(--color-bg);
  color: var(--color-brand);
  box-shadow: 4px 4px 0 var(--color-brand);
  text-decoration: underline;
  text-underline-offset: 0.25em;
}
@media (prefers-reduced-motion: no-preference) {
  .btn-hard { transition: transform var(--duration-fast), box-shadow var(--duration-fast); }
}
.btn-hard:hover  { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--color-brand); }
.btn-hard:active { transform: translate(4px, 4px); box-shadow: 0 0 0 var(--color-brand); }
.btn-hard:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 4px; }
Aturan bersama: hover, active, dan focus-visible harus terlihat jelas; status disabled hanya bila ada. Tautan eksternal membuka tab baru hanya bila berguna, dengan rel="noopener noreferrer". Panah (↓) boleh pada satu atau dua CTA utama, bukan di setiap tautan. Tombol tidak memakai efek magnet atau kursor kustom (§14).
7.5 Filter kategori
- Bentuk: baris tautan atau tombol: "Semua (48)", "Fashion (34)", "Beauty (14)". Jumlah dihitung dari gallery.json saat build, bukan ditulis tangan.
- Huruf kapital lewat CSS; jumlah ditampilkan lebih kecil di samping label.
- Item aktif ditandai dengan garis bawah atau bobot, bukan warna saja, dan memakai aria-pressed atau aria-current. "Semua" selalu pertama.
- Nama aksesibel memuat jumlah: "Fashion, 34 foto".
- Filter bekerja di browser tanpa backend dan tetap bisa dipakai tanpa animasi. Di M1 ke atas, kartu yang tersisa boleh bergeser dengan GSAP Flip (durasi di bawah 400 ms), tetapi hasil akhirnya identik dengan versi tanpa animasi.
7.6 Pengalih tampilan dan tampilan alternatif (opsional, P2)
- Pengalih tampilan: hanya muncul bila minimal dua tampilan aktif. Bentuknya kontrol segmen (pil) dengan satu opsi aktif bergaya solid. Gunakan kelompok tombol dengan aria-pressed atau radio berlabel.
- grid: tampilan bawaan.
- stack: strip horizontal berisi foto dengan tinggi seragam dan lebar mengikuti rasio, memakai overflow-x: auto dan scroll-snap. Wajib bisa dioperasikan keyboard dan sentuh; tidak boleh mengunci scroll halaman. Container strip diberi data-lenis-prevent agar tidak berebut dengan Lenis. Di M2 desktop, strip boleh ditingkatkan menjadi galeri horizontal ber-pin (§9.5, maksimal satu per halaman, versi native tetap menjadi fallback).
- board (kanvas bebas pada referensi) tidak termasuk starter.
- Tampilan daftar (indeks): baris dengan tahun, judul, dan kategori. Sertakan thumbnail kecil yang selalu terlihat, bukan hanya pratinjau saat hover (tidak bisa dipakai di layar sentuh). Butuh field year (§15).
- Pil melayang di tengah bawah (seperti Per Appelgren) tunduk pada aturan elemen fixed di §7.8.
7.7 Lightbox
Jika masuk scope:
- Latar gelap netral. Foto tampil sebesar viewport mengizinkan dengan rasio terjaga.
- Kontrol: tutup (berlabel jelas), sebelumnya, berikutnya, dan indikator posisi ("3 / 8").
- Keyboard: Escape menutup; panah kiri dan kanan berpindah foto; Tab tetap di dalam lightbox. Fokus terlihat.
- Sentuh: geser untuk berpindah; ketuk tombol tutup atau latar untuk menutup. Kontrol terjangkau satu ibu jari.
- Aksesibilitas: semantik dialog dengan nama aksesibel; fokus pindah ke dalam saat terbuka dan kembali ke pemicu saat tertutup; teks alt foto tersedia.
- Scroll dan motion: cegah scroll latar saat terbuka (panggil lenis.stop() bila M2 aktif, lalu lenis.start() saat tertutup) dan beri data-lenis-prevent pada dialog. Sembunyikan elemen fixed lain (WhatsApp melayang, pengalih tampilan). Dengan reduced motion, hanya fade instan.
- Tanpa autoplay, zoom berlebihan, atau animasi panjang. Lightbox adalah DOM biasa, bukan WebGL.
7.8 Elemen fixed
Referensi memakai dua elemen yang menempel di layar (pil di tengah bawah pada Per Appelgren, tombol WhatsApp di kanan bawah pada Gogoko). Agar tidak saling menutup:
- Maksimal satu elemen fixed di area bawah pada satu waktu.
- Hormati env(safe-area-inset-bottom).
- Elemen fixed tidak boleh menutupi CTA utama, bar CTA produk, atau footer.
- WhatsApp melayang: bulat, --color-whatsapp, nama aksesibel jelas ("Chat WhatsApp"). Label teks ("Ada pertanyaan?") hanya ditampilkan mulai 640 px; di mobile cukup ikon. Pesan terisi otomatis memuat konteks halaman (nama produk bila ada).
- Indikator progres scroll (M2) berupa garis tipis di tepi atas viewport, bukan elemen di area bawah, sehingga tidak termasuk hitungan elemen fixed bawah. Garis itu dekoratif (aria-hidden).
7.9 Kartu produk dan detail
- Tampilkan foto, nama, harga, dan jenis atau label produk dengan jelas. Pada detail, jelaskan lisensi digital atau spesifikasi fisik dari informasi klien. Harga memakai gaya Small atau Label, bukan badge.
- Karena tidak ada cart, CTA mengarah ke checkout eksternal per produk atau WhatsApp. Teks bantu di bawah tombol beli boleh menyebut bahwa pembeli akan diarahkan ke halaman checkout eksternal (tulis nama penyedia hanya bila sudah dipastikan).
- Produk yang tidak tersedia menampilkan catatan bergaya nonaktif ("Sedang tidak tersedia") dan tanpa tautan.
- Jangan menampilkan stok, diskon, rating, atau "terjual" kecuali datanya dikelola.
- Jangan menampilkan klaim bahwa pembayaran berhasil; website tidak mengetahui status transaksi. Jangan menampilkan logo atau klaim metode pembayaran sebelum diverifikasi.
7.10 Footer
Nama atau logo, hak cipta, tautan sosial, dan tautan navigasi yang sama dengan header (dari sumber data yang sama). Garis hairline di atas, padding lega, huruf kecil. Tautan legal yang relevan: jangan mengarang kebijakan legal; teks legal dan privasi harus disediakan atau disetujui pemilik bisnis. Tidak ada kolom kosong; tautan Toko hanya bila toko aktif.
7.11 Tabel state interaksi
Elemen	Default	Hover	Focus-visible	Active	Nonaktif
Tautan	Warna teks, garis bawah saat hover	Warna --color-brand	Outline 2 sampai 3 px --color-focus, offset 2 sampai 4 px	Sedikit lebih gelap	n/a
Tautan navigasi	Gaya nav-filter	Garis bawah	Outline	Garis bawah	n/a
Tombol primary	Isi --color-brand (Bold: outline + bayangan keras)	Sedikit lebih gelap (Bold: bayangan menyusut)	Outline + offset	Warna tekan (Bold: bayangan hilang)	Redup, tanpa pointer, tidak bisa difokuskan sebagai tautan
Chip filter	Teks, tanpa isi	Garis bawah	Outline	Terisi atau tebal	n/a
Kartu galeri	Foto + caption overlay	Zoom halus (hanya hover: hover)	Sama dengan hover + outline	n/a	n/a


Hover tidak pernah menjadi satu-satunya cara menampilkan informasi: fokus dan sentuhan harus memunculkan konten yang sama.
7.12 Video (opsional, P2)
Starter berfokus pada foto. Bila klien memerlukan video: pola facade (poster 16:9 dengan tombol putar yang terlihat, iframe baru dimuat saat diklik), iframe diberi title, tombol facade punya nama aksesibel, tidak ada autoplay dengan suara, dan tidak ada video latar (§14).
8. Aturan gambar
8.1 Preview dan watermark
- Gunakan preview hasil pipeline gambar, bukan foto master.
- Pertahankan rasio asli bila rasio bagian dari karya; crop hanya bila dikonfirmasi.
- Tentukan ukuran berdasarkan tempat pemakaian, bukan satu ukuran maksimal untuk semua konteks.
- Watermark harus terlihat dengan tujuan yang disepakati, tetapi tidak menutupi subjek utama. Posisi dan opacity bisa diubah sesuai materi.
- Watermark tidak boleh dipasarkan sebagai jaminan foto tidak dapat diunduh atau dicuri.
- Pada foto yang ditimpa teks atau caption, periksa watermark tidak bertabrakan dengan caption.
8.2 Teks alternatif
- alt mendeskripsikan isi foto secara ringkas. Gambar dekoratif memakai alt="".
- Jangan memakai nama file atau kata kunci SEO berulang sebagai pengganti alt.
- Build sebaiknya gagal bila foto informatif tidak punya alt dan tidak ditandai dekoratif.
8.3 Performa
- WebP sebagai baseline; AVIF hanya bila manfaatnya terukur dan fallback benar.
- Sajikan ukuran sumber sesuai kebutuhan tampilan (srcset dan sizes).
- Foto hero atau LCP: tanpa lazy-load dan dengan fetchpriority="high". Gambar di bawah lipatan: lazy-load.
- Dimensi (width dan height) harus diketahui untuk setiap foto agar tidak ada layout shift (§15).
8.4 Foto di WebGL (hanya bila M3 aktif)
- Fidelitas warna adalah aturan keras. Fotografer menilai karyanya dari warna; scene tidak boleh mengubahnya. Tekstur foto memakai colorSpace = SRGBColorSpace, renderer.toneMapping = NoToneMapping, outputColorSpace = SRGBColorSpace. Shader kustom memakai #include <colorspace_fragment> di akhir fragment shader. Uji dengan menaruh foto DOM dan kanvas berdampingan; selisih warna yang terlihat berarti konfigurasi salah (§9.6).
- Tekstur diambil dari preview yang sama dengan foto DOM (bukan master), maksimal 2048 px sisi terpanjang di desktop dan 1536 px di mobile.
- Efek distorsi hanya pada hero dan komposisi dekoratif. Foto yang dijual atau dilihat detail (galeri, lightbox, produk) tidak melewati shader.
9. Motion, scroll, dan 3D
Bagian ini menggantikan §9 versi v2. Teknologi resmi: Lenis, GSAP (termasuk ScrollTrigger, SplitText, Flip), dan Three.js. Tidak ada pustaka animasi atau 3D lain, dan tidak ada React atau React Three Fiber. Implementasi memakai komponen Astro dan TypeScript atau JavaScript biasa.
9.1 Tingkat motion
Satu codebase, empat level. Level aktif ditentukan konfigurasi proyek (§11), paket menentukan level tertinggi yang boleh dipakai.
Level	Isi	Teknologi yang dimuat	Paket (usulan)
M0	Hanya transisi hover dan fokus CSS (100 sampai 200 ms). Tidak ada JavaScript motion	CSS	Lite, dan dasar semua paket
M1	Satu urutan masuk saat halaman dimuat (hero), reveal teks dan gambar sekali saat masuk viewport, stagger kartu, reflow filter. Tanpa smooth scroll, tanpa animasi terhubung scroll	GSAP (core, SplitText, Flip). Pemicu reveal memakai IntersectionObserver, ScrollTrigger belum dimuat	Standard
M2	M1 + smooth scroll desktop + scroll choreography pada setiap section konten utama: reveal yang mengikuti posisi scroll, parallax terukur, penyingkapan teks/display, progres scroll, dan galeri horizontal ber-pin (opsional). Respons scroll berlaku di beranda, galeri, detail karya, about, dan contact; shop serta detail produk memakai reveal ringan tanpa parallax/pin/WebGL sesuai batas tiap halaman (§9.5).	+ Lenis, + ScrollTrigger	Plus; level utama untuk pengalaman scroll-interaktif
M3	M2 + satu scene Three.js pada hero (§9.6). Scene menerima progres scroll dari GSAP/ScrollTrigger dan dapat diberi respons pointer terbatas; bukan scene 3D yang berdiri sendiri.	+ Three.js (dynamic import, chunk terpisah)	Add-on terpisah


Aturan level:
- Level lebih tinggi tidak boleh membuat level lebih rendah rusak. Mematikan M3 meninggalkan M2 yang utuh; mematikan M2 meninggalkan M1 yang utuh.
- Kode level tinggi dimuat hanya bila levelnya aktif. Proyek M0 tidak mengunduh byte GSAP, Lenis, atau Three.js.
- Target pengalaman Pholio yang mengutamakan scroll interaktif adalah M2. M1 tetap menjadi fallback yang lebih ringan; M3 dipilih bila hero membutuhkan dimensi WebGL.
- M3 wajib mencakup M2: jangan mengaktifkan Three.js tanpa Lenis dan ScrollTrigger pada profil M3.
- Keputusan paket final tetap di proposal; tabel ini usulan (lihat §12 dan §15).
9.2 Aturan umum
1. Konten dulu. Tanpa JavaScript, dengan reduced motion, atau saat WebGL gagal, halaman tetap lengkap. Elemen yang akan dianimasikan baru disembunyikan lewat kelas motion-ready yang dipasang skrip inline kecil (kode di §9.5). Tanpa JS kelas itu tidak pernah ada, sehingga tidak ada yang tersembunyi.
2. Jangan menunda LCP. Foto hero (atau h1 bila halaman tidak punya foto di atas lipatan) tidak boleh disembunyikan menunggu JS dan tidak boleh dianimasikan dari opacity: 0. Animasi foto hero memakai clip-path atau transform yang tetap menyisakan piksel terlihat sejak frame pertama.
3. Hanya properti murah. Animasikan transform, opacity, dan clip-path. Jangan menganimasikan width, height, top, left, atau margin. Pakai will-change seperlunya dan lepas setelah selesai.
4. Reduced motion. Bila prefers-reduced-motion: reduce: Lenis tidak dibuat (scroll native), tidak ada parallax, pin, atau transform, elemen langsung berada di kondisi akhir, perubahan state boleh berupa opacity di bawah 150 ms, scene 3D hanya dirender sekali tanpa gerak atau diganti foto statis.
5. Satu ticker. GSAP memiliki ticker global. Lenis dan scene Three.js yang aktif ikut ticker itu. Dilarang membuat loop requestAnimationFrame sendiri.
6. Satu Lenis. Tepat satu instance Lenis, pada window. Tidak ada scroll container kustom.
7. Pembersihan wajib. Semua animasi, ScrollTrigger, listener, dan resource WebGL punya jalur pembersihan (gsap.matchMedia().revert(), ScrollTrigger.kill(), dispose()). Tidak ada yang tersisa setelah halaman diganti atau scene dihentikan.
8. Scroll choreography, bukan gerak acak. Pada M2/M3, setiap section konten utama yang dilewati pengunjung harus memiliki minimal satu respons scroll yang disengaja: reveal/progres saat memasuki viewport, pergeseran kedalaman, atau perubahan komposisi yang terikat progres scroll. Tidak semua elemen bergerak; pilih maksimal satu sampai dua pola per section dan pertahankan hierarki foto. Urutan masuk hero tetap satu kali per halaman. Pada M0/M1, animasi tetap lebih ringan dan tidak wajib terikat scroll.
9. Durasi. Tiap animasi UI 120 sampai 400 ms. Reveal gambar dan teks sampai 600 ms. Urutan masuk hero selesai dalam 1,2 detik (stagger termasuk). Animasi terhubung scroll tidak punya durasi, hanya jangkauan scroll.
10. Tanpa scroll-jacking. Jangan mengubah arah atau kecepatan scroll melebihi penghalusan Lenis, jangan menahan pengunjung untuk menonton animasi, dan jangan mengunci scroll kecuali untuk modal. Pin: maksimal satu per halaman, hanya desktop, panjang pin maksimal tiga tinggi viewport (§9.5).
11. Gerak otomatis. Gerak yang mulai sendiri dan berlangsung lebih dari 5 detik harus bisa dijeda atau dihentikan (WCAG 2.2.2). Pilihan desain bawaan: scene hanya bergerak sebagai respons pointer atau scroll, tidak berputar sendiri tanpa batas.
12. Tidak menghalangi interaksi. CTA, tautan, dan foto bisa diklik dan difokuskan sejak awal. Jangan memakai pointer-events: none pada elemen interaktif sambil menunggu animasi.
13. Ukur sebelum menambah. Setiap animasi baru punya tujuan visual yang bisa disebut (§1.2 poin 6) dan dampak performa yang diukur (§9.8).
9.3 Pembagian tugas teknologi
Teknologi	Peran	Memiliki	Tidak boleh
CSS	Transisi sederhana	Hover, fokus, toggle, fade gambar setelah dimuat	Menggantikan timeline yang memerlukan urutan
Lenis	Rasa dan koordinasi scroll	Smooth wheel/trackpad desktop, anchor, stop/start untuk modal; memberi posisi scroll konsisten kepada GSAP	Menjadi mesin animasi; membuat loop sendiri (autoRaf: false)
GSAP + ScrollTrigger	Mesin utama motion interaktif	Menghubungkan progres scroll dengan reveal, transform, parallax, masking, section transitions, dan ticker global	Dipakai untuk hal sederhana yang cukup ditangani CSS; membuat gerak tanpa tujuan
Three.js	Dimensi visual yang mengikuti scroll	Scene WebGL hero; menerima nilai progres dari GSAP/ScrollTrigger dan merespons pointer secara terbatas	Menjadi dependensi runtime global; dimuat di halaman tanpa kebutuhan 3D; merender galeri fungsional


Urutan pilihan: pakai yang paling ringan yang cukup. CSS untuk state sederhana; GSAP untuk gerak; ScrollTrigger untuk semua gerak yang harus mengikuti progres/posisi scroll; Lenis untuk rasa scroll desktop; Three.js untuk satu momen kedalaman 3D yang menerima progres scroll. Untuk M2/M3, GSAP + ScrollTrigger adalah penggerak utama scroll choreography; Lenis bukan pengganti ScrollTrigger dan Three.js bukan pengganti GSAP.
9.4 Runtime global: Lenis + GSAP (M2)
Pola integrasi mengikuti dokumentasi Lenis: Lenis tidak membuat loop sendiri, digerakkan oleh ticker GSAP, dan memberi tahu ScrollTrigger tiap kali posisi scroll berubah. Untuk scroll pada window, ScrollTrigger.scrollerProxy() tidak diperlukan.
// src/scripts/motion/runtime.ts
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export const getLenis = () => lenis;

export function startSmoothScroll(): Lenis | null {
  if (lenis || reduceMotion.matches) return lenis;

  lenis = new Lenis({
    autoRaf: false,            // GSAP ticker yang menggerakkan Lenis
    smoothWheel: true,
    syncTouch: false,          // sentuh tetap scroll native
    anchors: true,
    stopInertiaOnNavigate: true,
  });

  lenis.on("scroll", ScrollTrigger.update);    // ScrollTrigger membaca posisi terbaru
  tick = (time) => lenis?.raf(time * 1000);    // detik (GSAP) menjadi milidetik (Lenis)
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);                 // cegah jeda pada animasi scroll
  return lenis;
}

export function stopSmoothScroll(): void {
  if (!lenis) return;
  if (tick) gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  tick = null;
  gsap.ticker.lagSmoothing(500, 33);           // kembalikan nilai bawaan GSAP
}

// Ikuti perubahan preferensi pengguna saat halaman terbuka
reduceMotion.addEventListener("change", () =>
  reduceMotion.matches ? stopSmoothScroll() : startSmoothScroll(),
);
Tiga detail yang tidak boleh dilewatkan:
1. autoRaf: false mencegah Lenis membuat loop animasinya sendiri, sehingga hanya ada satu loop.
2. time * 1000 mengubah satuan waktu ticker GSAP (detik) menjadi milidetik yang dibutuhkan Lenis.
3. ScrollTrigger.update memastikan ScrollTrigger selalu membaca posisi scroll terbaru.
Aturan Lenis:
- Dimuat dengan dynamic import hanya bila motion.level adalah m2 atau m3, lalu startSmoothScroll() dipanggil sekali dari layout global.
- Impor lenis/dist/lenis.css dan hapus scroll-behavior: smooth buatan sendiri agar tidak bentrok.
- Sentuh tetap native (syncTouch: false). Lenis menghaluskan wheel/trackpad desktop; pada ponsel/tablet, browser tetap menangani scroll native. ScrollTrigger tetap wajib merespons scroll native tersebut, sehingga animasi scroll M2/M3 tetap aktif di perangkat sentuh. Scrollbar native dan tombol keyboard (PageDown, Space, Home, End) harus tetap berfungsi; uji.
- Modal, menu overlay, dan lightbox: panggil getLenis()?.stop() saat terbuka dan start() saat tertutup, dan beri data-lenis-prevent pada elemen yang punya scroll sendiri (dialog, strip stack, panel menu).
- Anchor dan skip link: anchors: true menangani scroll ke #id. Uji dengan keyboard dan pembaca layar bahwa fokus tetap berpindah ke target; bila tidak, panggil target.focus({ preventScroll: true }) setelah scroll selesai (target diberi tabindex="-1").
- Jangan membuat instance Lenis per halaman atau per komponen.
- Setelah font siap atau konten mengubah tinggi dokumen (filter, accordion), panggil ScrollTrigger.refresh().
- Bila Lenis menimbulkan masalah di halaman tertentu (mis. area dengan scroll bersarang yang rumit), matikan di halaman itu dengan stopSmoothScroll(); jangan menambal dengan kontainer scroll kustom.
9.5 Katalog animasi GSAP
Semua animasi dibuat di dalam gsap.matchMedia() (kondisi motion dan ukuran layar) sehingga pembersihan dan perubahan viewport ditangani otomatis. Tabel ini adalah daftar tertutup: pola di luar tabel perlu persetujuan dan masuk tabel lebih dulu.
Pola	Level	Teknik	Aturan
Urutan masuk hero	M1	gsap.timeline: foto lewat clip-path, baris judul dan caption lewat yPercent + autoAlpha	Sekali per muat; total ≤ 1,2 s; foto tidak dari opacity: 0
Scroll choreography section	M2	ScrollTrigger scrub: true untuk mengikat yPercent, clip-path, scale ringan, atau mask teks ke progres section	Wajib ada pada setiap section konten utama; pilih 1–2 pola per section; gerak maju/mundur mengikuti arah scroll; tidak menahan atau mengambil alih scroll
Reveal saat section masuk/keluar	M2	ScrollTrigger onEnter/`onEnterBack` atau timeline terikat progres	Berlaku pada hero lanjutan, karya pilihan, about, contact, serta konten gallery/shop/detail; harus terlihat saat scroll turun maupun naik; jangan mengulang animasi berlebihan
Reveal judul	M1	SplitText per baris dengan mask: "lines" dan autoSplit: true	Hanya h1 dan h2, bukan paragraf panjang; tunggu font siap
Reveal gambar	M1	clip-path atau scale 1,04 ke 1 pada pembungkus; dipicu IntersectionObserver, once	≤ 600 ms; hanya di bawah lipatan; ukuran elemen tidak berubah
Stagger kartu	M1	gsap.from(items, { stagger }) per batch	Maksimal 12 item per batch; once
Reveal karya saat discroll	M2	ScrollTrigger pada kartu/kelompok gambar; clip reveal atau y-offset kecil yang mengikuti viewport	Setiap kelompok karya mendapat respons saat masuk viewport; tanpa parallax individual yang berat; galeri tetap DOM biasa dan urutan baca tidak berubah
Kedalaman foto dekoratif	M2	ScrollTrigger scrub: true, yPercent ±6 sampai ±8	Hero, foto dekoratif, atau portrait about; tidak pada gambar yang perlu dibandingkan/detail; di bawah 768 px dikurangi atau dimatikan
Reflow filter	M1	GSAP Flip	≤ 400 ms; hasil akhir sama dengan tanpa animasi
Penyingkapan teks display	M2	Foto dan kata display bergerak berlawanan, terhubung scroll (setara pola #9)	Hanya hero; teks lengkap tetap ada di h1
Progres scroll	M2	scaleX garis atas viewport, scrub: true	Dekoratif (aria-hidden)
Galeri horizontal ber-pin	M2, opsional	ScrollTrigger pin + scrub, hanya pada (min-width: 1024px) and (hover: hover)	Maksimal satu per halaman; panjang pin ≤ 3 tinggi viewport; versi overflow-x: auto + scroll-snap tetap menjadi fallback
Transisi halaman	M2, opsional	ClientRouter Astro + cross-fade (§9.7)	≤ 400 ms; tanpa tirai berat
Microinteraction	M0 dan M1	CSS lebih dulu; GSAP tween hanya bila CSS tidak cukup	Tidak ada efek magnet atau kursor kustom (§14)


Sembunyikan awal yang aman (kelas motion-ready). Skrip ini berada di <head>, berjalan sebelum render, dan hanya memasang kelas bila motion diizinkan. Tanpa JavaScript, kelas tidak ada dan semua konten terlihat.
<script is:inline>
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    // Pengaman: bila runtime motion tidak siap dalam 2,5 detik, tampilkan semuanya
    setTimeout(() => root.classList.remove("motion-ready"), 2500);
  }
</script>
/* Jangan pernah memberi data-reveal pada foto LCP */
.motion-ready [data-reveal] { opacity: 0; }
Runtime menetapkan kondisi awal lewat gsap.from(...) (yang langsung menyetel opacity: 0 inline), baru kemudian menghapus kelas motion-ready dan menjalankan animasi.

Urutan masuk hero (M1). Foto tetap terlihat sejak awal; hanya bukaan clip-path yang beranimasi.
// src/scripts/motion/scroll-animations.ts
import gsap from "gsap";

export function initHeroEntrance(scope: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const q = gsap.utils.selector(scope);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(q("[data-hero-photo]"),
        { clipPath: "inset(0 0 8% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.6 })
      .from(q("[data-hero-line]"),
        { yPercent: 25, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, "-=0.35")
      .from(q("[data-hero-caption]"),
        { autoAlpha: 0, duration: 0.4 }, "-=0.2");
  });

  return () => mm.revert();   // pembersihan: dipanggil sebelum halaman diganti
}
Reveal judul dengan SplitText (M1, GSAP 3.13 ke atas). autoSplit memecah ulang saat font selesai dimuat atau ukuran berubah, dan tween yang dikembalikan onSplit disinkronkan ulang otomatis.
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

SplitText.create("[data-split]", {
  type: "lines",
  mask: "lines",
  autoSplit: true,
  onSplit(self) {
    return gsap.from(self.lines, {
      yPercent: 110, duration: 0.6, stagger: 0.08, ease: "power3.out",
    });
  },
});
SplitText secara bawaan (aria: "auto") memasang aria-label pada elemen yang dipecah dan aria-hidden pada potongannya. Tetap verifikasi dengan pembaca layar bahwa judul dibaca sebagai satu kalimat utuh; bila judul berisi tautan atau elemen bersarang, pakai aria: "none" dan sediakan duplikat khusus pembaca layar.

Parallax dan pin (M2).
const mm = gsap.matchMedia();

// Parallax halus
mm.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax ?? 6);        // persen
    gsap.fromTo(el, { yPercent: amount }, {
      yPercent: -amount, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
});

// Galeri horizontal ber-pin (opsional, desktop saja)
mm.add("(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
  const section = document.querySelector<HTMLElement>("[data-pin-gallery]");
  const track = section?.querySelector<HTMLElement>("[data-pin-track]");
  if (!section || !track) return;

  const distance = () => track.scrollWidth - section.clientWidth;
  gsap.to(track, {
    x: () => -distance(), ease: "none",
    scrollTrigger: {
      trigger: section, pin: true, scrub: true, start: "top top",
      end: () => `+=${distance()}`, invalidateOnRefresh: true,
    },
  });
});
Bungkus gambar parallax dengan overflow: clip dan buat gambarnya sedikit lebih tinggi dari bingkai supaya tidak muncul celah. Pada mode pin, strip stack diset overflow: visible di dalam kondisi media yang sama; di luar kondisi itu, strip kembali menjadi overflow-x: auto native.
9.6 Three.js: scene 3D
Three.js adalah lapisan 3D untuk pengalaman scroll-interaktif M3. Ia selalu menjadi peningkatan di atas M2, bukan pengganti GSAP/Lenis dan bukan fondasi semua halaman. GSAP/ScrollTrigger mengirim progres scroll yang sudah dinormalisasi ke uniform scene; Three.js merender respons visualnya. Jangan membuat loop scroll atau requestAnimationFrame terpisah.

Di mana boleh dan tidak boleh
Boleh	Tidak boleh
Hero beranda (satu scene)	Galeri fungsional, lightbox, toko, halaman produk
Komposisi dekoratif di beranda atau about (maksimal satu scene lagi, hanya bila terukur)	Header, footer, navigasi
	Merender foto yang dijual atau dinilai detailnya
	Halaman tanpa kebutuhan 3D (tidak boleh dimuat sama sekali)


Katalog scene
Scene	Deskripsi	Prioritas
depth-photo (default)	Foto hero pada satu bidang dengan distorsi UV halus yang mengikuti progres scroll sebagai perilaku utama, dengan respons pointer terbatas sebagai pelengkap. Progres dikirim dari GSAP/ScrollTrigger; satu plane, satu shader kecil, tanpa post-processing	P0 untuk M3
particles	Butir halus (debu atau grain) di belakang foto yang bereaksi pada pointer; paling serasi dengan preset Noir. Jumlah partikel dibatasi (titik awal: 2.000 desktop, 800 mobile; ukur ulang)	P1
contact-sheet	Dinding atau strip 3D dari foto unggulan yang bergeser mengikuti scroll, murni dekoratif. Alternatif visual untuk tampilan board yang tidak diadopsi	P2


Strategi muat dan siklus hidup
1. Dynamic import. import("three") dipanggil hanya saat host scene mendekati viewport (IntersectionObserver, rootMargin: "200px"). Impor kelas satu per satu agar tree-shaking bekerja. Three.js tidak pernah diimpor oleh runtime global.
2. Lewati scene bila WebGL2 tidak tersedia, bila navigator.connection?.saveData aktif, atau bila impor gagal. Hasilnya adalah hero statis, bukan galat.
3. Render sesuai kebutuhan. Scene statis dirender sekali dan saat resize atau input berubah. Scene beranimasi memakai ticker GSAP hanya saat terlihat dan tab aktif, dan berhenti sepenuhnya di luar viewport atau saat document.hidden.
4. Pixel ratio terbatas. Math.min(window.devicePixelRatio, 2) di desktop dan 1,5 di mobile (titik awal). Turunkan satu tingkat bila median 30 frame terakhir lebih dari 24 ms.
5. Ukuran lewat ResizeObserver pada host, bukan event window.resize. Reservasi ruang host dengan aspect-ratio agar tidak ada layout shift.
6. Kehilangan konteks. Tangani webglcontextlost: preventDefault(), hentikan loop, tandai data-scene-ready="failed", dan biarkan hero statis terlihat.
7. Pembersihan eksplisit. Daftarkan setiap geometry, material, dan texture (termasuk yang disimpan di uniforms) ke satu daftar saat dibuat, lalu dispose() semuanya, ditambah renderer.dispose(), renderer.forceContextLoss(), dan menghapus kanvas.
8. Warna setia pada foto (§8.4): SRGBColorSpace untuk tekstur dan output, NoToneMapping, uji berdampingan dengan foto DOM.
9. Hero statis tetap ada sebagai kandidat LCP dan fallback (§6.1). Kanvas muncul dengan fade setelah frame pertama (data-scene-ready="true"), tidak menggeser layout.
10. Perangkat sentuh: efek pointer diganti gerak halus terhubung scroll atau dimatikan. Progres scroll native tetap menggerakkan scene melalui ScrollTrigger. Jangan meminta izin sensor perangkat hanya demi efek.
11. Integrasi scroll: scene tidak membaca setiap event scroll untuk membuat render loop sendiri. ScrollTrigger/GSAP memperbarui nilai progres atau uniform; satu ticker GSAP merender scene hanya saat scene terlihat, tab aktif, dan reduced motion tidak aktif.
Pengelola scene (kerangka). Satu modul yang mengurus pemuatan, visibilitas, dan pembersihan; tiap scene hanya mengimplementasikan kontrak SceneInstance.
// src/scripts/three/scene-manager.ts
import gsap from "gsap";

export interface SceneInstance {
  render(): void;     // satu frame; scene juga merender ulang sendiri saat resize
  dispose(): void;    // lepaskan semua resource GPU dan hapus kanvas
}
export type SceneFactory = (
  host: HTMLElement,
  three: typeof import("three"),
) => Promise<SceneInstance>;

export function mountScene(
  host: HTMLElement,
  load: () => Promise<{ default: SceneFactory }>,
): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let instance: SceneInstance | null = null;
  let visible = false;
  let running = false;
  let destroyed = false;

  const frame = () => instance?.render();
  const sync = () => {
    const want = !!instance && visible && !document.hidden && !reduce.matches;
    if (want && !running) { gsap.ticker.add(frame); running = true; }
    if (!want && running) { gsap.ticker.remove(frame); running = false; }
  };

  const io = new IntersectionObserver(async ([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !instance && !destroyed) {
      try {
        const [three, mod] = await Promise.all([import("three"), load()]);
        if (destroyed) return;
        instance = await mod.default(host, three);
        if (destroyed) { instance.dispose(); instance = null; return; }
        if (reduce.matches) instance.render();      // satu render statis
        host.dataset.sceneReady = "true";
      } catch {
        host.dataset.sceneReady = "failed";         // hero statis tetap terlihat
      }
    }
    sync();
  }, { rootMargin: "200px" });

  io.observe(host);
  document.addEventListener("visibilitychange", sync);
  reduce.addEventListener("change", sync);

  return () => {                                    // pembersihan permanen
    destroyed = true;
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    reduce.removeEventListener("change", sync);
    if (running) gsap.ticker.remove(frame);
    instance?.dispose();
    instance = null;
  };
}
Pola pelacakan resource di dalam scene:
const disposables: { dispose(): void }[] = [];
const track = <T extends { dispose(): void }>(resource: T): T => (disposables.push(resource), resource);

const geometry = track(new three.PlaneGeometry(1, 1, 32, 32));
const texture = track(await new three.TextureLoader().loadAsync(src));
texture.colorSpace = three.SRGBColorSpace;
// ...
return {
  render: () => renderer.render(scene, camera),
  dispose() {
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  },
};
9.7 Integrasi Astro
Struktur kode (usulan untuk ARCHITECTURE.md; buat berkas hanya saat dibutuhkan):
src/
  components/motion/ThreeScene.astro   # host scene + <img> fallback
  scripts/
    motion/
      runtime.ts            # Lenis + ticker GSAP global (M2)
      scroll-animations.ts  # reveal, parallax, pin
      transitions.ts        # transisi halaman (opsional)
    three/
      scene-manager.ts      # muat, visibilitas, pembersihan
      scenes/hero-depth-photo.ts
Berkas	Tanggung jawab
runtime.ts	Satu Lenis global dan ticker GSAP
scroll-animations.ts	Animasi DOM (ScrollTrigger dan reveal)
transitions.ts	Transisi antarhalaman
scene-manager.ts	Siklus hidup scene
scenes/*.ts	Satu scene per berkas, mengikuti kontrak SceneInstance


Siklus hidup halaman. Default starter adalah situs multi-halaman biasa tanpa ClientRouter: skrip modul Astro berjalan sekali per muat halaman dan pembersihan terjadi otomatis saat halaman ditinggalkan. Bila ClientRouter (View Transitions) dipakai:
- Skrip modul tidak otomatis berjalan ulang di tiap navigasi. Inisialisasi per halaman ditaruh di astro:page-load (yang juga terpicu pada muat pertama), pembersihan di astro:before-swap.
- Instance Lenis dan ticker global dibuat sekali dan tidak dibuat ulang per navigasi.
- Setelah ganti halaman: getLenis()?.scrollTo(0, { immediate: true }) dan ScrollTrigger.refresh().
- Animasi bawaan ClientRouter sudah menghormati reduced motion, tetapi animasi GSAP, canvas, dan CSS buatan sendiri tetap harus ditangani sendiri.
// src/scripts/motion/page.ts
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "./runtime";
import { initPageMotion } from "./scroll-animations";   // mengembalikan fungsi pembersih

let cleanup: (() => void) | null = null;

document.addEventListener("astro:page-load", () => {
  cleanup?.();
  getLenis()?.scrollTo(0, { immediate: true });
  cleanup = initPageMotion();
  ScrollTrigger.refresh();
});

document.addEventListener("astro:before-swap", () => {
  cleanup?.();       // revert animasi, kill ScrollTrigger, dispose scene
  cleanup = null;
});
Alternatif lebih ringan: transisi lintas-dokumen CSS (@view-transition) sebagai peningkatan progresif tanpa JavaScript. Dukungan browser belum seragam, jadi cek sebelum dipakai dan pastikan navigasi tetap utuh tanpanya.
9.8 Anggaran performa, fallback, dan urutan pengerjaan
Anggaran performa. "Lantai" adalah angka yang selaras dengan PRD.md (lihat §15); "target" adalah tujuan desain.
Metrik	Lantai	Target
Lighthouse Performance, mobile	≥ 75	≥ 90 di M0 sampai M2; ≥ 75 di halaman dengan scene M3
Lighthouse Performance, desktop	≥ 80	≥ 90 di M0 sampai M2; ≥ 80 di halaman dengan scene M3
LCP	≤ 2,5 s	M3 tidak boleh memperburuk LCP halaman yang sama tanpa scene
CLS	≤ 0,1	≈ 0; tidak ada pergeseran saat inisialisasi lazy
INP	≤ 200 ms	Animasi tidak boleh memblokir input
Frame saat scroll dan scene	n/a	Stabil mendekati 60 fps pada perangkat menengah; scene menurunkan kualitas sebelum menjatuhkan frame
Ukuran JS (gzip, usulan awal, ukur ulang dengan bundle analyzer sebelum dijadikan kontrak)	n/a	Runtime M1 ≤ 40 KB; runtime M2 ≤ 90 KB; chunk Three.js terpisah ≤ 200 KB, hanya di halaman yang memerlukannya


Validasi di perangkat nyata (ponsel Android kelas menengah dan iPhone), bukan hanya Lighthouse. Pantau juga beban CPU dan GPU, memori WebGL, dan stabilitas frame saat scroll.

Matriks fallback
Kondisi	Perilaku
JavaScript mati	Semua konten terlihat, hero statis, scroll native, filter dan lightbox menurun dengan wajar
prefers-reduced-motion: reduce	Tanpa Lenis, parallax, pin, atau transform; scene satu render statis atau foto saja
WebGL tidak ada, konteks hilang, atau impor gagal	Foto hero statis; tidak ada pesan galat untuk pengunjung
Perangkat sentuh	Scroll native; efek pointer diganti atau dimatikan
saveData aktif	Scene M3 dilewati; M1 dan M2 tetap berjalan
Tab tersembunyi atau scene di luar viewport	Render berhenti
Runtime motion lambat atau gagal dimuat	Pengaman 2,5 detik menampilkan semua konten (§9.5)


Urutan pengerjaan. Satu langkah selesai dan terukur sebelum langkah berikutnya.
1. Infrastruktur: token motion, deteksi reduced motion, kelas motion-ready dengan pengaman, jalur pembersihan.
2. M1: utilitas reveal dan urutan masuk hero; ukur baseline performa.
3. M2: runtime Lenis + GSAP global, ScrollTrigger, parallax; validasi scroll mobile dan desktop, anchor, skip link, modal, dan keyboard.
4. Ukur ulang performa M2 terhadap baseline M1.
5. M3: satu scene (depth-photo di hero) dengan dynamic import, manajemen visibilitas, fallback, dan pembersihan GPU; ukur biaya tambahannya.
6. Tambah scene atau pola lain hanya bila biayanya terjustifikasi oleh pengukuran.
10. Aksesibilitas
Target WCAG 2.2 AA. Lighthouse Accessibility ≥ 90 adalah lantai (usulan), bukan tujuan: isu aksesibilitas nyata tetap diperbaiki walaupun skor tercapai.

Dasar
- Semua fungsi inti tersedia lewat keyboard, dan fokus terlihat jelas (outline dengan outline-offset, bukan hanya perubahan warna). Urutan fokus logis.
- Skip link "Lewati ke konten" adalah elemen pertama yang dapat difokuskan dan benar-benar memindahkan fokus ke main.
- Landmark semantik (header, nav, main, footer). Satu h1 per halaman, heading hierarkis. Jangan memilih level heading hanya demi ukuran visual.
- Tombol dan tautan punya nama yang jelas dan area sentuh minimal 44 × 44 px.
- Jangan mengandalkan warna saja untuk menandai kategori, status, atau tautan aktif.
- Kontras sesuai §3.3. Teks di atas foto memakai --color-scrim dan diuji pada foto paling terang.
Teks display raksasa
- h1 tetap berisi teks lengkap. Salinan dekoratif yang terpotong memakai aria-hidden="true". Huruf kapital lewat CSS agar pembaca layar tidak mengeja huruf satu per satu.
- Garis grid dan elemen dekoratif lain: aria-hidden="true" dan pointer-events: none.
Komponen
- Filter berhitung dan pengalih tampilan memakai atribut state (aria-pressed atau aria-current) dan nama yang memuat jumlah atau tampilan.
- Lightbox: dialog bernama, tombol tutup berlabel, fokus terjebak di dalam dan kembali ke pemicu.
- Menu overlay: fokus terjebak, Escape menutup.
Motion dan 3D
- Hormati prefers-reduced-motion di semua level (§9.2 poin 4), termasuk saat preferensi berubah ketika halaman terbuka.
- Gerak otomatis lebih dari 5 detik harus bisa dijeda atau dihentikan (WCAG 2.2.2). Desain bawaan menghindarinya.
- Smooth scroll tidak boleh merusak scrollbar native, keyboard, atau pembesaran teks. Uji PageDown, Space, Home, End, dan zoom 200%.
- Fokus tidak boleh tertutup header sticky atau header yang bersembunyi saat scroll (WCAG 2.4.11). Gunakan scroll-padding-top setara tinggi header.
- Kanvas WebGL: aria-hidden="true", tidak dapat difokuskan, tidak membawa informasi yang tidak ada di tempat lain. Teks alt foto hero tetap ada pada <img> fallback.
- Teks yang dipecah SplitText harus tetap terbaca sebagai satu kalimat oleh pembaca layar. Verifikasi, jangan asumsikan.
- Parallax dan gerak terhubung scroll berskala kecil (§9.5) untuk menghindari gangguan vestibular, dan dimatikan oleh reduced motion.
- Konten dan CTA tidak boleh disembunyikan, tertunda, atau tak bisa diklik oleh animasi.
11. Aturan brand per klien dan konfigurasi
Token default adalah baseline starter. Saat proyek klien dimulai:
1. Identifikasi jenis fotografi, audiens, dan karakter merek.
2. Pilih preset (Editorial, Bold, atau Noir), lalu sesuaikan --color-brand, font, lebar kontainer, varian hero, dan perlakuan caption.
3. Hitung ulang kontras setiap warna merek baru (§3.3). Jika merek klien terlalu terang untuk teks kecil, pakai versi lebih gelap untuk teks dan versi aslinya hanya untuk display besar.
4. Pilih level motion sesuai paket dan karakter klien (§9.1). Klien dengan foto yang menuntut pengamatan hening (fine-art, arsip) cenderung M0 atau M1.
5. Tetap memakai komponen dan pola yang ada; catat perubahan khusus di konfigurasi tema, bukan dengan menyalin komponen.
6. Konfirmasi arah visual lewat satu komposisi hero sebelum diterapkan ke semua halaman. Bila M3 dipilih, konfirmasi hero beserta scene-nya di perangkat nyata.
Pilihan yang sebaiknya dapat diatur lewat src/config/site.ts (nama kunci hanyalah usulan):
Pilihan	Nilai
theme.preset	editorial | bold | noir
theme.brand	warna merek (hex)
hero.variant	overlap | stagger
hero.scene	none | depth-photo | particles (hanya bila motion.level = m3)
header.variant	centered-wordmark | split-nav
gallery.views	daftar tampilan aktif, mis. ["grid"] atau ["grid", "stack"]
motion.level	m0 | m1 | m2 | m3
motion.smoothScroll	true | false (hanya berlaku di m2 ke atas; bawaan true)
motion.pinGallery	true | false (hanya m2 ke atas, desktop; bawaan false)
motion.pageTransitions	true | false (bawaan false)
features	filter, lightbox, gridLines, whatsappFloating


Untuk demo utama Pholio atau proyek yang menjual pengalaman scroll-interaktif, pilih m2 sebagai baseline; pilih m3 bila scene 3D hero memang diperlukan. Paket Lite/Standard tetap dapat membatasi level maksimum sesuai proposal.

features.entranceMotion pada v2 digantikan oleh motion.level (M1 ke atas).

Jangan menjadikan satu referensi sebagai desain final semua klien. Starter harus menampung gaya editorial, landscape, travel, fine-art, dan jenis fotografi lain tanpa kehilangan konsistensi.
12. Matriks fitur visual per paket (usulan)
Usulan awal selaras dengan paket Lite, Standard, dan Plus. Keputusan final tetap di proposal (lihat PRD.md §13 dan pholio-docs/PROPOSAL.md). Per proposal, filter kategori dan lightbox termasuk dalam paket Standard; Plus mencakup seluruh fitur Standard ditambah kapasitas dan layanan yang disepakati di proposal.
Fitur visual	Lite	Standard	Plus
Preset Editorial atau Bold, warna merek, dan font klien	✓	✓	✓
Preset Noir (tema gelap)	n/a	Add-on	✓
Satu varian hero	✓	✓	✓
Header centered-wordmark atau split-nav	✓	✓	✓
Grid galeri dengan rasio asli	✓	✓	✓
WhatsApp melayang	✓	✓	✓
Caption overlay pada foto	n/a	✓	✓
Garis grid (Bold dan Noir)	n/a	✓	✓
Filter berhitung	n/a	✓	✓
Lightbox	n/a	✓	✓
Motion M0 (CSS hover dan fokus)	✓	✓	✓
Motion M1 (GSAP: urutan masuk, reveal, stagger)	n/a	✓	✓
Motion M2 (Lenis + GSAP ScrollTrigger: scroll choreography pada setiap section utama)	n/a	n/a	✓
Galeri horizontal ber-pin	n/a	n/a	Add-on
Transisi halaman	n/a	n/a	Add-on
Motion M3 (M2 + scene Three.js hero yang merespons scroll)	n/a	n/a	Add-on terpisah
Tampilan stack dan pengalih tampilan	n/a	n/a	Add-on
Tampilan daftar (indeks)	n/a	n/a	Add-on


13. Kriteria penerimaan visual
Visual dan layout
- [ ] Karya fotografi menjadi fokus utama dan tidak dikalahkan ornamen atau efek.
- [ ] Hero adalah satu-satunya momen tipografi raksasa (dan, bila M3 aktif, satu-satunya scene 3D); halaman lain memakai skala biasa.
- [ ] Teks display raksasa tidak menyebabkan scroll horizontal pada 360 px, dan teks lengkapnya tersedia sebagai teks yang terbaca.
- [ ] Identitas, navigasi, galeri atau katalog, dan CTA mudah ditemukan.
- [ ] Grid mempertahankan rasio dan crop yang pantas, tanpa layout shift mencolok.
- [ ] Tipografi hierarkis, terbaca, dan tidak meluap pada mobile; huruf kapital hanya pada display, navigasi, dan filter.
- [ ] Kontras teks, tautan, fokus, dan tombol dihitung dan memenuhi 4,5 : 1 untuk teks biasa dan 3 : 1 untuk teks besar serta kontrol (termasuk preset noir bila dipakai).
- [ ] Caption di atas foto terbaca pada foto paling terang.
- [ ] Tidak ada elemen fixed yang menutupi CTA, footer, atau elemen fixed lain.
- [ ] Tidak ada ikon keranjang, status stok, atau klaim status pembayaran.
- [ ] Tidak ada foto, logo, teks, atau nama merek dari situs referensi pada hasil akhir.
- [ ] Hanya preview yang dipakai pada halaman publik.
- [ ] Tampilan diuji pada 360, 768, dan 1200 px atau lebih; juga 320 dan 1440 px sebagai uji tekanan.
Interaksi dan aksesibilitas
- [ ] Semua interaksi utama dapat dipakai dengan mouse, keyboard, dan sentuhan.
- [ ] Skip link, anchor, modal, menu, dan lightbox diuji dengan keyboard; fokus berpindah dan kembali dengan benar.
- [ ] Halaman utuh dan lengkap tanpa JavaScript, dengan reduced motion, dan dengan WebGL dimatikan.
Motion, scroll, dan 3D
- [ ] Foto hero tidak di-lazy-load dan tidak dianimasikan dari opacity: 0; LCP tidak lebih buruk dari baseline tanpa animasi.
- [ ] Tepat satu instance Lenis dan satu ticker; tidak ada loop requestAnimationFrame lain.
- [ ] Pada M2/M3, setiap section konten utama memiliki minimal satu respons scroll yang terlihat dan bertujuan; tidak ada section utama yang terasa statis tanpa alasan desain.
- [ ] Efek berbasis progres bergerak maju saat scroll turun dan kembali secara konsisten saat scroll naik; tidak flicker, jump, atau meninggalkan state yang salah.
- [ ] Scroll sentuh tetap native tetapi tetap memicu ScrollTrigger; wheel/trackpad desktop dihaluskan Lenis; PageDown, Space, Home, End, scrollbar, dan zoom 200% berfungsi.
- [ ] Modal, menu overlay, dan lightbox menghentikan scroll latar dan memulihkannya.
- [ ] Setelah navigasi atau penutupan, tidak ada ScrollTrigger, listener, atau resource WebGL yatim (periksa di DevTools).
- [ ] Maksimal satu pin per halaman, panjang ≤ 3 tinggi viewport, dengan fallback native.
- [ ] Animasi hanya memakai transform, opacity, dan clip-path; hanya pola di katalog §9.5.
- [ ] Three.js hanya dimuat di halaman yang memakai scene; pada M3 scene hero menerima progres scroll dari GSAP/ScrollTrigger, berhenti di luar viewport dan saat tab tersembunyi; hero statis tampil saat WebGL gagal.
- [ ] Warna foto di WebGL sama dengan foto di DOM pada uji berdampingan.
- [ ] Tidak ada gerak otomatis lebih dari 5 detik tanpa kontrol jeda.
- [ ] CLS ≈ 0 (≤ 0,1), INP ≤ 200 ms, LCP ≤ 2,5 s; Lighthouse memenuhi lantai §9.8; dicatat pada halaman representatif dan diuji di perangkat nyata.
- [ ] Tidak ada React, React Three Fiber, atau pustaka animasi di luar Lenis, GSAP, dan Three.js.
14. Hal yang tidak termasuk dalam sistem visual
- Menyalin halaman atau identitas situs referensi mana pun.
- Desain ulang tanpa batas di luar jumlah revisi proposal.
- Pengalih tema terang/gelap oleh pengunjung (preset noir adalah pilihan per proyek, bukan pengalih).
- Scroll-jacking, ScrollSmoother GSAP (bentrok dengan Lenis), dan pustaka smooth scroll lain.
- Kursor kustom dan efek magnet pada tombol.
- Video latar dan autoplay dengan suara.
- WebGL untuk galeri fungsional, lightbox, toko, atau halaman produk; lebih dari satu scene aktif per halaman; post-processing berat.
- Parallax atau pin di galeri fungsional, toko, dan halaman produk. Reveal ringan saat elemen masuk viewport tetap diperbolehkan.
- Tampilan board (kanvas bebas) dan galeri dengan posisi acak yang dihitung di klien.
- Ikon keranjang, mini-cart, badge jumlah item, dan layout toko yang bergantung pada checkout internal.
- Pratinjau saat hover sebagai satu-satunya cara melihat foto pada tampilan daftar.
- React, React Three Fiber, dan pustaka animasi atau 3D lain di luar Lenis, GSAP, dan Three.js.
- Komponen UI dekoratif yang tidak mendukung penemuan karya, pemahaman produk, atau pembelian.
15. Sinkronisasi dengan dokumen lain
DESIGN ini tidak mengubah PRD.md atau ARCHITECTURE.md. Hal berikut perlu diselaraskan hanya bila fiturnya diaktifkan pada paket:
Kebutuhan desain	Dokumen yang perlu menyesuaikan
Field width dan height pada setiap item gallery.json (cegah layout shift, hero overlap, reservasi ruang scene)	ARCHITECTURE.md §4
Field opsional year (tampilan daftar) dan credit (kolektif atau banyak fotografer)	ARCHITECTURE.md §4
Varian floating pada WhatsAppButton; komponen baru GridLines, FilterBar, ViewSwitch, ThreeScene (opsional)	ARCHITECTURE.md §2
Struktur src/scripts/motion/ dan src/scripts/three/ (§9.7); dependensi lenis, gsap, three yang dimuat bersyarat per level	ARCHITECTURE.md (struktur kode dan dependensi)
Kunci konfigurasi tema, hero (termasuk hero.scene), header, tampilan galeri, motion.*, dan fitur (§11)	ARCHITECTURE.md (config/site.ts)
Tombol WhatsApp melayang sebagai persyaratan eksplisit	PRD.md §8 (terkait FR-06)
Motion level M1, M2, M3 sebagai bagian atau add-on paket; preset noir	PRD.md §5 dan §13, pholio-docs/PROPOSAL.md
Lantai Lighthouse (75 mobile, 80 desktop) dan target di atasnya (§9.8). Bila PRD memakai angka lain, ubah di satu tempat saja	PRD.md
Aturan untuk agen: satu Lenis dan satu ticker; jangan mengimpor Three.js dari runtime global; selalu sediakan pembersihan; hanya pola di katalog §9.5; jangan menganimasikan foto LCP dari opacity: 0; jangan menambah pustaka animasi tanpa persetujuan	AGENTS.md
Urutan pengerjaan motion (§9.8) sebagai tugas bertahap dengan pengukuran di tiap tahap	TASKS.md


Lampiran A. Implementasi Tailwind CSS v4
Lampiran ini menggabungkan §3.3 sampai §3.5, §7.11, dan §16 dari v2. Nomor baris kode dihapus karena cepat basi; rujuk berkasnya langsung.
A.1 Setup
Aspek	Implementasi
Import	@import "tailwindcss"; di src/styles/global.css
Token tema	Blok @theme di global.css (sampai v2 hanya warna; sisanya di A.4 adalah kontrak untuk migrasi)
Pergantian preset	CSS custom properties pada :root[data-theme-preset="..."] + <html data-theme-preset={themePreset}> di BaseLayout.astro
Plugin build	@tailwindcss/vite di astro.config.mjs
Berkas konfigurasi	Tidak ada tailwind.config.js (benar untuk v4)
Deteksi class	Otomatis lewat plugin Vite (memindai .astro, .ts, .tsx, .js, .jsx, .html)


A.2 Arsitektur token tiga lapis
Lapis	Lokasi	Peran	Contoh
Tailwind @theme	src/styles/global.css	Sumber kebenaran untuk utility Tailwind (bg-brand, text-muted, dll.). Berisi nilai default (Editorial)	--color-brand: #0A0B10
Preset runtime	src/styles/global.css	Nilai yang berubah per preset via data-theme-preset pada <html>; dibaca langsung oleh CSS komponen. Nilai lengkap ada di §3.1 dan tidak diulang di sini	--color-brand: #D40000 (Bold)
Kompatibilitas v1	src/styles/global.css	Alias lama (--color-accent, --color-on-accent)	--color-accent: var(--color-brand)


Aturan sinkronisasi:
- @theme mendefinisikan nilai default. Preset runtime meng-override nilai yang berubah (warna, grid-line, scrim) lewat selector :root[data-theme-preset="bold"] dan "noir".
- Lapis kompatibilitas mengikuti --color-brand lewat var(); tidak didefinisikan ulang.
- Jangan menduplikasi nilai yang sama di ketiga lapis. Gunakan var() untuk merujuk ke atas.
- Token yang sengaja berubah per preset tidak ditaruh di @theme. Komponen yang memakai var(--color-brand) otomatis menerima nilai preset aktif.
@theme {
  /* Editorial (default). Preset lain meng-override di :root[data-theme-preset] */
  --color-bg: #F3F3F1;
  --color-surface: #FFFFFF;
  --color-text: #0A0B10;
  --color-muted: #62625E;
  --color-border: #D9D9D5;
  --color-brand: #0A0B10;
  --color-on-brand: #FFFFFF;
  --color-focus: #1D5FCC;
  --color-whatsapp: #167D48;
  --color-grid-line: rgb(10 11 16 / 0.08);
  --color-scrim: rgb(0 0 0 / 0.55);
}
Utility yang dihasilkan: bg-brand, text-muted, border-border, bg-surface, text-on-brand, focus:ring-focus, bg-whatsapp, dan sebagainya.
A.3 Kontrak token lain (belum tentu sudah ada di @theme)
Agen migrasi harus menambahkan token ini ke @theme sebelum memakainya. Nilainya mengikuti §4.2 (tipografi) dan §5.2 (breakpoint).
@theme {
  /* Layout */
  --spacing-gutter: clamp(16px, 3vw, 48px);
  --container-page: 1600px;          /* bukan --container-max: bentrok dengan utility max-w-max bawaan */

  /* Tipografi (sama dengan §4.2) */
  --text-display-overlap: clamp(4rem, 18vw, 16rem);
  --text-display-stagger: clamp(2.75rem, 6vw, 6.5rem);
  --text-heading-page: clamp(2.25rem, 4.5vw, 4.25rem);
  --text-heading-section: clamp(1.75rem, 2.8vw, 2.75rem);
  --text-body: clamp(1rem, 1.2vw, 1.125rem);
  --text-caption: clamp(0.8125rem, 1.1vw, 0.875rem);
  --text-nav-filter: clamp(0.8125rem, 1vw, 0.9375rem);

  --leading-display-overlap: 0.85;
  --leading-display-stagger: 0.96;
  --leading-heading-page: 1.05;
  --leading-heading-section: 1.1;
  --leading-body: 1.7;
  --leading-caption: 1.5;

  --tracking-tight: -0.02em;
  --tracking-tighter: -0.03em;
  --tracking-wide: 0.08em;
  --tracking-wider: 0.12em;

  /* Breakpoint: xl sengaja 1200px, bukan default Tailwind (1280px) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1200px;

  /* Bayangan */
  --shadow-btn-hard: 4px 4px 0 var(--color-brand);
  --shadow-btn-hard-hover: 2px 2px 0 var(--color-brand);
  --shadow-btn-hard-active: 0 0 0 var(--color-brand);
  --shadow-whatsapp-float: 0 4px 12px rgb(0 0 0 / 0.15);
  --shadow-whatsapp-float-hover: 0 6px 16px rgb(0 0 0 / 0.2);
  --shadow-product-card: 0 4px 12px rgb(0 0 0 / 0.05);
}
Token motion (§3.2) berada di :root sebagai CSS custom property biasa, bukan di @theme, agar tidak menimpa utility ease-out dan ease-in-out bawaan Tailwind. Pakai lewat duration-[var(--duration-fast)] atau CSS biasa. Nama --transition-fast dan --transition-base dari v2 diganti --duration-fast dan --duration-base.

Migrasi breakpoint: jangan mengubah media query komponen yang sudah ada sebelum token breakpoint tersedia dan paritas visual diverifikasi.
A.4 Kelas utilitas tipografi (target migrasi)
Kelas di global.css akan dipindahkan ke @utility:
Kelas saat ini	Nilai	Target
.text-display-overlap	clamp(4rem, 18vw, 16rem), lh 0.85, bobot 800, uppercase, tracking -0.02em	@utility text-display-overlap
.text-display-stagger	clamp(2.75rem, 6vw, 6.5rem), lh 0.96, bobot 800, uppercase, tracking -0.03em	@utility text-display-stagger
.text-heading-page	clamp(2.25rem, 4.5vw, 4.25rem), bobot 800, lh 1.05, tracking -0.02em	@utility text-heading-page
.text-heading-section	clamp(1.75rem, 2.8vw, 2.75rem), bobot 800, lh 1.1, tracking -0.01em	@utility text-heading-section
.text-body	clamp(1rem, 1.2vw, 1.125rem), lh 1.7, max-width: 68ch	@utility text-body (max-width butuh nilai arbitrer)
.text-caption	clamp(0.8125rem, 1.1vw, 0.875rem), lh 1.5, warna --color-muted	text-caption text-muted
.text-nav-filter	clamp(0.8125rem, 1vw, 0.9375rem), bobot 700, uppercase, tracking 0.08em	@utility text-nav-filter


A.5 Batas migrasi
Migrate (pindahkan ke utility Tailwind):
Pola	Target
Display, flex, grid	flex, grid, grid-cols-*, gap-*
Spacing	p-*, m-*, gap-*, nilai arbitrer gap-[clamp(12px,2vw,24px)]
Tipografi sederhana	text-*, font-*, leading-*, tracking-*, uppercase
Warna	bg-brand, text-muted, border-border
Border dan radius	border, border-brand, rounded-none
Bayangan sederhana	shadow-md atau shadow-[...]
Layout responsif	sm:, md:, lg:, xl:
State	hover:, focus-visible:, active:, disabled:
Transisi	transition-[transform,box-shadow] duration-[var(--duration-fast)]


Evaluate individually (nilai per kasus):
Pola	Pertimbangan
GridLines	repeating-linear-gradient + position: absolute; kandidat @utility grid-lines
Gradien scrim	linear-gradient(to top, var(--color-scrim), transparent 55%); kandidat @utility scrim-gradient
Sistem bingkai foto	Multi-elemen (.photo-frame, .frame-fallback, object-fit: cover/contain); pertahankan sebagai CSS komponen
Indentasi hero stagger	Spesifik konten; pertahankan
Grid mosaik galeri	12 kolom dengan grid-column/`grid-row` per indeks; pertahankan
Restrukturisasi header mobile	flex-wrap, order, row-gap; kompleks, pertahankan
Bar CTA lengket mobile	position: sticky, margin negatif, class body dan JS; pertahankan
WhatsApp melayang + IntersectionObserver	env(safe-area-inset), posisi fixed, koordinasi JS; pertahankan


Retain (tetap CSS biasa atau kode terpisah):
Pola	Alasan
Animasi GSAP, parallax, pin, dan scene Three.js	Logika ada di src/scripts/; bukan urusan utility
Lightbox (overlay, focus trap, swipe, keyboard)	Terikat erat pada perilaku JS
Reset reduced motion global	Selector * dengan !important; baseline global
Outline fokus global	Baseline aksesibilitas
Skip link	Pola aksesibilitas, tidak reusable
@font-face dan pemuatan font	Tetap di CSS global (§4.4)
Gaya cetak (bila ditambah)	Spesifik media


Aturan @utility: gunakan hanya untuk pola yang benar-benar reusable di seluruh sistem desain (text-display-*, scrim-gradient, grid-lines, btn-hard), tidak bergantung pada state JS atau struktur DOM khusus, dan mengurangi duplikasi secara berarti. Jangan membuat @utility untuk pola yang dipakai 1 sampai 2 kali, yang butuh nilai arbitrer berbeda tiap pemakaian, atau yang terikat pada JS.

Koeksistensi selama migrasi bertahap:
1. CSS lama dan utility Tailwind hidup berdampingan: @import "tailwindcss" dulu, lalu blok <style> komponen (lebih spesifik, meng-override).
2. Style komponen Astro punya specificity lebih tinggi daripada utility global. Hindari !important kecuali reset reduced motion.
3. Hapus CSS lama hanya setelah computed style utility terverifikasi sama (DevTools).
4. Setelah tiap batch, npm run build harus berhasil.
5. Cek paritas visual pada 360, 768, 1024, dan 1200 px sebelum dan sesudah.
A.6 Konvensi proyek
Konvensi	Aturan
Utility-first	Layout, spacing, tipografi, warna, border, bayangan, responsif, state memakai utility
@theme	Token desain: warna default, spacing, tipografi, breakpoint, bayangan
@utility	Pola reusable (lihat aturan di A.5)
<style> komponen	Pola kompleks (bingkai foto, lightbox, mosaik, header, bar CTA, WhatsApp)
Custom property untuk preset	--color-brand, --color-bg, --color-grid-line dan lainnya di-override lewat data-theme-preset
Nilai arbitrer	Boleh untuk clamp(), lebar kustom, gradien khusus, nilai animasi: sintaks [value]
Tanpa @apply dan tanpa @layer	Tidak dianjurkan di v4; pakai utility langsung atau @utility


Deteksi class dinamis. Tailwind v4 mendeteksi class dari kode sumber statis; string yang dirangkai tidak terdeteksi. Class yang dibangun dinamis harus ditulis utuh di sumber, mis. class={filter-btn${isActive ? " filter-btn--active" : ""}`}` aman karena filter-btn--active utuh. Untuk pola seperti featured-item--${i}, gunakan peta class berbasis data.
A.7 Daftar periksa per batch migrasi
- [ ] npm run build sukses
- [ ] Paritas visual: 360, 768, 1024, 1200+ px
- [ ] Layout responsif: kolom grid, arah flex, lebar kontainer, gutter
- [ ] Tipografi: nilai clamp, line-height, letter-spacing, text-transform
- [ ] Warna: semua preset (Editorial, Bold, Noir) dengan mengganti data-theme-preset
- [ ] Interaksi: hover, focus-visible, active, disabled
- [ ] Animasi: transform bayangan keras, skala WhatsApp, transisi
- [ ] Reduced motion: prefers-reduced-motion: reduce mematikan semua gerak, termasuk Lenis dan scene
- [ ] Aksesibilitas: fokus terlihat, skip link, atribut aria, hierarki heading
- [ ] Tanpa galat konsol, tanpa layout shift (CLS)
- [ ] CSS yang dihapus terverifikasi tidak punya pemakai tersisa
Lampiran B. Peta nomor bagian v2 ke v3
Gunakan tabel ini untuk memperbarui rujukan "DESIGN §x" di dokumen lain.
v2	v3
§1 Prinsip desain	§1 (ditambah prinsip 6 sampai 8 dan §1.3)
§2 Analisis referensi	§2 (ditambah §2.2)
§3 dan §3.1 Preset dan token warna	§3 dan §3.1 (ditambah preset Noir)
§3.2 Kontras	§3.3
(baru)	§3.2 Token motion
§3.3 sampai §3.5 Tailwind v4 (tema, breakpoint, utilitas tipografi)	Lampiran A.2 sampai A.4; breakpoint juga di §5.2
§4 Tipografi	§4 (nilai diseragamkan di §4.2, ditambah §4.4)
§5 Layout dan spacing	§5
§6 Pola halaman	§6
§7.1 sampai §7.10 Komponen	§7.1 sampai §7.10
(baru)	§7.11 Tabel state interaksi, §7.12 Video (P2)
§7.11 Batas migrasi Tailwind	Lampiran A.5
§8 Aturan gambar	§8 (ditambah §8.4)
§9 Motion (M0 sampai M2)	§9 (ditulis ulang: M0 sampai M3, Lenis, GSAP, Three.js)
§10 Aksesibilitas	§10
§11 Aturan brand dan konfigurasi	§11
§12 Matriks fitur per paket	§12
§13 Kriteria penerimaan	§13
§14 Di luar cakupan	§14
§16 Catatan implementasi Tailwind v4	Lampiran A.1, A.6, A.7
§15 Sinkronisasi	§15