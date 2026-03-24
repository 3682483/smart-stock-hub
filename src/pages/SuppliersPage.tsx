import { suppliers } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const filtered = suppliers.filter(s => s.name.includes(search) || s.category.includes(search));

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">供应商管理</h1>
          <p className="wms-page-subtitle">共 {suppliers.length} 个供应商</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
          <Plus size={16} />新增供应商
        </button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索供应商名称或类目..." className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">供应商名称</th>
                <th className="text-left p-3 font-medium text-muted-foreground">联系人</th>
                <th className="text-left p-3 font-medium text-muted-foreground">电话</th>
                <th className="text-left p-3 font-medium text-muted-foreground">供货类目</th>
                <th className="text-left p-3 font-medium text-muted-foreground">结算方式</th>
                <th className="text-right p-3 font-medium text-muted-foreground">账期(天)</th>
                <th className="text-right p-3 font-medium text-muted-foreground">累计订单</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.contact}</td>
                  <td className="p-3 font-mono text-sm">{s.phone}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3">{s.settleType}</td>
                  <td className="p-3 text-right">{s.cycleDays}</td>
                  <td className="p-3 text-right font-medium">{s.totalOrders}</td>
                  <td className="p-3 text-center"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
