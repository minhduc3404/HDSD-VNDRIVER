# VNDriver Help Center — System Design Document

## 1. Tổng quan dự án

**Mục tiêu:** Chuyển đổi tài liệu hướng dẫn sử dụng app VNDriver (định dạng docx/HTML thô) → phân tích, chắt lọc, chuẩn hóa nội dung theo cấu trúc bài hướng dẫn → xuất bản web responsive mobile/desktop.

**Đối tượng:** Tài xế lái xe sử dụng app VNDriver để nhận cuốc.

**Yêu cầu chính:**
- Dễ dàng thêm bài hướng dẫn mới
- Responsive mobile-first (tài xế xem trên điện thoại là chính)
- Nội dung chuẩn hóa, ngắn gọn, dễ làm theo
- Chi phí thấp / free

---

## 2. Kiến trúc tổng thể

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   RAW SOURCE     │ ──▶ │   PROCESSING      │ ──▶ │   WEB OUTPUT     │
│                  │     │   PIPELINE        │     │                  │
│ .docx (gốc)      │     │                   │     │ Static Site      │
│ .html (gốc)      │     │ Phân tích cấu trúc│     │ Responsive       │
│ .md (trung gian) │     │ Chắt lọc nội dung │     │ Search           │
│                  │     │ Chuẩn hóa schema   │     │ Navigation       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 3. Cấu trúc thư mục đề xuất

```
HDSD Driver/
├── SYSTEM.md                         # File này — mô tả hệ thống
├── original-documents/               # Tài liệu gốc (docx/HTML thô)
│   ├── 00.TL-HDSD-APP-LAI-XE.docx
│   ├── 00.TL-ALi-FAQ-V2.docx
│   └── ...
│
├── content/                          # Nội dung chuẩn hóa (Markdown + frontmatter)
│   ├── install.md                    # Bài: Cài đặt App
│   ├── login.md                      # Bài: Đăng nhập/Đăng xuất
│   ├── trip.md                       # Bài: Đón khách & chuyến đi
│   ├── queue.md                      # Bài: Xếp tài
│   ├── status.md                     # Bài: Trạng thái app
│   ├── profile.md                    # Bài: Hồ sơ & âm thanh
│   ├── wallet.md                     # Bài: Ví ký quỹ
│   └── faq/
│       ├── gps-issues.md             # FAQ: Lỗi GPS
│       ├── login-other-device.md     # FAQ: Đăng nhập thiết bị khác
│       └── ...
│
├── scripts/                          # Script xử lý nội dung
│   ├── normalize.py                  # Chuyển raw → markdown chuẩn
│   └── validate-schema.py            # Kiểm tra frontmatter/schema
│
├── assets/                           # Ảnh minh họa
│   ├── screenshots/
│   │   ├── install-android-01.png
│   │   ├── install-ios-01.png
│   │   └── ...
│   └── icons/
│
├── design-system/                    # Design System (tham khảo)
│   ├── vndriver-project-design-system-v2.html
│   ├── vndriver-design-system-mobile-pro.html
│   ├── vndriver-design-system-components.html
│   └── vndriver-hdsd-driver-content-rules.html
│
├── prototypes/                       # Prototype HTML (hiện có)
│   ├── cai-dat-app-vndriver.html
│   ├── hdsd-vndriver-driver.html
│   ├── hdsd-vndriver-driver-pro.html
│   ├── hdsd-vndriver-driver-full.html
│   └── vndriver-content-v2.jsx
│
├── mkdocs.yml                        # [Nếu chọn MkDocs] Config
│
├── docusaurus.config.js              # [Nếu chọn Docusaurus] Config
│
└── output/                           # Build output (HTML tĩnh)
    └── ...
```

---

## 4. Schema bài hướng dẫn (Article Schema)

Mỗi bài hướng dẫn là 1 file Markdown với frontmatter YAML.

### Schema (từ phân tích prototype hiện tại):

