# 💈 Randapp - Akıllı Randevu ve Yapay Zeka SaaS Platformu

Bu proje, bir kuaför, güzellik salonu veya herhangi bir randevulu sistem için geliştirilmiş, Google Gemini yapay zeka ile güçlendirilmiş, modern, duyarlı (responsive) ve karanlık/aydınlık (dark/light) mod destekli bir SPA (Tek Sayfalı Web Uygulaması) projesidir. Proje Multi-Tenant (SaaS) yapısında tasarlanmış olup, tek bir kod tabanıyla birden fazla işletmeye hizmet verebilir.

---

## 🌟 Öne Çıkan Özellikler

- **Multi-Tenant SaaS Altyapısı:** İşletmeler, kendi alt alan adlarıyla veya URL yapılarıyla platforma erişebilirler. Tüm uygulama `TenantContext` aracılığıyla sınırlandırılmış işletme kimliğine (`tenant_id`) bağlı olarak şekillenir.
- **Satış ve Önizleme Portalı (Demo Generator):** Kuaförler, platforma katılmadan önce `/demo` rotası üzerinden anında kendi salon isimleri, renkleri ve logolarıyla kişiselleştirilmiş bir demo oluşturabilirler. Bu arayüz tam olarak saha satışı için optimize edilmiştir.
- **İki Modlu Veri Akışı (Data Providers):** Mimari, esnek bir `dataProvider` katmanı (Strategy Pattern) üzerine kurulmuştur. Çevre değişkenlerine (`VITE_DATA_MODE`) bağlı olarak proje;
  - `mock`: Tamamen yerel, tarayıcıda çalışan, offline ve sunucuya ihtiyaç duymayan simüle JSON tabanlı mod ile,
  - `supabase`: Uzak veritabanlarına (PostgreSQL/Supabase) doğrudan okuma ve yazma yapabilen üretim modunda çalışabilir.
- **Gelişmiş Çalışan ve Hizmet Yönetimi:** İşletmeler, kendi çalışanlarını ve sundukları hizmetleri esnek bir altyapıda yönetebilir. Hizmetler; fiyat, süre ve resim içerecek şekilde detaylandırılır. Çalışan ve hizmetlere aktiflik kazandırılarak görünürlük kontrol edilebilir. Yalnızca *aktif* personeller ve hizmetler müşteri karşısına çıkar.
- **Dinamik Yönlendirme (Router Mode):** Önizleme, statik dosya barındırma ve production ortamlarına esnek uyum için `VITE_ROUTER_MODE` çevre değişkeniyle uygulamanın Yönlendiricisi dinamiğe alınmıştır. `hash` tabanlı yönderlendirme statik kolaylık sağlarken, `browser` modu temiz URL yapıları için Vercel veya Nginx rewrite kuralları üzerinden çalışır (Örn: `public/_redirects`, `vercel.json`).
- **AI Stil Görselleştirici (AI Visualizer):** Gemini yapay zeka entegrasyonu sayesinde kullanıcılar fotoğraflarını yükleyerek analiz yaptırabilir ve sanal deneyimlerde bulunabilirler.
- **Dinamik Dil Desteği & Temalar:** Göz yormayan Karanlık / Aydınlık Mod (Local Storage) entegrasyonu ve TR / EN tam dil desteği.
- **Uygulama İçi Ön Bellekleme (Service Worker Yönetimi):** Geliştirme kolaylığı için Service Worker bilinçli olarak kapatılabilir (`docs/WHITE_SCREEN_RECOVERY.md`), veya performans odaklı offline mod için açılabilir.

---

## 💼 Satış ve Demo Modu (Sales Demo Mode)

Randapp satış süreçlerini desteklemek amacıyla özel bir `/demo` landing page altyapısına sahiptir. Bu sayfa sayesinde saha satış ekipleri, müşterilere saniyeler içinde "Kendi markalarıyla uyumlu ve hazır" bir akıllı restoran veya salon web sitesi sunabiliyor.

