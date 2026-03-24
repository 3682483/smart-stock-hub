import { Package, Truck, ClipboardList, AlertTriangle, BarChart3, ArrowUpFromLine, ScanLine, Timer } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { dashboardStats, operationLogs, skuAggregations, inventoryAlerts, salesOrders } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const hourlyData = [
  { hour: '06:00', orders: 12, shipped: 8 },
  { hour: '07:00', orders: 28, shipped: 22 },
  { hour: '08:00', orders: 65, shipped: 45 },
  { hour: '09:00', orders: 89, shipped: 72 },
  { hour: '10:00', orders: 45, shipped: 38 },
];

const platformData = [
  { name: '淘宝', value: 45, color: 'hsl(15, 85%, 55%)' },
  { name: '抖音', value: 30, color: 'hsl(220, 80%, 50%)' },
  { name: '拼多多', value: 20, color: 'hsl(350, 80%, 55%)' },
  { name: '会员商城', value: 5, color: 'hsl(152, 60%, 40%)' },
];

const zoneUsage = [
  { zone: '存储区A', usage: 82 },
  { zone: '拣货区B', usage: 56 },
  { zone: '展位区C', usage: 64 },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">运营看板</h1>
          <p className="wms-page-subtitle">实时数据监控 · {new Date().toLocaleDateString('zh-CN')}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="今日订单" value={dashboardStats.todayOrders} icon={<ClipboardList size={20} />} color="hsl(var(--stat-blue))" trend={{ value: 12, label: '较昨日' }} />
        <StatCard title="今日发货" value={dashboardStats.todayShipped} icon={<Truck size={20} />} color="hsl(var(--stat-green))" trend={{ value: 8, label: '较昨日' }} />
        <StatCard title="待拣货" value={dashboardStats.pendingPick} icon={<ArrowUpFromLine size={20} />} color="hsl(var(--stat-orange))" subtitle="含3个多品订单" />
        <StatCard title="拦截订单" value={dashboardStats.intercepted} icon={<ScanLine size={20} />} color="hsl(var(--stat-red))" subtitle="避免物流损失 ¥45.60" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="拣货效率" value={`${dashboardStats.pickEfficiency}%`} icon={<Timer size={20} />} color="hsl(var(--stat-teal))" subtitle={`平均 ${dashboardStats.avgPickTime}/单`} />
        <StatCard title="仓库使用率" value={`${dashboardStats.warehouseUsage}%`} icon={<Package size={20} />} color="hsl(var(--stat-purple))" />
        <StatCard title="今日营收" value={`¥${dashboardStats.todayRevenue.toLocaleString()}`} icon={<BarChart3 size={20} />} color="hsl(var(--stat-green))" trend={{ value: 15, label: '较昨日' }} />
        <StatCard title="库存预警" value={dashboardStats.lowStockAlerts + dashboardStats.outOfStock} icon={<AlertTriangle size={20} />} color="hsl(var(--stat-red))" subtitle={`${dashboardStats.outOfStock}个缺货`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Hourly trend */}
        <div className="lg:col-span-2 bg-card rounded-lg border p-5">
          <h3 className="font-semibold mb-4">今日订单/发货趋势</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--stat-blue))" strokeWidth={2} name="订单" />
              <Line type="monotone" dataKey="shipped" stroke="hsl(var(--stat-green))" strokeWidth={2} name="发货" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform pie */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="font-semibold mb-4">渠道占比</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Zone usage */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="font-semibold mb-4">库区使用率</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={zoneUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} fontSize={12} />
              <YAxis type="category" dataKey="zone" fontSize={12} width={70} />
              <Tooltip />
              <Bar dataKey="usage" fill="hsl(var(--stat-blue))" radius={[0, 4, 4, 0]} name="使用率%" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="font-semibold mb-3">库存预警</h3>
          <div className="space-y-3">
            {inventoryAlerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded-md bg-muted/50">
                <AlertTriangle size={16} className={alert.type === 'out_of_stock' ? 'text-destructive mt-0.5' : 'text-warning mt-0.5'} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{alert.name}</p>
                  <p className="text-xs text-muted-foreground">库存: {alert.currentStock} / 安全线: {alert.safetyStock}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent logs */}
        <div className="bg-card rounded-lg border p-5">
          <h3 className="font-semibold mb-3">操作日志</h3>
          <div className="space-y-2.5">
            {operationLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">{log.time}</span>
                <div className="min-w-0">
                  <span className="font-medium">{log.operator}</span>
                  <span className="text-muted-foreground"> · {log.action}</span>
                  <p className="text-xs text-muted-foreground truncate">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
