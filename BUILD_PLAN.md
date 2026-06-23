# BUILD PLAN: HDSD VNDriver — MkDocs + Docker

> Mục tiêu: Xây dựng site tài liệu hướng dẫn VNDriver (static HTML) từ tài liệu gốc `.docx` → Markdown → artifact → deploy.
>  
> Pipeline: **Document gốc (docx/HTML/JSX) → Con người + AI chuẩn hóa nội dung → Markdown → MkDocs build → Static HTML → Deploy**

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│                    Source of Truth                       │
│  [Original .docx]  [HTML prototypes]  [JSX content]     │
└──────────┬──────────────────────────────────────────────┘
           │ Extract & chuẩn hóa
           ▼
┌─────────────────────────────────────────────────────────┐
│              Content Layer (Markdown)                    │
│  docs/*.md — mỗi bài hướng dẫn = 1 file                 │
│  docs/faq/*.md — FAQ & Troubleshooting                  │
└──────────┬──────────────────────────────────────────────┘
           │ mkdocs build (trong Docker)
           ▼
┌─────────────────────────────────────────────────────────┐
│              Artifact Layer (Static HTML)                │
│  site/ — thư mục output, deploy trực tiếp               │
└──────────┬──────────────────────────────────────────────┘
           │ Upload to hosting
           ▼
┌─────────────────────────────────────────────────────────┐
│              Deploy Layer                                │
│  GitHub Pages / Netlify / Cloudflare Pages / Vercel     │
│  → URL công khai                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Môi trường & Yêu cầu

### Trên máy phát triển (Build machine)

| Công cụ | Bắt buộc | Ghi chú |
|---|---|---|
| **Docker Desktop** (macOS) | ✅ Có | Đã cài, cần bật daemon |
| **Git** | ✅ Có | `git version 2.52.0` |
| **Python 3** (optional fallback) | ⬜ | Dự phòng nếu không dùng Docker |

### Trên máy deploy (Hosting)

| Hosting | Yêu cầu | Phí |
|---|---|---|
| GitHub Pages | Git repo + `gh-deploy` | Free |
| Netlify | Kéo thả `site/` | Free |
| Cloudflare Pages | Kết nối git repo | Free |
| Vercel | Kết nối git repo | Free |
| **Bất kỳ static hosting nào** | Chỉ cần serve file tĩnh | Free |

---

## 3. Pipeline build chi tiết

### Phase A: Chuẩn bị tài nguyên (làm 1 lần)

```
Step A1 ─ Đọc tài liệu gốc (.docx, HTML, JSX)
             ↓ Xác định schema
Step A2 ─ Xây dựng hệ thống nội dung
             ↓ Quy tắc biên soạn
Step A3 ─ Tạo cấu trúc thư mục docs/
```

**Input:**
- `original documents/` — file `.docx` gốc từ khách hàng
- `* .html` — prototype mẫu
- `* .jsx` — schema nội dung

**Output:**
- `SYSTEM.md` — blueprint hệ thống (đã tạo)
- `docs/` — thư mục chứa Markdown
- `docs/assets/screenshots/` — ảnh minh họa

---

### Phase B: Viết nội dung Markdown

```
Mỗi bài = 1 file .md trong docs/

Cấu trúc mỗi file:
────────────────────────────────────────────────
# Tiêu đề bài

![Ảnh minh họa](assets/screenshots/ten-anh.png)

## Điều kiện cần

- Yêu cầu 1
- Yêu cầu 2

/// tab | Android
Hướng dẫn dành cho Android...
///

/// tab | iOS
Hướng dẫn dành cho iOS...
///

!!! warning "Lưu ý quan trọng"
    Cảnh báo hoặc lưu ý đặc biệt

## Các bước thực hiện

1. Bước 1
2. Bước 2
3. Bước 3
...

## Xử lý lỗi thường gặp

- **Lỗi A**: Nguyên nhân và cách khắc phục
- **Lỗi B**: Nguyên nhân và cách khắc phục
────────────────────────────────────────────────
```

#### Danh sách bài viết

| # | File | Nội dung | Ghi chú |
|---|---|---|---|
| 1 | `docs/index.md` | Trang chủ / tổng quan | Giới thiệu app, link nhanh |
| 2 | `docs/install.md` | Cài đặt App VNDriver | Android (CH Play) + iOS (App Store) |
| 3 | `docs/login.md` | Đăng nhập & đăng xuất | Đăng ký, quên mật khẩu |
| 4 | `docs/trip.md` | Nhận & xử lý chuyến | GPS, nhận chuyến, hoàn thành |
| 5 | `docs/queue.md` | Xếp hàng chờ | Bật/tắt chế độ chờ |
| 6 | `docs/status.md` | Trạng thái hoạt động | Online/Offline |
| 7 | `docs/profile.md` | Hồ sơ cá nhân | Xem/sửa thông tin |
| 8 | `docs/wallet.md` | Ví & thanh toán | Số dư, lịch sử, rút tiền |
| 9 | `docs/faq/index.md` | FAQ tổng hợp | Câu hỏi thường gặp |
| 10 | `docs/faq/troubleshooting.md` | Xử lý lỗi | Lỗi GPS, login, thanh toán... |

---

### Phase C: Cấu hình project

```
Tạo các file cấu hình trong thư mục gốc:

1. mkdocs.yml          ← Cấu hình site, theme, navigation
2. Dockerfile          ← Định nghĩa environment build
3. docker-compose.yml  ← Orchestrate container dev/build
4. .gitignore          ← Bỏ qua thư mục build
5. .dockerignore       ← Tối ưu Docker context
```

#### Cấu hình `mkdocs.yml` cơ bản

```yaml
site_name: HDSD VNDriver
site_description: Hướng dẫn sử dụng App VNDriver cho tài xế
site_url: https://your-domain.com

theme:
  name: material
  language: vi
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - search.suggest
    - search.highlight
    - content.code.copy
    - content.tabs.link
  palette:
    - scheme: default
      primary: indigo
      accent: indigo

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
  - attr_list
  - md_in_html

nav:
  - Trang chủ: index.md
  - Hướng dẫn:
    - Cài đặt App: install.md
    - Đăng nhập: login.md
    - Nhận chuyến: trip.md
    - Xếp hàng chờ: queue.md
    - Trạng thái: status.md
    - Hồ sơ: profile.md
    - Ví & Thanh toán: wallet.md
  - FAQ & Lỗi:
    - Câu hỏi thường gặp: faq/index.md
    - Xử lý lỗi: faq/troubleshooting.md
```

> **Lưu ý:** Có thể mở rộng thêm plugin, extra CSS, custom template sau này mà không ảnh hưởng content.

---

### Phase D: Build trong Docker

#### D.1 — Build dev server (live reload)

```bash
# Bật Docker Desktop trước
# Sau đó chạy:

docker compose up

# → http://localhost:8000
# → mỗi lần sửa .md là tự reload
```

#### D.2 — Build artifact (static HTML)

```bash
docker compose run --rm mkdocs build

# → Output: ./site/ (thư mục HTML tĩnh)
```

#### D.3 — Kiểm tra artifact local

```bash
# Serve thử artifact đã build
docker compose run --rm -p 8000:8000 \
  python3 -m http.server 8000 --directory /docs/site
# → http://localhost:8000
```

---

### Phase E: Deploy

#### Option 1: GitHub Pages (khuyên dùng)

```bash
# Cần git init + push lên GitHub trước

# Cách A — dùng mkdocs gh-deploy (tự động)
git add . && git commit -m "docs: initial site"
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main

docker compose run --rm mkdocs gh-deploy
# → https://<user>.github.io/<repo>/

# Cách B — dùng GitHub Actions (CI/CD tự động)
# Tạo file .github/workflows/deploy.yml
```

#### Option 2: Netlify (kéo thả)

```
1. docker compose run --rm mkdocs build
2. Vào https://app.netlify.com/drop
3. Kéo thả thư mục site/ vào
# → https://random-name.netlify.app
```

#### Option 3: Cloudflare Pages

```
1. docker compose run --rm mkdocs build
2. Vào Cloudflare Dashboard → Pages → Upload assets
3. Upload thư mục site/
# → https://project-name.pages.dev
```

---

## 4. Vận hành & Bảo trì

### Quy trình thêm bài mới

```bash
# 1. Tạo file .md mới
touch docs/<bai-moi>.md

# 2. Viết nội dung...

# 3. Cập nhật navigation trong mkdocs.yml
# Thêm entry vào nav:

# 4. Kiểm tra
docker compose up

# 5. Build lại
docker compose run --rm mkdocs build

# 6. Deploy
docker compose run --rm mkdocs gh-deploy
```

### Quy trình cập nhật nội dung

```bash
# 1. Sửa file .md

# 2. Kiểm tra (dev server)
docker compose up

# 3. Build + deploy
docker compose run --rm mkdocs build
docker compose run --rm mkdocs gh-deploy
```

### Cập nhật ảnh minh họa

```bash
# 1. Copy ảnh vào thư mục assets
cp /path/to/new-screenshot.png docs/assets/screenshots/

# 2. Tham chiếu trong file .md
# ![Mô tả](assets/screenshots/new-screenshot.png)

# 3. Build lại
```

---

## 5. Cấu trúc thư mục hoàn chỉnh

```
HDSD Driver/
├── BUILD_PLAN.md                       ← File này (build plan)
├── SYSTEM.md                           ← Blueprint hệ thống
├── mkdocs.yml                          ← Cấu hình site
├── Dockerfile                          ← Build environment
├── docker-compose.yml                  ← Docker orchestration
├── .gitignore                          ← Git ignore
├── .dockerignore                       ← Docker build context
│
├── docs/                               ← Content layer (Markdown)
│   ├── index.md                        ← Trang chủ
│   ├── install.md                      ← Cài đặt
│   ├── login.md                        ← Đăng nhập
│   ├── trip.md                         ← Nhận chuyến
│   ├── queue.md                        ← Xếp hàng chờ
│   ├── status.md                       ← Trạng thái
│   ├── profile.md                      ← Hồ sơ
│   ├── wallet.md                       ← Ví & thanh toán
│   ├── assets/
│   │   ├── screenshots/                ← Ảnh minh họa
│   │   └── icons/
│   ├── faq/
│   │   ├── index.md                    ← FAQ
│   │   └── troubleshooting.md          ← Xử lý lỗi
│   └── overrides/                      ← (Optional) overrides
│
├── site/                               ← Artifact layer (git-ignored)
│   └── ... (HTML/CSS/JS sau khi build)
│
├── original documents/                 ← Source gốc (đọc, ko sửa)
│   ├── 00. TL-HDSD APP LÁI XE VNDriver - ver20260417.docx
│   └── 00. TL-ALi- FAQ-V2.docx
│
├── *.html / *.jsx                      ← Prototype cũ (tham khảo)
└── output/                             ← Output cũ (rỗng, có thể xoá)
```

---

## 6. Checklist hoàn thành

### Setup
- [ ] Bật Docker Desktop
- [ ] Tạo `Dockerfile` + `docker-compose.yml`
- [ ] Tạo `mkdocs.yml`
- [ ] Tạo `.gitignore` + `.dockerignore`
- [ ] Tạo cấu trúc thư mục `docs/`

### Content
- [ ] Viết `docs/index.md` — trang chủ
- [ ] Viết `docs/install.md` — cài đặt app
- [ ] Viết `docs/login.md` — đăng nhập
- [ ] Viết `docs/trip.md` — nhận chuyến
- [ ] Viết `docs/queue.md` — xếp hàng chờ
- [ ] Viết `docs/status.md` — trạng thái
- [ ] Viết `docs/profile.md` — hồ sơ
- [ ] Viết `docs/wallet.md` — ví & thanh toán
- [ ] Viết `docs/faq/index.md` — FAQ
- [ ] Viết `docs/faq/troubleshooting.md` — xử lý lỗi

### Build & Verify
- [ ] `docker compose run --rm mkdocs build` — build thành công
- [ ] Kiểm tra nội dung hiển thị đúng
- [ ] Kiểm tra search hoạt động
- [ ] Kiểm tra Android/iOS tabs
- [ ] Kiểm tra responsive mobile

### Deploy
- [ ] GitHub repo được tạo
- [ ] `mkdocs gh-deploy` hoặc upload hosting
- [ ] URL hoạt động public

---

## 7. Troubleshooting

| Vấn đề | Nguyên nhân | Cách fix |
|---|---|---|
| Docker: "Cannot connect to daemon" | Docker Desktop chưa bật | Mở Docker Desktop → đợi xanh |
| `mkdocs serve` chậm reload trên macOS | Volume mount trên macOS | Thêm `--dirty` vào command, hoặc dùng polling |
| Build lỗi: không tìm thấy module | Thiếu pip package | Kiểm tra `Dockerfile` có đủ `pip install` |
| Ảnh không hiển thị | Sai đường dẫn | Dùng relative path: `assets/screenshots/...` |
| Search không có kết quả | Thiếu plugin `search` | Material theme đã built-in search |
| `gh-deploy` lỗi permission | Chưa push code/SSH key | `git push` lên GitHub trước |
| Tab Android/iOS không hoạt động | Thiếu `pymdownx.tabbed` | Kiểm tra `markdown_extensions` trong `mkdocs.yml` |
