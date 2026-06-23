# HDSD VNDriver — Site tài liệu hướng dẫn lái xe

Site tài liệu hướng dẫn sử dụng App VNDriver cho tài xế.  
Build bằng **MkDocs + Material for MkDocs**, chạy trong **Docker**.

---

## Cấu trúc thư mục

```
docs/                           ← Nội dung (Markdown) — sửa ở đây
├── index.md                    ← Trang chủ
├── install.md                  ← Cài đặt App
├── login.md                    ← Đăng nhập / Đăng xuất
├── trip.md                     ← Nhận & xử lý chuyến
├── queue.md                    ← Xếp hàng chờ
├── status.md                   ← Trạng thái hoạt động
├── profile.md                  ← Hồ sơ & cài đặt
├── wallet.md                   ← Ví ký quỹ & thanh toán
├── faq/
│   ├── index.md                ← Câu hỏi thường gặp
│   └── troubleshooting.md      ← Xử lý lỗi
├── assets/
│   ├── screenshots/            ← Ảnh minh họa (thêm ảnh mới vào đây)
│   └── stylesheets/extra.css   ← Style tùy chỉnh
│
site/                           ← Output build, deploy thư mục này
mkdocs.yml                      ← Cấu hình site (menu, theme, domain)
Dockerfile                      ← Môi trường build
docker-compose.yml              ← Chạy dev server
```

---

## Quy trình sửa nội dung → Deploy

### 1. Sửa nội dung

Mở file `.md` tương ứng trong thư mục `docs/`, sửa trực tiếp bằng trình soạn thảo văn bản bất kỳ.

- Cú pháp cơ bản: [Markdown Guide](https://www.markdownguide.org/cheat-sheet/)
- Thêm ảnh: copy file vào `docs/assets/screenshots/`, chèn bằng `![Mô tả](assets/screenshots/ten-file.png)`
- Thêm bài mới: tạo file `.md` → thêm vào mục `nav` trong `mkdocs.yml`

### 2. Xem trước nội dung (local)

```bash
# Bật Docker Desktop trước, sau đó:
docker compose up -d
```

Mở trình duyệt → http://localhost:8000  
Mỗi lần sửa file `.md`, trang web tự reload.

### 3. Build artifact

```bash
docker compose run --rm mkdocs mkdocs build
```

Output: thư mục `site/` (HTML tĩnh, ~3MB).

### 4. Deploy lên hosting

#### Cách nhanh nhất — Netlify (kéo thả)

1. Build xong → vào https://app.netlify.com/drop
2. Kéo thả thư mục **`site/`** vào cửa sổ trình duyệt
3. Xong — URL có dạng `ten-du-an.netlify.app`

#### Hoặc dùng GitHub Pages

```bash
# Lần đầu: push code lên GitHub
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main

# Deploy
docker compose run --rm mkdocs mkdocs gh-deploy
```

---

## Lệnh thường dùng

| Lệnh | Mục đích |
|---|---|
| `docker compose up -d` | Chạy dev server (nền) |
| `docker compose run --rm mkdocs mkdocs build` | Build ra HTML tĩnh |
| `docker compose run --rm mkdocs build --dirty` | Build nhanh (chỉ rebuild file thay đổi) |
| `docker compose stop` | Tắt dev server |
| `docker compose restart` | Khởi động lại dev server |

---

## Yêu cầu hệ thống

- **Docker Desktop** — bắt buộc (bật trước khi chạy lệnh)
- **Git** — nếu dùng GitHub Pages

Không cần cài Python, Node, hay bất kỳ runtime nào khác.

---

## Lưu ý

- Chỉ sửa file trong `docs/`. **Không sửa file trong `site/`** — nó được build tự động và sẽ bị ghi đè.
- `mkdocs.yml` là cấu hình chính (theme màu, menu, domain) — chỉ sửa khi cần thay đổi cấu trúc site.
- Trước khi deploy, luôn chạy `build` để cập nhật `site/`.
