# 💀 GRIMDARKASCENT // HƯỚNG DẪN BẢO TRÌ & CẬP NHẬT WEBSITE

Landing page chính thức của kênh YouTube **GrimdarkAscent** — "Wake up in the 41st Millennium".

- 🌐 **Tên miền trực tiếp (Live Site)**: [https://grimdarkascent40k.vercel.app](https://grimdarkascent40k.vercel.app)
- 🐙 **GitHub Repository**: [https://github.com/moichan19106/grimdark-ascent](https://github.com/moichan19106/grimdark-ascent)
- 🏛️ **Tài liệu kiến trúc hệ thống**: Chi tiết xem tại [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📌 MỤC LỤC
1. [Cập nhật Video mới (Featured & Archive)](#1-cập-nhật-video-mới)
2. [Thay đổi cấu hình kênh, Email & Tên miền](#2-thay-đổi-cấu-hình-kênh-email--tên-miền)
3. [Thay đổi Logo & Ảnh minh họa (Artwork)](#3-thay-đổi-logo--ảnh-minh-họa)
4. [Chạy thử nghiệm ở máy cá nhân (Local Dev)](#4-chạy-thử-nghiệm-ở-máy-cá-nhân)
5. [Đẩy cập nhật lên Live (Deploy to Production)](#5-đẩy-cập-nhật-lên-live)
6. [Gắn tên miền riêng tuỳ chỉnh (Custom Domain .com / .vn)](#6-gắn-tên-miền-riêng-tuỳ-chỉnh)

---

## 1. Cập nhật Video mới

Tất cả video hiển thị trên website được lưu trữ tại file duy nhất:
👉 [`src/content/videos.ts`](./src/content/videos.ts)

Không cần can thiệp vào mã nguồn giao diện HTML/CSS, chỉ cần sửa danh sách video trong file này.

### A. Cập nhật cụm 3 Video nổi bật đầu trang (`featuredVideos`)
Cụm này gồm 3 video:
- **Video 1 (Đầu tiên)**: Chiếm khung hình lớn nhất (7 cột) làm tâm điểm chính.
- **Video 2 & 3**: Xếp chồng ở cột bên phải (5 cột).

```ts
export const featuredVideos: FeaturedVideo[] = [
  {
    id: "8fmUTSQtlTc", // ← Lấy ID từ link YouTube: https://www.youtube.com/watch?v=8fmUTSQtlTc
    title: "From Psyker to Supreme Grand Master: Your Life as a Grey Knight | Warhammer 40K",
    duration: "1:04:05", // Thời lượng video
    category: "Transformation", // Thể loại: POV Life / Ranks & Hierarchy / Transformation / Worlds & Survival
  },
  // ... video 2 và video 3
];
```

### B. Cập nhật 6 Video trong Kho lưu trữ (`archiveVideos`)
Lưới lưu trữ hiển thị 6 tập gần nhất theo bố cục nghệ thuật so le (7/5, 5/7, 7/5):

```ts
export const archiveVideos: ArchiveVideo[] = [
  {
    id: "H66fH7G_j0Y", // ID YouTube
    title: "A Death Korps Guardsman's Final 17 Hours on Vraks | Warhammer 40K",
    duration: "48:12",
    category: "POV Life",
  },
  // ... thêm hoặc thay thế các video khác tại đây (tối ưu nhất là 6 video)
];
```

> 💡 **Mẹo lấy ID YouTube**:
> Khi link video là `https://www.youtube.com/watch?v=t0Rul-EBtrk`, thì ID là phần sau chữ `v=`, tức là `t0Rul-EBtrk`.
> Website sẽ **tự động lấy ảnh thumbnail chất lượng cao nhất** (`maxresdefault.jpg`) từ máy chủ YouTube mà bạn không cần phải tải ảnh về máy!

---

## 2. Thay đổi cấu hình kênh, Email & Tên miền

Mọi thông tin liên hệ và URL chính thức được khai báo tập trung tại:
👉 [`src/config/site.ts`](./src/config/site.ts)

```ts
export const siteConfig = {
  name: "GrimdarkAscent",
  // Link kênh YouTube chính thức:
  youtubeUrl: "https://www.youtube.com/@grimdarkascent40k",
  youtubeVideosUrl: "https://www.youtube.com/@grimdarkascent40k/videos",

  // Link tài khoản X (Twitter): nếu chưa có để nguyên "REPLACE_WITH_X_URL" (hệ thống sẽ tự ẩn nút)
  xUrl: "REPLACE_WITH_X_URL", // Ví dụ khi có: "https://x.com/grimdarkascent"

  // Email liên hệ công việc (sẽ tạo link mailto: trực tiếp ở chân trang):
  businessEmail: "chonosuke19106@gmail.com",

  // Tên miền chính thức hiện tại:
  siteUrl: "https://grimdarkascent40k.vercel.app",
} as const;
```

---

## 3. Thay đổi Logo & Ảnh minh họa

### A. Thay đổi Logo
- File logo gốc nằm ở: [`public/logo.png`](./public/logo.png) (kích thước tối ưu: vuông từ 512x512 đến 1024x1024 pixel, định dạng PNG).
- Khi bạn thay file ảnh này với cùng tên `logo.png`, website sẽ tự động cập nhật logo ở cả **Header** và **Footer**.
- Để tạo lại bộ favicon và icon PWA đồng bộ, chạy lệnh:
  ```bash
  node scripts/generate-icons.mjs
  ```

### B. Thay đổi các tác phẩm minh họa trong các Section
Tất cả 8 bức tranh minh họa độc quyền 2D cel-animation nằm trong thư mục:
👉 [`public/art/`](./public/art/)

| Tên file | Vị trí hiển thị |
| :--- | :--- |
| `hero-fates.png` | Banner Hero đầu trang (4 chiến binh 40K) |
| `path-pov.png` | Cổng Fate 01: POV Lives (Chiến binh hào chiến Krieg) |
| `path-hierarchy.png` | Cổng Fate 02: Ranks & Hierarchies (Sĩ quan Hải quân) |
| `path-transformation.png` | Cổng Fate 03: Transformations (Các bước biến đổi Astartes) |
| `path-worlds.png` | Cổng Fate 04: Worlds & Survival (Kẻ sống sót trên tử địa) |
| `fate-portraits.png` | Dải 6 huy hiệu chân dung kim loại dưới mục Tuyên ngôn (Manifesto) |
| `canon-method.png` | Bức tranh hồ sơ quân sự cổ trên bàn sắt ở mục "Lore stays intact" |
| `final-transmission.png` | Khung cảnh hoàng hôn gothic hoành tráng ở mục kêu gọi cuối trang |

Chỉ cần xuất ảnh minh họa mới đè lên file cũ với cùng tên là xong!

---

## 4. Chạy thử nghiệm ở máy cá nhân

Yêu cầu máy tính đã cài **Node.js** (phiên bản 18, 20 hoặc 22+).

1. Cài đặt các gói thư viện (chỉ chạy lần đầu):
   ```bash
   npm install
   ```
2. Khởi chạy môi trường phát triển (Development):
   ```bash
   npm run dev
   ```
   Mở trình duyệt vào địa chỉ: [http://localhost:3000](http://localhost:3000)

3. Kiểm tra lỗi chính tả TypeScript và Lint:
   ```bash
   npm run typecheck
   npm run lint
   ```

4. Kiểm tra bản build production tại máy trước khi đẩy lên:
   ```bash
   npm run build
   npm start
   ```

---

## 5. Đẩy cập nhật lên Live

Dự án đã được liên kết trực tiếp giữa **GitHub** và **Vercel**. Bạn có 2 cách cập nhật:

### Cách 1: Tự động qua Git / GitHub (Khuyên dùng - Rất tiện lợi)
Mỗi khi bạn sửa xong file (ví dụ thêm video trong `videos.ts`), chỉ cần mở terminal và chạy 3 lệnh:

```bash
git add .
git commit -m "feat: cap nhat video moi"
git push origin main
```

Ngay sau khi lệnh chạy xong, Vercel sẽ tự động phát hiện commit mới trên GitHub, tự build và cập nhật trang web [https://grimdarkascent40k.vercel.app](https://grimdarkascent40k.vercel.app) chỉ trong 20-30 giây!

### Cách 2: Triển khai trực tiếp qua Vercel CLI
Nếu bạn muốn build và đẩy thẳng từ máy tính không qua Git:

```bash
vercel --prod
```

---

## 6. Gắn tên miền riêng tuỳ chỉnh (Custom Domain .com / .vn)

Nếu sau này bạn mua tên miền riêng (ví dụ: `grimdarkascent.com` hoặc `grimdarkascent40k.com`):

1. Truy cập vào trang quản lý dự án trên Vercel:
   👉 [https://vercel.com/moichan19106s-projects/grimdark-archive-source/settings/domains](https://vercel.com/moichan19106s-projects/grimdark-archive-source/settings/domains)
2. Nhập tên miền bạn đã mua (ví dụ `grimdarkascent.com`) và bấm **Add**.
3. Cài đặt bản ghi DNS tại nhà cung cấp tên miền của bạn (Namecheap, Cloudflare, GoDaddy, v.v.) theo hướng dẫn trên màn hình Vercel:
   - **Type**: `A` | **Name**: `@` | **Value**: `76.76.21.21`
   - **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`
4. Cập nhật lại dòng `siteUrl` trong [`src/config/site.ts`](./src/config/site.ts) thành tên miền mới:
   ```ts
   siteUrl: "https://grimdarkascent.com",
   ```
5. Đẩy lên GitHub (`git commit` & `git push`) là website sẽ tự động cập nhật toàn bộ SEO, Canonical URL và Sitemap theo tên miền mới!
