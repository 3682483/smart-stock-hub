import { useState } from 'react';
import { products as initialProducts } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Plus, Filter, Download, Pencil, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const categories = ['全部', '数码配件', '手机配件', '运动健康', '美妆工具', '家居百货', '汽车用品'];
const statuses = ['全部', 'active', 'inactive', 'low_stock', 'out_of_stock'];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [showAddDialog, setShowAddDialog] = useState(false);
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

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">商品/SKU管理</h1>
          <p className="wms-page-subtitle">共 {products.length} 个商品</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
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