```yaml
---
# ── Metadata ──
id: "install"                     # ID duy nhất, dùng cho URL/sidebar
title: "Cài đặt App VnDriver"     # Tên bài — ngôn ngữ tài xế
description: "Hướng dẫn tải app, mở app và cấp quyền lần đầu."
time: "2 phút"                    # Ước lượng thời gian
category: "getting-started"       # Nhóm: getting-started | trip | settings | faq
platform: "both"                   # android | ios | both
icon: "📱"                         # Icon hiển thị trong danh sách
order: 1                          # Thứ tự trong sidebar
created: "2026-06-23"
updated: "2026-06-23"
# ── Content ──
steps:                            # Mảng các bước, tối đa 5-7 bước
  - text: "Mở CH Play, tìm \"vndriver\""     # Hành động — bắt đầu bằng động từ
    sub: "..."                                # Hướng dẫn phụ (optional)
    screen: "Tìm kiếm VnDriver trên CH Play" # Caption ảnh (optional)
    warn: "..."                               # Cảnh báo (optional)
  - text: "Bấm Cài đặt → đợi tải → bấm Mở"
    screen: "Cài đặt App VnDriver"
done: "Xong — mở app, đăng nhập."           # Kết quả khi hoàn thành
related: ["login", "status"]                 # Bài liên quan
---
```

### Quy tắc viết (Content Rules):

| Quy tắc | Ví dụ Đúng | Ví dụ Sai |
|---|---|---|
| Bỏ chủ ngữ, bắt đầu bằng động từ | "Mở CH Play, tìm \"vndriver\"" | "Tài xế truy cập vào CH Play..." |
| Dùng → cho chuỗi thao tác | "Bấm Cài đặt → đợi → bấm Mở" | "Click chọn vào ứng dụng..." |
| 1 cảnh báo = 1 ý | "⚠️ Bắt buộc — nếu không app bị tắt" | Gộp nhiều lỗi trong 1 cảnh báo |
| Kết thúc bằng kết quả | "Xong — sẵn sàng nhận chuyến." | Lặp lại bước cuối |

---

## 5. Component Library (kế thừa từ prototype)

| Component | Mô tả |
|---|---|
| **TopBar** | Thanh top sticky, brand + navigation |
| **Hero** | Đầu trang: title, meta, ảnh minh họa |
| **ArticleCard** | Thẻ bài viết trong danh sách |
| **StepItem** | 1 bước: số thứ tự + nội dung |
| **Alert/Warning** | Cảnh báo (warning/info/success) |
| **Screenshot** | Khung chứa ảnh + caption |
| **FAQAccordion** | FAQ dạng xem thêm/ẩn bớt |
| **PlatformToggle** | Chuyển Android/iOS |

### Design Tokens

- Brand: `#1A2B4A` (navy), `#2563EB` (blue)
- Success: `#16A34A` (green)
- Warning: `#D97706` (amber)
- Danger: `#DC2626` (red)
- Surface: `#F9FAFB` (gray-50)
- Text: `#1F2937` (gray-800)
- Radius: 6px–24px
- Font: Inter / -apple-system

---

## 6. Cách thêm bài hướng dẫn mới

### Quy trình 4 bước:

**Bước 1 — Phân tích tài liệu gốc**
- Đọc file docx/HTML gốc từ `original-documents/`
- Xác định: mục đích bài, đối tượng, các bước chính, lưu ý

**Bước 2 — Tạo file Markdown**
- Tạo file `.md` trong `content/`
- Điền frontmatter YAML theo schema
- Viết nội dung theo Content Rules
- 1 bước = 1 hành động tối đa, dùng `→` nối thao tác liên tiếp

**Bước 3 — Thêm ảnh minh họa**
- Đặt ảnh vào `assets/screenshots/`
- Đặt tên theo quy tắc: `{article-id}-{platform}-{step-number}.png`
- Cập nhật trường `screen` trong step

**Bước 4 — Cập nhật navigation**
- Nếu dùng **MkDocs**: thêm vào `mkdocs.yml` → `nav:`
- Nếu dùng **Docusaurus**: thêm vào `sidebars.js`

---

## 7. Stack & Công cụ khuyến nghị

### Phương án A — MkDocs + Material for MkDocs (Khuyến nghị)

