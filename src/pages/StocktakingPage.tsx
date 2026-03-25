import React, { useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle, AlertTriangle, AlertCircle, RefreshCw, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const mockCountPlans = [
  { id: 'STK-202603-01', type: '周期配盘', scope: 'A区(爆款拣货区)', items: 45, progress: 80, status: 'active', variance: 2 },
  { id: 'STK-202603-02', type: '动态盘点', scope: 'B区智能推荐建议', items: 12, progress: 100, status: 'completed', variance: 0 },
  { id: 'STK-202603-03', type: '异常盘点', scope: 'C-01 库位', items: 1, progress: 0, status: 'pending', variance: 0 },
];

const mockLogs = [
  { id: 'LOG-001', operator: '张三', action: '盘点差异确认', target: 'SKU-10088', result: '-2件', date: '10分钟前' },
  { id: 'LOG-002', operator: '李四', action: '扫码盘点', target: 'A-01-01', result: '无差异', date: '30分钟前' },
  { id: 'LOG-003', operator: 'PDA-002', action: '触发盘点任务', target: 'B区-补货点', result: '已生成', date: '1小时前' },
];

export default function StocktakingPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showLogDialog, setShowLogDialog] = useState(false);
  const { toast } = useToast();

  const handleStartCount = (id: string) => {
    toast({ title: '盘点已开始', description: `任务 ${id} 的盘点单已同步至PDA手持端，请前往作业。` });
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">盘点管理</h1>
          <p className="wms-page-subtitle">周期性盘点、动态触发盘点、差异对比汇总报告</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <RefreshCw size={16} />同步日志
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition font-medium">
            <Plus size={16} />发起的盘点
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-5 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">本月总完成</p>
            <div className="p-2 bg-success/10 text-success rounded-md"><CheckCircle size={16} /></div>
          </div>
          <p className="text-2xl font-bold">42 场</p>
          <p className="text-xs text-muted-foreground flex items-center mt-2">
            包含: 周期*15, 动态*22, 异常*5
          </p>
        </div>
        <div className="bg-card p-5 rounded-lg border shadow-sm border-warning/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">平均差异率</p>
            <div className="p-2 bg-warning/10 text-warning rounded-md"><AlertTriangle size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-warning">0.32%</p>
          <p className="text-xs text-success flex items-center mt-2 font-medium">
            <TrendingDown size={12} className="mr-1" /> 同比上月下降 12%
          </p>
        </div>
        <div className="bg-card p-5 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">待解决差异</p>
            <div className="p-2 bg-destructive/10 text-destructive rounded-md"><AlertCircle size={16} /></div>
          </div>
          <p className="text-2xl font-bold font-mono text-destructive">2 笔</p>
          <p className="text-xs text-muted-foreground flex items-center mt-2">
            需采购员/账面管理员人工复核
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Plan lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索盘点单号范围或类型..."
              className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary/40 text-background-foreground scroll-m-0 hover:bg-muted/50 transition-colors"
            />
          </div>

          <div className="space-y-3">
            {mockCountPlans.map((plan) => (
              <div key={plan.id} className="bg-card border rounded-lg p-5 hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{plan.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">{plan.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">盘点范围: {plan.scope}</p>
                  </div>
                  <StatusBadge status={plan.status === 'completed' ? 'active' : plan.status === 'pending' ? 'warning' : 'pending'} />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-muted-foreground">点件进度</span>
                      <span className="font-bold">{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${plan.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">包含商品</span>
                    <p className="font-bold">{plan.items} 档</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t text-sm">
                  <div className="flex items-center gap-4 text-xs">
                    {plan.variance > 0 ? (
                      <span className="flex items-center gap-1 text-destructive font-semibold">
                        <AlertTriangle size={14} /> 差异 {plan.variance} 笔
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-success font-medium">
                        <CheckCircle size={14} /> 暂无差异
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {plan.status === 'active' && <button onClick={() => handleStartCount(plan.id)} className="text-xs text-primary hover:underline">继续盘点</button>}
                    {plan.status === 'pending' && <button onClick={() => handleStartCount(plan.id)} className="text-xs px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition text-[11px]">启动并分派</button>}
                    {plan.status === 'completed' && <button className="text-xs text-muted-foreground hover:underline">查看差异报告</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic logs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border rounded-lg p-5 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ClipboardList size={18} className="text-primary" />
              实操动作日志
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {mockLogs.map((log) => (
                <div key={log.id} className="p-3 border rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold">{log.operator}</span>
                    <span className="text-[10px] text-muted-foreground">{log.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{log.action} · {log.target}</span>
                    <span className={`font-bold ${log.result.startsWith('-') ? 'text-destructive' : log.result === '无差异' ? 'text-success' : ''}`}>{log.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
