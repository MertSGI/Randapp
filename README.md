# 💈 Randapp - Akıllı Randevu ve Yapay Zeka SaaS Platformu

Bu proje, bir kuaför, güzellik salonu veya herhangi bir randevulu sistem için geliştirilmiş, Google Gemini yapay zeka ile güçlendirilmiş, modern, duyarlı (responsive) ve karanlık/aydınlık (dark/light) mod destekli bir SPA (Tek Sayfalı Web Uygulaması) projesidir. Proje Multi-Tenant (SaaS) yapısında tasarlanmış olup, tek bir kod tabanıyla birden fazla işletmeye hizmet verebilir.

---

## 🌟 Öne Çıkan Özellikler

- **Multi-Tenant SaaS Altyapısı:** İşletmeler, kendi alt alan adlarıyla veya URL yapılarıyla platforma erişebilirler. Tüm uygulama `TenantContext` aracılığıyla sınırlandırılmış işletme kimliğine (`tenant_id`) bağlı olarak şekillenir.
- **Satış ve Önizleme Portalı (Demo Generator) & Özelleştirilebilir Web Sitesi:** Kuaförler, platforma katılmadan önce `/demo` rotası üzerinden anında kendi salon isimleri, renkleri ve logolarıyla kişiselleştirilmiş bir demo oluşturabilirler. Kurulumdan sonra ise, sadece bir randevu sistemi değil, tam teşekküllü profesyonel bir web sitesi (Cover = Gallery, Hizmet ve Uzman tanıtımı) sahibi olurlar. Bu arayüz tam olarak saha satışı için optimize edilmiştir.
- **İki Modlu Veri Akışı (Data Providers):** Mimari, esnek bir `dataProvider` katmanı (Strategy Pattern) üzerine kurulmuştur. Çevre değişkenlerine (`VITE_DATA_MODE`) bağlı olarak proje;
  - `mock`: Tamamen yerel, tarayıcıda çalışan, offline ve sunucuya ihtiyaç duymayan simüle JSON tabanlı mod ile,
  - `supabase`: Uzak veritabanlarına (PostgreSQL/Supabase) doğrudan okuma ve yazma yapabilen üretim modunda çalışabilir.
- **Gelişmiş Çalışan ve Hizmet Yönetimi:** İşletmeler, kendi çalışanlarını ve sundukları hizmetleri esnek bir altyapıda yönetebilir. Hizmetler; fiyat, süre ve resim içerecek şekilde detaylandırılır. Çalışan ve hizmetlere aktiflik kazandırılarak görünürlük kontrol edilebilir. Yalnızca *aktif* personeller ve hizmetler müşteri karşısına çıkar.
- **Dinamik Yönlendirme (Router Mode):** Önizleme, statik dosya barındırma ve production ortamlarına esnek uyum için `VITE_ROUTER_MODE` çevre değişkeniyle uygulamanın Yönlendiricisi dinamiğe alınmıştır. `hash` tabanlı yönderlendirme statik kolaylık sağlarken, `browser` modu temiz URL yapıları için Vercel veya Nginx rewrite kuralları üzerinden çalışır.
- **Dil Desteği (I18N):** İngilizce (EN) ve Türkçe (TR) dilleri yerleşik olarak desteklenir. Tarayıcı dilini anlar, `localStorage` ile tercih kaydeder ve React Context üzerinden anlık olarak arayüz dilini çevirir.
- **Hafif Müşteri Hesabı (Account Lite):** Müşteriler, şifre belirlemeden veya ağır kayıt süreçlerinden geçmeden sadece isim, telefon ve email bilgilerini aynı tarayıcıda kaydederek Hızlı Randevu Autofill avantajından faydalanabilirler.
- **AI Stil Görselleştirici (AI Visualizer):** Gemini yapay zeka entegrasyonu sayesinde kullanıcılar fotoğraflarını yükleyerek analiz yaptırabilir ve sanal deneyimlerde bulunabilirler.
- **Uygulama İçi Ön Bellekleme (Service Worker Yönetimi):** Geliştirme kolaylığı ve tutarsız önbelleği engellemek için Service Worker, cache stratejisi sonlandırılana kadar devre dışı bırakılmıştır. Lütfen manuel olarak aktif etmeyiniz.

---

## 💼 Satış ve Demo Modu (Sales Demo Mode)