**Demo Modu Özellikleri:**
- **Local Logo Yükleme:** Kuaförler, sunucu yüklemesi (backend storage) olmadan cihazlarındaki logoları doğrudan sayfada yükleyip saniyeler içinde canlı randevu bileşeninde test edebilir. Logolar kalıcı olarak saklanmaz, anlık `FileReader` API tabanlı önizleme mantığı ile çalışır.
- **WhatsApp Satış Yakalama (Lead Capture):** "WhatsApp'tan Demo Talep Et" butonu, kullanıcının o an ekrandaki yapılandırmasını (marka adı, logo, adres, vs.) dinamik URL encode'lu bir formatla direkt olarak önceden ayarlanmış satış numarasına (`VITE_SALES_WHATSAPP_NUMBER`) göndererek etkili Lead toplar.
- **Satış Çıktısı Paylaşımı:** İşletmeciler, yaptıkları simülasyonun tam URL yapısını (parametre veya anlık yollar) "Önizleme Linkini Kopyala" ile saklayabilir veya direkt paylaşabilir.
- **Admin Setup Akışı:** İlk kurulum esnasında mock panele bağlanan (veya sisteme onboarding yapan) yöneticiler, "Kurulum" sekmesi üzerinden işletme kimlikleri, renkleri ve logolarını esnek bir formatta atayabilir, tüm atanan değerlerin durumunu izleyen dinamik bir Onboarding CheckList'i kullanabilir.

**Notlar:** 
* Saha satış demosu için `VITE_DATA_MODE=mock` kullanılması en yüksek stabiliteyi sunar.
* White Screen hatalarından kaçınmak (önizleme ekranlarının offline cache durumlarında asılı kalmasını engellemek) amacıyla PWA Service Worker (Vite PWA) geçici olarak `main.tsx` içinde deaktive edilmiştir.

---

## 🚀 Web Tabanlı Kurulum ve Çalıştırma (Adım Adım)

Prosedürü doğrudan test edip, geliştirebilmek için aşağıdaki adımları tamamlayabilirsiniz.

### 1️⃣ Projeyi İndirin ve Bağımlılıkları Yükleyin

```bash
npm install
```

### 2️⃣ Çevre Değişkenleri (Environment Variables) Ayarı

Proje ana dizininde bulunan `.env.example` dosyasının bir kopyasını oluşturun ve adını `.env` olarak değiştirin. Projenin çalışma şekline veya bağlamak istediğiniz sistemlere göre konfigüre edin.

```env
# MOCK veya SUPABASE Veri Akış Modu
VITE_DATA_MODE=mock

# SPA Routing Tipi (Vercel gibi ortamlarda browser, yerel testlerde hash).
VITE_ROUTER_MODE=hash

# (Opsiyonel) Supabase ortam değişkenleri, eğer VITE_DATA_MODE=supabase ise zorunlu
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=sizin_gemini_api_anahtariniz
```

ℹ️ **Not:** Gemini API anahtarı şuanda *sadece geliştirme amaçlı* istemci (client) tarafında tutulmaktadır. *Production için kendi backend proxy mimarinize almalısınız.*

### 3️⃣ Geliştirme (Development) Sunucusunu Başlatma

```bash
npm run dev
```

### 4️⃣ Canlıya Alma (Production Build)

Uygulamanın optimize edilmiş dağıtım paketini çıkartmak için:

```bash
npm run build
```
Oluşan `dist/` klasörü, modern bir hosting paneline doğrudan yüklenebilir.

---

## 🔐 Yönetici (Admin) Paneli Bilgileri

Yerel (Mock) Mod (`VITE_DATA_MODE=mock`) ile test ederken örnek admin panelini şu bilgilerle deneyebilirsiniz:
- **E-posta:** `admin@randapp.com` (Simülasyon/Test)
- **Şifre:** `admin123` 

Eğer VITE_DATA_MODE `supabase` ise, uygulama Supabase yetkilendirmesi üzerinden çalışacaktır, ancak `salon_owner` veya `super_admin` rolu atanmış ve platforma dahil edilmiş kurumsal üyeliğiniz olması gerekir.

---

_Akıllı Randevu Sistemleri için Sevgiyle <3 hazırlanmıştır._
