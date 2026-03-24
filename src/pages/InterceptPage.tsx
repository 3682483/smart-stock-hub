import { useState } from 'react';
import { ScanLine, AlertTriangle, CheckCircle, XCircle, Search, Package } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const interceptRecords = [
  { id: 'INT001', orderNo: 'DY-20250324-66003', platform: '抖音', expressNo: 'SF1234567890', reason: '用户取消', status: 'intercepted', operator: '系统', time: '09:15' },
  { id: 'INT002', orderNo: 'TB-20250324-88005', platform: '淘宝', expressNo: 'ZT9876543210', reason: '地址异常', status: 'released', operator: '王五', time: '08:45' },
  { id: 'INT003', orderNo: 'PDD-20250324-55003', platform: '拼多多', expressNo: 'JD2468101214', reason: '重复订单', status: 'intercepted', operator: '系统', time: '08:30' },
  { id: 'INT004', orderNo: 'TB-20250324-88008', platform: '淘宝', expressNo: 'YTO1357924680', reason: '超时未付款', status: 'released', operator: '李四', time: '07:55' },
];

export default function InterceptPage() {
  const [scanValue, setScanValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [scanResult, setScanResult] = useState<typeof interceptRecords[0] | null>(null);
  const { toast } = useToast();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue) return;

    // 模拟扫描查找
    const found = interceptRecords.find(r => r.expressNo.includes(scanValue) || r.orderNo.includes(scanValue));
    if (found) {
      setScanResult(found);
      setShowResult(true);
      if (found.status === 'intercepted') {
        toast({ title: '订单已拦截', description: `订单 ${found.orderNo} 已被拦截，请处理`, variant: 'destructive' });
      } else {
        toast({ title: '订单可放行', description: `订单 ${found.orderNo} 无异常，可以放行` });
      }
    } else {
      toast({ title: '未找到订单', description: '未匹配到相关订单信息', variant: 'destructive' });
    }
    setScanValue('');
  };

  const handleRelease = (id: string) => {
    toast({ title: '已放行', description: `订单已标记为放行，可继续发货` });
    setShowResult(false);
    setScanResult(null);
  };

  const handleProcessException = (id: string) => {
    toast({ title: '异常件处理', description: '请选择异常原因并提交' });
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">出库拦截</h1>
          <p className="wms-page-subtitle">出库前扫描面单，自动拦截已取消订单</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            导出记录
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日拦截', value: 5, color: 'text-destructive' },
          { label: '已放行', value: 12, color: 'text-success' },
          { label: '待处理', value: 2, color: 'text-warning' },
          { label: '避免损失', value: '¥860', color: 'text-primary' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Scan Area */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex flex-col items-center">
          <div className={`p-6 rounded-full ${showResult && scanResult?.status === 'intercepted' ? 'bg-destructive/10' : showResult ? 'bg-success/10' : 'bg-primary/10'} mb-4 transition-colors`}>
            <ScanLine size={48} className={showResult && scanResult?.status === 'intercepted' ? 'text-destructive' : showResult ? 'text-success' : 'text-primary'} />
          </div>
          <h2 className="text-lg font-semibold mb-2">扫描面单条码</h2>
          <p className="text-sm text-muted-foreground mb-6">扫描物流面单或输入单号进行拦截检查</p>
          <form onSubmit={handleScan} className="w-full max-w-md flex gap-2">
            <input
              type="text"
              placeholder="扫描或输入面单号..."
              className="flex-1 px-4 py-3 rounded-lg bg-muted text-lg outline-none focus:ring-2 focus:ring-primary/30 text-center font-mono"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
            />
            <button type="submit" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
              查询
            </button>
          </form>
        </div>
      </div>

      {/* Scan Result */}
      {showResult && scanResult && (
        <div className={`rounded-lg border p-6 ${scanResult.status === 'intercepted' ? 'border-destructive bg-destructive/5' : 'border-success bg-success/5'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${scanResult.status === 'intercepted' ? 'bg-destructive/10' : 'bg-success/10'}`}>
              {scanResult.status === 'intercepted' ? <XCircle size={32} className="text-destructive" /> : <CheckCircle size={32} className="text-success" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">{scanResult.status === 'intercepted' ? '订单已拦截' : '订单可放行'}</h3>
                <StatusBadge status={scanResult.status === 'intercepted' ? 'abnormal' : 'active'} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">订单号</p>
                  <p className="font-mono font-medium">{scanResult.orderNo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">平台</p>
                  <p className="font-medium">{scanResult.platform}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">物流单号</p>
                  <p className="font-mono">{scanResult.expressNo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">拦截原因</p>
                  <p className="font-medium text-destructive">{scanResult.reason}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            {scanResult.status === 'intercepted' ? (
              <>
                <button onClick={() => { toast({ title: '已放行', description: '订单已标记为放行' }); setShowResult(false); }} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">强制放行</button>
                <button onClick={() => handleProcessException(scanResult.id)} className="px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition">异常处理</button>
              </>
            ) : (
              <button onClick={() => handleRelease(scanResult.id)} className="px-4 py-2 text-sm rounded-md bg-success text-success-foreground hover:bg-success/90 transition">确认放行</button>
            )}
          </div>
        </div>
      )}

      {/* Internal Label Example */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package size={18} className="text-muted-foreground" />
          内部库位联说明
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground">内部库位联是贴在包裹上的内部识别标签，包含：</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>订单号（用于溯源）</li>
            <li>库位编码（用于退货归位）</li>
            <li>商品摘要（用于快速识别）</li>
          </ul>
          <p className="mt-3 text-muted-foreground">当订单被拦截或退货时，可通过内部联上的库位信息直接进行归位操作，无需再查询系统。</p>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-card rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">拦截记录</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="搜索订单..." className="pl-8 pr-4 py-1.5 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 w-48" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">记录ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">订单号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">平台</th>
                <th className="text-left p-3 font-medium text-muted-foreground">物流单号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">拦截原因</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                <th className="text-left p-3 font-medium text-muted-foreground">操作员</th>
                <th className="text-left p-3 font-medium text-muted-foreground">时间</th>
              </tr>
            </thead>
            <tbody>
              {interceptRecords.map(record => (
                <tr key={record.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs">{record.id}</td>
                  <td className="p-3 font-mono text-xs">{record.orderNo}</td>
                  <td className="p-3 text-sm">{record.platform}</td>
                  <td className="p-3 font-mono text-xs">{record.expressNo}</td>
                  <td className="p-3 text-sm">
                    {record.status === 'intercepted' ? (
                      <span className="text-destructive flex items-center gap-1"><AlertTriangle size={12} />{record.reason}</span>
                    ) : (
                      <span className="text-muted-foreground">{record.reason}</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={record.status === 'intercepted' ? 'abnormal' : 'active'} />
                  </td>
                  <td className="p-3 text-sm">{record.operator}</td>
                  <td className="p-3 text-xs text-muted-foreground">{record.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
