// ============ SKU / Products ============
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  barcode: string;
  spec: string;
  unit: string;
  cost: number;
  price: number;
  stock: number;
  safetyStock: number;
  location: string;
  supplier: string;
  image?: string;
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock';
}

export const products: Product[] = [
  { id: 'P001', sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', category: '数码配件', barcode: '6901234567890', spec: '黑色/降噪版', unit: '个', cost: 68, price: 129, stock: 520, safetyStock: 100, location: 'A-01-03', supplier: '深圳优品科技', status: 'active' },
  { id: 'P002', sku: 'SKU-10002', name: '手机壳 iPhone15', category: '手机配件', barcode: '6901234567891', spec: '透明/防摔', unit: '个', cost: 5.5, price: 19.9, stock: 2300, safetyStock: 500, location: 'A-02-01', supplier: '义乌壳王贸易', status: 'active' },
  { id: 'P003', sku: 'SKU-10003', name: '筋膜枪 Mini', category: '运动健康', barcode: '6901234567892', spec: '4档/Type-C充电', unit: '台', cost: 45, price: 99, stock: 85, safetyStock: 100, location: 'B-01-02', supplier: '广州力健运动', status: 'low_stock' },
  { id: 'P004', sku: 'SKU-10004', name: 'LED化妆镜', category: '美妆工具', barcode: '6901234567893', spec: '三色调光/10X放大', unit: '个', cost: 22, price: 59.9, stock: 0, safetyStock: 50, location: 'B-02-04', supplier: '深圳优品科技', status: 'out_of_stock' },
  { id: 'P005', sku: 'SKU-10005', name: '收纳箱 大号', category: '家居百货', barcode: '6901234567894', spec: '66L/可折叠', unit: '个', cost: 18, price: 39.9, stock: 680, safetyStock: 200, location: 'C-01-01', supplier: '浙江美家工贸', status: 'active' },
  { id: 'P006', sku: 'SKU-10006', name: '车载手机支架', category: '汽车用品', barcode: '6901234567895', spec: '磁吸式/通用', unit: '个', cost: 8, price: 29.9, stock: 1500, safetyStock: 300, location: 'A-03-02', supplier: '义乌壳王贸易', status: 'active' },
  { id: 'P007', sku: 'SKU-10007', name: '无线充电器', category: '数码配件', barcode: '6901234567896', spec: '15W快充/兼容QI', unit: '个', cost: 25, price: 69, stock: 320, safetyStock: 80, location: 'A-01-05', supplier: '深圳优品科技', status: 'active' },
  { id: 'P008', sku: 'SKU-10008', name: '厨房电子秤', category: '家居百货', barcode: '6901234567897', spec: '0.1g精度/5kg', unit: '台', cost: 15, price: 35, stock: 42, safetyStock: 60, location: 'C-02-03', supplier: '浙江美家工贸', status: 'low_stock' },
];

// ============ Locations ============
export interface Location {
  id: string;
  code: string;
  zone: string;
  type: 'normal' | 'picking' | 'exhibition';
  capacity: number;
  used: number;
  product?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export const locations: Location[] = [
  { id: 'L001', code: 'A-01-01', zone: '存储区A', type: 'normal', capacity: 200, used: 180, product: 'SKU-10001', status: 'occupied' },
  { id: 'L002', code: 'A-01-02', zone: '存储区A', type: 'normal', capacity: 200, used: 0, status: 'available' },
  { id: 'L003', code: 'A-01-03', zone: '存储区A', type: 'normal', capacity: 200, used: 120, product: 'SKU-10001', status: 'occupied' },
  { id: 'L004', code: 'A-02-01', zone: '存储区A', type: 'normal', capacity: 500, used: 450, product: 'SKU-10002', status: 'occupied' },
  { id: 'L005', code: 'A-03-02', zone: '存储区A', type: 'picking', capacity: 300, used: 200, product: 'SKU-10006', status: 'occupied' },
  { id: 'L006', code: 'B-01-01', zone: '拣货区B', type: 'picking', capacity: 150, used: 0, status: 'available' },
  { id: 'L007', code: 'B-01-02', zone: '拣货区B', type: 'picking', capacity: 150, used: 85, product: 'SKU-10003', status: 'occupied' },
  { id: 'L008', code: 'B-02-04', zone: '拣货区B', type: 'picking', capacity: 100, used: 0, product: 'SKU-10004', status: 'reserved' },
  { id: 'L009', code: 'C-01-01', zone: '展位区C', type: 'exhibition', capacity: 100, used: 60, product: 'SKU-10005', status: 'occupied' },
  { id: 'L010', code: 'C-02-03', zone: '展位区C', type: 'exhibition', capacity: 80, used: 42, product: 'SKU-10008', status: 'occupied' },
];

// ============ Suppliers ============
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  settleType: string;
  cycleDays: number;
  totalOrders: number;
  status: 'active' | 'suspended' | 'pending';
}

export const suppliers: Supplier[] = [
  { id: 'S001', name: '深圳优品科技', contact: '张经理', phone: '13800001111', category: '数码配件', settleType: '月结', cycleDays: 30, totalOrders: 156, status: 'active' },
  { id: 'S002', name: '义乌壳王贸易', contact: '李总', phone: '13800002222', category: '手机配件/汽车用品', settleType: '月结', cycleDays: 15, totalOrders: 89, status: 'active' },
  { id: 'S003', name: '广州力健运动', contact: '王经理', phone: '13800003333', category: '运动健康', settleType: '货到付款', cycleDays: 0, totalOrders: 34, status: 'active' },
  { id: 'S004', name: '浙江美家工贸', contact: '陈总', phone: '13800004444', category: '家居百货', settleType: '月结', cycleDays: 45, totalOrders: 67, status: 'active' },
  { id: 'S005', name: '佛山星光照明', contact: '刘经理', phone: '13800005555', category: '灯具照明', settleType: '预付款', cycleDays: 0, totalOrders: 12, status: 'pending' },
];

// ============ Purchase Orders ============
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  items: { sku: string; name: string; qty: number; received: number; unitCost: number }[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'partial' | 'completed' | 'abnormal';
  createdAt: string;
  expectedAt: string;
}

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO001', poNumber: 'PO-20250324-001', supplier: '深圳优品科技', items: [{ sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', qty: 500, received: 500, unitCost: 68 }, { sku: 'SKU-10007', name: '无线充电器', qty: 200, received: 200, unitCost: 25 }], totalAmount: 39000, status: 'completed', createdAt: '2025-03-20', expectedAt: '2025-03-24' },
  { id: 'PO002', poNumber: 'PO-20250324-002', supplier: '义乌壳王贸易', items: [{ sku: 'SKU-10002', name: '手机壳 iPhone15', qty: 2000, received: 1800, unitCost: 5.5 }], totalAmount: 11000, status: 'partial', createdAt: '2025-03-21', expectedAt: '2025-03-25' },
  { id: 'PO003', poNumber: 'PO-20250324-003', supplier: '广州力健运动', items: [{ sku: 'SKU-10003', name: '筋膜枪 Mini', qty: 300, received: 0, unitCost: 45 }], totalAmount: 13500, status: 'pending', createdAt: '2025-03-22', expectedAt: '2025-03-27' },
  { id: 'PO004', poNumber: 'PO-20250324-004', supplier: '深圳优品科技', items: [{ sku: 'SKU-10004', name: 'LED化妆镜', qty: 100, received: 90, unitCost: 22 }], totalAmount: 2200, status: 'abnormal', createdAt: '2025-03-18', expectedAt: '2025-03-22' },
];

