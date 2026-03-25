import React, { useState } from 'react';
import { ShoppingBag, Users, Building, Percent, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const mockSelectionItems = [
    { id: 'SEL-001', name: '极光机械键盘', supplier: '外设大厂', price: '¥ 129.00', status: 'pending', date: '今日' },
    { id: 'SEL-002', name: '便携保温杯', supplier: '温控科技', price: '¥ 35.00', status: 'pending', date: '今日' },
    { id: 'SEL-003', name: '无线鼠标 M2', supplier: '外设大厂', price: '¥ 45.00', status: 'approved', date: '昨日' },
];

const mockMerchants = [
    { id: 'MER-01', name: '深圳优品贸易', type: '继仓模式', cycle: '按月', status: 'active', booths: 'Z-01-01' },
    { id: 'MER-02', name: '义乌潮玩中心', type: '代贴单模式', cycle: '按季', status: 'pending', booths: '暂无' },
];

export default function MerchantPage() {
    const [activeTab, setActiveTab] = useState('selection');
    const { toast } = useToast();

    const handleApprove = (id: string) => {
        toast({ title: '审核通过', description: `选品 ${id} 已成功发布至商城选品池！` });
    };

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="wms-page-header">
                <div>
                    <h1 className="wms-page-title">选品与招商中心</h1>
                    <p className="wms-page-subtitle">商品选品池审核发布、供应商入驻租赁、展位定额租金结算</p>
                </div>
            </div>

            <div className="flex gap-4 border-b">
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'selection' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('selection')}
                >
                    选品池审核
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'merchant' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('merchant')}
                >
                    招商入驻管理
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'rental' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('rental')}
                >
                    展位租赁管理
                </button>
            </div>

            <div className="flex-1 space-y-4">
                {activeTab === 'selection' && (
                    <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><ShoppingBag className="text-primary" size={18} /> 待审核商品池</h3>
                        <div className="space-y-3">
                            {mockSelectionItems.map((item) => (
                                <div key={item.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-xl">📦</div>
                                        <div>
                                            <p className="font-bold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">供应商: {item.supplier} | 申请价: <strong className="text-primary font-mono">{item.price}</strong></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={item.status === 'approved' ? 'active' : 'pending'} />
                                        {item.status === 'pending' && (
                                            <div className="flex gap-1 ml-4">
                                                <button className="p-1 border rounded text-destructive hover:bg-red-50"><XCircle size={16} /></button>
                                                <button onClick={() => handleApprove(item.id)} className="p-1 bg-primary text-white rounded hover:bg-primary/90"><CheckCircle size={16} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'merchant' && (
                    <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="text-primary" size={18} /> 招商合作伙伴</h3>
                        <div className="space-y-3">
                            {mockMerchants.map((merchant) => (
                                <div key={merchant.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm">{merchant.name}</p>
                                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">{merchant.type}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">结算周期: {merchant.cycle} | 占用展位: <span className="font-mono text-primary">{merchant.booths}</span></p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={merchant.status === 'active' ? 'active' : 'pending'} />
                                        {merchant.status === 'pending' && <button className="text-xs text-primary hover:underline ml-4">同意入驻</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'rental' && (
                    <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><Building className="text-primary" size={18} /> 展位租金和计费 rule 规则</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-dashed rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-sm">展厅摊位 A 级</span>
                                    <Percent className="text-primary" size={16} />
                                </div>
                                <p className="text-xl font-mono font-bold">¥ 450.00 <span className="text-xs text-muted-foreground">/ 月</span></p>
                                <p className="text-xs text-muted-foreground mt-1">按面积计费法则结算，每平米 ¥15 /月</p>
                            </div>
                            <div className="p-4 border border-dashed rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-sm">自营货架 B 级</span>
                                    <Percent className="text-slate-400" size={16} />
                                </div>
                                <p className="text-xl font-mono font-bold">¥ 80.00 <span className="text-xs text-muted-foreground">/ 月</span></p>
                                <p className="text-xs text-muted-foreground mt-1">按仓位租借定额核算，自动生成月底结算单</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
