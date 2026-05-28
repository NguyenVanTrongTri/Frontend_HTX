export const PROVINCES = [
  'Lâm Đồng', 'Đắk Lắk', 'Gia Lai', 'Sơn La', 'Hưng Yên', 'Thái Nguyên', 'Sóc Trăng'
];

export const PRODUCTS = [
  {
    id: 1,
    name: 'Cà Phê Arabica Cầu Đất',
    cooperativeId: 'HTX-001',
    desc: 'Hương vị chua thanh, hậu vị ngọt chuẩn gu thưởng thức quốc tế.',
    category: 'Trà & Café',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1200',
    ocop: '5-Star',
    cert: 'Verified Origin via GIS',
    price: '320,000đ',
    fullDesc: 'Arabica Cầu Đất nổi tiếng với hương thơm nồng nàn và hậu vị ngọt đặc trưng. Được canh tác tại độ cao 1,600m, sản phẩm trải qua quy trình sơ chế ướt khắt khe để giữ trọn vẹn đặc tính của từng hạt cà phê. Đây là sản phẩm tiêu biểu trong chuỗi giá trị nông nghiệp số VietAgri.',
    attributes: [
      { label: 'Độ cao', value: '1600m ASL' },
      { label: 'Quy trình', value: 'Washed Process' },
      { label: 'Độ ẩm', value: '12.5%' },
      { label: 'Vùng trồng', value: 'Cầu Đất, Đà Lạt' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1506370822645-ecad51278437?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501333190791-4548fb2734cc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 2,
    name: 'Mật Ong Bạc Hà Mèo Vạc',
    cooperativeId: 'HTX-003',
    desc: 'Hương thơm tinh tế từ hoa bạc hà cao nguyên đá Đồng Văn.',
    category: 'Đặc sản',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=1200',
    ocop: '5-Star',
    cert: 'Verified Origin via GIS',
    price: '450,000đ'
  },
];

export const WARDS_MAP: Record<string, string[]> = {
  'Lâm Đồng': ['Cầu Đất', 'Xuân Trường', 'Trạm Hành', 'Lạc Dương'],
  'Đắk Lắk': ['Buôn Ma Thuột', 'Krông Pắc', 'Cư M\'gar'],
  'Gia Lai': ['Chư Sê', 'Đắk Đoa', 'Pleiku'],
  'Sơn La': ['Mộc Châu', 'Mai Sơn', 'Yên Châu'],
  'Hưng Yên': ['Khoái Châu', 'Kim Động', 'Vân Giang'],
  'Thái Nguyên': ['Đại Từ', 'Phú Lương', 'Đồng Hỷ'],
  'Sóc Trăng': ['Mỹ Xuyên', 'Trần Đề', 'Vĩnh Châu'],
};

export interface Cooperative {
  id: string;
  name: string;
}

export const COOPERATIVES: Cooperative[] = [
  { id: 'HTX-001', name: 'HTX Cà phê Cầu Đất' },
  { id: 'HTX-002', name: 'HTX Hoa Đà Lạt' },
  { id: 'HTX-003', name: 'HTX Nông sản Đức Trọng' },
  { id: 'HTX-004', name: 'HTX Rừng Thông Lâm Đồng' },
  { id: 'HTX-005', name: 'HTX Công Nghệ Cao Q1' },
  { id: 'HTX-006', name: 'HTX Bình Thạnh Xanh' },
  { id: 'HTX-007', name: 'HTX Ba Đình Organic' },
  { id: 'HTX-008', name: 'HTX Hải Châu Nông Sản' },
  { id: 'HTX-009', name: 'HTX Cầu Giấy Xanh' },
  { id: 'HTX-010', name: 'HTX Thanh Khê Hải Sản' },
  { id: 'HTX-011', name: 'HTX Ninh Kiều Nông Sản' },
  { id: 'HTX-012', name: 'HTX Nông nghiệp Quận 2' },
  { id: 'HTX-013', name: 'HTX Công nghệ Thủ Đức' },
  { id: 'HTX-014', name: 'HTX Hoàn Kiếm Nông Sản' },
  { id: 'HTX-015', name: 'HTX Sơn Trà Hải Sản' },
  { id: 'HTX-016', name: 'HTX Cái Răng Nông Sản' },
];

export interface CooperativeConfig {
  province: string;
  crops: string[];
}

export const COOPERATIVE_CONFIGS: Record<string, CooperativeConfig> = {
  'HTX-001': { province: 'Lâm Đồng', crops: ['Cà phê Arabica', 'Chè ô long', 'Dâu tây Đà Lạt'] },
  'HTX-002': { province: 'Lâm Đồng', crops: ['Hoa cúc', 'Hoa hồng', 'Xà lách thủy canh'] },
  'HTX-003': { province: 'Lâm Đồng', crops: ['Súp lơ', 'Ớt chuông', 'Cà chua VietGAP'] },
  'HTX-004': { province: 'Lâm Đồng', crops: ['Thông lấy nhựa', 'Atiso', 'Hạt mác ca'] },
  'HTX-005': { province: 'Đắk Lắk', crops: ['Sầu riêng Ri6', 'Cà phê Robusta', 'Bơ sáp'] },
  'HTX-006': { province: 'Sơn La', crops: ['Mận hậu', 'Xoài tròn Yên Châu', 'Nhãn xuồng'] },
  'HTX-007': { province: 'Gia Lai', crops: ['Hồ tiêu', 'Chanh dây', 'Cà phê Robusta'] },
  'HTX-008': { province: 'Hưng Yên', crops: ['Nhãn lồng', 'Mật ong hoa nhãn', 'Sen Hưng Yên'] },
  'HTX-009': { province: 'Thái Nguyên', crops: ['Trà Tân Cương', 'Chè trung du', 'Măng lục trúc'] },
  'HTX-010': { province: 'Sóc Trăng', crops: ['Lúa ST25', 'Hành tím Vĩnh Châu', 'Tôm thẻ chân trắng'] },
  'HTX-011': { province: 'Đắk Lắk', crops: ['Cà phê nhân', 'Hồ tiêu hữu cơ', 'Sầu riêng Dona'] },
  'HTX-012': { province: 'Gia Lai', crops: ['Sắn dây', 'Đậu nành', 'Ngô lai'] },
  'HTX-013': { province: 'Lâm Đồng', crops: ['Rau bó xôi', 'Bắp cải tí hon', 'Dâu tây thủy canh'] },
  'HTX-014': { province: 'Đắk Lắk', crops: ['Ca cao', 'Hạt điều', 'Mãng cầu xiêm'] },
  'HTX-015': { province: 'Sóc Trăng', crops: ['Gạo tài nguyên', 'Vú sữa hoàng kim', 'Bưởi năm roi'] },
  'HTX-016': { province: 'Đắk Lắk', crops: ['Mắc ca Đắk Lắk', 'Tiêu sọ', 'Sầu riêng chín hóa'] },
};

export const COOPERATIVES_BY_LOCATION: Record<string, Record<string, string[]>> = {
  'Lâm Đồng': {
    'Cầu Đất': ['HTX Cà phê Cầu Đất', 'HTX Chè Cầu Đất', 'HTX Phát triển Nông nghiệp Cầu Đất'],
    'Xuân Trường': ['HTX Nông nghiệp Xuân Trường', 'HTX Rau Thủy Canh Xuân Trường'],
    'Trạm Hành': ['HTX Chè Trạm Hành'],
    'Lạc Dương': ['HTX Rau Hoa Lạc Dương', 'HTX Cà phê Lạc Dương']
  },
  'Đắk Lắk': {
    'Buôn Ma Thuột': ['HTX Cà phê Buôn Ma Thuột', 'HTX Nông nghiệp Công nghệ cao Buôn Ma Thuột'],
    'Krông Pắc': ['HTX Sầu riêng Krông Pắc'],
    'Cư M\'gar': ['HTX DVNN Công Bằng Ea Kiết']
  },
  'Hưng Yên': {
    'Default': ['HTX Ong Mật Hưng Yên', 'HTX Nhãn Lồng Hưng Yên', 'HTX Sen Hưng Yên']
  },
  'Sóc Trăng': {
    'Default': ['HTX Lúa Tôm Sóc Trăng', 'HTX Nông nghiệp Hưng Lợi']
  }
};

