import React, { useState } from 'react';
import { DownloadCloud, DollarSign, TrendingUp, CreditCard, FileText, BarChart3, Receipt, Scale } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import StatusBadge from '@/components/ui/StatusBadge';

const profitData = [
    { name: '第1周', 收入: 4000, 成本: 2400, 利润: 1600 },
    { name: '第2周', 收入: 3000, 成本: 1398, 利润: 1602 },
    { name: '第3周', 收入: 6000, 成本: 3800, 利润: 2200 },
    { name: '第4周', 收入: 2780, 成本: 1908, 利润: 872 },
    { name: '第5周', 收入: 4890, 成本: 2800, 利润: 2090 },
];

const billingRecords = [
    { id: 'FEE-202311-01', type: '存储费', client: '极客电子', amount: '¥ 1,250.00', date: '2023-11-01', status: 'paid' },
    { id: 'FEE-202311-02', type: '操作费', client: '极客电子', amount: '¥ 320.00', date: '2023-11-02', status: 'paid' },
    { id: 'FEE-202311-03', type: '包材费', client: '潮玩世纪', amount: '¥ 890.00', date: '2023-11-03', status: 'pending' },
    { id: 'FEE-202311-04', type: '盘点费', client: '优品生活', amount: '¥ 150.00', date: '2023-11-05', status: 'pending' },
];

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="wms-page-header">
                <div>
                    <h1 className="wms-page-title">财务结算</h1>
                    <p className="wms-page-subtitle">仓储计费、订单利润分析、财务报表</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition font-medium">
                        <FileText size={16} />对账单生成
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition font-medium shadow-sm">
                        <DownloadCloud size={16} />导出月度报表
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">本月预估收入</p>
                        <div className="p-2 bg-success/10 text-success rounded-md"><DollarSign size={16} /></div>
                    </div>
                    <p className="text-3xl font-bold font-mono">¥ 124,500.00</p>
                    <p className="text-xs text-success flex items-center mt-2 font-medium">
                        <TrendingUp size={12} className="mr-1" /> +14.5% 同比上月
                    </p>
                </div>
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">仓储操作成本</p>
                        <div className="p-2 bg-destructive/10 text-destructive rounded-md"><CreditCard size={16} /></div>
                    </div>
                    <p className="text-3xl font-bold font-mono">¥ 45,280.00</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-2">
                        包含: 包材、人工、水电
                    </p>
                </div>
                <div className="bg-card p-5 rounded-lg border shadow-sm border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">毛利润总计</p>
                        <div className="p-2 bg-primary/10 text-primary rounded-md"><Scale size={16} /></div>
                    </div>
                    <p className="text-3xl font-bold font-mono text-primary">¥ 79,220.00</p>
                    <p className="text-xs text-success flex items-center mt-2 font-medium">
                        <TrendingUp size={12} className="mr-1" /> 利润率 63.6%
                    </p>
                </div>
                <div className="bg-card p-5 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">待回款金额</p>
                        <div className="p-2 bg-warning/10 text-warning rounded-md"><Receipt size={16} /></div>
                    </div>
                    <p className="text-3xl font-bold font-mono">¥ 12,450.00</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-2">
                        共 8 笔未结清账单
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Charts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border rounded-lg p-5 shadow-sm">
                        <h3 className="font-semibold mb-6 flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary" />
                            订单收入与利润趋势
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={profitData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="收入" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="利润" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 计费明细  */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border rounded-lg p-5 shadow-sm h-[calc(300px+84px)] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Receipt size={18} className="text-primary" />
                                仓储物流计费清单
                            </h3>
                            <a href="#" className="text-xs text-primary hover:underline">查看全部</a>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                            {billingRecords.map((record) => (
                                <div key={record.id} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-xs font-semibold">{record.id}</span>
                                        <StatusBadge status={record.status === 'paid' ? 'active' : 'pending'} />
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{record.type} · {record.client}</span>
                                        <span className={`font-bold font-mono ${record.status === 'pending' ? 'text-destructive' : ''}`}>{record.amount}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">{record.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
