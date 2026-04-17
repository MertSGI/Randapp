# 💈 MA Yılmaz Design - Akıllı Randevu ve Yapay Zeka Stüdyosu

Bu proje, bir kuaför ve güzellik salonu için geliştirilmiş, Google Gemini yapay zeka ile güçlendirilmiş, modern, duyarlı (responsive) ve karanlık/aydınlık (dark/light) mod destekli bir SPA (Tek Sayfalı Web Uygulaması) projesidir.

---

## 📸 Ekran Görüntüleri ve Arayüz Tasarımı

Aşağıda uygulamanın temel sayfalarının nasıl göründüğüne dair temsilî ekran görüntüleri (veya konsept vizyonu) bulunmaktadır. *(Not: Gerçek ekran görüntülerinizi projeyi canlıya aldıktan sonra buradaki linklerle değiştirebilirsiniz).*

### 1. Kullanıcı Randevu Akışı (Booking Flow) & Karanlık Mod
Müşteriler uzman seçimi ile başlar, Master Designer (Mustafa Ali Yılmaz) en üstte öne çıkarılır. Tarih, saat ve iletişim bilgilerini girip randevularını AI destekli onay mesajları eşliğinde tamamlarlar. Karanlık mod desteğiyle göz yormaz.
![Booking Flow](https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800&h=400)

### 2. Admin Yönetim Paneli (Staff & Appointments)
Kullanıcıların randevu taleplerinin yönetildiği, yeni uzman ve çalışanların (profil URL'si, Google Takvim maili, telefon numarası) eklenebildiği gelişmiş panel.
![Admin Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=400)

### 3. AI Stil Görselleştirici (AI Visualizer)
Gemini yapay zeka entegrasyonu sayesinde kullanıcılar fotoğraflarını yükleyerek saç analizi yaptırabilir ve yeni saç kesim modellerini/renklerini kendi üzerilerinde sanal olarak deneyebilirler.
![AI Visualizer](https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800&h=400)

---

## 🌟 Öne Çıkan Özellikler

- **Gelişmiş Çalışan Yönetimi:** "Mustafa Ali Yılmaz" her zaman master kullanıcı olarak en üstte görünür, silinemez. Diğer çalışanlar admin panelinden dinamik olarak eklenebilir, silinebilir ve güncellenebilir.
- **WhatsApp ve İletişim:** Seçilen uzmanın telefon numarası, randevu sonrası çıkan WhatsApp yönlendirme linkinde doğrudan müşteriye iletilir.
- **Google Takvim (Simüle Edilmiş):** Eklenen uzmanların e-posta adresleri üzerinden Google Calendar etkinlik senkronizasyonu yönetilebilir.
- **Dinamik Dil Desteği:** Tek tıkla Türkçe (Varsayılan) ve İngilizce arasında geçiş imkanı.
- **Karanlık / Aydınlık Mod (Theme Toggle):** Kullanıcı dostu arayüz ve kalıcı (Local Storage üzerinden hatırlanan) gece/gündüz modu.
- **Yapay Zeka Destekli Metin ve Temsiller:** Gemini API aracılığıyla onay maillerinin kişiselleştirilmesi ve AI görselleştirici.

---

## 🚀 Web Tabanlı Kurulum ve Çalıştırma (Adım Adım)

Projeyi kendi bilgisayarınızda veya bir sunucuda tek seferde başarıyla çalıştırabilmek için aşağıdaki adımları izleyin.

### Ön Koşullar
- Bilgisayarınızda (veya sunucunuzda) **Node.js** (v16 veya üzeri tavsiye edilir) kurulu olmalıdır.
- (Opsiyonel ama tavsiye edilir) Ücretsiz bir Gemini API Anahtarı alın. (Bkz. `.env.example`)

### 1️⃣ Projeyi İndirin ve Bağımlılıkları Yükleyin

Proje dosyalarını cihazınıza indirdikten sonra terminal veya komut satırını bu projenin bulunduğu klasörde açın ve aşağıdaki komutu çalıştırın:

```bash
npm install
```
*Bu komut projenin ihtiyaç duyduğu Tailwind CSS, React, React-Router-Dom gibi tüm paketleri anında indirip ayarlayacaktır.*

### 2️⃣ Çevre Değişkenleri (Environment Variables) Ayarı

Proje ana dizininde bulunan `.env.example` dosyasının bir kopyasını oluşturun ve adını `.env` olarak değiştirin. Ardından içindeki Gemini API Anahtarını kendinize uygun şekilde doldurun:

```env
VITE_GEMINI_API_KEY=sizin_kendi_api_anahtariniz_buraya_gelecek
```

### 3️⃣ Geliştirme (Development) Sunucusunu Başlatma

Bağımlılıklar indirildikten ve `.env` dosyası ayarlandıktan sonra projeyi test etmek için şu komutu girin:

```bash
npm run dev
```
*Terminal size uygulamanın önizlemesi için bir adres verecektir (genellikle `http://localhost:3000`). Bu adresi tarayıcınızda açıp uygulamayı kullanabilirsiniz.*

### 4️⃣ Canlıya Alma (Production Build) - Web Tabanlı Yayın 

Uygulamanın internetteki bir web sitesi olarak barındırılmasına hazır halini (optimize edilmiş kod) "Build" etmek için şu komutu çalıştırın:

```bash
npm run build
```
Oluşan `dist/` klasörü projenizin tamamen web ortamında çalışmaya hazır halidir. Bu `dist/` klasörünü aşağıdaki modern hosting firmalarına ücretsiz yükleyebilirsiniz:

- **Vercel** veya **Netlify**: Projeyi GitHub'a atıp Vercel/Netlify üzerinden doğrudan bağlayabilirsiniz (Build Comment: `npm run build`, Output Directory: `dist`).
- **Firebase Hosting**: Terminale sırasıyla `npm install -g firebase-tools`, `firebase login`, `firebase init hosting` ve `firebase deploy` yazarak yayınlayabilirsiniz.

---

## 🔐 Yönetici (Admin) Paneli Bilgileri

Varsayılan ayarlarla Yönetim Paneline girmek için `localhost:3000/#/login` (veya yayınladığınız site adresi) üzerinden giriş yapmalısınız:
- **Şifre:** `admin123` *(Bu test amaçlıdır, canlıda kullanmadan önce `pages/LoginPage.tsx` içerisinde değiştirmeniz önerilir).*

---

_MA Yılmaz Design için sevgiyle <3 ve Yapay Zeka destekli hazırlandı._
