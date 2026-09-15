export const SITE_CONFIG = {
  name: 'TruyenViet',
  description: 'Nền tảng đọc truyện chữ, truyện tranh và sáng tác miễn phí hàng đầu Việt Nam.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
};

export const READER_DEFAULTS = {
  fontSize: 18,
  theme: 'light' as const,
  fontFamily: 'Arial',
  lineHeight: 1.6,
};

export const STORY_CATEGORIES = [
  { id: 1, name: 'Tiên Hiệp', slug: 'tien-hiep' },
  { id: 2, name: 'Huyền Huyễn', slug: 'huyen-huyen' },
  { id: 3, name: 'Đô Thị', slug: 'do-thi' },
  { id: 4, name: 'Khoa Huyễn', slug: 'khoa-huyen' },
  { id: 5, name: 'Võng Du', slug: 'vong-du' },
  { id: 6, name: 'Ngôn Tình', slug: 'ngon-tinh' },
  { id: 7, name: 'Trọng Sinh', slug: 'trong-sinh' },
  { id: 8, name: 'Hành Động', slug: 'hanh-dong' },
];
