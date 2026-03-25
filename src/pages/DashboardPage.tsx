import { useState } from 'react';
import { Package, Truck, ClipboardList, AlertTriangle, BarChart3, ArrowUpFromLine, ScanLine, Timer, TrendingUp, TrendingDown, Eye, Bell, MapPin, Wifi, Battery, Signal } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { dashboardStats, operationLogs, skuAggregations, inventoryAlerts, salesOrders, locations, products } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { useToast } from '@/components/ui/use-toast';

// 实时数据模拟
const realtimeData = {
  todayOrders: 428,
  todayShipped: 356,
  pendingPick: 72,
  intercepted: 5,
  pickEfficiency: 96.2,
  warehouseUsage: 74,
  todayRevenue: 52380,
  lowStockAlerts: 3,
  outOfStock: 1,
};

// 24小时趋势数据
const hourlyTrend = [
  { hour: '00', orders: 12, shipped: 15 },
  { hour: '02', orders: 8, shipped: 6 },
  { hour: '04', orders: 5, shipped: 3 },
  { hour: '06', orders: 25, shipped: 18 },
  { hour: '08', orders: 86, shipped: 72 },
  { hour: '10', orders: 125, shipped: 98 },
  { hour: '12', orders: 68, shipped: 55 },
  { hour: '14', orders: 45, shipped: 38 },
  { hour: '16', orders: 32, shipped: 28 },
  { hour: '18', orders: 18, shipped: 15 },
  { hour: '20', orders: 8, shipped: 5 },
  { hour: '22', orders: 5, shipped: 3 },
];

// 平台订单分布
const platformData = [
  { name: '淘宝', value: 42, color: 'hsl(15, 85%, 55%)', orders: 180 },
  { name: '抖音', value: 28, color: 'hsl(220, 80%, 50%)', orders: 120 },
  { name: '拼多多', value: 22, color: 'hsl(350, 80%, 55%)', orders: 94 },
  { name: '会员商城', value: 8, color: 'hsl(152, 60%, 40%)', orders: 34 },
];

// 库区使用率
const zoneUsage = [
  { zone: '存储区A', used: 1680, total: 2000, percentage: 84, locations: 25 },
  { zone: '拣货区B', used: 420, total: 600, percentage: 70, locations: 15 },
  { zone: '展位区C', used: 180, total: 300, percentage: 60, locations: 10 },
];

// 库存预警类型统计
const alertTypeStats = [
  { type: '缺货', count: 1, color: 'hsl(var(--destructive))' },
  { type: '低库存', count: 3, color: 'hsl(var(--warning))' },
  { type: '滞销', count: 2, color: 'hsl(var(--muted-foreground))' },
  { type: '超库存', count: 1, color: 'hsl(var(--stat-purple))' },
];

// 数字孪生 - 仓库可视化数据
const warehouseVisualization = [
  { id: 'A1', code: 'A-01', zone: '存储区A', type: 'normal', status: 'occupied', fill: 85 },
  { id: 'A2', code: 'A-02', zone: '存储区A', type: 'normal', status: 'occupied', fill: 72 },
  { id: 'A3', code: 'A-03', zone: '存储区A', type: 'normal', status: 'available', fill: 0 },
  { id: 'A4', code: 'A-04', zone: '存储区A', type: 'normal', status: 'occupied', fill: 90 },
  { id: 'A5', code: 'B-01', zone: '拣货区B', type: 'picking', status: 'occupied', fill: 65 },
  { id: 'A6', code: 'B-02', zone: '拣货区B', type: 'picking', status: 'occupied', fill: 45 },
  { id: 'A7', code: 'B-03', zone: '拣货区B', type: 'picking', status: 'available', fill: 0 },
  { id: 'A8', code: 'C-01', zone: '展位区C', type: 'exhibition', status: 'occupied', fill: 55 },
  { id: 'A9', code: 'C-02', zone: '展位区C', type: 'exhibition', status: 'occupied', fill: 40 },
  { id: 'A10', code: 'C-03', zone: '展位区C', type: 'exhibition', status: 'maintenance', fill: 0 },
];

// 拣货效能趋势
const pickEfficiencyData = [
  { time: '06:00', efficiency: 92 },
  { time: '08:00', efficiency: 95 },
  { time: '10:00', efficiency: 97 },
  { time: '12:00', efficiency: 94 },
  { time: '14:00', efficiency: 96 },
  { time: '16:00', efficiency: 98 },
  { time: '18:00', efficiency: 95 },
];