Randapp satış süreçlerini desteklemek amacıyla özel bir `/demo` landing page altyapısına sahiptir. Bu sayfa sayesinde saha satış ekipleri, müşterilere saniyeler içinde "Kendi markalarıyla uyumlu ve hazır" bir akıllı salon web sitesi sunabiliyor.

**Demo Modu Özellikleri:**
- **Local Logo Yükleme:** Kuaförler, sunucu yüklemesi olmadan logoları önizleyebilir.
- **WhatsApp Satış Yakalama (Lead Capture):** "WhatsApp'tan Demo Talep Et" butonu ile lead toplar.
- **Admin Onboarding Akışı:** İlk kurulum esnasında mock panele bağlanan (veya sisteme onboarding yapan) yöneticiler, "Kurulum" sekmesini kullanarak sistemlerini yayına hazırlayabilirler.

## 🎯 Hedef Kitle (Target Market)
Randapp öncelikli olarak randevu bazlı hizmet veren yerel işletmelere odaklanmaktadır:
- **Kuaförler ve Berberler**
- **Güzellik ve Bakım Salonları**
- **Nail Art ve Tırnak Stüdyoları**
- **Spa, Masaj ve Klinik Randevulu Hizmet Sağlayıcılar**

## 💳 Abonelik ve Ödeme Modeli Altyapısı (Subscription Scaffold)
Sisteme ücretli planlar, limit kontrolleri ve fatura portalı entegrasyonu hazırlığı yapılmıştır. Bu aşama tamamen planların ve yetkilerin mock tabanlı simülasyonunu içerir. Hiçbir gerçek ödeme veya kart işlemi şuan gerçekleşmez (Canlı ödeme henüz aktif değildir). Gerçek ödeme işlemleri için iyzico sandbox test altyapısı hazırlanmıştır ve Node.js tabanlı sunucu fonksiyonlarına (Edge Functions) inşa edilmelidir.

---

## 🚀 Geliştirme Ortamı Kurulumu

### 1️⃣ Çevre Değişkenleri (Environment Variables)

Proje ana dizininde bulunan `.env.example` dosyasının bir kopyasını oluşturun ve adını `.env` olarak değiştirin.

```env
# MOCK veya SUPABASE Veri Akış Modu
VITE_DATA_MODE=mock

# SPA Routing Tipi (Vercel gibi ortamlarda browser, yerel testlerde hash).
VITE_ROUTER_MODE=hash
```

🚨 **ÖNEMLİ YAPAY ZEKA GÜVENLİK NOTU:**  
Gemini API anahtarı `VITE_GEMINI_API_KEY` olarak istemci (client) tarafında **ASLA PRODUCTION ORTAMINDA KULLANILMAMALIDIR**. Şu anki geliştirme iterasyonunda mock ve test amaçlı tarayıcıdan çalışmaktadır ancak üretim ortamına (production) çıkmadan önce tüm yapay zeka çağrıları bir Node.js Backend / Edge Function üzerinden geçirilmek zorundadır.

### 2️⃣ Uygulamayı Başlatma

```bash
npm install
npm run dev
```

---

## 🔐 Geliştirici Rolleri ve Yönetici (Admin) Erişimi

Yerel (Mock) Mod (`VITE_DATA_MODE=mock`) ile çalışırken, tüm rol geçişleri ve özellik testlerini yapabilmek için aşağıdaki **sadece geliştirmeye özel (development-only)** hesapları kullanabilirsiniz:

**1. Salon Sahibi (Tenant Admin):**
- **Sorumluluk:** Kendi salonunu yönetme, kurulum yapma, randevularını ayarlama. Sadece `/admin` rotasına erişebilir. `/super-admin`e erişimi yoktur.
- **E-posta:** `admin@randapp.com`
- **Şifre:** `admin123`

**2. Süper Yönetici (Super Admin):**
- **Sorumluluk:** Tüm salonları (tenant'ları) listeleme, metrikleri görüntüleme, onboarding onayı verme (Yayına Alma). Sadece `/super-admin` rotasına erişebilir.
- **E-posta:** `superadmin@randapp.com`
- **Şifre:** `superadmin123`

Eğer VITE_DATA_MODE `supabase` ise, uygulama gerçek Supabase yetkilendirmesi üzerinden çalışacaktır ve rollere sahip üyeliğiniz olması gerekir. Mock şifreler üretim veritabanına bağlanırken devrede değildir.

---

_Akıllı Randevu Sistemleri için Sevgiyle <3 hazırlanmıştır._
