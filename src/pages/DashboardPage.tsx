import { useState, useEffect, useRef } from 'react';
import { Package, Truck, ClipboardList, AlertTriangle, BarChart3, ArrowUpFromLine, ScanLine, Timer, TrendingUp, TrendingDown, Eye, Bell, MapPin, Wifi, Battery, Signal, Monitor, Download, RefreshCw, Search, Activity, Plus, Minus, Camera, Flashlight, Volume2, Keyboard, CheckCircle, AlertCircle } from 'lucide-react';
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

// 仓库数字孪生监控中心数据
const twinStats = [
  { label: '当日作业', value: 128, unit: '单', icon: <ClipboardList size={16} />, color: 'primary' },
  { label: '出库数', value: 86, unit: '单', icon: <Truck size={16} />, color: 'success' },
  { label: '收货数', value: 42, unit: '单', icon: <Package size={16} />, color: 'blue' },
  { label: '移库数', value: 15, unit: '次', icon: <ArrowUpFromLine size={16} />, color: 'orange' },
];

// 楼层数据
const floorData = [
  { floor: '3F', name: '退货区', items: 12, color: 'from-red-100 to-red-50', borderColor: 'border-red-200', textColor: 'text-red-700', bgColor: 'bg-red-500' },
  { floor: '2F', name: '发货区', items: 28, color: 'from-green-100 to-green-50', borderColor: 'border-green-200', textColor: 'text-green-700', bgColor: 'bg-green-500' },
  { floor: '1F', name: '收货区', items: 18, color: 'from-blue-100 to-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700', bgColor: 'bg-blue-500' },
];

// 实时动态线数据
const realtimeActivityData = [
  { time: '10:32:15', action: '入库上架', operator: '张三', detail: 'SKU-10001 × 500 → A-01-03', status: 'success' },
  { time: '10:31:48', action: '波次拣货', operator: '李四', detail: '波次#W005 完成 15单', status: 'success' },
  { time: '10:30:22', action: '移库作业', operator: '王五', detail: 'B-02-01 → A-03-05', status: 'info' },
  { time: '10:29:05', action: '打包发货', operator: '赵六', detail: '快递 #SF1234567890', status: 'success' },
  { time: '10:27:33', action: '出库扫描', operator: '张三', detail: '拦截订单 DY-20250324-003', status: 'warning' },
  { time: '10:25:18', action: '退货入库', operator: '李四', detail: 'RMA-20250324-001 → C-01', status: 'info' },
  { time: '10:23:42', action: '盘点开始', operator: '系统', detail: 'A区周期盘点任务已创建', status: 'muted' },
];

