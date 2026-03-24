import { useState } from 'react';
import { ArrowRight, MapPin, Package, CheckCircle, ScanLine, Plus, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const transferOrders = [
  { id: 'TR001', fromLocation: 'A-01-01', toLocation: 'B-01-01', sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', qty: 50, operator: '张三', status: 'pending', createdAt: '2025-03-24 08:00' },
  { id: 'TR002', fromLocation: 'A-02-01', toLocation: 'B-02-01', sku: 'SKU-10002', name: '手机壳 iPhone15', qty: 200, operator: '李四', status: 'in_progress', createdAt: '2025-03-24 09:15' },
  { id: 'TR003', fromLocation: 'A-03-02', toLocation: 'C-01-01', sku: 'SKU-10006', name: '车载手机支架', qty: 100, operator: '王五', status: 'completed', createdAt: '2025-03-24 07:30' },
];

const suggestedLocations = [
  { code: 'B-01-01', type: '拣货位', currentUsage: '35%', reason: '拣货区核心位置，热门商品' },
  { code: 'B-02-01', type: '拣货位', currentUsage: '45%', reason: '容量充足，距离打包区近' },
  { code: 'B-03-02', type: '拣货位', currentUsage: '20%', reason: '新开辟区域，容量大' },
];

export default function TransferPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [scanValue, setScanValue] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState<typeof transferOrders[0] | null>(null);
  const { toast } = useToast();

  const filteredOrders = activeTab === 'all' ? transferOrders : transferOrders.filter(t => t.status === activeTab);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue) return;
    const found = transferOrders.find(t => t.id === scanValue || t.sku === scanValue);
    if (found) {
      setSelectedTransfer(found);
      toast({ title: '扫描成功', description: `找到调拨单 ${found.id}` });
    } else {
      toast({ title: '未找到', description: '未匹配到相关调拨单', variant: 'destructive' });
    }
    setScanValue('');
  };

  const handleConfirmTransfer = (id: string) => {
    toast({ title: '移库完成', description: `调拨单 ${id} 已确认完成` });
    setSelectedTransfer(null);
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">移库/补货</h1>
          <p className="wms-page-subtitle">存储区到拣货区调拨、PDA扫码移库</p>
        </div>
        <button
          onClick={() => setShowNewDialog(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <Plus size={16} />新建调拨
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '待调拨', value: 5, color: 'text-warning' },
          { label: '调拨中', value: 3, color: 'text-primary' },
          { label: '已完成今日', value: 12, color: 'text-success' },
          { label: '异常件', value: 1, color: 'text-destructive' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: 'pending', label: '待调拨' },
          { key: 'in_progress', label: '调拨中' },
          { key: 'completed', label: '已完成' },
          { key: 'all', label: '全部' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-1 text-sm font-medium ${activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scan Input */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ScanLine size={18} />
            <span>PDA扫码:</span>
          </div>
          <form onSubmit={handleScan} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="扫描调拨单号或SKU..."
              className="flex-1 px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
            />
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition">
              扫描
            </button>
          </form>
        </div>
      </div>

      {/* Transfer List */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">调拨单号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">商品信息</th>
                <th className="text-left p-3 font-medium text-muted-foreground">源库位</th>
                <th className="text-left p-3 font-medium text-muted-foreground">目标库位</th>
                <th className="text-right p-3 font-medium text-muted-foreground">数量</th>
                <th className="text-left p-3 font-medium text-muted-foreground">操作员</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(t => (
                <tr key={t.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{t.id}</td>
                  <td className="p-3">
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{t.sku}</p>
                  </td>
                  <td className="p-3 font-mono">{t.fromLocation}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <ArrowRight size={14} className="text-muted-foreground" />
                      <span className="font-mono font-medium">{t.toLocation}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono">{t.qty}</td>
                  <td className="p-3 text-sm">{t.operator}</td>
                  <td className="p-3 text-center"><StatusBadge status={t.status === 'completed' ? 'active' : t.status === 'in_progress' ? 'pending' : 'warning'} /></td>
                  <td className="p-3 text-center">
                    {t.status === 'pending' && (
                      <button
                        onClick={() => setSelectedTransfer(t)}
                        className="text-xs text-primary hover:underline"
                      >
                        开始调拨
                      </button>
                    )}
                    {t.status === 'in_progress' && (
                      <button
                        onClick={() => handleConfirmTransfer(t.id)}
                        className="text-xs text-success hover:underline"
                      >
                        确认完成
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Detail Dialog */}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTransfer(null)}>
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold">调拨作业 - {selectedTransfer.id}</h2>
              <p className="text-sm text-muted-foreground mt-1">请扫描库位标签确认移库</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-muted-foreground">源库位</p>
                  <p className="font-mono font-bold text-lg">{selectedTransfer.fromLocation}</p>
                </div>
                <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                  <p className="text-muted-foreground">目标库位</p>
                  <p className="font-mono font-bold text-lg text-primary">{selectedTransfer.toLocation}</p>
                </div>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-muted-foreground">商品</p>
                <p className="font-medium">{selectedTransfer.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{selectedTransfer.sku} × {selectedTransfer.qty}</p>
              </div>
              <div className="p-3 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ScanLine size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">扫描目标库位确认</p>
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setSelectedTransfer(null)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
              <button onClick={() => handleConfirmTransfer(selectedTransfer.id)} className="px-4 py-2 text-sm rounded-md bg-success text-success-foreground hover:bg-success/90 transition">确认移库</button>
            </div>
          </div>
        </div>
      )}

      {/* New Transfer Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewDialog(false)}>
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold">新建调拨单</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">商品SKU</label>
                <select className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option>SKU-10001 - 蓝牙耳机 Pro Max</option>
                  <option>SKU-10002 - 手机壳 iPhone15</option>
                  <option>SKU-10006 - 车载手机支架</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">源库位</label>
                  <select className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                    <option>A-01-01 (存储区A)</option>
                    <option>A-02-01 (存储区A)</option>
                    <option>A-03-02 (存储区A)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">目标库位</label>
                  <select className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                    <option>B-01-01 (拣货区B)</option>
                    <option>B-02-01 (拣货区B)</option>
                    <option>C-01-01 (展位区C)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">调拨数量</label>
                <input type="number" defaultValue="50" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">推荐目标库位</label>
                <div className="space-y-2">
                  {suggestedLocations.map(loc => (
                    <div key={loc.code} className="p-3 rounded-md border hover:border-primary/50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium">{loc.code}</span>
                        <span className="text-xs text-muted-foreground">{loc.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{loc.reason} · 当前使用{loc.currentUsage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setShowNewDialog(false)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
              <button onClick={() => { toast({ title: '调拨单已创建', description: '调拨单已提交待执行' }); setShowNewDialog(false); }} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">创建调拨单</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
