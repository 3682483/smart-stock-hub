import { purchaseOrders as initialOrders } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const handleCreateOrder = (formData: any) => {
    toast({ title: '采购单已创建', description: `采购单 ${formData.poNumber} 已创建，等待供应商确认` });
    setShowAddDialog(false);
  };

  const handleConfirmInbound = (id: string) => {
    toast({ title: '入库确认', description: '采购单已标记为部分入库' });
  };

  const handleProcessAbnormal = (id: string) => {
    toast({ title: '差异处理', description: '请选择差异处理方式' });
  };

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">采购单管理</h1>
          <p className="wms-page-subtitle">管理采购订单与入库差异</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <Plus size={16} />创建采购单
        </button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">采购单号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">供应商</th>
                <th className="text-left p-3 font-medium text-muted-foreground">商品明细</th>
                <th className="text-right p-3 font-medium text-muted-foreground">金额</th>
                <th className="text-left p-3 font-medium text-muted-foreground">下单日期</th>
                <th className="text-left p-3 font-medium text-muted-foreground">预计到货</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(po => (
                <tr key={po.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{po.poNumber}</td>
                  <td className="p-3">{po.supplier}</td>
                  <td className="p-3">
                    {po.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground ml-1">
                          × {item.qty}
                          {item.received < item.qty && (
                            <span className="text-destructive ml-1">(收{item.received})</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 text-right font-mono">¥{po.totalAmount.toLocaleString()}</td>
                  <td className="p-3 text-sm">{po.createdAt}</td>
                  <td className="p-3 text-sm">{po.expectedAt}</td>
                  <td className="p-3 text-center"><StatusBadge status={po.status} /></td>
                  <td className="p-3 text-center">
                    {po.status === 'abnormal' && (
                      <button onClick={() => handleProcessAbnormal(po.id)} className="text-xs text-destructive hover:underline flex items-center gap-1 mx-auto">
                        <AlertCircle size={12} />处理差异
                      </button>
                    )}
                    {po.status === 'pending' && (
                      <button onClick={() => handleConfirmInbound(po.id)} className="text-xs text-primary hover:underline">确认入库</button>
                    )}
                    {po.status === 'partial' && (
                      <button onClick={() => handleConfirmInbound(po.id)} className="text-xs text-primary hover:underline">继续入库</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost calculation example */}
      <div className="mt-6 bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle size={16} className="text-destructive" />
          差异处理示例 · PO-20250324-004
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-md bg-muted/50">
            <p className="text-muted-foreground">采购数量</p>
            <p className="font-bold text-lg">100 个</p>
          </div>
          <div className="p-3 rounded-md bg-muted/50">
            <p className="text-muted-foreground">实收数量</p>
            <p className="font-bold text-lg text-destructive">90 个</p>
          </div>
          <div className="p-3 rounded-md bg-muted/50">
            <p className="text-muted-foreground">实际单件成本</p>
            <p className="font-bold text-lg">¥{(2200 / 90).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">总额¥2200 ÷ 实收90 = ¥{(2200 / 90).toFixed(2)}/件</p>
          </div>
        </div>
      </div>

      {/* Create Purchase Order Dialog */}
      {showAddDialog && (
        <PurchaseOrderDialog
          onSave={handleCreateOrder}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}

function PurchaseOrderDialog({ onSave, onClose }: { onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    poNumber: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    supplier: '',
    expectedAt: '',
    items: [{ name: '', sku: '', qty: 0, unitCost: 0 }],
  });

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { name: '', sku: '', qty: 0, unitCost: 0 }] });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b sticky top-0 bg-card">
          <h2 className="text-lg font-bold">创建采购单</h2>
          <p className="text-sm text-muted-foreground">单号：{formData.poNumber}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">供应商</label>
              <select value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">选择供应商</option>
                <option>深圳优品科技</option>
                <option>义乌壳王贸易</option>
                <option>广州力健运动</option>
                <option>浙江美家工贸</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">预计到货日期</label>
              <input type="date" value={formData.expectedAt} onChange={e => setFormData({ ...formData, expectedAt: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">商品明细</label>
              <button onClick={addItem} className="text-xs text-primary hover:underline">+ 添加商品</button>
            </div>
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 p-3 rounded-md bg-muted/50">
                  <input
                    placeholder="商品名称"
                    value={item.name}
                    onChange={e => updateItem(index, 'name', e.target.value)}
                    className="px-3 py-2 rounded bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    placeholder="SKU"
                    value={item.sku}
                    onChange={e => updateItem(index, 'sku', e.target.value)}
                    className="px-3 py-2 rounded bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="number"
                    placeholder="数量"
                    value={item.qty || ''}
                    onChange={e => updateItem(index, 'qty', Number(e.target.value))}
                    className="px-3 py-2 rounded bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="number"
                    placeholder="单价"
                    value={item.unitCost || ''}
                    onChange={e => updateItem(index, 'unitCost', Number(e.target.value))}
                    className="px-3 py-2 rounded bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">采购总金额</span>
              <span className="text-2xl font-bold text-primary">¥{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">创建采购单</button>
        </div>
      </div>
    </div>
  );
}
