import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-500 text-base font-black text-white shadow-sm">
                T
              </span>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Truyen<span className="text-amber-500">Viet</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Nền tảng đọc truyện chữ, truyện tranh và cộng đồng sáng tác truyện miễn phí hàng đầu Việt Nam. Cập nhật liên tục hàng nghìn đầu truyện hot mỗi ngày.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
              <span>© {new Date().getFullYear()} TruyenViet. All rights reserved.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Khám phá
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-amber-500 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/bxh" className="hover:text-amber-500 transition">
                  Bảng xếp hạng
                </Link>
              </li>
              <li>
                <Link href="/the-loai" className="hover:text-amber-500 transition">
                  Tất cả thể loại
                </Link>
              </li>
              <li>
                <Link href="/danh-sach?loai=comic" className="hover:text-amber-500 transition">
                  Truyện tranh mới
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Creator */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Cộng đồng tác giả
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/author/truyen-moi" className="hover:text-amber-500 transition">
                  Đăng tải sáng tác
                </Link>
              </li>
              <li>
                <Link href="/danh-sach?loai=original" className="hover:text-amber-500 transition">
                  Truyện Việt độc quyền
                </Link>
              </li>
              <li>
                <Link href="/tac-gia/huong-dan" className="hover:text-amber-500 transition">
                  Quy chế kiếm xu
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-amber-500 transition">
                  Giao lưu độc giả
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Thông tin & Hỗ trợ
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/dieu-khoan" className="hover:text-amber-500 transition">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach" className="hover:text-amber-500 transition">
                  Chính sách quyền riêng tư
                </Link>
              </li>
              <li>
                <Link href="/ban-quyen" className="hover:text-amber-500 transition">
                  Bản quyền nội dung
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="hover:text-amber-500 transition">
                  Liên hệ đóng góp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-zinc-100 pt-6 text-[11px] leading-relaxed text-zinc-400 dark:border-zinc-900 dark:text-zinc-500">
          TruyenViet là nền tảng đọc truyện mở phục vụ cộng đồng đọc giả và người yêu sáng tác. Mọi nội dung do cộng đồng đóng góp được chia sẻ theo đúng tôn chỉ phi thương mại và tuân thủ bản quyền.
        </div>
      </div>
    </footer>
  );
}
