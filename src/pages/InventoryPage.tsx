import { products, inventoryAlerts } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { AlertTriangle, TrendingDown, Package, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InventoryPage() {
  const stockData = products.map(p => ({
    name: p.name.length > 6 ? p.name.slice(0, 6) + '...' : p.name,
    stock: p.stock,
    safety: p.safetyStock,
  }));

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">库存监控</h1>
          <p className="wms-page-subtitle">实时库存水位与预警</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="wms-stat-card">
          <p className="text-sm text-muted-foreground">总SKU数</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="wms-stat-card">
          <p className="text-sm text-muted-foreground">总库存量</p>
          <p className="text-2xl font-bold">{products.reduce((s, p) => s + p.stock, 0).toLocaleString()}</p>
        </div>
        <div className="wms-stat-card">
          <p className="text-sm text-muted-foreground flex items-center gap-1"><TrendingDown size={14} className="text-warning" />低库存</p>
          <p className="text-2xl font-bold text-warning">{products.filter(p => p.status === 'low_stock').length}</p>
        </div>
        <div className="wms-stat-card">
          <p className="text-sm text-muted-foreground flex items-center gap-1"><XCircle size={14} className="text-destructive" />缺货</p>
          <p className="text-2xl font-bold text-destructive">{products.filter(p => p.status === 'out_of_stock').length}</p>
        </div>
      </div>

      {/* Stock chart */}
      <div className="bg-card rounded-lg border p-5 mb-6">
        <h3 className="font-semibold mb-4">库存水位对比</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip />
            <Bar dataKey="stock" fill="hsl(var(--stat-blue))" name="当前库存" radius={[4, 4, 0, 0]} />
            <Bar dataKey="safety" fill="hsl(var(--stat-orange))" name="安全库存" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning" />预警中心
        </h3>
        <div className="space-y-3">
          {inventoryAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4 p-4 rounded-md border bg-muted/30">
              <div className={`p-2 rounded-md ${alert.type === 'out_of_stock' ? 'bg-destructive/10' : 'bg-warning/10'}`}>
                {alert.type === 'out_of_stock' ? <XCircle size={18} className="text-destructive" /> : <AlertTriangle size={18} className="text-warning" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{alert.sku}</span>
                  <StatusBadge status={alert.type} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  当前库存 <span className="font-bold">{alert.currentStock}</span> · 安全库存 {alert.safetyStock} · 可售天数 {alert.daysOfSupply}天
                </p>
                <p className="text-sm mt-1">{alert.suggestion}</p>
              </div>
              <button className="text-sm text-primary hover:underline shrink-0">立即补货</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
