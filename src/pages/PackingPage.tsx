import React, { useState } from 'react';
import { FileDown, Printer, Scissors, Split, Truck, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

const pendingPacks = [
    { id: 'SO-231105-001', type: 'single', items: 1, status: 'ready', carrier: '顺丰速运', weight: '1.2kg' },
    { id: 'SO-231105-002', type: 'multi', items: 3, status: 'sorting', carrier: '中通快递', weight: '3.5kg' },
    { id: 'SO-231105-003', type: 'multi', items: 2, status: 'ready', carrier: '京东物流', weight: '2.0kg' },
];

export default function PackingPage() {
    const [activeTab, setActiveTab] = useState('all');

    const filteredPacks = pendingPacks.filter(p => activeTab === 'all' || p.type === activeTab);

    return (
        <div className="space-y-6">
            <div className="wms-page-header">
                <div>
                    <h1 className="wms-page-title">打包发货</h1>
                    <p className="wms-page-subtitle">组合面单打印、内部库位联、多品订单分流</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border text-muted-foreground hover:bg-muted transition">
                        <RefreshCw size={16} />同步物流单号
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                        <Printer size={16} />自动打单机配置
                    </button>
                </div>
            </div>

            <div className="flex gap-4 border-b">
                {['all', 'single', 'multi'].map((tab) => (
                    <button
                        key={tab}
                        className={`pb-3 px-1 text-sm font-medium ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'all' && '全部待打包'}
                        {tab === 'single' && '单品单件 (快速通道)'}
                        {tab === 'multi' && '多品订单 (需分播)'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Packing List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-card border rounded-lg p-4 sticky top-6">
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="扫描订单号或物流单..."
                                className="w-full pl-10 pr-4 py-2 bg-muted rounded-md outline-none focus:ring-2 focus:ring-primary/30"
                            />
                            <ScanLineIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        </div>

                        <div className="space-y-3">
                            {filteredPacks.map((pack) => (
                                <div key={pack.id} className="p-3 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors bg-card">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-sm font-bold">{pack.id}</span>
                                        <StatusBadge status={pack.status === 'ready' ? 'active' : 'pending'} />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                                        <span className="flex items-center gap-1"><Truck size={12} /> {pack.carrier}</span>
                                        <span className="flex items-center gap-1">{pack.type === 'multi' ? <Split size={12} className="text-warning" /> : <CheckCircle size={12} className="text-success" />} {pack.items} 件商品</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Active Packing Task */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border rounded-lg overflow-hidden">
                        <div className="bg-muted p-4 border-b flex justify-between items-center">
                            <div>
                                <h3 className="font-bold flex items-center gap-2 text-lg">
                                    当前打包任务: SO-231105-002
                                    <span className="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-xs border border-warning/30 flex items-center gap-1">
                                        <Split size={12} />多品订单分播
                                    </span>
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium">{pendingPacks[1].carrier} - {pendingPacks[1].weight}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                {/* 组合面单预览 */}
                                <div className="border-2 border-dashed rounded-lg p-6 bg-muted/20 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button className="p-1.5 bg-background border rounded hover:bg-muted text-muted-foreground"><FileDown size={16} /></button>
                                    </div>
                                    <div className="w-48 bg-white shadow-sm border border-border/50 p-4 font-mono text-xs scale-90 sm:scale-100 flex flex-col pt-8">
                                        <div className="absolute top-0 left-0 right-0 border-b border-dashed h-6 bg-slate-50 flex items-center justify-center text-[10px] text-muted-foreground tracking-widest">
                                            ----- 内部库位联 -----
                                        </div>
                                        <strong>SO-231105-002</strong>
                                        <p className="mt-1">A区1架-02 ×1</p>
                                        <p>B区3架-11 ×2</p>
                                        <div className="border-t border-dashed my-3 -mx-4"></div>
                                        <strong>{pendingPacks[1].carrier}</strong>
                                        <div className="h-8 bg-black/80 my-2 w-full"></div>
                                        <span>[收] 广东省深圳市南山区...</span>
                                        <span>张生 138****8888</span>
                                    </div>
                                    <button className="mt-6 flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition shadow-sm">
                                        <Printer size={18} />
                                        打印组合面单
                                    </button>
                                </div>

                                {/* 分播与校验 */}
                                <div>
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <Scissors size={18} className="text-muted-foreground" />
                                        商品校验与分流
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded-md border-success bg-success/5">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle size={18} className="text-success" />
                                                <div>
                                                    <p className="text-sm">无线机械键盘 Pro</p>
                                                    <p className="text-xs text-muted-foreground font-mono">SKU: KBD-W01 (1/1)</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-success/80">已扫描</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-md border-primary shadow-sm bg-primary/5 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                            <div className="flex items-center gap-3">
                                                <AlertTriangle size={18} className="text-primary" />
                                                <div>
                                                    <p className="text-sm font-medium">定制键帽套装</p>
                                                    <p className="text-xs text-primary font-mono mt-0.5">SKU: CAP-S05 (0/2)</p>
                                                </div>
                                            </div>
                                            <button className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded">确认扫描</button>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-muted rounded-lg text-sm flex gap-3 text-muted-foreground">
                                        <Split size={24} className="shrink-0 text-muted-foreground/50" />
                                        <p>此订单为多品订单。在打包区请注意分拣墙指示灯，将相应商品投入指定分流筐内。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted p-4 border-t flex justify-between items-center">
                            <button className="px-4 py-2 text-sm text-muted-foreground hover:bg-background rounded-md transition border border-transparent hover:border-border">暂挂异常并跳过</button>
                            <button className="px-8 py-2 bg-success text-success-foreground font-bold rounded-md hover:bg-success/90 transition shadow-sm">全部齐套 · 完成打包</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline Icon Component for ScanLine matching the size/color API
function ScanLineIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
            <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
            <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
            <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
            <path d="M7 12h10"></path>
        </svg>
    );
}
