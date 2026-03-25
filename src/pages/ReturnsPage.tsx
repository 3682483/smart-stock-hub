import React, { useState } from 'react';
import { ScanLine, CheckCircle, AlertTriangle, RefreshCw, Archive, MapPin, Undo2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const mockReturns = [
  { id: 'RET-250325-001', sku: 'SKU-10088', name: '智能蓝牙耳机', reason: '七天无理由', check: '完好', recommend: 'A-01-01', status: 'pending' },
  { id: 'RET-250325-002', sku: 'SKU-10045', name: '无线充电宝', reason: '破损拒收', check: '破损', recommend: '维修/报损区', status: 'active' },
  { id: 'RET-250325-003', sku: 'SKU-10034', name: '定制键帽', reason: '漏发补发', check: '完好', recommend: 'A-01-03', status: 'completed' },
];

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [scanValue, setScanValue] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<typeof mockReturns[0] | null>(null);
  const { toast } = useToast();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue) return;
    toast({ title: '扫描成功', description: `退货件 ${scanValue} 已核验，建议归位至 A-01-02。` });
    setScanValue('');
  };

  const handleReturnToShelf = () => {
    toast({ title: '归位成功', description: '系统库存已更新，该包裹已移出退货处理区。' });
    setSelectedReturn(null);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">退货处理</h1>
          <p className="wms-page-subtitle">退货归位引导、异常件拆包核验、逆向库存更新</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border text-muted-foreground hover:bg-muted transition">
            <RefreshCw size={16} />同步售后单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left column: Scan & Inspect */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ScanLine size={18} className="text-primary" />
              拆包扫描归位
            </h3>
            <form onSubmit={handleScan} className="flex gap-2">
              <input
                type="text"
                placeholder="扫描面单或售后单号..."
                className="flex-1 px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-1 focus:ring-primary/40 text-background-foreground"
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition"
              >
                扫描
              </button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p>利用面单或关联的内部联（库位联），可直接获知原本发出的库位位置，免查系统直接“快速回仓归位”。</p>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg flex gap-3 text-purple-600">
            <Archive size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-semibold mb-1">逆向物流追踪</h4>
              <p className="text-muted-foreground">处理拦截异常、破损异常和漏发异常，流转至采购或客服跟进二次派发或退款流程。</p>
            </div>
          </div>
        </div>

        {/* Right column: Task lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4 border-b">
            {['all', 'pending', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && '全部退货单'}
                {tab === 'pending' && '待拆包'}
                {tab === 'active' && '核验中'}
                {tab === 'completed' && '已完成'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mockReturns.filter(o => activeTab === 'all' || o.status === activeTab).map((order) => (
              <div
                key={order.id}
                className={`bg-card border rounded-lg p-5 hover:border-primary/50 cursor-pointer transition-colors shadow-sm ${selectedReturn?.id === order.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedReturn(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{order.id}</span>
                      <span className="text-xs text-muted-foreground">{order.sku} · {order.name}</span>
                    </div>
                    <p className="text-xs text-destructive font-medium mt-1">退货原因: {order.reason}</p>
                  </div>
                  <StatusBadge status={order.status === 'completed' ? 'active' : order.status === 'pending' ? 'warning' : 'pending'} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">质检状态</span>
                    <p className={`font-bold ${order.check === '破损' ? 'text-destructive' : 'text-success'}`}>{order.check}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">推荐归位</span>
                    <p className="font-mono font-bold flex items-center gap-1">
                      <MapPin size={14} className="text-primary" />
                      {order.recommend}
                    </p>
                  </div>
                </div>

                {selectedReturn?.id === order.id && order.status !== 'completed' && (
                  <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                    <button className="text-xs px-3 py-1.5 border hover:bg-muted rounded text-muted-foreground">报损登记</button>
                    <button onClick={handleReturnToShelf} className="text-xs px-4 py-1.5 bg-primary text-white rounded hover:bg-primary/90 transition shadow-sm font-semibold flex items-center gap-1"><Undo2 size={12} /> 一键归位</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
