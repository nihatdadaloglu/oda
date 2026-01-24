# KEESO Kurumsal Web Sitesi – Uygulama Planı (v1)

Kapsam: Kayseri Emlakçılar Esnaf ve Sanatkârlar Odası (KEESO) için modern, hızlı, mobil öncelikli ve kurumsal web sitesi. Türkçe, güven veren, sade ve okunabilir arayüz.

## 1) Objectives (Amaçlar)
- Kurumsal, hızlı ve mobil uyumlu bir site oluşturmak
- İçeriklerin tamamını yönetilebilir yapmak (duyuru, doküman, sayfalar, ziyaretler, ödemeler)
- Basit admin girişi ve içerik yönetimi (2 yönetici, opsiyonel role destek)
- Dosya yükleme (PDF, görsel, başvuru eki) ve e‑posta bildirimleri (SendGrid/SMTP)
- SEO (başlık/açıklama, sitemap) ve erişilebilirlik

## 2) Architecture & Key Decisions
- Stack: React (shadcn/ui), FastAPI, MongoDB (FARM). Tüm API yolları `/api` ile başlar.
- Kimlik Doğrulama: JWT (email/şifre). Roller: admin, editor (v1’de opsiyonel).
- Depolama: Sürücü tabanlı katman (Local v1) → S3 uyumlu sürücü (ENV ile geçiş).
- E‑posta: SendGrid tercih; yoksa SMTP. ENV ile seçilebilir: EMAIL_PROVIDER=sendgrid|smtp.
- SEO: SSR yok; React’te dinamik meta (react-helmet-async). FastAPI’de `/api/sitemap.xml`.
- Tasarım: Logo sol üst, beyaz/açık başlık; Ana renk lacivert, vurgu kırmızı, arkaplan beyaz/açık gri; tipografi Inter/Montserrat/Roboto.

## 3) Phase 1 – Core POC (Gerekli)
Neden: Dış entegrasyon (e‑posta) ve dosya yükleme akışı kritik ve hata eğilimli.

### 3.1 POC Kapsamı
- Entegrasyon playbook: SendGrid + SMTP (integration agent)
- `test_core.py` tek dosya:
  - `test_sendgrid_email()` – ENV ile tek deneme e‑postası
  - `test_smtp_email()` – ENV ile tek deneme e‑postası
  - `test_storage_local()` – örnek PDF/JPEG’i `uploads/` içine güvenli isimle kaydetme ve okuma
  - (Opsiyon) `test_storage_s3()` – S3 ENV varsa presigned URL ile yükleme/erişim
- Başarım ölçütü: E‑posta fonksiyonları başarılı yanıt döner; dosyalar yazılır, geri okunur.

