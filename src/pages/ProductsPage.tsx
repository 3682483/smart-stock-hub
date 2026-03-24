import { useState } from 'react';
import { products } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Plus, Filter, Download } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const filtered = products.filter(p =>
    p.name.includes(search) || p.sku.includes(search) || p.barcode.includes(search)
  );

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">商品/SKU管理</h1>
          <p className="wms-page-subtitle">共 {products.length} 个商品</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
            <Plus size={16} />新增商品
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Download size={16} />导出
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索商品名称、SKU、条码..." className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Filter size={14} />筛选
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
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
