import { useState } from 'react';
import { Monitor, Wifi, WifiOff, CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings, Activity, Package, Barcode, Camera, Cog } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// 模拟设备数据
const mockDevices = [
    { id: 'AUTO-001', name: '入库扫码线-A', location: 'A1入库口', status: 'online', scans: 1256, errors: 3, lastScan: '10:23:45' },
    { id: 'AUTO-002', name: '出库扫码线-A', location: 'B1出库口', status: 'online', scans: 892, errors: 1, lastScan: '10:23:42' },
    { id: 'AUTO-003', name: '托盘绑定线', location: 'C1合流区', status: 'offline', scans: 0, errors: 0, lastScan: '-' },
    { id: 'AUTO-004', name: '库位扫描器-01', location: 'A区货架', status: 'online', scans: 3421, errors: 8, lastScan: '10:23:50' },
    { id: 'AUTO-005', name: '库位扫描器-02', location: 'B区货架', status: 'warning', scans: 2890, errors: 156, lastScan: '10:22:30' },
    { id: 'AUTO-006', name: '复核扫码线', location: 'D1复核区', status: 'online', scans: 567, errors: 2, lastScan: '10:23:38' },
];

// 模拟扫描记录
const mockScanLogs = [
    { id: 1, time: '10:23:45', device: 'AUTO-001', type: '入库扫码', code: 'SKU-20240315-001', result: 'success', detail: '成功入库' },
    { id: 2, time: '10:23:42', device: 'AUTO-002', type: '出库扫码', code: 'OUT-20240315-089', result: 'success', detail: '库存扣减成功' },
    { id: 3, time: '10:23:38', device: 'AUTO-006', type: '复核扫码', code: 'PKG-20240315-256', result: 'success', detail: '包裹复核通过' },
    { id: 4, time: '10:23:35', device: 'AUTO-004', type: '库位扫描', code: 'LOC-A-01-003', result: 'error', detail: '库位信息不匹配' },
    { id: 5, time: '10:23:30', device: 'AUTO-001', type: '入库扫码', code: 'SKU-20240315-002', result: 'success', detail: '商品已上架' },
    { id: 6, time: '10:23:25', device: 'AUTO-002', type: '出库扫码', code: 'OUT-20240315-088', result: 'warning', detail: '库存不足，提醒补货' },
];

