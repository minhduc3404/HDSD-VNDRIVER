# MkDocs — Công cụ xây dựng site tài liệu

## MkDocs là gì?

**MkDocs** là một static site generator (trình tạo web tĩnh) viết bằng Python, chuyên dùng để xây dựng **site tài liệu** từ các file **Markdown** (.md).

- **Đầu vào:** file `.md` (Markdown) + cấu hình `mkdocs.yml`
- **Đầu ra:** thư mục HTML/CSS/JS tĩnh → có thể deploy lên bất kỳ web hosting nào
- **Không cần database, không cần backend, không cần runtime trên server**

Trong dự án này, MkDocs được đóng gói trong Docker nên không cần cài Python hay thư viện gì trên máy — chỉ cần Docker Desktop.

---

## MkDocs làm được gì?

### 1. Biên dịch Markdown → HTML

Viết nội dung bằng Markdown đơn giản, MkDocs tự động sinh ra HTML đẹp, có cấu trúc, responsive.

```markdown
# Tiêu đề bài

## Bước 1

Mô tả bước 1...
```

→ Tự động ra trang HTML hoàn chỉnh.

### 2. Tìm kiếm toàn văn (full-text search)

MkDocs Material có sẵn thanh tìm kiếm, index toàn bộ nội dung — không cần cài plugin hay dịch vụ ngoài. Người dùng gõ từ khóa, tìm thấy ngay bài viết chứa từ đó.

### 3. Navigation tự động

Từ cấu hình `mkdocs.yml`, MkDocs tự sinh menu điều hướng: tabs, sidebar, breadcrumb.

```yaml
nav:
  - Trang chủ: index.md
  - Hướng dẫn:
    - Cài đặt App: install.md
    - Đăng nhập: login.md
```

### 4. Giao diện responsive (Material Theme)

Theme Material for MkDocs hỗ trợ:

- **Desktop** — tabs, sidebar, thanh search
- **Tablet / Mobile** — menu hamburger, layout co dãn
- Chế độ sáng/tối
- Tab Android/iOS (dùng extension `pymdownx.tabbed`)

### 5. Admonition (khung cảnh báo, chú ý)

Viết trong Markdown:

```
!!! warning "Lưu ý"
    Nội dung cảnh báo
```

→ Ra khung màu vàng/đỏ/xanh với icon tương ứng (warning, info, tip, danger...).

### 6. Mở rộng bằng plugin & CSS tùy chỉnh

- Thêm CSS riêng để đổi màu sắc, font, layout (đã làm với `extra.css`)
- Tích hợp Google Analytics, comments (Disqus), diagram (Mermaid)...

---

## Vai trò của MkDocs trong toàn trình xây dựng web docs

```
┌──────────────────────────────────────────────────────────────────┐
│                     Quy trình toàn trình                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐    │
│  │  Tài liệu gốc │───▶│  Nội dung    │───▶│  Build bằng      │    │
│  │  (.docx/HTML) │    │  Markdown    │    │  MkDocs (Docker) │    │
│  └──────────────┘    └──────────────┘    └────────┬─────────┘    │
│                                                    │              │
│                                                    ▼              │
│                                          ┌──────────────────┐    │
│                                          │  Artifact tĩnh    │    │
│                                          │  site/ (HTML)     │    │
│                                          └────────┬─────────┘    │
│                                                    │              │
│                                                    ▼              │
│                                          ┌──────────────────┐    │
│                                          │  Deploy lên       │    │
│                                          │  hosting tĩnh     │    │
│                                          └──────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Giai đoạn 1: Chuẩn bị nội dung

| Bước | Làm gì | Ai làm |
|---|---|---|
| 1. Đọc tài liệu gốc | `.docx`, HTML prototype, JSX → xác định nội dung | Con người + AI |
| 2. Viết Markdown | Chuyển thành file `.md` có cấu trúc, thêm ảnh | Con người + AI |
| 3. Kiểm tra | Chạy `docker compose up -d` → xem local | Con người |

**Vai trò MkDocs:** chưa tham gia — chỉ là target format.

### Giai đoạn 2: Build (MkDocs đóng vai trò trung tâm)

| Bước | Làm gì | Lệnh |
|---|---|---|
| 1. Đọc cấu hình | `mkdocs.yml` → biết theme, nav, plugin | Tự động |
| 2. Đọc Markdown | Đọc tất cả file `.md` trong `docs/` | Tự động |
| 3. Áp dụng theme | Material for MkDocs → sinh HTML có CSS/JS | Tự động |
| 4. Index search | Đọc toàn bộ text → xây chỉ mục tìm kiếm | Tự động |
| 5. Ghi output | Ghi ra thư mục `site/` | `mkdocs build` |

```bash
# Lệnh build
docker compose run --rm mkdocs mkdocs build

# → Kết quả: thư mục site/ chứa toàn bộ web tĩnh
```

**Đây là bước duy nhất MkDocs hoạt động** — nó biên dịch Markdown + config + theme → ra HTML tĩnh.

### Giai đoạn 3: Deploy

| Bước | Làm gì |
|---|---|
| 1. Lấy thư mục `site/` | Đã có sau khi build |
| 2. Upload lên hosting | Netlify / Cloudflare Pages / GitHub Pages / ... |
| 3. Serve | Hosting tự phục vụ file tĩnh — **không cần MkDocs nữa** |

**Vai trò MkDocs:** kết thúc sau khi build. Server hosting chỉ cần serve file HTML — không cần Python, không cần MkDocs, không cần Docker.

### Giai đoạn 4: Bảo trì

```
Sửa .md → Build lại → Upload lại site/
        ↑                          ↑
    Sửa content           MkDocs build lại    Hosting serve bản mới
```

Mỗi lần cần cập nhật nội dung:

1. Sửa file `.md` trong `docs/`
2. `docker compose run --rm mkdocs mkdocs build`
3. Upload `site/` lên hosting

---

## Tóm tắt

| Câu hỏi | Trả lời |
|---|---|
| **MkDocs là gì?** | Trình tạo web tĩnh từ Markdown, viết bằng Python |
| **Nó làm được gì?** | Biên dịch `.md` → HTML, tìm kiếm, navigation, responsive theme, admonition, tabs Android/iOS |
| **Nó làm gì trong toàn trình?** | **Build** — bước duy nhất nó hoạt động. Đầu vào: Markdown + config. Đầu ra: thư mục `site/` |
| **Có cần trên server không?** | **Không.** Server chỉ serve file tĩnh. MkDocs chỉ chạy trên máy phát triển |
| **Có cần trên CI/CD không?** | Có thể — build trong Docker trên GitHub Actions để tự động deploy |
