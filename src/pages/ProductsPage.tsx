import { useState } from 'react';
import { products as initialProducts } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Plus, Filter, Download, Pencil, Trash2, Upload, FileSpreadsheet, RefreshCw, ShoppingBag, AlertCircle, CheckCircle, X, Link } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const categories = ['全部', '数码配件', '手机配件', '运动健康', '美妆工具', '家居百货', '汽车用品'];
const statuses = ['全部', 'active', 'inactive', 'low_stock', 'out_of_stock'];

// 模拟从各平台导入的商品数据
const mockPlatformProducts = {
  taobao: [
    { name: '迷你蓝牙音箱', sku: 'TB-2024-001', category: '数码配件', spec: '黑色/小号', cost: 45, price: 89, stock: 200, location: 'A-01-01', supplier: '深圳优品科技' },
    { name: 'Type-C快充数据线', sku: 'TB-2024-002', category: '手机配件', spec: '1米/白色', cost: 8, price: 25, stock: 500, location: 'A-01-02', supplier: '义乌壳王贸易' },
  ],
  douyin: [
    { name: '网红筋膜枪mini', sku: 'DY-2024-001', category: '运动健康', spec: '粉色/标准版', cost: 120, price: 259, stock: 85, location: 'B-02-01', supplier: '广州力健运动' },
    { name: '智能体脂秤', sku: 'DY-2024-002', category: '运动健康', spec: '白色/旗舰版', cost: 65, price: 139, stock: 120, location: 'B-02-02', supplier: '广州力健运动' },
  ],
  pdd: [
    { name: '家用收纳箱', sku: 'PDD-2024-001', category: '家居百货', spec: '中号/透明蓝', cost: 18, price: 38, stock: 300, location: 'C-01-01', supplier: '浙江美家工贸' },
    { name: '创意水杯', sku: 'PDD-2024-002', category: '家居百货', spec: '500ml/白色', cost: 12, price: 29, stock: 450, location: 'C-01-02', supplier: '浙江美家工贸' },
  ],
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [importType, setImportType] = useState<'file' | 'taobao' | 'douyin' | 'pdd'>('file');
  const [importing, setImporting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();

  const products = initialProducts.filter(p => {
    const matchSearch = p.name.includes(search) || p.sku.includes(search) || p.barcode.includes(search);
    const matchCategory = categoryFilter === '全部' || p.category === categoryFilter;
    const matchStatus = statusFilter === '全部' || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleAddProduct = (formData: any) => {
    toast({ title: '商品已添加', description: `商品 ${formData.name} 已成功添加到系统` });
    setShowAddDialog(false);
  };

  const handleEditProduct = (formData: any) => {
    toast({ title: '商品已更新', description: `商品 ${formData.name} 信息已更新` });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (sku: string) => {
    toast({ title: '商品已删除', description: `商品 ${sku} 已从系统中移除` });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({ title: '文件上传中', description: `正在解析 ${file.name}...` });
      setTimeout(() => {
        toast({ title: '解析完成', description: '已识别 156 个商品，请确认导入', variant: 'default' });
        setShowImportDialog(false);
        setShowPreviewDialog(true);
      }, 1500);
    }
  };

  const handlePlatformImport = (platform: 'taobao' | 'douyin' | 'pdd') => {
    const platformLabels = { taobao: '淘宝', douyin: '抖音', pdd: '拼多多' };
    toast({ title: '正在连接', description: `正在从${platformLabels[platform]}获取商品数据...` });
    setImporting(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSyncProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setImporting(false);
        setSyncProgress(0);
        const products = mockPlatformProducts[platform];
        setSelectedProducts(products);
        setShowImportDialog(false);
        setShowPreviewDialog(true);
        toast({ title: '获取成功', description: `从${platformLabels[platform]}获取了 ${products.length} 个商品` });
      }
    }, 400);
  };

  const handleSync = () => {
    toast({ title: '开始同步', description: '正在同步各平台商品数据...' });
    setImporting(true);
    setSyncProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setSyncProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setImporting(false);
        setSyncProgress(0);
        setShowSyncDialog(false);
        toast({ title: '同步完成', description: '已从3个平台同步 156 个商品' });
      }
    }, 200);
  };

  const handleImportConfirm = () => {
    toast({ title: '导入成功', description: `已成功导入 ${selectedProducts.length} 个商品` });
    setShowPreviewDialog(false);
    setSelectedProducts([]);
  };

  const toggleProductSelection = (product: any) => {
    setSelectedProducts(prev =>
      prev.some(p => p.sku === product.sku)
        ? prev.filter(p => p.sku !== product.sku)
        : [...prev, product]
    );
  };

  const handleExport = () => {
    toast({ title: '正在导出', description: '生成商品数据表格...' });
    setTimeout(() => {
      toast({ title: '导出成功', description: '商品数据已导出为Excel文件' });
    }, 1000);
  };

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">商品/SKU管理</h1>
          <p className="wms-page-subtitle">共 {products.length} 个商品</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowImportDialog(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Upload size={16} />批量导入
          </button>
          <button onClick={() => setShowSyncDialog(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <RefreshCw size={16} />一键同步
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Download size={16} />导出
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <Plus size={16} />新增商品
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索商品名称、SKU、条码..." className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-md bg-muted text-sm outline-none">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-md bg-muted text-sm outline-none">
            {statuses.map(s => <option key={s} value={s}>{s === '全部' ? '全部状态' : s}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Filter size={14} />更多筛选
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">SKU编码</th>
                <th className="text-left p-3 font-medium text-muted-foreground">商品名称</th>
                <th className="text-left p-3 font-medium text-muted-foreground">规格</th>
                <th className="text-left p-3 font-medium text-muted-foreground">分类</th>
                <th className="text-right p-3 font-medium text-muted-foreground">成本</th>
                <th className="text-right p-3 font-medium text-muted-foreground">售价</th>
                <th className="text-right p-3 font-medium text-muted-foreground">库存</th>
                <th className="text-left p-3 font-medium text-muted-foreground">库位</th>
                <th className="text-left p-3 font-medium text-muted-foreground">供应商</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs">{p.sku}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.spec}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-right font-mono">¥{p.cost}</td>
                  <td className="p-3 text-right font-mono">¥{p.price}</td>
                  <td className="p-3 text-right font-mono font-medium">{p.stock}</td>
                  <td className="p-3 font-mono text-xs">{p.location}</td>
                  <td className="p-3 text-sm">{p.supplier}</td>
                  <td className="p-3 text-center"><StatusBadge status={p.status} /></td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setEditingProduct(p)} className="p-1.5 rounded hover:bg-muted transition" title="编辑"><Pencil size={14} className="text-muted-foreground" /></button>
                      <button onClick={() => handleDeleteProduct(p.sku)} className="p-1.5 rounded hover:bg-muted transition" title="删除"><Trash2 size={14} className="text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Dialog */}
      {showAddDialog && (
        <ProductDialog
          title="新增商品"
          onSave={handleAddProduct}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {/* Edit Product Dialog */}
      {editingProduct && (
        <ProductDialog
          title="编辑商品"
          product={editingProduct}
          onSave={handleEditProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {/* 批量导入 Dialog */}
      {showImportDialog && (
        <ImportDialog
          onClose={() => setShowImportDialog(false)}
          onFileImport={handleFileImport}
          onPlatformImport={handlePlatformImport}
          importing={importing}
        />
      )}

      {/* 一键同步 Dialog */}
      {showSyncDialog && (
        <SyncDialog
          onClose={() => setShowSyncDialog(false)}
          onSync={handleSync}
          importing={importing}
          syncProgress={syncProgress}
        />
      )}

      {/* 导入预览 Dialog */}
      {showPreviewDialog && (
        <PreviewDialog
          products={selectedProducts}
          onClose={() => setShowPreviewDialog(false)}
          onConfirm={handleImportConfirm}
          onToggle={toggleProductSelection}
        />
      )}
    </div>
  );
}

function ProductDialog({ title, product, onSave, onClose }: { title: string; product?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    sku: product?.sku || `SKU-${Date.now().toString().slice(-5)}`,
    name: product?.name || '',
    category: product?.category || '数码配件',
    spec: product?.spec || '',
    barcode: product?.barcode || '',
    unit: product?.unit || '个',
    cost: product?.cost || 0,
    price: product?.price || 0,
    stock: product?.stock || 0,
    safetyStock: product?.safetyStock || 0,
    location: product?.location || '',
    supplier: product?.supplier || '',
    status: product?.status || 'active',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b sticky top-0 bg-card">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">SKU编码</label>
              <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">商品条码</label>
              <input value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">商品名称</label>
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">分类</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
                {categories.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">规格</label>
              <input value={formData.spec} onChange={e => setFormData({ ...formData, spec: e.target.value })} placeholder="如：黑色/L码" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">成本价</label>
              <input type="number" value={formData.cost} onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">售价</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">单位</label>
              <input value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">库存</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">安全库存</label>
              <input type="number" value={formData.safetyStock} onChange={e => setFormData({ ...formData, safetyStock: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">库位</label>
              <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="如：A-01-01" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">供应商</label>
              <select value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
                <option value="">选择供应商</option>
                <option>深圳优品科技</option>
                <option>义乌壳王贸易</option>
                <option>广州力健运动</option>
                <option>浙江美家工贸</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">{product ? '保存修改' : '确认添加'}</button>
        </div>
      </div>
    </div>
  );
}

// 批量导入对话框
function ImportDialog({ onClose, onFileImport, onPlatformImport, importing }: {
  onClose: () => void;
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlatformImport: (platform: 'taobao' | 'douyin' | 'pdd') => void;
  importing: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Upload size={20} className="text-primary" />批量导入商品
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-5">
          {/* 文件上传区 */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
          >
            <FileSpreadsheet size={40} className="mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">拖拽Excel文件到此处</p>
            <p className="text-sm text-muted-foreground mb-3">或</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition">
              <Upload size={16} />
              选择文件
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFileImport} />
            </label>
            <p className="text-xs text-muted-foreground mt-3">支持 .xlsx, .xls, .csv 格式</p>
          </div>

          {/* 下载模板 */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-primary" />
              <span className="text-sm">商品导入模板.xlsx</span>
            </div>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              <Download size={14} />下载模板
            </button>
          </div>

          {/* 平台导入 */}
          <div>
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Link size={16} className="text-primary" />从电商平台快速导入
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onPlatformImport('taobao')}
                disabled={importing}
                className="p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <div className="text-2xl mb-1">🍑</div>
                <p className="text-sm font-medium">淘宝/天猫</p>
                <p className="text-xs text-muted-foreground">1688同步</p>
              </button>
              <button
                onClick={() => onPlatformImport('douyin')}
                disabled={importing}
                className="p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <div className="text-2xl mb-1">🎵</div>
                <p className="text-sm font-medium">抖音小店</p>
                <p className="text-xs text-muted-foreground">商品同步</p>
              </button>
              <button
                onClick={() => onPlatformImport('pdd')}
                disabled={importing}
                className="p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                <div className="text-2xl mb-1">🛒</div>
                <p className="text-sm font-medium">拼多多</p>
                <p className="text-xs text-muted-foreground">批发同步</p>
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
        </div>
      </div>
    </div>
  );
}

// 一键同步对话框
function SyncDialog({ onClose, onSync, importing, syncProgress }: {
  onClose: () => void;
  onSync: () => void;
  importing: boolean;
  syncProgress: number;
}) {
  const platforms = [
    { name: '淘宝/天猫', icon: '🍑', count: 45 },
    { name: '抖音小店', icon: '🎵', count: 32 },
    { name: '拼多多', icon: '🛒', count: 28 },
    { name: '京东', icon: '📦', count: 18 },
    { name: '快手', icon: '🎬', count: 15 },
    { name: '小红书', icon: '📕', count: 18 },
  ];

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['taobao', 'douyin', 'pdd']);

  const togglePlatform = (name: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <RefreshCw size={20} className="text-primary" />一键同步商品
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">自动同步各平台商品数据</p>
              <p className="text-muted-foreground mt-1">系统将自动获取已授权平台的商品信息，包括价格、库存、SKU等关键数据。</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">选择同步平台</p>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(p => (
                <button
                  key={p.name}
                  onClick={() => togglePlatform(p.name)}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${selectedPlatforms.includes(p.name) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.count}个商品</p>
                  </div>
                  {selectedPlatforms.includes(p.name) && <CheckCircle size={18} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>同步进度</span>
                <span className="font-medium">{syncProgress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${syncProgress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-center">正在同步商品数据，请稍候...</p>
            </div>
          )}
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition" disabled={importing}>取消</button>
          <button onClick={onSync} disabled={importing || selectedPlatforms.length === 0} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2">
            {importing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {importing ? '同步中...' : '开始同步'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 导入预览对话框
function PreviewDialog({ products, onClose, onConfirm, onToggle }: {
  products: any[];
  onClose: () => void;
  onConfirm: () => void;
  onToggle: (product: any) => void;
}) {
  const selectedCount = products.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary" />导入预览
            </h2>
            <p className="text-sm text-muted-foreground mt-1">共 {products.length} 个商品，已选择 {selectedCount} 个</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground w-10">
                  <input type="checkbox" checked={selectedCount === products.length} onChange={() => {}} className="rounded" />
                </th>
                <th className="text-left p-3 font-medium text-muted-foreground">SKU编码</th>
                <th className="text-left p-3 font-medium text-muted-foreground">商品名称</th>
                <th className="text-left p-3 font-medium text-muted-foreground">分类</th>
                <th className="text-left p-3 font-medium text-muted-foreground">规格</th>
                <th className="text-right p-3 font-medium text-muted-foreground">成本</th>
                <th className="text-right p-3 font-medium text-muted-foreground">售价</th>
                <th className="text-right p-3 font-medium text-muted-foreground">库存</th>
                <th className="text-left p-3 font-medium text-muted-foreground">库位</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <input type="checkbox" checked={selectedCount === products.length} onChange={() => onToggle(p)} className="rounded" />
                  </td>
                  <td className="p-3 font-mono text-xs">{p.sku}</td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-muted-foreground">{p.spec}</td>
                  <td className="p-3 text-right font-mono">¥{p.cost}</td>
                  <td className="p-3 text-right font-mono">¥{p.price}</td>
                  <td className="p-3 text-right font-mono font-medium">{p.stock}</td>
                  <td className="p-3 font-mono text-xs">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>已选择 <strong className="text-foreground">{selectedCount}</strong> 个商品</span>
            <span>|</span>
            <span>预计新增 <strong className="text-primary">{selectedCount}</strong> 个</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
            <button onClick={onConfirm} disabled={selectedCount === 0} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50">
              确认导入 ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
