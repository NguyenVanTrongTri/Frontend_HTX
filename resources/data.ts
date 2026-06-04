export interface Cooperative {
  id: string;
  name: string;
}

export interface CooperativeConfig {
  province: string;
  crops: string[];
}

export interface Product {
  id: string;
  name: string;
  cooperativeId: string;
  price: string;
  unit: string;
  desc?: string;
  fullDesc?: string;
  category?: string;
  image?: string;
  ocop?: string;
  cert?: string;
  gallery?: string[];
  attributes?: { label: string; value: string }[];
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

export const PRODUCTS: Product[] = [
  { id: 'POST-001', name: 'Cà phê Arabica Cầu Đất Thượng Hạng', cooperativeId: 'HTX-001', price: '450.000', unit: 'kg' },
  { id: 'POST-002', name: 'Sầu riêng Ri6 VietGAP - Chín cây', cooperativeId: 'HTX-005', price: '120.000', unit: 'kg' },
  { id: 'POST-003', name: 'Tiêu đen xô sạch - Giá sỉ', cooperativeId: 'HTX-007', price: '85.000', unit: 'kg' },
  { id: '1', name: 'Cà phê Arabica Cầu Đất', cooperativeId: 'HTX-001', price: '250.000', unit: 'kg' },
  { id: '2', name: 'Hoa cúc Đà Lạt', cooperativeId: 'HTX-002', price: '30.000', unit: 'bó' },
  { id: '3', name: 'Cà chua VietGAP Đức Trọng', cooperativeId: 'HTX-003', price: '25.000', unit: 'kg' },
];

export const PROVINCES: string[] = [
  'Lâm Đồng',
  'Đắk Lắk',
  'Gia Lai',
  'Sơn La',
  'Hưng Yên',
  'Thái Nguyên',
  'Sóc Trăng'
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