// ============ Sales Orders ============
export interface SalesOrder {
  id: string;
  orderNo: string;
  platform: 'taobao' | 'douyin' | 'pdd' | 'member';
  items: { sku: string; name: string; qty: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'picking' | 'packed' | 'shipped' | 'cancelled' | 'intercepted';
  buyer: string;
  address: string;
  createdAt: string;
}

export const salesOrders: SalesOrder[] = [
  { id: 'SO001', orderNo: 'TB-20250324-88001', platform: 'taobao', items: [{ sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', qty: 1, price: 129 }], totalAmount: 129, status: 'pending', buyer: '用户A', address: '上海市浦东新区xxx路', createdAt: '2025-03-24 08:12' },
  { id: 'SO002', orderNo: 'DY-20250324-66001', platform: 'douyin', items: [{ sku: 'SKU-10002', name: '手机壳 iPhone15', qty: 3, price: 19.9 }], totalAmount: 59.7, status: 'pending', buyer: '用户B', address: '北京市朝阳区xxx号', createdAt: '2025-03-24 08:30' },
  { id: 'SO003', orderNo: 'PDD-20250324-55001', platform: 'pdd', items: [{ sku: 'SKU-10005', name: '收纳箱 大号', qty: 2, price: 39.9 }, { sku: 'SKU-10006', name: '车载手机支架', qty: 1, price: 29.9 }], totalAmount: 109.7, status: 'picking', buyer: '用户C', address: '广州市天河区xxx街', createdAt: '2025-03-24 09:01' },
  { id: 'SO004', orderNo: 'TB-20250324-88002', platform: 'taobao', items: [{ sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', qty: 2, price: 129 }], totalAmount: 258, status: 'picking', buyer: '用户D', address: '深圳市南山区xxx大厦', createdAt: '2025-03-24 09:15' },
  { id: 'SO005', orderNo: 'DY-20250324-66002', platform: 'douyin', items: [{ sku: 'SKU-10006', name: '车载手机支架', qty: 5, price: 29.9 }], totalAmount: 149.5, status: 'packed', buyer: '用户E', address: '成都市武侯区xxx路', createdAt: '2025-03-24 07:45' },
  { id: 'SO006', orderNo: 'TB-20250324-88003', platform: 'taobao', items: [{ sku: 'SKU-10007', name: '无线充电器', qty: 1, price: 69 }], totalAmount: 69, status: 'shipped', buyer: '用户F', address: '杭州市西湖区xxx', createdAt: '2025-03-24 06:30' },
  { id: 'SO007', orderNo: 'PDD-20250324-55002', platform: 'pdd', items: [{ sku: 'SKU-10002', name: '手机壳 iPhone15', qty: 10, price: 19.9 }], totalAmount: 199, status: 'pending', buyer: '用户G', address: '武汉市洪山区xxx', createdAt: '2025-03-24 09:30' },
  { id: 'SO008', orderNo: 'DY-20250324-66003', platform: 'douyin', items: [{ sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', qty: 1, price: 129 }], totalAmount: 129, status: 'cancelled', buyer: '用户H', address: '南京市鼓楼区xxx', createdAt: '2025-03-24 08:00' },
];

// ============ SKU Aggregation (for picking view) ============
export interface SkuAggregation {
  sku: string;
  name: string;
  totalQty: number;
  orderCount: number;
  location: string;
  availableStock: number;
  priority: 'high' | 'medium' | 'low';
}

export const skuAggregations: SkuAggregation[] = [
  { sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', totalQty: 4, orderCount: 3, location: 'A-01-03', availableStock: 520, priority: 'high' },
  { sku: 'SKU-10002', name: '手机壳 iPhone15', totalQty: 13, orderCount: 2, location: 'A-02-01', availableStock: 2300, priority: 'high' },
  { sku: 'SKU-10005', name: '收纳箱 大号', totalQty: 2, orderCount: 1, location: 'C-01-01', availableStock: 680, priority: 'medium' },
  { sku: 'SKU-10006', name: '车载手机支架', totalQty: 6, orderCount: 2, location: 'A-03-02', availableStock: 1500, priority: 'medium' },
  { sku: 'SKU-10007', name: '无线充电器', totalQty: 1, orderCount: 1, location: 'A-01-05', availableStock: 320, priority: 'low' },
];

// ============ Dashboard Stats ============
export const dashboardStats = {
  todayShipped: 328,
  todayOrders: 412,
  pendingPick: 84,
  intercepted: 3,
  totalSku: 8,
  lowStockAlerts: 2,
  outOfStock: 1,
  pickEfficiency: 94.5,
  avgPickTime: '2.3min',
  warehouseUsage: 72,
  todayRevenue: 48750,
  pendingPurchase: 2,
};

// ============ Inventory Alerts ============
export interface InventoryAlert {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  safetyStock: number;
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'slow_moving';
  daysOfSupply: number;
  suggestion: string;
}

export const inventoryAlerts: InventoryAlert[] = [
  { id: 'IA001', sku: 'SKU-10003', name: '筋膜枪 Mini', currentStock: 85, safetyStock: 100, type: 'low_stock', daysOfSupply: 3, suggestion: '建议补货200台，已有采购单PO-003在途' },
  { id: 'IA002', sku: 'SKU-10004', name: 'LED化妆镜', currentStock: 0, safetyStock: 50, type: 'out_of_stock', daysOfSupply: 0, suggestion: '紧急补货！当前缺货，建议采购100个' },
  { id: 'IA003', sku: 'SKU-10008', name: '厨房电子秤', currentStock: 42, safetyStock: 60, type: 'low_stock', daysOfSupply: 5, suggestion: '即将触及安全库存，建议补货80台' },
];

// ============ Operation Logs ============
export interface OperationLog {
  id: string;
  time: string;
  operator: string;
  action: string;
  detail: string;
  module: string;
}

export const operationLogs: OperationLog[] = [
  { id: 'OL001', time: '09:32', operator: '张三', action: '入库上架', detail: 'SKU-10001 x 500 → A-01-03', module: '入库' },
  { id: 'OL002', time: '09:28', operator: '李四', action: '波次拣货', detail: '波次#W003 完成 12单/26件', module: '出库' },
  { id: 'OL003', time: '09:15', operator: '王五', action: '出库拦截', detail: '订单DY-66003 已取消，拦截成功', module: '拦截' },
  { id: 'OL004', time: '09:01', operator: '李四', action: '开始拣货', detail: '波次#W004 开始 8单/15件', module: '出库' },
  { id: 'OL005', time: '08:50', operator: '赵六', action: '盘点完成', detail: 'B区拣货位全量盘点，差异0', module: '库内' },
  { id: 'OL006', time: '08:30', operator: '张三', action: '移库操作', detail: 'SKU-10006 x 100 A-03-01→A-03-02', module: '库内' },
];
