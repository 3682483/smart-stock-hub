import { purchaseOrders } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Plus, AlertCircle } from 'lucide-react';

export default function PurchaseOrdersPage() {
  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">采购单管理</h1>
          <p className="wms-page-subtitle">管理采购订单与入库差异</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
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
              {purchaseOrders.map(po => (
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
                      <button className="text-xs text-destructive hover:underline flex items-center gap-1 mx-auto">
                        <AlertCircle size={12} />处理差异
                      </button>
                    )}
                    {po.status === 'pending' && (
                      <button className="text-xs text-primary hover:underline">确认入库</button>
                    )}
                    {po.status === 'partial' && (
                      <button className="text-xs text-primary hover:underline">继续入库</button>
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
    </div>
  );
}