// PDA设备状态
const pdaDevices = [
  { id: 'PDA-001', operator: '张三', status: 'online', battery: 85, signal: 'good', currentTask: '入库上架' },
  { id: 'PDA-002', operator: '李四', status: 'online', battery: 62, signal: 'good', currentTask: '波次拣货' },
  { id: 'PDA-003', operator: '王五', status: 'online', battery: 45, signal: 'weak', currentTask: '移库作业' },
  { id: 'PDA-004', operator: '赵六', status: 'offline', battery: 0, signal: 'none', currentTask: '休眠中' },
];

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRefresh = () => {
    toast({ title: '数据已刷新', description: '实时数据更新成功' });
  };

  const handleZoneClick = (zone: string) => {
    setSelectedZone(zone === selectedZone ? null : zone);
    toast({ title: `查看${zone}`, description: '跳转至库位管理页面' });
  };

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">数字化运营看板</h1>
          <p className="wms-page-subtitle">
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                数据实时更新中
              </span>
              <span className="text-muted-foreground">·</span>
              <span>{new Date().toLocaleString('zh-CN')}</span>
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            刷新数据
          </button>
          <div className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary/10 text-primary">
            <Eye size={16} />
            数字孪生视图
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b pb-3">
        {[
          { key: 'overview', label: '运营总览' },
          { key: 'digital_twin', label: '数字孪生/平面图' },
          { key: 'alerts', label: '库存预警中心' },
          { key: 'pda', label: 'PDA设备监控' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeView === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 运营总览 */}
      {activeView === 'overview' && (
        <>
          {/* 关键指标卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="今日订单" value={realtimeData.todayOrders} icon={<ClipboardList size={20} />} color="hsl(var(--stat-blue))" trend={{ value: 12, label: '较昨日' }} />
            <StatCard title="今日发货" value={realtimeData.todayShipped} icon={<Truck size={20} />} color="hsl(var(--stat-green))" trend={{ value: 8, label: '较昨日' }} />
            <StatCard title="待拣货" value={realtimeData.pendingPick} icon={<ArrowUpFromLine size={20} />} color="hsl(var(--stat-orange))" subtitle="含5个多品订单" />
            <StatCard title="拦截订单" value={realtimeData.intercepted} icon={<ScanLine size={20} />} color="hsl(var(--stat-red))" subtitle="避免损失 ¥860" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="拣货效率" value={`${realtimeData.pickEfficiency}%`} icon={<Timer size={20} />} color="hsl(var(--stat-teal))" subtitle="平均 2.1min/单" />
            <StatCard title="仓库使用率" value={`${realtimeData.warehouseUsage}%`} icon={<Package size={20} />} color="hsl(var(--stat-purple))" />
            <StatCard title="今日营收" value={`¥${realtimeData.todayRevenue.toLocaleString()}`} icon={<BarChart3 size={20} />} color="hsl(var(--stat-green))" trend={{ value: 18, label: '较昨日' }} />
            <StatCard title="库存预警" value={realtimeData.lowStockAlerts + realtimeData.outOfStock} icon={<AlertTriangle size={20} />} color="hsl(var(--stat-red))" subtitle={`${realtimeData.outOfStock}个缺货`} />
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* 24小时趋势 */}
            <div className="lg:col-span-2 bg-card rounded-lg border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  24小时订单/发货趋势
                </h3>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary" />订单</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success" />发货</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={hourlyTrend}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorShipped" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorOrders)" name="订单" />
                  <Area type="monotone" dataKey="shipped" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorShipped)" name="发货" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 平台分布 */}
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                渠道订单分布
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={platformData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" label={({ name, orders }) => `${name} ${orders}单`} labelLine={false}>
                    {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {alertTypeStats.map(stat => (
                  <div key={stat.type} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: stat.color }} />{stat.type}</span>
                    <span className="font-medium">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 库区使用率 */}
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package size={18} className="text-primary" />
                库区使用率
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={zoneUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} fontSize={10} />
                  <YAxis type="category" dataKey="zone" fontSize={10} width={60} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="hsl(var(--stat-blue))" radius={[0, 4, 4, 0]} name="使用率%" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>总容量: 2,900</span>
                <span>已用: 2,280</span>
              </div>
            </div>

            {/* 库存预警 */}
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={18} className="text-destructive" />
                库存预警
              </h3>
              <div className="space-y-3">
                {inventoryAlerts.slice(0, 4).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded-md bg-muted/50">
                    <AlertTriangle size={14} className={alert.type === 'out_of_stock' ? 'text-destructive mt-0.5' : 'text-warning mt-0.5'} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{alert.name}</p>
                      <p className="text-xs text-muted-foreground">库存: {alert.currentStock} / 安全: {alert.safetyStock}</p>
                      <p className="text-xs text-muted-foreground truncate">{alert.suggestion}</p>
                    </div>
                    <button className="text-xs text-primary hover:underline shrink-0">补货</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作日志 */}
            <div className="bg-card rounded-lg border p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ClipboardList size={18} className="text-muted-foreground" />
                操作日志
              </h3>
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
        </>
      )}

      {/* 数字孪生/平面图 */}
      {activeView === 'digital_twin' && (
        <div className="space-y-6">
          {/* 3D风格仓库平面图 */}
          <div className="bg-card rounded-lg border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                仓库数字孪生可视化
              </h3>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'hsl(var(--stat-green))' }} />空闲</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'hsl(var(--stat-blue))' }} />占用</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'hsl(var(--stat-orange))' }} />预警</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: 'hsl(var(--muted))' }} />维护</span>
              </div>
            </div>

            {/* 仓库平面图 - 3D效果 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 存储区A */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-blue-800 flex items-center gap-2">
                    <Package size={16} /> 存储区A
                  </h4>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">84% 使用率</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {warehouseVisualization.filter(v => v.zone === '存储区A').map((loc, i) => (
                    <div
                      key={loc.id}
                      onClick={() => handleZoneClick('存储区A')}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md ${
                        loc.status === 'occupied' ? 'bg-blue-500 text-white' :
                        loc.status === 'available' ? 'bg-green-100 border-2 border-green-300 text-green-700' :
                        'bg-gray-100 border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{loc.code}</span>
                      {loc.status === 'occupied' && <span className="text-[8px] opacity-80">{loc.fill}%</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 拣货区B */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-green-800 flex items-center gap-2">
                    <ArrowUpFromLine size={16} /> 拣货区B
                  </h4>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">70% 使用率</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {warehouseVisualization.filter(v => v.zone === '拣货区B').map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => handleZoneClick('拣货区B')}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md ${
                        loc.status === 'occupied' ? 'bg-green-500 text-white' :
                        loc.status === 'available' ? 'bg-green-100 border-2 border-green-300 text-green-700' :
                        'bg-gray-100 border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{loc.code}</span>
                      {loc.status === 'occupied' && <span className="text-[8px] opacity-80">{loc.fill}%</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* 展位区C */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-purple-800 flex items-center gap-2">
                    <Eye size={16} /> 展位区C
                  </h4>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">60% 使用率</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {warehouseVisualization.filter(v => v.zone === '展位区C').map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => handleZoneClick('展位区C')}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-md ${
                        loc.status === 'occupied' ? 'bg-purple-500 text-white' :
                        loc.status === 'available' ? 'bg-purple-100 border-2 border-purple-300 text-purple-700' :
                        'bg-gray-100 border-2 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold">{loc.code}</span>
                      {loc.status === 'occupied' && <span className="text-[8px] opacity-80">{loc.fill}%</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 库位状态列表 */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">库位状态详情</h3>
              <div className="flex gap-2">
                <input placeholder="搜索库位..." className="px-3 py-1.5 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 w-48" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="wms-data-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">库位编号</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">所属库区</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">类型</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">容量</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">使用率</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">商品</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.slice(0, 8).map(l => (
                    <tr key={l.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => handleZoneClick(l.zone)}>
                      <td className="p-3 font-mono font-medium">{l.code}</td>
                      <td className="p-3">{l.zone}</td>
                      <td className="p-3 text-sm">{l.type === 'normal' ? '普通库位' : l.type === 'picking' ? '拣货位' : '展位'}</td>
                      <td className="p-3 text-right">{l.capacity}</td>
                      <td className="p-3 text-right">{l.capacity > 0 ? Math.round(l.used / l.capacity * 100) : 0}%</td>
                      <td className="p-3 font-mono text-xs">{l.product || '-'}</td>
                      <td className="p-3 text-center"><StatusBadge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 库存预警中心 */}
      {activeView === 'alerts' && (
        <div className="space-y-6">
          {/* 预警统计 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {alertTypeStats.map(stat => (
              <div key={stat.type} className="bg-card rounded-lg border p-4 flex items-center gap-4">
                <div className="p-3 rounded-full" style={{ background: `${stat.color}20` }}>
                  <AlertTriangle size={24} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.type}预警</p>
                </div>
              </div>
            ))}
          </div>

          {/* 预警设置 */}
          <div className="bg-card rounded-lg border p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              预警阈值设置
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">安全库存天数</span>
                  <span className="text-primary font-bold">5天</span>
                </div>
                <input type="range" min="1" max="30" defaultValue="5" className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">低于此天数将触发补货预警</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">滞销天数</span>
                  <span className="text-warning font-bold">30天</span>
                </div>
                <input type="range" min="7" max="90" defaultValue="30" className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">超过此天数未销售视为滞销</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">库存水位上限</span>
                  <span className="text-stat-purple font-bold">200%</span>
                </div>
                <input type="range" min="100" max="500" defaultValue="200" className="w-full" />
                <p className="text-xs text-muted-foreground mt-1">超过安全库存倍数触发预警</p>
              </div>
            </div>
          </div>

          {/* 预警列表 */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">预警明细</h3>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 rounded-md bg-muted text-sm outline-none">
                  <option>全部类型</option>
                  <option>缺货</option>
                  <option>低库存</option>
                  <option>滞销</option>
                  <option>超库存</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="wms-data-table">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">SKU</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">商品名称</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">当前库存</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">安全库存</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">可售天数</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">预警类型</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">建议操作</th>
                    <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryAlerts.map(alert => (
                    <tr key={alert.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{alert.sku}</td>
                      <td className="p-3 font-medium">{alert.name}</td>
                      <td className="p-3 text-right font-mono">{alert.currentStock}</td>
                      <td className="p-3 text-right font-mono">{alert.safetyStock}</td>
                      <td className="p-3 text-center">
                        <span className={`font-medium ${alert.daysOfSupply <= 5 ? 'text-destructive' : 'text-warning'}`}>
                          {alert.daysOfSupply}天
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={alert.type} />
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{alert.suggestion}</td>
                      <td className="p-3 text-center">
                        <button className="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90">立即补货</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PDA设备监控 */}
      {activeView === 'pda' && (
        <div className="space-y-6">
          {/* PDA设备概览 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <Wifi size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">在线设备</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Wifi size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">离线设备</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Battery size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">72%</p>
                  <p className="text-xs text-muted-foreground">平均电量</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-warning/10">
                  <Signal size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">信号弱设备</p>
                </div>
              </div>
            </div>
          </div>

          {/* PDA设备列表 */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">PDA设备状态</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {pdaDevices.map(pda => (
                <div key={pda.id} className={`p-4 rounded-lg border ${pda.status === 'online' ? 'bg-success/5 border-success/20' : 'bg-muted/50 border-muted'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${pda.status === 'online' ? 'bg-success/10' : 'bg-muted'}`}>
                        <Wifi size={20} className={pda.status === 'online' ? 'text-success' : 'text-muted-foreground'} />
                      </div>
                      <div>
                        <p className="font-medium">{pda.id}</p>
                        <p className="text-xs text-muted-foreground">操作员: {pda.operator}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${pda.status === 'online' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {pda.status === 'online' ? '在线' : '离线'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Battery size={14} className={pda.battery > 50 ? 'text-success' : pda.battery > 20 ? 'text-warning' : 'text-destructive'} />
                        {pda.battery}%
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Signal size={14} className={pda.signal === 'good' ? 'text-success' : 'text-warning'} />
                        {pda.signal === 'good' ? '信号强' : '信号弱'}
                      </span>
                    </div>
                    <span className="text-primary text-xs">{pda.currentTask}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDA操作记录 */}
          <div className="bg-card rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">实时作业动态</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { time: '10:32', operator: '张三', action: '入库上架', detail: 'SKU-10001 × 500 → A-01-03', type: 'success' },
                { time: '10:28', operator: '李四', action: '波次拣货', detail: '波次#W005 完成 15单/32件', type: 'success' },
                { time: '10:25', operator: '王五', action: 'PDA扫描', detail: '扫描调拨单 TR-002', type: 'info' },
                { time: '10:20', operator: '张三', action: '入库上架', detail: 'SKU-10007 × 200 → A-01-05', type: 'success' },
                { time: '10:15', operator: '系统', action: '自动拦截', detail: '订单DY-20250324-66003 已取消', type: 'warning' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <span className="text-xs font-mono text-muted-foreground w-12">{log.time}</span>
                  <span className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-success' : log.type === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                  <span className="font-medium text-sm w-16">{log.operator}</span>
                  <span className="text-sm text-primary">{log.action}</span>
                  <span className="text-sm text-muted-foreground flex-1 truncate">{log.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
