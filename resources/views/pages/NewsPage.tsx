import React from 'react';
import { Link } from 'react-router-dom';

const NEWS_DATA = [
  {
    id: 1,
    title: 'Lịch sử cây chè trên vùng đất Ba Vì',
    excerpt: 'Từ "Đồn điền cà phê lộng lẫy" đến...',
    date: '01/05/2026',
    image: '/images/image1.png',
  },
  {
    id: 2,
    title: 'Hướng dẫn sử dụng Hoptacxa.vn',
    excerpt: 'Hướng dẫn chi tiết sử dụng nền tảng...',
    date: '05/05/2026',
    image: '/images/image2.png',
  },
  {
    id: 3,
    title: 'Công bố sản phẩm',
    excerpt: 'Công ty Cổ phần Kim Chính Công bố sản phẩm...',
    date: '10/05/2026',
    image: '/images/image3.png',
  },
  {
    id: 4,
    title: 'Cần Thơ: Gia tăng hiệu quả mô hình kinh tế tập thể',
    excerpt: 'Nâng cao hiệu quả kinh tế tập thể...',
    date: '12/05/2026',
    image: '/images/image4.png',
  },
  {
    id: 5,
    title: 'Cần Thơ tiên phong số hóa quy trình canh tác lúa',
    excerpt: 'Ứng dụng ViRiCert tạo nền tảng Gạo Việt xanh phát thải thấp.',
    date: '14/05/2026',
    image: '/images/cantho.png',
  },
  {
    id: 6,
    title: 'Cập nhật quy định SPS, hỗ trợ xuất khẩu nông sản',
    excerpt: 'Hỗ trợ doanh nghiệp và nông dân nắm bắt các quy định SPS...',
    date: '14/05/2026',
    image: '/images/bonongghiep.jpg',
  },
  {
    id: 7,
    title: 'Yêu cầu tuân thủ nghiêm các quy định để thúc đẩy xuất khẩu nông sản',
    excerpt: 'Chủ động nắm bắt và thực hiện đúng các quy định về xuất khẩu...',
    date: '14/05/2026',
    image: '/images/xuatkhau.jpg',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-emerald-950 tracking-tighter mb-4">Tin tức & Sự kiện</h1>
          <p className="text-slate-600 text-lg">Cập nhật thông tin mới nhất về mạng lưới và nông nghiệp số.</p>
        </header>

        <div className="w-full aspect-video mb-12 rounded-3xl overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/5lziavJX-rU"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...NEWS_DATA].reverse().map((news) => (
            <Link key={news.id} to={`#`} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2 bg-emerald-900/80 text-white text-xs font-bold px-2 py-1 rounded">
                  {news.date}
                </div>
              </div>
              <div className="p-4 flex flex-col h-[180px]">                
                <h3 className="font-bold text-emerald-950 mb-2 leading-tight">{news.title}</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">{news.excerpt}</p>
                <span className="text-emerald-700 font-semibold text-sm mt-auto">Xem thêm →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-emerald-950 mb-6">Sự kiện nổi bật</h2>
          <div className="space-y-4">
            {[...NEWS_DATA].reverse().map((news) => (
              <Link key={`feat-${news.id}`} to={`#`} className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all">
                <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex flex-col justify-center">
                  <h3 className="font-bold text-emerald-950">{news.title}</h3>
                  <p className="text-xs text-slate-400">{news.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
