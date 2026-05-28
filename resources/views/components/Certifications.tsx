import React from 'react';
import { Award, ShieldCheck, BadgeCheck } from 'lucide-react';

export const Certifications = () => {
  const certifications = [
    {
      icon: <Award className="w-10 h-10 text-orange-500" />,
      title: 'OCOP 4-SAO',
      status: 'CERTIFIED',
      bgColor: 'bg-orange-50/50',
      borderColor: 'border-orange-100',
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
      title: 'VietGAP',
      status: 'CERTIFIED',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-100',
    },
    {
      icon: <BadgeCheck className="w-10 h-10 text-cyan-500" />,
      title: 'GlobalGAP',
      status: 'CERTIFIED',
      bgColor: 'bg-cyan-50/50',
      borderColor: 'border-cyan-100',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/3 space-y-4">
            <h2 className="text-3xl font-bold text-[#1f2937]">Chứng nhận & Uy tín</h2>
            <p className="text-gray-500 leading-relaxed">
              Sản phẩm của VietAgri luôn đảm bảo các tiêu chuẩn khắt khe nhất về 
              an toàn vệ sinh thực phẩm và bền vững.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-orange-600 italic">
              <span className="text-lg">★</span>
              <span>Xác thực bởi Bộ Nông nghiệp & PTNT</span>
            </div>
          </div>

          <div className="lg:w-2/3 grid sm:grid-cols-3 gap-6 w-full">
            {certifications.map((cert, index) => (
              <div 
                key={index}
                className={`${cert.bgColor} ${cert.borderColor} border rounded-[32px] p-8 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:shadow-gray-100 transition-all duration-500`}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm">
                  {cert.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#1f2937] uppercase tracking-wide">{cert.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 tracking-widest">{cert.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
