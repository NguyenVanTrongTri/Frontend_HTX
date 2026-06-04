import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';

const NEWS_DATA = [
  {
    id: 'news-static-1',
    title: 'Lịch sử cây chè trên vùng đất Ba Vì',
    excerpt: 'Từ "Đồn điền cà phê lộng lẫy" đến...',
    date: '01/05/2026',
    image: '/images/image1.png',
  },
  {
    id: 'news-static-2',
    title: 'Hướng dẫn sử dụng Hoptacxa.vn',
    excerpt: 'Hướng dẫn chi tiết sử dụng nền tảng...',
    date: '05/05/2026',
    image: '/images/image2.png',
  },
  {
    id: 'news-static-3',
    title: 'Công bố sản phẩm',
    excerpt: 'Công ty Cổ phần Kim Chính Công bố sản phẩm...',
    date: '10/05/2026',
    image: '/images/image3.png',
  },
  {
    id: 'news-static-4',
    title: 'Cần Thơ: Gia tăng hiệu quả mô hình kinh tế tập thể',
    excerpt: 'Nâng cao hiệu quả kinh tế tập thể...',
    date: '12/05/2026',
    image: '/images/image4.png',
  },
  {
    id: 'news-static-5',
    title: 'Cần Thơ tiên phong số hóa quy trình canh tác lúa',
    excerpt: 'Ứng dụng ViRiCert tạo nền tảng Gạo Việt xanh phát thải thấp.',
    date: '14/05/2026',
    image: '/images/cantho.png',
  },
  {
    id: 'news-static-6',
    title: 'Cập nhật quy định SPS, hỗ trợ xuất khẩu nông sản',
    excerpt: 'Hỗ trợ doanh nghiệp và nông dân nắm bắt các quy định SPS...',
    date: '14/05/2026',
    image: '/images/bonongghiep.jpg',
  },
  {
    id: 'news-static-7',
    title: 'Yêu cầu tuân thủ nghiêm các quy định để thúc đẩy xuất khẩu nông sản',
    excerpt: 'Chủ động nắm bắt và thực hiện đúng các quy định về xuất khẩu...',
    date: '14/05/2026',
    image: '/images/xuatkhau.jpg',
  },
];

export default function NewsPage() {
  const [allNews, setAllNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let apiNews: any[] = [];
      try {
        const response = await postService.getAllPosts();
        const posts = Array.isArray(response) ? response : (response?.data || []);
        
        // Filter news/articles if needed, otherwise grab all posts
        apiNews = posts.map((post: any) => ({
          id: post.id || Math.random().toString(),
          title: post.title || post.productName || 'Tin tức nông nghiệp',
          excerpt: post.excerpt || post.description || 'Thông tin mới nhất từ hệ thống.',
          date: post.date || post.createdAt || 'Mới cập nhật',
          image: post.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
          link: post.link || '',
        }));
      } catch (error) {
        console.error("Failed to fetch news via API:", error);
      }

      // Read from custom admin-published news
      let customNews: any[] = [];
      try {
        const stored = localStorage.getItem('vietagri_custom_news');
        if (stored) {
          customNews = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Failed to read custom news from storage", e);
      }

      setAllNews([...customNews, ...apiNews, ...NEWS_DATA]);
    };
    
    fetchData();

    // Dynamically listen to storage updates from other parts of the system
    window.addEventListener('storage', fetchData);
    return () => {
      window.removeEventListener('storage', fetchData);
    };
  }, []);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {allNews.map((news) => {
            const hasExternalLink = news.link && news.link !== '#';
            return (
              <a 
                key={news.id} 
                href={hasExternalLink ? news.link : undefined}
                target={hasExternalLink ? '_blank' : undefined}
                rel={hasExternalLink ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer"
              >
                <div className="relative h-32 md:h-48 overflow-hidden bg-slate-50 shrink-0">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-emerald-950/80 text-white text-[9px] md:text-xs font-semibold px-2 py-0.5 rounded tracking-tight">
                    {news.date}
                  </div>
                </div>
                <div className="p-3 md:p-4 flex flex-col flex-grow justify-between min-h-[140px] md:min-h-[180px]">                
                  <div>
                    <h3 className="font-extrabold text-[#004d40] text-xs md:text-sm mb-1 leading-snug line-clamp-2 group-hover:text-[#036e5c] transition-colors">{news.title}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 line-clamp-3 md:line-clamp-4 leading-normal font-semibold">{news.excerpt}</p>
                  </div>
                  <span className="text-[#004d40] font-bold text-xs md:text-sm mt-2 flex items-center gap-0.5 shrink-0 uppercase tracking-wider text-[10px] sm:text-xs">
                    Xem thêm →
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-emerald-950 mb-6">Sự kiện nổi bật</h2>
          <div className="space-y-4">
            {allNews.slice(0, 5).map((news) => {
              const hasExternalLink = news.link && news.link !== '#';
              return (
                <a 
                  key={`feat-${news.id}`} 
                  href={hasExternalLink ? news.link : undefined}
                  target={hasExternalLink ? '_blank' : undefined}
                  rel={hasExternalLink ? 'noopener noreferrer' : undefined}
                  className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="w-24 h-16 sm:w-32 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  </div>
                  <div className="ml-4 flex flex-col justify-center">
                    <h3 className="font-bold text-emerald-950 text-sm sm:text-base line-clamp-1">{news.title}</h3>
                    <p className="text-xs text-slate-450 mt-1">{news.date}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
