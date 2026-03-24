import React, { useState } from 'react';
import { ScanLine, MapPin, Package, CheckCircle2, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export default function InboundPage() {
  const [scanValue, setScanValue] = useState('');
  const [scannedItem, setScannedItem] = useState<any>(null);

  const mockLocations = [
    { id: 'A-01-01', type: '推荐', capacity: '70%', status: 'active' },
    { id: 'B-02-04', type: '备选', capacity: '40%', status: 'pending' },
  ];

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue) return;
    
    // Simulate finding an item
    setScannedItem({
      po: 'PO-20231015-001',
      sku: scanValue,
      name: '智能蓝牙耳机',
      expectedQty: 500,
      scannedQty: 120,
      image: '🎧'
    });
    setScanValue('');
  };

  const handlePutaway = () => {
    alert('上架成功！');
    setScannedItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">入库作业</h1>
          <p className="wms-page-subtitle">PDA扫码入库、上架引导、库位推荐</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition">
            批量导入
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
            异常登记
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scanning */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ScanLine size={18} className="text-primary" />
              PDA 扫码模拟
            </h3>
            <form onSubmit={handleScan} className="flex gap-2">
              <input
                type="text"
                placeholder="扫描 SKU 或 快递单号..."
                className="flex-1 px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
                autoFocus
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition"
              >
                扫描
              </button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p>请模拟使用硬件PDA扫描实体条码。</p>
              <p className="mt-1">支持：采购单号、SKU码、物流单号</p>
            </div>
          </div>

          {/* Incoming Tasks */}
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package size={18} className="text-muted-foreground" />
              待入库任务
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-md border hover:border-primary/50 cursor-pointer transition-colors">
                  <div>
                    <p className="text-sm font-medium">PO-20231015-00{i}</p>
                    <p className="text-xs text-muted-foreground mt-1">供应商: 深圳电子极客</p>
                  </div>
                  <StatusBadge status="pending" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Processing */}
        <div className="lg:col-span-2">
          {scannedItem ? (
            <div className="bg-card border rounded-lg p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                    {scannedItem.image}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{scannedItem.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">SKU: <span className="font-mono">{scannedItem.sku}</span> | 关联单号: {scannedItem.po}</p>
                  </div>
                </div>
                <StatusBadge status="active" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <p className="text-sm text-muted-foreground mb-1">预计到货</p>
                  <p className="text-2xl font-bold">{scannedItem.expectedQty}</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">已清点</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-primary">{scannedItem.scannedQty}</p>
                    <p className="text-sm text-muted-foreground mb-1">/ {scannedItem.expectedQty}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(scannedItem.scannedQty / scannedItem.expectedQty) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  智能库位推荐
                </h3>
                <div className="space-y-3">
                  {mockLocations.map((loc, idx) => (
                    <div key={loc.id} className={`flex items-center justify-between p-4 border rounded-lg ${idx === 0 ? 'border-primary bg-primary/5' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${idx === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          {idx === 0 ? <CheckCircle2 size={18} /> : <MapPin size={18} />}
                        </div>
                        <div>
                          <p className="font-mono font-bold text-lg">{loc.id}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">当前容量: {loc.capacity} | {loc.type}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handlePutaway}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${idx === 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                      >
                        确认上架至此
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
              <ScanLine size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">等待扫描入库商品</p>
              <p className="text-sm mt-2">请在左侧使用PDA模拟扫描商品条码开始作业</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