// PDA模拟器设备
const pdaSimDevice = {
  id: 'PDA-001',
  operator: '管理员',
  status: 'online',
  battery: 92,
  signal: 'excellent',
  connection: 'WIFI',
};

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
  const [pdaScanMode, setPdaScanMode] = useState<'sku' | 'location' | 'express'>('sku');
  const [pdaScanValue, setPdaScanValue] = useState('');
  const [pdaShowResult, setPdaShowResult] = useState(false);
  const [pdaSound, setPdaSound] = useState(true);
  const [pdaFlash, setPdaFlash] = useState(false);
  const [pdaCamera, setPdaCamera] = useState(false);
  const pdaInputRef = useRef<HTMLInputElement>(null);
  const [activityLogs, setActivityLogs] = useState(realtimeActivityData);
  const { toast } = useToast();

  // 实时更新动态
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        action: ['入库上架', '波次拣货', '移库作业', '打包发货'][Math.floor(Math.random() * 4)],
        operator: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
        detail: `SKU-${10000 + Math.floor(Math.random() * 100)} × ${10 + Math.floor(Math.random() * 90)} → A-0${1 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
        status: ['success', 'info'][Math.floor(Math.random() * 2)],
      };
      setActivityLogs(prev => [newLog, ...prev.slice(0, 6)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    toast({ title: '数据已刷新', description: '实时数据更新成功' });
  };

  const handleZoneClick = (zone: string) => {
    setSelectedZone(zone === selectedZone ? null : zone);
    toast({ title: `查看${zone}`, description: '跳转至库位管理页面' });
  };

  // PDA模拟器扫码处理
  const handlePdaScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdaScanValue.trim()) return;
    setPdaShowResult(true);
    toast({ title: '扫描成功', description: `${pdaScanMode === 'sku' ? 'SKU' : pdaScanMode === 'location' ? '库位' : '快递'}: ${pdaScanValue}` });
    setTimeout(() => {
      setPdaShowResult(false);
      setPdaScanValue('');
    }, 1500);
  };

  useEffect(() => {
    pdaInputRef.current?.focus();
  }, [pdaScanMode]);

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
        <div className="space-y-4">
          {/* 顶部标题栏 */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor size={24} className="text-primary" />
              <h2 className="text-lg font-bold text-white">仓库数字孪生监控中心</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                实时监控中 · {new Date().toLocaleTimeString('zh-CN')}
              </span>
              <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-slate-700 text-white hover:bg-slate-600 transition">
                <RefreshCw size={14} /> 刷新
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* 左侧统计数据 */}
            <div className="space-y-4">
              {twinStats.map((stat, idx) => (
                <div key={idx} className="bg-card rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-md ${stat.color === 'primary' ? 'bg-primary/10 text-primary' : stat.color === 'success' ? 'bg-success/10 text-success' : stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold">{stat.value} <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span></p>
                </div>
              ))}

              {/* 快捷操作 */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3 text-sm">快捷操作</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toast({ title: '开始盘点', description: '已创建周期盘点任务' })} className="px-3 py-2 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition">
                    <ScanLine size={14} className="mx-auto mb-1" /> 盘点
                  </button>
                  <button onClick={() => toast({ title: '移库作业', description: '正在跳转到移库页面' })} className="px-3 py-2 text-xs rounded-md bg-success/10 text-success hover:bg-success/20 transition">
                    <ArrowUpFromLine size={14} className="mx-auto mb-1" /> 移库
                  </button>
                  <button onClick={() => toast({ title: '打包发货', description: '正在跳转到打包页面' })} className="px-3 py-2 text-xs rounded-md bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition">
                    <Package size={14} className="mx-auto mb-1" /> 打包
                  </button>
                  <button onClick={() => toast({ title: '拦截处理', description: '正在跳转到拦截页面' })} className="px-3 py-2 text-xs rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition">
                    <AlertTriangle size={14} className="mx-auto mb-1" /> 拦截
                  </button>
                </div>
              </div>
            </div>

            {/* 中间仓库平面图 */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl p-5 border-2 border-slate-200 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} /> 仓库平面图
                </h3>
                <div className="flex gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> 收货区</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> 发货区</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> 退货区</span>
                </div>
              </div>

              {/* 楼层可视化 */}
              <div className="space-y-3">
                {floorData.map((floor, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${floor.color} rounded-lg p-3 border ${floor.borderColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${floor.bgColor} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {floor.floor}
                        </div>
                        <span className={`font-bold ${floor.textColor}`}>{floor.name}</span>
                      </div>
                      <span className={`text-xs ${floor.textColor} bg-white/50 px-2 py-0.5 rounded-full`}>
                        {floor.items} 个作业
                      </span>
                    </div>
                    {/* 模拟货架格子 */}
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`aspect-square rounded ${Math.random() > 0.3 ? `${floor.bgColor} opacity-60` : 'bg-white/50 border border-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧功能栏 */}
            <div className="space-y-4">
              {/* 任务动态 */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                  <Activity size={14} className="text-primary" /> 任务动态
                </h3>
                <div className="space-y-2">
                  {activityLogs.slice(0, 4).map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${log.status === 'success' ? 'bg-success' : log.status === 'warning' ? 'bg-warning' : 'bg-muted-foreground'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{log.action}</p>
                        <p className="text-muted-foreground truncate">{log.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 库位实时状态 */}
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-primary" /> 库位状态
                </h3>
                <div className="space-y-2">
                  {[
                    { zone: 'A-01区', status: '正常', count: 24, color: 'bg-success' },
                    { zone: 'B-02区', status: '繁忙', count: 18, color: 'bg-warning' },
                    { zone: 'C-03区', status: '空闲', count: 8, color: 'bg-muted' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="font-mono">{item.zone}</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-muted-foreground">{item.status}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 异常告警 */}
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle size={14} /> 异常告警
                </h3>
                <div className="space-y-2">
                  {[
                    { type: '库存不足', sku: 'SKU-10005', desc: '仅剩15件' },
                    { type: '库位已满', sku: 'A-02-08', desc: '无法上架' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <AlertTriangle size={12} className="text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-muted-foreground">{item.sku} - {item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 实时状态动态线 */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2 text-sm">
                <Activity size={14} className="text-primary animate-pulse" /> 实时状态动态线
              </h3>
              <span className="text-xs text-slate-400">自动滚动 · 5秒更新</span>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {activityLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-3 shrink-0 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700">
                  <span className="text-xs font-mono text-slate-500">{log.time}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-success' : log.status === 'warning' ? 'bg-warning' : 'bg-blue-400'}`} />
                  <span className="text-xs text-white">{log.operator}</span>
                  <span className="text-xs text-primary">{log.action}</span>
                  <span className="text-xs text-slate-400 max-w-[120px] truncate">{log.detail}</span>
                </div>
              ))}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PDA模拟器 */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 shadow-2xl border-4 border-slate-700">
                {/* PDA顶部状态栏 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Camera size={18} className={pdaCamera ? 'text-primary' : 'text-slate-500'} />
                    <Flashlight size={18} className={pdaFlash ? 'text-warning' : 'text-slate-500'} />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400">WMS</span>
                    <p className="text-sm font-bold text-white">手持终端</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPdaCamera(!pdaCamera)} className={`p-1.5 rounded ${pdaCamera ? 'bg-primary' : 'bg-slate-700'}`}>
                      <Camera size={14} className="text-white" />
                    </button>
                    <button onClick={() => setPdaFlash(!pdaFlash)} className={`p-1.5 rounded ${pdaFlash ? 'bg-warning' : 'bg-slate-700'}`}>
                      <Flashlight size={14} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* 设备信息 */}
                <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${pdaSimDevice.status === 'online' ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                      <span className="text-white font-medium">{pdaSimDevice.id}</span>
                    </div>
                    <span className="text-slate-400">操作员: {pdaSimDevice.operator}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Wifi size={12} className="text-success" /> {pdaSimDevice.connection}
                    </span>
                    <span className="flex items-center gap-1">
                      <Battery size={12} className={pdaSimDevice.battery > 50 ? 'text-success' : 'text-warning'} /> {pdaSimDevice.battery}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Signal size={12} className="text-success" /> 信号{pdaSimDevice.signal}
                    </span>
                  </div>
                </div>

                {/* 扫描模式切换 */}
                <div className="flex gap-1 mb-4 bg-slate-700 rounded-lg p-1">
                  {[
                    { key: 'sku', label: 'SKU' },
                    { key: 'location', label: '库位' },
                    { key: 'express', label: '快递' },
                  ].map(mode => (
                    <button
                      key={mode.key}
                      onClick={() => setPdaScanMode(mode.key as typeof pdaScanMode)}
                      className={`flex-1 py-2 text-xs font-medium rounded-md transition ${pdaScanMode === mode.key ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* 扫描区域 */}
                <div className="relative mb-4">
                  <div className={`aspect-[4/3] rounded-xl border-2 ${pdaShowResult ? 'border-success bg-success/10' : 'border-dashed border-slate-600'} flex items-center justify-center relative overflow-hidden`}>
                    {pdaCamera && (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                    )}
                    <div className="text-center">
                      {pdaShowResult ? (
                        <>
                          <CheckCircle size={48} className="text-success mx-auto mb-2" />
                          <p className="text-white font-medium">扫描成功</p>
                        </>
                      ) : (
                        <>
                          <ScanLine size={48} className="text-slate-500 mx-auto mb-2" />
                          <p className="text-slate-500 text-sm">对准{pdaScanMode === 'sku' ? '商品条码' : pdaScanMode === 'location' ? '库位标签' : '快递单号'}</p>
                        </>
                      )}
                      <div className={`absolute left-2 right-2 h-0.5 bg-primary ${pdaShowResult ? 'hidden' : ''}`} style={{ animation: 'scan 2s ease-in-out infinite' }} />
                    </div>
                  </div>
                </div>

                {/* 输入框 */}
                <form onSubmit={handlePdaScan} className="mb-4">
                  <div className="relative">
                    <input
                      ref={pdaInputRef}
                      type="text"
                      value={pdaScanValue}
                      onChange={(e) => setPdaScanValue(e.target.value)}
                      placeholder={pdaScanMode === 'sku' ? '输入或扫描SKU...' : pdaScanMode === 'location' ? '输入或扫描库位...' : '输入或扫描快递号...'}
                      className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white text-center font-mono text-lg outline-none focus:ring-2 focus:ring-primary placeholder-slate-500"
                    />
                    <Keyboard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                  <button type="submit" className="w-full mt-3 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition shadow-lg">
                    扫描
                  </button>
                </form>

                {/* 快捷操作 */}
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setPdaSound(!pdaSound)} className={`py-2 rounded-lg text-white text-xs transition ${pdaSound ? 'bg-primary' : 'bg-slate-700'}`}>
                    <Volume2 size={14} className="mx-auto mb-1" />
                    声音
                  </button>
                  <button className="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-xs transition">
                    历史
                  </button>
                  <button className="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-xs transition">
                    帮助
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧：设备状态和操作记录 */}
            <div className="lg:col-span-2 space-y-4">
              {/* PDA设备列表 */}
              <div className="bg-card rounded-lg border p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Monitor size={18} className="text-primary" /> PDA设备状态
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* 实时作业动态 */}
              <div className="bg-card rounded-lg border p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-primary animate-pulse" /> 实时作业动态
                </h3>
                <div className="space-y-3">
                  {activityLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <span className="text-xs font-mono text-muted-foreground w-16">{log.time}</span>
                      <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-success' : log.status === 'warning' ? 'bg-warning' : 'bg-primary'}`} />
                      <span className="font-medium text-sm w-16">{log.operator}</span>
                      <span className="text-sm text-primary">{log.action}</span>
                      <span className="text-sm text-muted-foreground flex-1 truncate">{log.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 设备统计 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold text-success">3</p>
                  <p className="text-xs text-muted-foreground">在线设备</p>
                </div>
                <div className="bg-card rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold text-muted-foreground">1</p>
                  <p className="text-xs text-muted-foreground">离线设备</p>
                </div>
                <div className="bg-card rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold text-primary">72%</p>
                  <p className="text-xs text-muted-foreground">平均电量</p>
                </div>
                <div className="bg-card rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold text-warning">12</p>
                  <p className="text-xs text-muted-foreground">作业中</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
