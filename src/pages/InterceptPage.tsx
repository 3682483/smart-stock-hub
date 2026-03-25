import React, { useState } from 'react';
import { ScanLine, RefreshCw, CheckCircle, AlertCircle, Trash2, XCircle, Printer } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const mockIntercepOrders = [
  { id: 'SO-250325-001', carrierNo: 'SF1425364758', reason: '买家申请取消', status: 'intercepted', time: '10分钟前' },
  { id: 'SO-250325-002', carrierNo: 'SF1425364759', reason: '地址变更', status: 'pending', time: '30分钟前' },
  { id: 'SO-250325-003', carrierNo: 'SF1425364760', reason: '库存盘亏', status: 'pending', time: '1小时前' },
];

export default function InterceptPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [scanValue, setScanValue] = useState('');
  const { toast } = useToast();

  const handleIntercept = (id: string) => {
    toast({ title: '拦截成功', description: `订单 ${id} 的物流面单已成功核验拦截状态，包裹已转入退位区。` });
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanValue) return;
    toast({ title: '扫描拦截核验', description: `扫描单号 ${scanValue}，订单由于 [买家申请退款] 已被强制拦截归位！`, variant: 'destructive' });
    setScanValue('');
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">出库拦截</h1>
          <p className="wms-page-subtitle">最后一道关卡：出库前扫描面单，自动识别并拦截已取消订单</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border text-muted-foreground hover:bg-muted transition">
            <RefreshCw size={16} />同步取消单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Scan column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ScanLine size={18} className="text-primary" />
              面单出库核验
            </h3>
            <form onSubmit={handleScan} className="flex gap-2">
              <input
                type="text"
                placeholder="扫描面单条码或快递单号..."
                className="flex-1 px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-1 focus:ring-primary/40 text-background-foreground"
                value={scanValue}
                onChange={(e) => setScanValue(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition"
              >
                核验
              </button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p>在包裹交付快递员扫描揽收前，最后一分钟过检系统核验状态。</p>
              <p className="mt-1 text-destructive font-medium">如有冻结，声光报警发出红色拦截指示！</p>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg flex gap-3 text-warning">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-semibold mb-1">避免物流费损失</h4>
              <p className="text-muted-foreground">出库扫描可百分之百拦截取消订单，从而在揽收端阻止商品进入快递链路，减少仓储及逆向物流损耗。</p>
            </div>
          </div>
        </div>

        {/* List column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4 border-b">
            {['all', 'pending', 'intercepted'].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && '全部拦截记录'}
                {tab === 'pending' && '待核验拦截'}
                {tab === 'intercepted' && '已成功拦截'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mockIntercepOrders.filter(o => activeTab === 'all' || o.status === activeTab).map((order) => (
              <div key={order.id} className="bg-card border rounded-lg p-5 hover:bg-muted/30 cursor-pointer transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{order.id}</span>
                      <span className="text-xs text-muted-foreground">面单号: {order.carrierNo}</span>
                    </div>
                    <p className="text-xs text-destructive font-medium mt-1">拦截原因: {order.reason}</p>
                  </div>
                  <StatusBadge status={order.status === 'intercepted' ? 'active' : 'pending'} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t mt-4">
                  <span>创建时间: {order.time}</span>
                  <div className="flex gap-2">
                    {order.status === 'pending' ? (
                      <button onClick={() => handleIntercept(order.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-[11px] transition shadow-sm">
                        强制拦截归位
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-success text-[11px]"><CheckCircle size={12} /> 已强制回仓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
