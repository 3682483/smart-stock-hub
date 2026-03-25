import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, MapPin, Package, CheckCircle, CheckCircle2, AlertCircle, ArrowRight, Wifi, Battery, Signal, Keyboard, X, Plus, Minus, Camera, Flashlight, Volume2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const mockIncomingTasks = [
  { id: 'PO-20250325-001', supplier: '深圳优品科技', items: 3, totalQty: 1500, status: 'pending', expectedTime: '10:30' },
  { id: 'PO-20250325-002', supplier: '义乌壳王贸易', items: 2, totalQty: 3000, status: 'in_transit', expectedTime: '14:00' },
  { id: 'PO-20250325-003', supplier: '广州力健运动', items: 1, totalQty: 300, status: 'pending', expectedTime: '16:00' },
];

const mockLocations = [
  { id: 'A-01-01', type: '普通库位', capacity: '70%', usage: 180, max: 200, priority: 1, reason: '核心存储区，热门SKU' },
  { id: 'A-01-03', type: '普通库位', capacity: '60%', usage: 120, max: 200, priority: 2, reason: '靠近出入口，搬运方便' },
  { id: 'A-02-01', type: '普通库位', capacity: '90%', usage: 450, max: 500, priority: 3, reason: '容量充足，适合大批量' },
  { id: 'B-01-01', type: '拣货位', capacity: '35%', usage: 52, max: 150, priority: 1, reason: '拣货核心区，周转快' },
];