export default function AutoDevicePage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('monitor');
    const [deviceFilter, setDeviceFilter] = useState('all');
    const [showConfigDialog, setShowConfigDialog] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<typeof mockDevices[0] | null>(null);

    const filteredDevices = mockDevices.filter(d => {
        if (deviceFilter === 'all') return true;
        return d.status === deviceFilter;
    });

    const onlineCount = mockDevices.filter(d => d.status === 'online').length;
    const warningCount = mockDevices.filter(d => d.status === 'warning').length;
    const offlineCount = mockDevices.filter(d => d.status === 'offline').length;
    const totalScans = mockDevices.reduce((sum, d) => sum + d.scans, 0);
    const totalErrors = mockDevices.reduce((sum, d) => sum + d.errors, 0);

    const handleRefresh = () => {
        toast({ title: '刷新状态', description: '正在刷新设备状态...' });
    };

    const handleConfig = (device: typeof mockDevices[0]) => {
        setSelectedDevice(device);
        setShowConfigDialog(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online': return <CheckCircle size={16} className="text-green-500" />;
            case 'offline': return <XCircle size={16} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            default: return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'online': return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">在线</span>;
            case 'offline': return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">离线</span>;
            case 'warning': return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">异常</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="wms-page-header">
                <div>
                    <h1 className="wms-page-title">无感录入设备监控</h1>
                    <p className="wms-page-subtitle">自动化流水线扫码设备状态监控与日志管理</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                        <RefreshCw size={16} />刷新状态
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                        <Cog size={16} />批量配置
                    </button>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">设备总数</p>
                        <Monitor size={16} className="text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{mockDevices.length}</p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">在线设备</p>
                        <Wifi size={16} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{onlineCount}</p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">离线/异常</p>
                        <WifiOff size={16} className="text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{offlineCount + warningCount}</p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">今日扫码量</p>
                        <Barcode size={16} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{totalScans.toLocaleString()}</p>
                </div>
            </div>

            {/* Tab切换 */}
            <div className="flex gap-4 border-b">
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'monitor' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('monitor')}
                >
                    设备监控
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'logs' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('logs')}
                >
                    扫描日志
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'stats' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('stats')}
                >
                    数据统计
                </button>
            </div>

            {/* 设备监控 */}
            {activeTab === 'monitor' && (
                <div className="space-y-4">
                    {/* 筛选栏 */}
                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <select value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)} className="px-3 py-2 rounded-md bg-muted text-sm">
                                <option value="all">全部状态</option>
                                <option value="online">在线</option>
                                <option value="offline">离线</option>
                                <option value="warning">异常</option>
                            </select>
                            <div className="flex-1"></div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>在线率: <span className="font-medium text-green-600">{(onlineCount / mockDevices.length * 100).toFixed(0)}%</span></span>
                                <span>今日错误率: <span className="font-medium text-red-600">{(totalErrors / totalScans * 100).toFixed(2)}%</span></span>
                            </div>
                        </div>
                    </div>

                    {/* 设备列表 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDevices.map(device => (
                            <div key={device.id} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-lg ${device.status === 'online' ? 'bg-green-100' : device.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                                            <Camera size={20} className={device.status === 'online' ? 'text-green-600' : device.status === 'warning' ? 'text-yellow-600' : 'text-red-600'} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{device.name}</p>
                                            <p className="text-xs text-muted-foreground">{device.location}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(device.status)}
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                                        <p className="text-lg font-bold">{device.scans.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">扫码数</p>
                                    </div>
                                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                                        <p className={`text-lg font-bold ${device.errors > 10 ? 'text-red-600' : 'text-yellow-600'}`}>{device.errors}</p>
                                        <p className="text-xs text-muted-foreground">异常数</p>
                                    </div>
                                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                                        <p className="text-xs font-mono">{device.lastScan}</p>
                                        <p className="text-xs text-muted-foreground">最近扫码</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t">
                                    <button
                                        onClick={() => handleConfig(device)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition"
                                    >
                                        <Settings size={14} />配置
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                                        <Activity size={14} />详情
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 无感录入说明 */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                            <Barcode size={16} /> 无感录入设备说明
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <div>
                                    <p className="font-medium">固定式扫描</p>
                                    <p className="text-muted-foreground text-xs">安装于流水线关键节点，自动识别条码/二维码</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <div>
                                    <p className="font-medium">无感录入</p>
                                    <p className="text-muted-foreground text-xs">货物经过即自动扫码，无需人工干预，效率提升显著</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <div>
                                    <p className="font-medium">实时监控</p>
                                    <p className="text-muted-foreground text-xs">设备状态实时监测，异常自动告警，与PDA形成互补</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 扫描日志 */}
            {activeTab === 'logs' && (
                <div className="space-y-4">
                    <div className="bg-card border rounded-lg overflow-hidden">
                        <table className="wms-data-table">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium text-muted-foreground">时间</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">设备</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">类型</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">条码编号</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">结果</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">详情</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockScanLogs.map(log => (
                                    <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-3 font-mono text-sm">{log.time}</td>
                                        <td className="p-3 text-sm">
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{log.device}</span>
                                        </td>
                                        <td className="p-3 text-sm">{log.type}</td>
                                        <td className="p-3 font-mono text-sm">{log.code}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-xs ${log.result === 'success' ? 'bg-green-100 text-green-700' : log.result === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {log.result === 'success' ? '成功' : log.result === 'warning' ? '警告' : '失败'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-muted-foreground">{log.detail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 数据统计 */}
            {activeTab === 'stats' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 扫码量趋势 */}
                        <div className="bg-card border rounded-lg p-5">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Activity size={18} /> 今日扫码趋势
                            </h3>
                            <div className="h-48 flex items-end justify-around gap-2">
                                {[65, 45, 78, 52, 88, 72, 95, 68, 83, 76, 90, 85].map((val, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                        <div
                                            className="w-8 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                                            style={{ height: `${val}%` }}
                                        />
                                        <span className="text-xs text-muted-foreground">{`${6 + i}:00`}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 错误分布 */}
                        <div className="bg-card border rounded-lg p-5">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <AlertTriangle size={18} /> 异常类型分布
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">条码无法识别</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '45%' }} />
                                        </div>
                                        <span className="text-sm font-medium">45%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">库位不匹配</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '30%' }} />
                                        </div>
                                        <span className="text-sm font-medium">30%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">重复扫码</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '15%' }} />
                                        </div>
                                        <span className="text-sm font-medium">15%</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">其他异常</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-gray-500 rounded-full" style={{ width: '10%' }} />
                                        </div>
                                        <span className="text-sm font-medium">10%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 设备效率对比 */}
                    <div className="bg-card border rounded-lg p-5">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Barcode size={18} /> 设备效率对比
                        </h3>
                        <div className="space-y-3">
                            {mockDevices.filter(d => d.status === 'online').sort((a, b) => b.scans - a.scans).slice(0, 4).map((device, index) => (
                                <div key={device.id} className="flex items-center gap-4">
                                    <span className="w-6 text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">{device.name}</span>
                                            <span className="text-sm text-muted-foreground">{device.scans.toLocaleString()} 次</span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                                                style={{ width: `${(device.scans / mockDevices[0].scans) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 配置对话框 */}
            {showConfigDialog && selectedDevice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Settings size={20} /> 设备配置 - {selectedDevice.name}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">设备名称</label>
                                <input
                                    type="text"
                                    defaultValue={selectedDevice.name}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">安装位置</label>
                                <input
                                    type="text"
                                    defaultValue={selectedDevice.location}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">灵敏度</label>
                                <select className="w-full px-3 py-2 border rounded-lg bg-white">
                                    <option>高</option>
                                    <option selected>中</option>
                                    <option>低</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">告警阈值</label>
                                <input
                                    type="number"
                                    defaultValue="10"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowConfigDialog(false)}
                                className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => {
                                    toast({ title: '配置保存', description: '设备配置已保存' });
                                    setShowConfigDialog(false);
                                }}
                                className="flex-1 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
