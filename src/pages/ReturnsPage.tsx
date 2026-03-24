import { useState } from 'react';
import { Package, RotateCcw, MapPin, CheckCircle, AlertTriangle, Search, Plus } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const returnOrders = [
  { id: 'RE001', returnNo: 'RT-20250324-001', originalOrder: 'TB-20250324-88006', platform: '淘宝', reason: '7天无理由', customer: '用户A', items: '蓝牙耳机×1', status: 'pending', location: 'A-01-03', createdAt: '2025-03-24 10:00' },
  { id: 'RE002', returnNo: 'RT-20250324-002', originalOrder: 'DY-20250324-66005', platform: '抖音', reason: '商品破损', customer: '用户B', items: '手机壳×2', status: 'received', location: 'A-02-01', createdAt: '2025-03-24 09:30' },
  { id: 'RE003', returnNo: 'RT-20250324-003', originalOrder: 'PDD-20250324-55005', platform: '拼多多', reason: '型号错误', customer: '用户C', items: '车载支架×1', status: 'returned', location: 'A-03-02', createdAt: '2025-03-24 08:45' },
  { id: 'RE004', returnNo: 'RT-20250324-004', originalOrder: 'TB-20250324-88010', platform: '淘宝', reason: '其他', customer: '用户D', items: '无线充电器×1', status: 'abnormal', location: '-', createdAt: '2025-03-24 08:00' },
];

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReturn, setSelectedReturn] = useState<typeof returnOrders[0] | null>(null);
  const { toast } = useToast();

  const filteredReturns = activeTab === 'all' ? returnOrders : returnOrders.filter(r => r.status === activeTab);

  const handleConfirmReceive = (id: string) => {
    toast({ title: '已确认收货', description: `退货单 ${id} 已入库，待归位处理` });
  };

  const handleConfirmReturn = (id: string) => {
    toast({ title: '归位完成', description: `商品已归位到 ${returnOrders.find(r => r.id === id)?.location}` });
    setSelectedReturn(null);
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">退货处理</h1>
          <p className="wms-page-subtitle">退货归位引导、异常件处理</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            导出记录
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
            <Plus size={16} />异常件登记
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '待收货', value: 5, color: 'text-warning' },
          { label: '待归位', value: 3, color: 'text-primary' },
          { label: '已完成', value: 28, color: 'text-success' },
          { label: '异常件', value: 2, color: 'text-destructive' },
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
          { key: 'pending', label: '待收货' },
          { key: 'received', label: '待归位' },
          { key: 'returned', label: '已完成' },
          { key: 'abnormal', label: '异常件' },
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

      {/* Quick Guide */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          退货归位指引
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
              <span className="font-medium">扫描退货单</span>
            </div>
            <p className="text-sm text-muted-foreground">扫描退货单号或物流单获取退货信息</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
              <span className="font-medium">核对商品</span>
            </div>
            <p className="text-sm text-muted-foreground">验收退货商品，检查是否完好</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
              <span className="font-medium">归位上架</span>
            </div>
            <p className="text-sm text-muted-foreground">根据内部联库位信息直接归位，无需再查系统</p>
          </div>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">退单号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">原订单</th>
                <th className="text-left p-3 font-medium text-muted-foreground">平台</th>
                <th className="text-left p-3 font-medium text-muted-foreground">退货商品</th>
                <th className="text-left p-3 font-medium text-muted-foreground">原因</th>
                <th className="text-left p-3 font-medium text-muted-foreground">库位</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map(ret => (
                <tr key={ret.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs font-medium">{ret.returnNo}</td>
                  <td className="p-3 font-mono text-xs">{ret.originalOrder}</td>
                  <td className="p-3 text-sm">{ret.platform}</td>
                  <td className="p-3 text-sm">{ret.items}</td>
                  <td className="p-3 text-sm">
                    {ret.reason === '商品破损' ? (
                      <span className="text-destructive flex items-center gap-1"><AlertTriangle size={12} />{ret.reason}</span>
                    ) : (
                      <span className="text-muted-foreground">{ret.reason}</span>
                    )}
                  </td>
                  <td className="p-3">
                    {ret.location !== '-' ? (
                      <span className="font-mono text-sm bg-primary/10 px-2 py-0.5 rounded">{ret.location}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={ret.status === 'pending' ? 'warning' : ret.status === 'received' ? 'pending' : ret.status === 'returned' ? 'active' : 'abnormal'} />
                  </td>
                  <td className="p-3 text-center">
                    {ret.status === 'pending' && (
                      <button onClick={() => handleConfirmReceive(ret.id)} className="text-xs text-primary hover:underline">确认收货</button>
                    )}
                    {ret.status === 'received' && (
                      <button onClick={() => setSelectedReturn(ret)} className="text-xs text-primary hover:underline">确认归位</button>
                    )}
                    {ret.status === 'abnormal' && (
                      <button onClick={() => toast({ title: '异常处理', description: '请到异常件处理区' })} className="text-xs text-destructive hover:underline">处理异常</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Detail Dialog */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedReturn(null)}>
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold">退货归位 - {selectedReturn.returnNo}</h2>
              <p className="text-sm text-muted-foreground">请根据内部联信息进行归位操作</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-muted-foreground">原订单</p>
                  <p className="font-mono font-medium">{selectedReturn.originalOrder}</p>
                </div>
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-muted-foreground">平台</p>
                  <p className="font-medium">{selectedReturn.platform}</p>
                </div>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-muted-foreground">退货商品</p>
                <p className="font-medium">{selectedReturn.items}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-semibold">推荐归位库位</span>
                </div>
                <p className="text-2xl font-mono font-bold text-primary">{selectedReturn.location}</p>
                <p className="text-xs text-muted-foreground mt-1">基于原出库库位智能推荐</p>
              </div>
              <div className="p-3 rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Package size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">请将商品放回指定库位</p>
                  <p className="text-xs mt-1">扫描库位标签确认归位</p>
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setSelectedReturn(null)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
              <button onClick={() => handleConfirmReturn(selectedReturn.id)} className="px-4 py-2 text-sm rounded-md bg-success text-success-foreground hover:bg-success/90 transition">确认归位完成</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
