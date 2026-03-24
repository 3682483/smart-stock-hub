import { suppliers as initialSuppliers } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function SuppliersPage() {
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const { toast } = useToast();

  const suppliers = initialSuppliers.filter(s => s.name.includes(search) || s.category.includes(search));

  const handleAddSupplier = (formData: any) => {
    toast({ title: '供应商已添加', description: `供应商 ${formData.name} 已成功添加` });
    setShowAddDialog(false);
  };

  const handleEditSupplier = (formData: any) => {
    toast({ title: '供应商已更新', description: `供应商 ${formData.name} 信息已更新` });
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (name: string) => {
    toast({ title: '供应商已删除', description: `供应商 ${name} 已从系统中移除` });
  };

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">供应商管理</h1>
          <p className="wms-page-subtitle">共 {suppliers.length} 个供应商</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
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
                <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{s.contact}</td>
                  <td className="p-3 font-mono text-sm">{s.phone}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3">{s.settleType}</td>
                  <td className="p-3 text-right">{s.cycleDays}</td>
                  <td className="p-3 text-right font-medium">{s.totalOrders}</td>
                  <td className="p-3 text-center"><StatusBadge status={s.status} /></td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setEditingSupplier(s)} className="p-1.5 rounded hover:bg-muted transition" title="编辑"><Pencil size={14} className="text-muted-foreground" /></button>
                      <button onClick={() => handleDeleteSupplier(s.name)} className="p-1.5 rounded hover:bg-muted transition" title="删除"><Trash2 size={14} className="text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Dialog */}
      {showAddDialog && (
        <SupplierDialog
          title="新增供应商"
          onSave={handleAddSupplier}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {/* Edit Supplier Dialog */}
      {editingSupplier && (
        <SupplierDialog
          title="编辑供应商"
          supplier={editingSupplier}
          onSave={handleEditSupplier}
          onClose={() => setEditingSupplier(null)}
        />
      )}
    </div>
  );
}

function SupplierDialog({ title, supplier, onSave, onClose }: { title: string; supplier?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact: supplier?.contact || '',
    phone: supplier?.phone || '',
    category: supplier?.category || '',
    settleType: supplier?.settleType || '月结',
    cycleDays: supplier?.cycleDays || 30,
    status: supplier?.status || 'active',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">供应商名称</label>
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">联系人</label>
              <input value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">联系电话</label>
              <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">供货类目</label>
            <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="如：数码配件、家居百货" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">结算方式</label>
              <select value={formData.settleType} onChange={e => setFormData({ ...formData, settleType: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
                <option>月结</option>
                <option>货到付款</option>
                <option>预付款</option>
                <option>周结</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">账期(天)</label>
              <input type="number" value={formData.cycleDays} onChange={e => setFormData({ ...formData, cycleDays: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">状态</label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
              <option value="active">正常</option>
              <option value="pending">待审核</option>
              <option value="suspended">已停用</option>
            </select>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">{supplier ? '保存修改' : '确认添加'}</button>
        </div>
      </div>
    </div>
  );
}