const mockScannedItems = [
  { sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', expected: 500, scanned: 320, status: 'scanning' },
  { sku: 'SKU-10007', name: '无线充电器', expected: 200, scanned: 200, status: 'completed' },
];

// PDA设备模拟
const pdaDevice = {
  id: 'PDA-001',
  operator: '张三',
  status: 'online',
  battery: 85,
  signal: 'good',
  connection: 'WIFI',
};

export default function InboundPage() {
  const [scanMode, setScanMode] = useState<'sku' | 'location' | 'express'>('sku');
  const [scanValue, setScanValue] = useState('');
  const [scannedItems, setScannedItems] = useState(mockScannedItems);
  const [selectedLocation, setSelectedLocation] = useState<typeof mockLocations[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentTask, setCurrentTask] = useState<typeof mockIncomingTasks[0] | null>(null);
  const [pdaSound, setPdaSound] = useState(true);
  const [pdaVibrate, setPdaVibrate] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    inputRef.current?.focus();
  }, [scanMode]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue.trim()) return;

    // 模拟扫描结果
    const mockResults = {
      sku: { found: true, sku: scanValue, name: '蓝牙耳机 Pro Max', expected: 500 },
      location: { found: true, code: 'A-01-01', type: '普通库位', capacity: '70%' },
      express: { found: true, expressNo: scanValue, order: 'PO-20250325-001' },
    };

    const result = mockResults[scanMode];
    if (result.found) {
      setShowResult(true);
      toast({
        title: '扫描成功',
        description: scanMode === 'sku' ? `SKU: ${scanValue}` : scanMode === 'location' ? `库位: ${scanValue}` : `快递: ${scanValue}`,
      });
      if (pdaSound) {
        // 模拟声音反馈
        console.log('Beep!');
      }
    } else {
      toast({ title: '未找到', description: '未匹配到相关信息', variant: 'destructive' });
    }
    setScanValue('');
  };

  const handleSelectLocation = (loc: typeof mockLocations[0]) => {
    setSelectedLocation(loc);
    toast({ title: '库位已选择', description: `已选择 ${loc.id}，点击确认上架` });
  };

  const handleConfirmPutaway = () => {
    if (!selectedLocation) return;
    toast({
      title: '上架成功',
      description: `商品已上架至 ${selectedLocation.id}`,
    });
    setScannedItems(items =>
      items.map(item =>
        item.status === 'scanning' ? { ...item, scanned: item.expected, status: 'completed' as const } : item
      )
    );
    setSelectedLocation(null);
    setShowResult(false);
  };

  const handleStartTask = (task: typeof mockIncomingTasks[0]) => {
    setCurrentTask(task);
    toast({ title: '开始作业', description: `任务 ${task.id} 已开始` });
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">入库作业</h1>
          <p className="wms-page-subtitle">PDA扫码入库、上架引导、库位推荐</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Plus size={16} />批量导入
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <AlertCircle size={16} />异常登记
          </button>
        </div>
      </div>

      {/* PDA状态栏 */}
      <div className="bg-card rounded-lg border p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${pdaDevice.status === 'online' ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <span className="text-sm font-medium">{pdaDevice.id}</span>
          </div>
          <span className="text-xs text-muted-foreground">操作员: {pdaDevice.operator}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Wifi size={14} className={pdaDevice.status === 'online' ? 'text-success' : 'text-muted-foreground'} />
            {pdaDevice.connection}
          </span>
          <span className="flex items-center gap-1">
            <Battery size={14} className={pdaDevice.battery > 50 ? 'text-success' : pdaDevice.battery > 20 ? 'text-warning' : 'text-destructive'} />
            {pdaDevice.battery}%
          </span>
          <span className="flex items-center gap-1">
            <Signal size={14} className={pdaDevice.signal === 'good' ? 'text-success' : 'text-warning'} />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧: PDA扫描 */}
        <div className="lg:col-span-1 space-y-4">
          {/* PDA设备模拟 */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 shadow-2xl border-4 border-slate-700">
            {/* PDA顶部 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera size={18} className={cameraOn ? 'text-primary' : 'text-slate-500'} />
                <Flashlight size={18} className={flashOn ? 'text-warning' : 'text-slate-500'} />
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400">WMS</span>
                <p className="text-sm font-bold text-white">手持终端</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCameraOn(!cameraOn)} className={`p-1.5 rounded ${cameraOn ? 'bg-primary' : 'bg-slate-700'}`}>
                  <Camera size={14} className="text-white" />
                </button>
                <button onClick={() => setFlashOn(!flashOn)} className={`p-1.5 rounded ${flashOn ? 'bg-warning' : 'bg-slate-700'}`}>
                  <Flashlight size={14} className="text-white" />
                </button>
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
                  onClick={() => setScanMode(mode.key as typeof scanMode)}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition ${scanMode === mode.key ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* 扫描区域 */}
            <div className="relative mb-4">
              <div className={`aspect-[4/3] rounded-xl border-2 ${showResult ? 'border-success bg-success/10' : 'border-dashed border-slate-600'} flex items-center justify-center relative overflow-hidden`}>
                {cameraOn && (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
                )}
                <div className="text-center">
                  {showResult ? (
                    <>
                      <CheckCircle size={48} className="text-success mx-auto mb-2" />
                      <p className="text-white font-medium">扫描成功</p>
                    </>
                  ) : (
                    <>
                      <ScanLine size={48} className="text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">对准{scanMode === 'sku' ? '商品条码' : scanMode === 'location' ? '库位标签' : '快递单号'}</p>
                    </>
                  )}
                  {/* 扫描线动画 */}
                  <div className={`absolute left-2 right-2 h-0.5 bg-primary ${showResult ? 'hidden' : ''}`} style={{ animation: 'scan 2s ease-in-out infinite' }} />
                </div>
              </div>
            </div>

            {/* 输入框 */}
            <form onSubmit={handleScan} className="mb-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  placeholder={scanMode === 'sku' ? '输入或扫描SKU...' : scanMode === 'location' ? '输入或扫描库位...' : '输入或扫描快递号...'}
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
              <button className="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-xs transition">
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

          {/* 待入库任务 */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package size={16} className="text-muted-foreground" />
              待入库任务
            </h3>
            <div className="space-y-3">
              {mockIncomingTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleStartTask(task)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${currentTask?.id === task.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm font-medium">{task.id}</span>
                    <StatusBadge status={task.status === 'pending' ? 'warning' : 'pending'} />
                  </div>
                  <p className="text-sm text-muted-foreground">{task.supplier}</p>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span>{task.items}种商品</span>
                    <span>预计{task.expectedTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧: 处理区域 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 已扫描商品 */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-primary" />
              已扫描商品
            </h3>
            <div className="space-y-3">
              {scannedItems.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${item.status === 'completed' ? 'border-success bg-success/5' : 'border-primary bg-primary/5'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{item.sku}</p>
                    </div>
                    {item.status === 'completed' ? (
                      <CheckCircle size={20} className="text-success" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <button className="p-1 rounded bg-muted hover:bg-background">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-lg w-12 text-center">{item.scanned}</span>
                        <button className="p-1 rounded bg-muted hover:bg-background">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.status === 'completed' ? 'bg-success' : 'bg-primary'}`}
                          style={{ width: `${(item.scanned / item.expected) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.scanned} / {item.expected}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 智能库位推荐 */}
          <div className="bg-card border rounded-lg p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              智能库位推荐
            </h3>
            <p className="text-sm text-muted-foreground mb-4">系统根据商品特性、库存水位和拣货效率推荐最佳上架位置</p>
            <div className="space-y-3">
              {mockLocations.map((loc, idx) => (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${selectedLocation?.id === loc.id ? 'border-primary bg-primary/5' : idx === 0 ? 'border-primary/50' : 'hover:border-primary/30'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${idx === 0 ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {idx === 0 ? <CheckCircle2 size={18} /> : <MapPin size={18} />}
                      </div>
                      <div>
                        <p className="font-mono font-bold text-lg">{loc.id}</p>
                        <p className="text-xs text-muted-foreground">{loc.type} · 当前容量 {loc.capacity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {idx === 0 && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">推荐</span>}
                      <p className="text-xs text-muted-foreground mt-1">{loc.usage}/{loc.max}</p>
                    </div>
                  </div>
                  <div className="mt-2 pl-11">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: loc.capacity }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{loc.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 确认上架 */}
          {selectedLocation && (
            <div className="bg-card border border-primary/20 rounded-lg p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">确认上架</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    将商品上架至 <span className="font-mono font-bold text-primary">{selectedLocation.id}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirmPutaway}
                    className="px-6 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium shadow-lg"
                  >
                    确认上架
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 差异处理提示 */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning">差异处理说明</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  如实收数量与预期不符，系统将自动记录差异并生成待处理任务。采购员可在"采购单管理"中进行二次确认或退款处理。
                </p>
                <div className="mt-2 flex gap-2">
                  <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded">到货100实收90</span>
                  <span className="text-xs px-2 py-1 bg-warning/20 text-warning rounded">自动计算实际成本</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
