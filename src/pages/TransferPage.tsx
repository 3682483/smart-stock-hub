import React, { useState } from 'react';
import { RefreshCw, MapPin, ArrowRightLeft, Package, CheckCircle, AlertTriangle, ScanLine, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockTransfers = [
  { id: 'TRF-250325-001', from: 'A-01-01', to: 'B-01-01', items: 3, qty: 150, type: '补货', status: 'pending' },
  { id: 'TRF-250325-002', from: 'B-02-04', to: 'A-02-01', items: 1, qty: 50, type: '移库', status: 'active' },
  { id: 'TRF-250325-003', from: 'C-01-02', to: 'A-01-03', items: 2, qty: 80, type: '触发式补货', status: 'completed' },
];

export default function TransferPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showPdaSim, setShowPdaSim] = useState(true);
  const [pdaScreen, setPdaScreen] = useState<'menu' | 'transfer' | 'success'>('menu');
  const [pdaForm, setPdaForm] = useState({ from: '', sku: '', to: '', qty: '1' });
  const { toast } = useToast();

  const handlePdaSubmit = () => {
    if (!pdaForm.from || !pdaForm.sku || !pdaForm.to) {
      toast({ title: '参数缺失', description: '请扫描/输入所有必要字段', variant: 'destructive' });
      return;
    }
    setPdaScreen('success');
    toast({ title: '移库成功', description: `物料已移至 ${pdaForm.to}` });
  };

  const resetPda = () => {
    setPdaScreen('menu');
    setPdaForm({ from: '', sku: '', to: '', qty: '1' });
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">库内移库/补货</h1>
          <p className="wms-page-subtitle">触发式补货、存储区到拣货区调拨、PDA扫码移库操作</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border text-muted-foreground hover:bg-muted transition">
            <RefreshCw size={16} />刷新任务
          </button>
          <button
            onClick={() => setShowPdaSim(!showPdaSim)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border ${showPdaSim ? 'border-primary text-primary bg-primary/5' : ''} transition`}
          >
            <ScanLine size={16} />PDA 模拟器
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition font-medium">
            新建移库单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left/Middle Column: Transfer Job Lists & Status */}
        <div className={`lg:col-span-2 space-y-6 ${showPdaSim ? 'lg:border-r pr-6' : ''}`}>
          <div className="flex gap-4 border-b">
            {['all', 'pending', 'active', 'completed'].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' && '全部移库单'}
                {tab === 'pending' && '待指派'}
                {tab === 'active' && '进行中'}
                {tab === 'completed' && '已完成'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mockTransfers.filter(t => activeTab === 'all' || t.status === activeTab).map((job) => (
              <div key={job.id} className="bg-card border rounded-lg p-5 hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{job.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">{job.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">创建时间: 2026-03-25 09:15</p>
                  </div>
                  <StatusBadge status={job.status === 'completed' ? 'active' : job.status === 'pending' ? 'warning' : 'pending'} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">源库位</span>
                    <span className="font-mono font-bold text-base flex items-center gap-1">
                      <MapPin size={14} className="text-destructive" />
                      {job.from}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="text-muted-foreground animate-pulse" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">目标库位</span>
                    <span className="font-mono font-bold text-base flex items-center gap-1">
                      <MapPin size={14} className="text-success" />
                      {job.to}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Package size={16} />
                    共 <strong className="text-foreground">{job.items}</strong> 种商品 / <strong className="text-foreground">{job.qty}</strong> 件
                  </span>
                  <button className="text-xs text-primary hover:underline font-medium">查看商品清单</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: PDA Simulator */}
        {showPdaSim && (
          <div className="lg:col-span-1 border-t lg:border-t-0 flex justify-center items-start pt-6 lg:pt-0">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 shadow-2xl border-[6px] border-slate-700 w-full max-w-sm sticky top-6">
              {/* Device Notch/Top */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-[10px] text-slate-400">10:42 AM</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>WIFI</span>
                  <span>85%</span>
                </div>
              </div>

              {/* Main PDA Screen Screen */}
              <div className="bg-slate-50 rounded-xl overflow-hidden min-h-[420px] flex flex-col text-slate-900 shadow-inner">
                {/* Header */}
                <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
                  {pdaScreen !== 'menu' && (
                    <button onClick={resetPda} className="text-xs">返回</button>
                  )}
                  <h3 className="font-bold flex-1 text-center text-sm">
                    {pdaScreen === 'menu' && 'WMSPro PDA'}
                    {pdaScreen === 'transfer' && '库内移库'}
                    {pdaScreen === 'success' && '操作成功'}
                  </h3>
                  <div className="w-8"></div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col gap-3">
                  {pdaScreen === 'menu' && (
                    <div className="grid grid-cols-2 gap-3 flex-1 items-center">
                      <button onClick={() => setPdaScreen('transfer')} className="aspect-square bg-white shadow-sm border rounded-xl flex flex-col items-center justify-center p-3 hover:bg-slate-50 transition">
                        <ArrowRightLeft size={32} className="text-purple-500 mb-2" />
                        <span className="text-xs font-bold">库内移库</span>
                      </button>
                      <button className="aspect-square bg-white shadow-sm border rounded-xl flex flex-col items-center justify-center p-3">
                        <Package size={32} className="text-blue-500 mb-2" />
                        <span className="text-xs font-bold">扫描上架</span>
                      </button>
                      <button className="aspect-square bg-white shadow-sm border rounded-xl flex flex-col items-center justify-center p-3">
                        <CheckCircle size={32} className="text-green-500 mb-2" />
                        <span className="text-xs font-bold">动态盘点</span>
                      </button>
                      <button className="aspect-square bg-white shadow-sm border rounded-xl flex flex-col items-center justify-center p-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center font-bold text-lg mb-2">Q</div>
                        <span className="text-xs font-bold">库存查询</span>
                      </button>
                    </div>
                  )}

                  {pdaScreen === 'transfer' && (
                    <div className="space-y-3 flex-1 flex flex-col">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">扫描原库位</label>
                        <input
                          type="text"
                          placeholder="请扫描原库位..."
                          className="w-full text-center py-2 border rounded-md font-mono text-sm bg-slate-100"
                          value={pdaForm.from}
                          onChange={e => setPdaForm({ ...pdaForm, from: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">扫描商品条码</label>
                        <input
                          type="text"
                          placeholder="请扫描商品..."
                          className="w-full text-center py-2 border rounded-md font-mono text-sm bg-slate-100"
                          value={pdaForm.sku}
                          onChange={e => setPdaForm({ ...pdaForm, sku: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">扫描目标库位</label>
                        <input
                          type="text"
                          placeholder="请扫描目标库位..."
                          className="w-full text-center py-2 border rounded-md font-mono text-sm bg-slate-100"
                          value={pdaForm.to}
                          onChange={e => setPdaForm({ ...pdaForm, to: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">移库数量</label>
                        <input
                          type="number"
                          value={pdaForm.qty}
                          onChange={e => setPdaForm({ ...pdaForm, qty: e.target.value })}
                          className="w-full text-center py-2 border rounded-md font-bold text-lg"
                        />
                      </div>
                      <div className="flex-1"></div>
                      <button onClick={handlePdaSubmit} className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition mt-auto">确认移库</button>
                    </div>
                  )}

                  {pdaScreen === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <CheckCircle size={32} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">移库成功</h4>
                        <p className="text-xs text-muted-foreground mt-1">记录已实时同步至后台系统</p>
                      </div>
                      <button onClick={resetPda} className="px-6 py-2 bg-slate-800 text-white text-xs font-bold rounded-full mt-4">继续操作</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Home Indicator */}
              <div className="w-24 h-1 bg-slate-500 rounded-full mx-auto mt-4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