**Ưu điểm:**
- Đơn giản: Markdown + 1 file YAML config
- Giao diện Material responsive/đẹp
- Host miễn phí trên GitHub Pages
- Tích hợp Decap CMS cho editor UI (nếu cần)
- Chi phí: $0

**Pipeline:**
```
raw/*.docx|html  ──▶  scripts/normalize.py  ──▶  content/*.md  ──▶  mkdocs build  ──▶  output/
```

**Cấu hình nav** (`mkdocs.yml`):
```yaml
nav:
  - Bắt đầu:
    - Cài đặt App: install.md
    - Đăng nhập/Đăng xuất: login.md
  - Chuyến đi:
    - Đón khách & chuyến đi: trip.md
    - Xếp tài: queue.md
  - Cài đặt:
    - Trạng thái app: status.md
    - Hồ sơ & âm thanh: profile.md
    - Ví ký quỹ: wallet.md
  - FAQ:
    - Lỗi GPS: faq/gps-issues.md
    - Đăng nhập thiết bị khác: faq/login-other-device.md
```

### Phương án B — Docusaurus + Contentlayer

**Ưu điểm:**
- Versioning, search, i18n built-in
- Phù hợp nếu mở rộng nhiều sau này
- MDX cho phép chèn component React phức tạp

**Pipeline:**
```
raw/*.docx|html  ──▶  scripts/normalize.js  ──▶  content/*.mdx  ──▶  Docusaurus build  ──▶  output/
```

---

## 8. Trạng thái dự án hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Design System (tokens, components, rules) | ✅ Đã hoàn thiện |
| Content Rules (quy tắc viết) | ✅ Đã hoàn thiện |
| Article Schema | ✅ Đã hoàn thiện (trong `vndriver-content-v2.jsx`) |
| Prototype HTML (các bài mẫu) | ✅ Đã có |
| **File nguồn chuẩn hóa (content/*.md)** | ❌ Chưa tạo |
| **Script normalize raw→markdown** | ❌ Chưa tạo |
| **Static site config (MkDocs/Docusaurus)** | ❌ Chưa chọn stack |
| **Ảnh minh họa screenshots** | ❌ Chưa export |

---

## 9. Các file đã có trong dự án (tham khảo)

| File | Nội dung |
|---|---|
| `original documents/00.TL-HDSD-APP-LAI-XE-VNDriver.docx` | Tài liệu gốc HDSD |
| `original documents/00.TL-ALi-FAQ-V2.docx` | Tài liệu gốc FAQ |
| `vndriver-content-v2.jsx` | React component: article schema + rules + demo preview |
| `vndriver-hdsd-driver-content-rules.html` | Content rules + full page layout demo |
| `vndriver-project-design-system-v2.html` | Design tokens theo chuẩn MB AMC DS |
| `vndriver-design-system-mobile-pro.html` | Mobile design system (Inter font, token chuẩn) |
| `vndriver-design-system-components.html` | Component library (32 dòng, responsive) |
| `cai-dat-app-vndriver.html` | Bài mẫu: Cài đặt app (step-by-step, platform toggle) |
| `hdsd-vndriver-driver.html` | HDSD full: install, login, trip, queue, status, profile |
| `hdsd-vndriver-driver-pro.html` | Phiên bản pro của HDSD |
| `hdsd-vndriver-driver-full.html` | Phiên bản full nhất |

---

## 10. Kế hoạch triển khai tiếp theo

1. **Chọn stack**: MkDocs + Material for MkDocs (khuyến nghị) hoặc Docusaurus
2. **Tạo script normalize**: Chuyển nội dung từ prototype HTML/JSX sang file Markdown schema chuẩn
3. **Tạo các file content**: Từng bài hướng dẫn theo schema
4. **Cấu hình nav**: Tổ chức sidebar navigation
5. **Xuất ảnh screenshots**: Từ tài liệu gốc
6. **Build & deploy**: GitHub Pages hoặc hosting tĩnh
7. **Tích hợp CMS** (optional): Decap CMS để editor thêm bài qua UI

---

*Tài liệu được tạo ngày 23/06/2026 — dựa trên phân tích codebase hiện tại và tham khảo kiến trúc từ MkDocs/Material, Docusaurus, Decap CMS, Eleventy.*