### 3.2 ENV Beklentileri
- SendGrid: `SENDGRID_API_KEY`, `EMAIL_FROM`, `EMAIL_TO_TEST`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO_TEST`
- Depolama: `STORAGE_DRIVER=local|s3`, `UPLOAD_DIR=/app/uploads`
- S3: `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`

### 3.3 POC User Stories (en az 5)
1. Yönetici olarak test e‑postası gönderebildiğimi doğrulamak istiyorum.
2. SMTP ile de yedek e‑posta gönderebildiğimi görmek istiyorum.
3. Örnek PDF’in sunucuda güvenli şekilde kaydedildiğini ve geri okunabildiğini görmek istiyorum.
4. S3 bilgileri varsa presigned URL ile yükleyip indirme bağlantısını doğrulamak istiyorum.
5. Hatalı ENV durumunda anlaşılır hata mesajları görmek istiyorum.

## 4) Phase 2 – Ana Uygulama Geliştirme

### 4.1 Veri Modelleri (Mongo)
- users: email, password_hash, role
- announcements: title, slug, category, content, cover_image, published_at
- documents: title, description, file_url, tags
- visits (ziyaretler): title, date, description, cover_image, gallery_images[]
- payments: title, description, external_url, button_text
- page_sections: page (kurumsal/uyelik/hizmetler), key, content (HTML/JSON)
- settings: contact info (adres/telefon/email/whatsapp/map), socials, seo
- membership_applications: name, phone, email, files[], status, note, created_at
- contacts: name, phone, email, message, created_at

### 4.2 Backend – FastAPI
- Auth: `/api/auth/login`, `/api/auth/seed-admins` (2 admin’i ilk çalıştırmada seed)
- CRUD: `/api/announcements`, `/api/documents`, `/api/visits`, `/api/payments`, `/api/page-sections`, `/api/settings`
- Upload: `/api/upload` (PDF/JPEG/PNG, boyut ve mime kontrol), storage driver ile URL döndürme
- Forms: `/api/contact` (e‑posta bildirimi + kayıt), `/api/membership` (form + ekler + e‑posta)
- Query: `/api/announcements?category=...`, `/api/membership/status?query=...`
- SEO: `/api/sitemap.xml`
- Yardımcılar: `serialize_doc`, rol kontrol dekoratörleri

### 4.3 Frontend – React
- Router: Ana Sayfa, Kurumsal, Üyelik, Hizmetler, Duyurular (liste+detay), İletişim, Ziyaretler (liste+detay), Ödeme, Admin (login+panel)
- Ana Sayfa: Hero (başlık+alt başlık), Hızlı İşlemler kartları, Son Duyurular, Hakkımızda
- Kurumsal: Oda Hakkında, Yönetim Kurulu, Mevzuat (page_sections’ten)
- Üyelik: Şartlar, Başvuru formu (ek yükleme), Üyelik sorgulama
- Hizmetler: Doküman Merkezi (PDF indirme), Dilekçe şablonları, Eğitimler
- Duyurular: kategori filtre, arama, detay sayfası
- İletişim: form (bildirim), harita (placeholder), click-to-call, WhatsApp
- Ziyaretler: kapak görselli liste, detayda galeri
- Ödeme: dış linkli ödeme kalemleri (redirect)
- Admin Panel: Duyurular/Belge/Sayfalar/Ziyaretler/Ödemeler/Settings/İletişimler/Başvurular (CRUD)
- UI/UX: Lacivert-kırmızı tema, geniş boşluklar, yükleniyor + hata durumları; tüm etkileşimlere `data-testid`.

### 4.4 Phase 2 User Stories (ziyaretçi + admin)
US2.1–US2.25 (talep edilenlerin aynen karşılanması: ana sayfa gezinim, kurumsal içerik, üyelik başvurusu ve sorgulama, doküman merkezi, duyurular liste/detay, iletişim+harita+çağrı+WhatsApp, ziyaretler liste/detay, ödeme dış link, admin login, tüm CRUD’lar, ayarlar, başvurular ve iletişim görüntüleme, e‑posta bildirimleri, mobil hız ve kurumsal tasarım).

### 4.5 Uygulama Adımları (Operasyonel)
1. Design Agent: kurumsal UI rehberi (logo/renk/komponent)
2. Bağımlılıklar: backend (python-multipart, pydantic[email], sendgrid veya smtplib, boto3 opsiyonel), frontend (react-router-dom, axios, react-helmet-async)
3. Backend ve Frontend’i bulk olarak yazma; .env’leri kullanma (REACT_APP_BACKEND_URL, MONGO_URL)
4. Görsel/PDF upload ve gösterim akışlarını doğrulama
5. E‑posta bildirimlerini formlara bağlama
6. SEO: helmet meta + sitemap endpoint
7. İlk örnek içerik seed (Türkçe)
8. E2E test: testing agent ile tüm US’ler

## 5) Phase 3 – Test & İyileştirme
- testing_agent_v3 ile tüm akışların taranması (drag&drop/kamera testleri atlanır)
- Hata düzeltmeleri (önce kritik)
- Performans: görsel optimizasyonu, lazy load, önbellekleme başlıkları
- Güvenlik: rate limit basit, giriş korumaları, CORS, yükleme boyut sınırları
- Nihai tasarım uyumu, içerik ve metin gözden geçirme

## 6) Next Actions (Hemen Sonraki Adımlar)
- (Biz) Phase 1 POC: entegrasyon playbook → test_core.py → çalıştır & doğrula
- (Siz) Hazır olduğunuzda: SendGrid anahtarı veya SMTP bilgileri; S3 bilgileri (opsiyonel)
- (Biz) Design Agent çağrısı ve tam geliştirme (20–30 dk uygulama süreci bildirimi)

## 7) Success Criteria (Başarı Kriterleri)
- Tüm US2.1–US2.25 ve Phase 3 kontrolleri geçer
- E‑posta bildirimleri ve dosya yükleme/indirme hatasız çalışır
- `/api` ön-ekli endpointler ve ENV kullanımında hardcode yok
- Mobilde hızlı, Lighthouse uygun, kurumsal arayüz; renkler ve tipografi uygun
- SEO: başlık/açıklama set, `/api/sitemap.xml` üretilir
- Admin panelden tüm içerikler düzenlenebilir; örnek içeriklerle canlı önizleme
