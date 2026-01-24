{
  "brand": {
    "name": "KAYSERİ EMLAKÇILAR ESNAF VE SANATKARLAR ODASI (KEESO)",
    "attributes": ["kurumsal", "güvenilir", "resmi", "şeffaf", "erişilebilir"],
    "tone": "Resmi ve sade. Hızlı, anlaşılır, abartısız hareket/animasyon."
  },
  "palette": {
    "primary": {"hex": "#1e3a8a", "usage": ["başlıklar", "birincil butonlar", "header arka planında ince alt sınır", "ikonlar"], "hsl": "224 64% 33%"},
    "accent": {"hex": "#dc2626", "usage": ["CTA", "uyarı etiketleri", "önemli vurgular", "aktif menü alt çizgisi"], "hsl": "0 72% 51%"},
    "bg": {"white": "#ffffff", "light": "#f3f4f6"},
    "text": {"heading": "#1e3a8a", "body": "#1f2937", "muted": "#6b7280"},
    "support": {"border": "#e5e7eb", "success": "#16a34a", "warning": "#f59e0b", "info": "#2563eb"},
    "notes": [
      "Koyu degrade kullanmayın. İçerik blokları düz arka plan olmalı.",
      "Kırmızı sadece vurgu/CTA ve durum etiketlerinde sınırlı kullanılmalı."
    ]
  },
  "typography": {
    "families": {
      "heading": "Montserrat",
      "body": "Inter",
      "mono": "Source Code Pro"
    },
    "cdn_or_import": {
      "google_fonts": "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700&display=swap"
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight",
      "h2": "text-base md:text-lg font-semibold",
      "h3": "text-lg md:text-xl font-semibold",
      "body": "text-sm md:text-base leading-relaxed",
      "small": "text-xs text-muted-foreground"
    },
    "weights": {"normal": 400, "medium": 500, "semibold": 600, "bold": 700}
  },
  "css_tokens": {
    "tailwind_root_overrides_hint": "index.css içindeki :root section’ına ekleyin ve mevcut shadcn tokenlerini KEESO renklerine eşleyin.",
    "snippet": "@layer base {\n  :root {\n    /* KEESO brand tokens (referans) */\n    --keeso-primary: 224 64% 33%; /* #1e3a8a */\n    --keeso-accent: 0 72% 51%;   /* #dc2626 */\n    --keeso-bg: 0 0% 100%;       /* #ffffff */\n    --keeso-bg-muted: 220 14% 96%; /* #f3f4f6 */\n    --keeso-body: 215 28% 17%;   /* #1f2937 yaklaşık */\n    --keeso-border: 210 20% 92%; /* #e5e7eb */\n\n    /* Map to shadcn tokens */\n    --background: var(--keeso-bg);\n    --foreground: var(--keeso-body);\n    --card: var(--keeso-bg);\n    --card-foreground: var(--keeso-body);\n    --popover: var(--keeso-bg);\n    --popover-foreground: var(--keeso-body);\n    --primary: var(--keeso-primary);\n    --primary-foreground: 0 0% 100%;\n    --secondary: var(--keeso-bg-muted);\n    --secondary-foreground: var(--keeso-body);\n    --muted: var(--keeso-bg-muted);\n    --muted-foreground: 215 16% 47%;\n    --accent: var(--keeso-accent);\n    --accent-foreground: 0 0% 100%;\n    --destructive: var(--keeso-accent);\n    --destructive-foreground: 0 0% 98%;\n    --border: var(--keeso-border);\n    --input: var(--keeso-border);\n    --ring: var(--keeso-primary);\n    --radius: 0.5rem;\n  }\n}\n\n/* Global font family */\nbody {\n  font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;\n}\n.h-heading { font-family: 'Montserrat', ui-sans-serif, system-ui; }\n"
  },
  "components": {
    "Header": {
      "component_path": ["/app/frontend/src/components/ui/navigation-menu.jsx", "/app/frontend/src/components/ui/button.jsx"],
      "layout": "Sol: logo (koyu lacivert metin veya görsel), sağ: Ana Sayfa, Kurumsal, Üyelik, Hizmetler, Duyurular, Ziyaretler, Ödeme, İletişim. Sticky, beyaz zemin, alt sınır.",
      "classes": "sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b",
      "nav_item": "px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#1e3a8a] aria-[current=page]:text-[#1e3a8a]",
      "testids": {
        "container": "header-navbar",
        "logo": "header-logo",
        "nav-link": "header-nav-link"
      }
    },
    "Hero": {
      "usage": "Kurumsal sadelik, Erciyes görseli veya KEESO binası, minimal başlık + kısa açıklama + 1 birincil CTA.",
      "classes": "bg-white", 
      "structure_jsx": "<section className=\"container mx-auto px-4 py-12 sm:py-16\">\n  <div className=\"grid md:grid-cols-2 gap-8 items-center\">\n    <div>\n      <h1 className=\"h-heading text-4xl sm:text-5xl lg:text-6xl text-[#1e3a8a]\">KEESO</h1>\n      <p className=\"mt-4 text-slate-700 max-w-prose\">Kayseri Emlakçılar Esnaf ve Sanatkarlar Odası resmi web sitesi.</p>\n      <div className=\"mt-6 flex gap-3\">\n        <Button data-testid=\"hero-basvuru-cta\" className=\"bg-[#1e3a8a] hover:bg-[#1b3479]\">Üyelik Başvurusu</Button>\n        <Button data-testid=\"hero-duyurular-cta\" variant=\"outline\" className=\"border-[#1e3a8a] text-[#1e3a8a] hover:bg-slate-50\">Duyurular</Button>\n      </div>\n    </div>\n    <div className=\"aspect-[16/10] rounded-lg overflow-hidden border\">\n      <img src=\"/images/erciyes-hero.jpg\" alt=\"Erciyes Dağı ve Kayseri silueti\" className=\"w-full h-full object-cover\" />\n    </div>\n  </div>\n</section>",
      "component_path": ["/app/frontend/src/components/ui/button.jsx", "/app/frontend/src/components/ui/aspect-ratio.jsx", "/app/frontend/src/components/ui/card.jsx"]
    },
    "QuickActions": {
      "usage": "Anasayfa kısayolları (Üyelik Başvurusu, Evrak Doğrulama, Belge Listesi, İletişim).",
      "grid": "grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4",
      "card_style": "bg-white border rounded-lg p-4 hover:shadow-sm transition-colors",
      "iconography": "lucide-react ikonları (FileText, Users, Phone, Building).",
      "testids": {"card": "quick-action-card", "link": "quick-action-link"},
      "component_path": ["/app/frontend/src/components/ui/card.jsx", "/app/frontend/src/components/ui/button.jsx"]
    },
    "AnnouncementsList": {
      "usage": "Liste görünümü + kategori filtresi + sayfalama.",
      "filters": "<Select> ile kategori; <Input> ile arama; <Pagination> ile sayfalama",
      "classes": "space-y-4",
      "row": "border rounded-lg p-4 bg-white hover:bg-slate-50",
      "component_path": ["/app/frontend/src/components/ui/select.jsx", "/app/frontend/src/components/ui/input.jsx", "/app/frontend/src/components/ui/pagination.jsx", "/app/frontend/src/components/ui/card.jsx"],
      "testids": {"filter-select": "duyurular-kategori-select", "search-input": "duyurular-ara-input", "row": "duyuru-kart"}
    },
    "Documents": {
      "usage": "Belgeler ve doküman merkezi. Tablo görünümleri, indirme butonları.",
      "row_actions": ["indir", "görüntüle"],
      "component_path": ["/app/frontend/src/components/ui/table.jsx", "/app/frontend/src/components/ui/button.jsx", "/app/frontend/src/components/ui/select.jsx", "/app/frontend/src/components/ui/checkbox.jsx"],
      "testids": {"table": "dokuman-tablosu", "download-button": "dokuman-indir-button"}
    },
    "ContactForm": {
      "usage": "Profesyonel form: Ad Soyad, E-posta, Telefon, Mesaj.",
      "component_path": ["/app/frontend/src/components/ui/form.jsx", "/app/frontend/src/components/ui/input.jsx", "/app/frontend/src/components/ui/textarea.jsx", "/app/frontend/src/components/ui/button.jsx"],
      "validation": "react-hook-form + zod önerilir",
      "testids": {"form": "iletisim-form", "submit": "iletisim-gonder-button"},
      "note": "WhatsApp ve telefon için tıklanabilir butonlar ekleyin."
    },
    "Gallery": {
      "usage": "Ziyaretler galerisi. Grid + tıklayınca büyüt (Dialog).",
      "component_path": ["/app/frontend/src/components/ui/carousel.jsx", "/app/frontend/src/components/ui/dialog.jsx", "/app/frontend/src/components/ui/card.jsx"],
      "testids": {"image": "galeri-gorsel", "dialog": "galeri-dialog"}
    },
    "Admin": {
      "modules": ["Duyurular", "Belgeler", "Üyeler", "Galeri"],
      "patterns": ["Tablo + arama + filtre + CRUD için Dialog", "Toast bildirimleri"],
      "component_path": ["/app/frontend/src/components/ui/table.jsx", "/app/frontend/src/components/ui/dialog.jsx", "/app/frontend/src/components/ui/form.jsx", "/app/frontend/src/components/ui/input.jsx", "/app/frontend/src/components/ui/textarea.jsx", "/app/frontend/src/components/ui/button.jsx", "/app/frontend/src/components/ui/sonner.jsx", "/app/frontend/src/components/ui/tabs.jsx"],
      "testids": {"create-button": "admin-yeni-kayit-button", "edit-button": "admin-duzenle-button", "delete-button": "admin-sil-button", "table": "admin-tablo"}
    },
    "Footer": {
      "layout": "3 sütun: İletişim (adres/telefon/e-posta), Hızlı Menü, Sosyal/Harita bağlantıları.",
      "classes": "bg-white border-t",
      "testids": {"container": "footer-container"}
    },
    "Buttons": {
      "style": "Professional / Corporate",
      "radius": "rounded-md",
      "variants": {
        "primary": "bg-[#1e3a8a] text-white hover:bg-[#1b3479] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1e3a8a]",
        "secondary": "border border-[#1e3a8a] text-[#1e3a8a] hover:bg-slate-50",
        "ghost": "text-slate-700 hover:bg-slate-100"
      },
      "sizes": {"sm": "h-9 px-3", "md": "h-10 px-4", "lg": "h-11 px-5"},
      "data_testid_rule": "Tüm butonlara veri-tabanlı testler için açıklayıcı data-testid ekleyin (örn. data-testid=\"uyelik-formu-kaydet-button\")."
    }
  },
  "layout": {
    "container": "mx-auto w-full max-w-7xl px-4 md:px-6",
    "section_spacing": "py-10 sm:py-12 md:py-16",
    "cards": "bg-white border rounded-lg",
    "grid_system": {
      "mobile_first": true,
      "homepage": "stacked; ardından 2-4 kolon grid",
      "content_pages": "iki sütun: içerik + yan menü (md ve üstü)"
    }
  },
  "pages": {
    "/ (Ana Sayfa)": ["Hero", "QuickActions", "Duyurular (son 5)", "Hakkımızda kısa"] ,
    "Kurumsal": ["Tarihçe", "Misyon/Vizyon", "Yönetim Kurulu (liste kartları)", "Belgeler"],
    "Üyelik": ["Üyelik şartları", "Gerekli belgeler", "Sıkça Sorulanlar", "Başvuru formu (Form)", "Üyelik Sorgu (Input+Button)"],
    "Hizmetler": ["Sicil işlemleri listesi (Card + Link)", "Belge merkezi (Table)", "Ücretlendirme tablosu"],
    "Duyurular": ["Kategori filtresi (Select)", "Arama (Input)", "Liste (Card)", "Sayfalama"],
    "İletişim": ["İletişim formu", "Adres/telefon/WhatsApp butonları", "Gömülü harita"],
    "Ziyaretler": ["Galeri grid + Dialog büyütme", "Etiket/başlıklar"],
    "Ödeme": ["Harici ödeme bağlantıları (Button - outline)", "Açıklamalar"],
    "Yönetim Paneli": ["Sekmeler (Tabs)", "Tablo + CRUD (Dialog)", "Toast bildirimleri", "Rol bazlı erişim placeholder"]
  },
  "spacing": {
    "scale": [4, 8, 12, 16, 20, 24, 32, 40, 48, 64],
    "rules": ["Bölümler arası en az 48px", "Kart içi 16–24px", "Tipografi alt boşlukları 1.5x satır yüksekliği"]
  },
  "breakpoints": {"sm": 640, "md": 768, "lg": 1024, "xl": 1280, "2xl": 1536},
  "motion": {
    "principles": ["Hızlı ve sade", "Yalnızca hover/focus/entrance – evrensel transition YOK"],
    "examples": {
      "link_hover": "transition-colors duration-150",
      "button_hover": "transition-colors duration-150",
      "card_hover": "transition-colors duration-150"
    }
  },
  "accessibility": {
    "language": "tr",
    "contrast": "Başlık/Body metinleri arka planla AA+ kontrast",
    "focus": "Tüm etkileşimli öğelerde görünür focus ring (ring-[#1e3a8a] ring-offset-2)",
    "aria": ["nav, main, footer landmark rolleri", "img alt zorunlu"],
    "testing": "Tüm interaktif/önemli metinlerde data-testid zorunlu (kebab-case ve rol tanımlı)."
  },
  "microcopy": {
    "nav": ["Ana Sayfa", "Kurumsal", "Üyelik", "Hizmetler", "Duyurular", "Ziyaretler", "Ödeme", "İletişim"],
    "cta": {"apply": "Üyelik Başvurusu", "viewAnnouncements": "Duyurular"},
    "form": {"name": "Ad Soyad", "email": "E-posta", "phone": "Telefon", "message": "Mesaj", "submit": "Gönder"}
  },
  "libraries": {
    "required": [
      {"name": "lucide-react", "usage": "ikons", "install": "npm i lucide-react"},
      {"name": "react-hook-form", "usage": "Form state", "install": "npm i react-hook-form"},
      {"name": "zod", "usage": "Form doğrulama", "install": "npm i zod"}
    ],
    "optional": [
      {"name": "@tanstack/react-table", "usage": "Gelişmiş tablo sıralama/filtreleme", "install": "npm i @tanstack/react-table"}
    ],
    "toasts": {"component_path": "/app/frontend/src/components/ui/sonner.jsx", "usage": "import { Toaster, toast } from './components/ui/sonner'"}
  },
  "image_urls": [
    {"category": "hero", "description": "Erciyes ve şehir silueti (kurumsal, sakin)", "url": "https://images.unsplash.com/photo-1716813695408-fa6576c9d22d?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"category": "hero_alt", "description": "Erciyes dağ silueti alternatif", "url": "https://images.unsplash.com/photo-1716813708880-5cfeabb12f69?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"category": "gallery", "description": "Erciyes tipili kış", "url": "https://images.unsplash.com/photo-1623007241547-954541fd7760?crop=entropy&cs=srgb&fm=jpg&q=85"},
    {"category": "gallery", "description": "ERCİYES yazısı", "url": "https://images.pexels.com/photos/19271759/pexels-photo-19271759.jpeg"}
  ],
  "component_path": [
    "/app/frontend/src/components/ui/button.jsx",
    "/app/frontend/src/components/ui/card.jsx",
    "/app/frontend/src/components/ui/input.jsx",
    "/app/frontend/src/components/ui/textarea.jsx",
    "/app/frontend/src/components/ui/select.jsx",
    "/app/frontend/src/components/ui/pagination.jsx",
    "/app/frontend/src/components/ui/table.jsx",
    "/app/frontend/src/components/ui/dialog.jsx",
    "/app/frontend/src/components/ui/form.jsx",
    "/app/frontend/src/components/ui/navigation-menu.jsx",
    "/app/frontend/src/components/ui/carousel.jsx",
    "/app/frontend/src/components/ui/sonner.jsx",
    "/app/frontend/src/components/ui/tabs.jsx",
    "/app/frontend/src/components/ui/checkbox.jsx",
    "/app/frontend/src/components/ui/separator.jsx"
  ],
  "instructions_to_main_agent": {
    "assets": [
      "Kullanıcının sağladığı resmi KEESO logosunu /public/keeso-logo.png olarak yerleştirin.",
      "Hero görselini /public/images/erciyes-hero.jpg olarak kopyalayın (image_urls listesinde var)."
    ],
    "header_scaffold": "<header className=\"sticky top-0 z-50 bg-white border-b\" data-testid=\"header-navbar\">...</header>",
    "seo": [
      "Her sayfada <title> ve meta description (Türkçe)",
      "Breadcrumb JSON-LD (Kurumsal, Duyurular vb.)",
      "OpenGraph: başlık, açıklama, paylaşım görseli"
    ],
    "routing": "React Router veya mevcut yönlendirme katmanıyla yukarıdaki sayfaları oluşturun.",
    "forms": "react-hook-form + zod kullanın. Hatalar için <FormMessage>. Tüm input/buttonlara data-testid ekleyin.",
    "tables": "shadcn table bileşenlerini kullanın. Gerekirse TanStack Table ile sıralama/filtre ekleyin.",
    "maps": "İletişim sayfasında Google Maps embed (iframe) yeterli.",
    "testing_attrs": "Etkileşimli ve kritik metinlerde data-testid şart. Örn: header-nav-link, duyurular-kategori-select, iletisim-gonder-button, admin-yeni-kayit-button",
    "do_nots": [
      "Aşırı animasyon yok",
      "Gradient yoğunluğu < 20% viewport",
      "İçerik alanlarında gradient yok"
    ]
  },
  "general_ui_ux_design_guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
