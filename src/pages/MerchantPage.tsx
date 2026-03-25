import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, Building, Percent, CheckCircle, XCircle, Clock, Trash2, Plus, Search, Filter, Eye, Edit, FileText, DollarSign, TrendingUp, AlertCircle, Check, X, RefreshCw, Download, Upload, Link, QrCode, ExternalLink, Package } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = ['数码配件', '手机配件', '运动健康', '美妆工具', '家居百货', '汽车用品', '食品饮料', '服装鞋帽', '其他'];

// 选品数据
const mockSelectionItems = [
    { id: 'SEL-001', name: '极光机械键盘', supplier: '外设大厂', category: '数码配件', platform: 'taobao', cost: 85, price: 129, margin: 34, status: 'pending', date: '今日', applicant: '张经理' },
    { id: 'SEL-002', name: '便携保温杯', supplier: '温控科技', category: '家居百货', platform: 'douyin', cost: 22, price: 35, margin: 37, status: 'pending', date: '今日', applicant: '李总' },
    { id: 'SEL-003', name: '无线鼠标 M2', supplier: '外设大厂', category: '数码配件', platform: 'pdd', cost: 28, price: 45, margin: 38, status: 'approved', date: '昨日', applicant: '王经理' },
    { id: 'SEL-004', name: '智能体脂秤', supplier: '运动品牌', category: '运动健康', platform: 'taobao', cost: 95, price: 199, margin: 52, status: 'rejected', date: '昨日', applicant: '刘总' },
    { id: 'SEL-005', name: '创意手机壳', supplier: '配件批发', category: '手机配件', platform: '1688', cost: 8, price: 19.9, margin: 60, status: 'pending', date: '今日', applicant: '陈经理' },
];

// 供应商入驻数据
const mockMerchants = [
    { id: 'MER-001', name: '深圳优品贸易', type: '继仓模式', contact: '张总', phone: '13800138001', category: '数码配件', cycle: '月结', status: 'active', booths: 'EX-A-01', applyDate: '2025-01-15', totalOrders: 156 },
    { id: 'MER-002', name: '义乌潮玩中心', type: '代贴单模式', contact: '李总', phone: '13800138002', category: '综合', cycle: '季结', status: 'pending', booths: '-', applyDate: '2026-03-20', totalOrders: 0 },
    { id: 'MER-003', name: '广州力健运动', type: '继仓模式', contact: '王经理', phone: '13800138003', category: '运动健康', cycle: '月结', status: 'active', booths: 'EX-B-01', applyDate: '2024-11-08', totalOrders: 89 },
    { id: 'MER-004', name: '浙江美家工贸', type: '代贴单模式', contact: '陈总', phone: '13800138004', category: '家居百货', cycle: '预付', status: 'expiring', booths: 'EX-B-02', applyDate: '2024-03-01', totalOrders: 234 },
];

// 计费规则
const mockBillingRules = [
    { id: 'RULE-001', name: '展厅摊位A级', type: 'exhibition', unit: '/㎡/月', price: 15, minArea: 10, description: '按面积计费，适合标准展位', status: 'active' },
    { id: 'RULE-002', name: '临展特卖区', type: 'temporary', unit: '/㎡/日', price: 5, minArea: 5, description: '短期租赁，按天计费', status: 'active' },
    { id: 'RULE-003', name: '自营货架B级', type: 'shelf', unit: '个位/月', price: 80, minArea: 1, description: '按仓位定额核算', status: 'active' },
    { id: 'RULE-004', name: '仓储操作费', type: 'operation', unit: '件', price: 0.5, minArea: 1, description: '入库/出库操作服务费', status: 'active' },
    { id: 'RULE-005', name: '包材费', type: 'material', unit: '单', price: 2, minArea: 1, description: '标准包装材料费', status: 'active' },
    { id: 'RULE-006', name: '盘点费', type: 'stocktake', unit: '次', price: 50, minArea: 1, description: '全量/增量盘点服务费', status: 'active' },
];

const platformLabels: Record<string, { label: string; color: string }> = {
    taobao: { label: '淘宝', color: '#FF5000' },
    douyin: { label: '抖音', color: '#1677FF' },
    pdd: { label: '拼多多', color: '#E74C3C' },
    '1688': { label: '1688', color: '#FF6A00' },
    jd: { label: '京东', color: '#E2231A' },
};

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
    pending: { label: '待审核', bg: 'bg-yellow-100', color: 'text-yellow-700' },
    approved: { label: '已通过', bg: 'bg-green-100', color: 'text-green-700' },
    rejected: { label: '已拒绝', bg: 'bg-red-100', color: 'text-red-700' },
    active: { label: '合作中', bg: 'bg-green-100', color: 'text-green-700' },
    expiring: { label: '即将到期', bg: 'bg-orange-100', color: 'text-orange-700' },
    inactive: { label: '已停用', bg: 'bg-gray-100', color: 'text-gray-700' },
};

export default function MerchantPage() {
    const [activeTab, setActiveTab] = useState('selection');
    const [selectionFilter, setSelectionFilter] = useState('all');
    const [merchantFilter, setMerchantFilter] = useState('all');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [addType, setAddType] = useState<'selection' | 'merchant'>('selection');
    const [showQRDialog, setShowQRDialog] = useState(false);
    const [qrType, setQrType] = useState<'merchant' | 'product'>('merchant');
    const { toast } = useToast();

    // 新增选品表单
    const [newSelection, setNewSelection] = useState({
        name: '', supplier: '', category: '数码配件', platform: 'taobao', cost: '', price: '', applicant: ''
    });

    // 新增入驻表单
    const [newMerchant, setNewMerchant] = useState({
        name: '', contact: '', phone: '', type: '继仓模式', category: '数码配件', cycle: '月结'
    });

    // 模拟已提交的申请数据
    const [pendingApplications, setPendingApplications] = useState([
        { id: 'APP-001', name: '深圳新奇贸易', type: '供应商入驻', contact: '赵总', phone: '13900139001', date: '2026-03-24', status: 'pending' },
        { id: 'APP-002', name: '无线蓝牙耳机', type: '商品申报', contact: '钱经理', phone: '13900139002', date: '2026-03-24', status: 'pending' },
    ]);

    const [productApplications, setProductApplications] = useState([
        { id: 'PRD-001', name: '智能手表T1', brand: '科技穿戴', category: '数码配件', cost: 180, price: 299, platform: 'taobao', status: 'pending', date: '2026-03-24' },
        { id: 'PRD-002', name: '颈椎按摩仪', brand: '健康生活', category: '运动健康', cost: 120, price: 268, platform: 'douyin', status: 'pending', date: '2026-03-23' },
    ]);

    // 模拟从URL参数获取提交的数据
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const submitted = urlParams.get('submitted');
        if (submitted === 'merchant') {
            const appData = {
                id: `APP-${Date.now()}`,
                name: urlParams.get('companyName') || '新申请供应商',
                type: '供应商入驻',
                contact: urlParams.get('contactPerson') || '未知',
                phone: urlParams.get('contactPhone') || '未知',
                date: new Date().toISOString().split('T')[0],
                status: 'pending'
            };
            setPendingApplications(prev => [appData, ...prev]);
            toast({ title: '新入驻申请', description: `供应商 ${appData.name} 已提交，待审核` });
            window.history.replaceState({}, '', '/merchant');
        } else if (submitted === 'product') {
            const prodData = {
                id: `PRD-${Date.now()}`,
                name: urlParams.get('productName') || '新申报商品',
                brand: urlParams.get('brand') || '-',
                category: urlParams.get('category') || '-',
                cost: parseFloat(urlParams.get('costPrice') || '0'),
                price: parseFloat(urlParams.get('salePrice') || '0'),
                platform: urlParams.get('platform')?.toLowerCase() || 'other',
                status: 'pending',
                date: new Date().toISOString().split('T')[0]
            };
            setProductApplications(prev => [prodData, ...prev]);
            toast({ title: '新商品申报', description: `商品 ${prodData.name} 已提交，待审核` });
            window.history.replaceState({}, '', '/merchant');
        }
    }, [toast]);

    const getBaseUrl = () => {
        return window.location.origin;
    };

    const merchantApplyUrl = `${getBaseUrl()}/merchant-apply`;
    const productApplyUrl = `${getBaseUrl()}/product-apply`;

    const handleApproveProduct = (id: string) => {
        setProductApplications(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
        toast({ title: '商品审核通过', description: `商品已成功发布至选品池` });
    };

    const handleApproveApplication = (id: string) => {
        setPendingApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
        toast({ title: '审核通过', description: '申请已批准' });
    };

    const handleAddSelection = (e: React.FormEvent) => {
        e.preventDefault();
        const cost = parseFloat(newSelection.cost) || 0;
        const price = parseFloat(newSelection.price) || 0;
        const margin = cost > 0 ? Math.round((price - cost) / price * 100) : 0;
        const newItem = {
            id: `SEL-${String(Date.now()).slice(-6)}`,
            name: newSelection.name,
            supplier: newSelection.supplier,
            category: newSelection.category,
            platform: newSelection.platform,
            cost,
            price,
            margin,
            status: 'pending',
            date: '今日',
            applicant: newSelection.applicant || '系统录入'
        };
        // @ts-ignore
        mockSelectionItems.unshift(newItem);
        toast({ title: '选品已添加', description: `商品 "${newSelection.name}" 已添加到待审核列表` });
        setNewSelection({ name: '', supplier: '', category: '数码配件', platform: 'taobao', cost: '', price: '', applicant: '' });
        setShowAddDialog(false);
    };

    const handleAddMerchant = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = {
            id: `MER-${String(Date.now()).slice(-6)}`,
            name: newMerchant.name,
            type: newMerchant.type,
            contact: newMerchant.contact,
            phone: newMerchant.phone,
            category: newMerchant.category,
            cycle: newMerchant.cycle,
            status: 'pending',
            booths: '-',
            applyDate: new Date().toISOString().split('T')[0],
            totalOrders: 0
        };
        // @ts-ignore
        mockMerchants.unshift(newItem);
        toast({ title: '入驻申请已添加', description: `供应商 "${newMerchant.name}" 已添加到待审核列表` });
        setNewMerchant({ name: '', contact: '', phone: '', type: '继仓模式', category: '数码配件', cycle: '月结' });
        setShowAddDialog(false);
    };

    const QRDialog = ({ type, open, onClose }: { type: 'merchant' | 'product', open: boolean, onClose: () => void }) => {
        const url = type === 'merchant' ? merchantApplyUrl : productApplyUrl;
        const title = type === 'merchant' ? '供应商入驻申请' : '商品申报';
        const desc = type === 'merchant' ? '扫码提交供应商入驻申请' : '扫码提交商品申报';

        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {type === 'merchant' ? <Building size={20} /> : <Package size={20} />}
                            {title} - 二维码分享
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center py-6">
                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-4">
                            <QRCodeSVG
                                value={url}
                                size={180}
                                level="H"
                                includeMargin={true}
                                bgColor="#ffffff"
                                fgColor="#2563eb"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground text-center mb-2">{desc}</p>
                        <p className="text-xs text-gray-400 font-mono break-all text-center px-4">{url}</p>
                        <div className="flex gap-2 mt-4">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition"
                            >
                                <ExternalLink size={14} />在新窗口打开
                            </a>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(url);
                                    toast({ title: '链接已复制', description: '申请链接已复制到剪贴板' });
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition"
                            >
                                <Link size={14} />复制链接
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    // 新增选品/入驻对话框
    const AddDialog = ({ open, onClose, type }: { open: boolean, onClose: () => void, type: 'selection' | 'merchant' }) => {
        if (type === 'selection') {
            return (
                <Dialog open={open} onOpenChange={onClose}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <ShoppingBag size={20} /> 新增选品
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddSelection} className="space-y-4 py-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
                                <input
                                    value={newSelection.name}
                                    onChange={e => setNewSelection({ ...newSelection, name: e.target.value })}
                                    required
                                    placeholder="请输入商品名称"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">供应商</label>
                                    <input
                                        value={newSelection.supplier}
                                        onChange={e => setNewSelection({ ...newSelection, supplier: e.target.value })}
                                        placeholder="请输入供应商名称"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">主营类目</label>
                                    <select
                                        value={newSelection.category}
                                        onChange={e => setNewSelection({ ...newSelection, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">来源平台</label>
                                    <select
                                        value={newSelection.platform}
                                        onChange={e => setNewSelection({ ...newSelection, platform: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                    >
                                        <option value="taobao">淘宝</option>
                                        <option value="douyin">抖音</option>
                                        <option value="pdd">拼多多</option>
                                        <option value="1688">1688</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">申请人</label>
                                    <input
                                        value={newSelection.applicant}
                                        onChange={e => setNewSelection({ ...newSelection, applicant: e.target.value })}
                                        placeholder="请输入申请人"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">成本价 *</label>
                                    <input
                                        value={newSelection.cost}
                                        onChange={e => setNewSelection({ ...newSelection, cost: e.target.value })}
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="请输入成本价"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">销售价 *</label>
                                    <input
                                        value={newSelection.price}
                                        onChange={e => setNewSelection({ ...newSelection, price: e.target.value })}
                                        required
                                        type="number"
                                        step="0.01"
                                        placeholder="请输入销售价"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:opacity-90">确认添加</button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            );
        }

        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Building size={20} /> 新增入驻申请
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddMerchant} className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">企业名称 *</label>
                            <input
                                value={newMerchant.name}
                                onChange={e => setNewMerchant({ ...newMerchant, name: e.target.value })}
                                required
                                placeholder="请输入企业全称"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">联系人 *</label>
                                <input
                                    value={newMerchant.contact}
                                    onChange={e => setNewMerchant({ ...newMerchant, contact: e.target.value })}
                                    required
                                    placeholder="请输入联系人"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 *</label>
                                <input
                                    value={newMerchant.phone}
                                    onChange={e => setNewMerchant({ ...newMerchant, phone: e.target.value })}
                                    required
                                    type="tel"
                                    placeholder="请输入手机号"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">合作模式</label>
                                <select
                                    value={newMerchant.type}
                                    onChange={e => setNewMerchant({ ...newMerchant, type: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                >
                                    <option value="继仓模式">继仓模式</option>
                                    <option value="代贴单模式">代贴单模式</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">结算周期</label>
                                <select
                                    value={newMerchant.cycle}
                                    onChange={e => setNewMerchant({ ...newMerchant, cycle: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                >
                                    <option value="月结">月结</option>
                                    <option value="季结">季结</option>
                                    <option value="预付">预付</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">主营类目</label>
                            <select
                                value={newMerchant.category}
                                onChange={e => setNewMerchant({ ...newMerchant, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg bg-white"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                            <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:opacity-90">确认添加</button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    const filteredSelections = mockSelectionItems.filter(item => {
        if (selectionFilter === 'all') return true;
        return item.status === selectionFilter;
    });

    const filteredMerchants = mockMerchants.filter(m => {
        if (merchantFilter === 'all') return true;
        return m.status === merchantFilter;
    });

    const handleApprove = (id: string) => {
        toast({ title: '审核通过', description: `选品 ${id} 已成功发布至商城选品池！` });
    };

    const handleReject = (id: string) => {
        toast({ title: '已拒绝', description: `选品 ${id} 审核未通过` });
    };

    const handleBatchApprove = () => {
        toast({ title: '批量操作', description: `已通过 ${filteredSelections.filter(i => i.status === 'pending').length} 个选品审核` });
    };

    const handleMerchantApprove = (id: string) => {
        toast({ title: '入驻审核通过', description: '供应商入驻申请已批准' });
    };

    const handleExport = () => {
        toast({ title: '导出数据', description: '正在生成Excel导出文件...' });
    };

    return (
        <div className="space-y-6">
            <div className="wms-page-header">
                <div>
                    <h1 className="wms-page-title">选品与招商中心</h1>
                    <p className="wms-page-subtitle">商品选品池审核发布、供应商入驻管理、计费规则配置</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setQrType('product'); setShowQRDialog(true); }} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                        <QrCode size={16} />商品申报二维码
                    </button>
                    <button onClick={() => { setQrType('merchant'); setShowQRDialog(true); }} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                        <QrCode size={16} />入驻申请二维码
                    </button>
                    <button onClick={() => { setAddType('selection'); setShowAddDialog(true); }} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                        <Plus size={16} />新增选品
                    </button>
                    <button onClick={() => { setAddType('merchant'); setShowAddDialog(true); }} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                        <Users size={16} />新增入驻
                    </button>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">待审核选品</p>
                        <ShoppingBag size={16} className="text-warning" />
                    </div>
                    <p className="text-2xl font-bold">{mockSelectionItems.filter(i => i.status === 'pending').length}</p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">已合作供应商</p>
                        <Users size={16} className="text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{mockMerchants.filter(m => m.status === 'active').length}</p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">本月入驻</p>
                        <Building size={16} className="text-success" />
                    </div>
                    <p className="text-2xl font-bold">{mockMerchants.filter(m => m.status === 'pending').length}</p>
                </div>
                <div className="bg-card rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">平均毛利率</p>
                        <TrendingUp size={16} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-bold">44.2%</p>
                </div>
            </div>

            {/* Tab切换 */}
            <div className="flex gap-4 border-b">
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'selection' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('selection')}
                >
                    选品池管理
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'merchant' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('merchant')}
                >
                    招商入驻
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'applications' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('applications')}
                >
                    申请审核
                    {(pendingApplications.filter(a => a.status === 'pending').length + productApplications.filter(p => p.status === 'pending').length) > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                            {pendingApplications.filter(a => a.status === 'pending').length + productApplications.filter(p => p.status === 'pending').length}
                        </span>
                    )}
                </button>
                <button
                    className={`pb-3 px-1 text-sm font-medium ${activeTab === 'billing' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('billing')}
                >
                    计费规则
                </button>
            </div>

            {/* 选品池管理 */}
            {activeTab === 'selection' && (
                <div className="space-y-4">
                    {/* 筛选栏 */}
                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="relative flex-1 max-w-sm">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input placeholder="搜索商品名称、供应商..." className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-sm outline-none" />
                            </div>
                            <select value={selectionFilter} onChange={e => setSelectionFilter(e.target.value)} className="px-3 py-2 rounded-md bg-muted text-sm">
                                <option value="all">全部状态</option>
                                <option value="pending">待审核</option>
                                <option value="approved">已通过</option>
                                <option value="rejected">已拒绝</option>
                            </select>
                            <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                                <Filter size={14} />更多筛选
                            </button>
                            <div className="flex-1"></div>
                            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                                <Download size={14} />导出
                            </button>
                            {selectionFilter === 'pending' && (
                                <button onClick={handleBatchApprove} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                                    <Check size={14} />批量通过
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 选品列表 */}
                    <div className="bg-card border rounded-lg overflow-hidden">
                        <table className="wms-data-table">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium text-muted-foreground">商品信息</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">来源平台</th>
                                    <th className="text-right p-3 font-medium text-muted-foreground">成本</th>
                                    <th className="text-right p-3 font-medium text-muted-foreground">售价</th>
                                    <th className="text-right p-3 font-medium text-muted-foreground">毛利率</th>
                                    <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">申请时间</th>
                                    <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSelections.map((item) => {
                                    const platform = platformLabels[item.platform];
                                    return (
                                        <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-lg">📦</div>
                                                    <div>
                                                        <p className="font-medium text-sm">{item.name}</p>
                                                        <p className="text-xs text-muted-foreground">{item.supplier} · {item.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: `${platform.color}15`, color: platform.color }}>
                                                    {platform.label}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-mono">¥{item.cost}</td>
                                            <td className="p-3 text-right font-mono">¥{item.price}</td>
                                            <td className="p-3 text-right">
                                                <span className={`font-bold ${item.margin > 40 ? 'text-success' : item.margin > 25 ? 'text-warning' : 'text-destructive'}`}>
                                                    {item.margin}%
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 rounded text-xs ${statusLabels[item.status].bg} ${statusLabels[item.status].color}`}>
                                                    {statusLabels[item.status].label}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-muted-foreground">{item.date}</td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button className="p-1.5 rounded hover:bg-muted" title="查看详情"><Eye size={14} className="text-muted-foreground" /></button>
                                                    {item.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleReject(item.id)} className="p-1.5 rounded hover:bg-red-50" title="拒绝"><XCircle size={14} className="text-destructive" /></button>
                                                            <button onClick={() => handleApprove(item.id)} className="p-1.5 rounded hover:bg-green-50" title="通过"><CheckCircle size={14} className="text-success" /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 招商入驻 */}
            {activeTab === 'merchant' && (
                <div className="space-y-4">
                    {/* 筛选栏 */}
                    <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <select value={merchantFilter} onChange={e => setMerchantFilter(e.target.value)} className="px-3 py-2 rounded-md bg-muted text-sm">
                                <option value="all">全部状态</option>
                                <option value="active">合作中</option>
                                <option value="pending">待审核</option>
                                <option value="expiring">即将到期</option>
                                <option value="inactive">已停用</option>
                            </select>
                            <div className="flex-1"></div>
                            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
                                <Download size={14} />导出
                            </button>
                        </div>
                    </div>

                    {/* 入驻列表 */}
                    <div className="bg-card border rounded-lg overflow-hidden">
                        <table className="wms-data-table">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-left p-3 font-medium text-muted-foreground">供应商信息</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">合作模式</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">主营类目</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">结算周期</th>
                                    <th className="text-left p-3 font-medium text-muted-foreground">占用展位</th>
                                    <th className="text-right p-3 font-medium text-muted-foreground">累计订单</th>
                                    <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                                    <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMerchants.map((merchant) => (
                                    <tr key={merchant.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-3">
                                            <div>
                                                <p className="font-medium text-sm">{merchant.name}</p>
                                                <p className="text-xs text-muted-foreground">{merchant.contact} · {merchant.phone}</p>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{merchant.type}</span>
                                        </td>
                                        <td className="p-3 text-sm">{merchant.category}</td>
                                        <td className="p-3 text-sm">{merchant.cycle}</td>
                                        <td className="p-3 font-mono text-sm">{merchant.booths}</td>
                                        <td className="p-3 text-right font-medium">{merchant.totalOrders}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs ${statusLabels[merchant.status].bg} ${statusLabels[merchant.status].color}`}>
                                                {statusLabels[merchant.status].label}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="p-1.5 rounded hover:bg-muted" title="查看详情"><Eye size={14} className="text-muted-foreground" /></button>
                                                <button className="p-1.5 rounded hover:bg-muted" title="编辑"><Edit size={14} className="text-muted-foreground" /></button>
                                                {merchant.status === 'pending' && (
                                                    <button onClick={() => handleMerchantApprove(merchant.id)} className="p-1.5 rounded hover:bg-green-50" title="审核通过"><CheckCircle size={14} className="text-success" /></button>
                                                )}
                                                <button className="p-1.5 rounded hover:bg-muted" title="合同"><FileText size={14} className="text-muted-foreground" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 入驻流程说明 */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                            <AlertCircle size={16} /> 入驻流程说明
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <div>
                                    <p className="font-medium">提交申请</p>
                                    <p className="text-muted-foreground text-xs">填写供应商基本信息及资质证明</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <div>
                                    <p className="font-medium">资质审核</p>
                                    <p className="text-muted-foreground text-xs">平台对营业执照、资质证明进行审核</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <div>
                                    <p className="font-medium">签订合同</p>
                                    <p className="text-muted-foreground text-xs">确认合作模式、结算周期、展位分配</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">4</div>
                                <div>
                                    <p className="font-medium">正式入驻</p>
                                    <p className="text-muted-foreground text-xs">开通账户、分配展位、开始运营</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 申请审核 */}
            {activeTab === 'applications' && (
                <div className="space-y-6">
                    {/* 供应商入驻申请 */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Building size={18} /> 供应商入驻申请
                        </h3>
                        <div className="bg-card border rounded-lg overflow-hidden">
                            <table className="wms-data-table">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-3 font-medium text-muted-foreground">申请单位</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">类型</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">联系人</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">联系电话</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">申请日期</th>
                                        <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                                        <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">暂无待审核申请</td>
                                        </tr>
                                    ) : (
                                        pendingApplications.map(app => (
                                            <tr key={app.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-3">
                                                    <p className="font-medium text-sm">{app.name}</p>
                                                </td>
                                                <td className="p-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{app.type}</span>
                                                </td>
                                                <td className="p-3 text-sm">{app.contact}</td>
                                                <td className="p-3 text-sm font-mono">{app.phone}</td>
                                                <td className="p-3 text-sm text-muted-foreground">{app.date}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {app.status === 'pending' ? '待审核' : '已通过'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1.5 rounded hover:bg-muted" title="查看详情"><Eye size={14} className="text-muted-foreground" /></button>
                                                        {app.status === 'pending' && (
                                                            <button onClick={() => handleApproveApplication(app.id)} className="p-1.5 rounded hover:bg-green-50" title="审核通过"><CheckCircle size={14} className="text-success" /></button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 商品申报审核 */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Package size={18} /> 商品申报审核
                        </h3>
                        <div className="bg-card border rounded-lg overflow-hidden">
                            <table className="wms-data-table">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-3 font-medium text-muted-foreground">商品信息</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">品牌</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">类目</th>
                                        <th className="text-right p-3 font-medium text-muted-foreground">成本价</th>
                                        <th className="text-right p-3 font-medium text-muted-foreground">销售价</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">来源</th>
                                        <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                                        <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="p-8 text-center text-muted-foreground">暂无待审核商品</td>
                                        </tr>
                                    ) : (
                                        productApplications.map(prod => (
                                            <tr key={prod.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-lg">📦</div>
                                                        <p className="font-medium text-sm">{prod.name}</p>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm">{prod.brand}</td>
                                                <td className="p-3 text-sm">{prod.category}</td>
                                                <td className="p-3 text-right font-mono">¥{prod.cost}</td>
                                                <td className="p-3 text-right font-mono">¥{prod.price}</td>
                                                <td className="p-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{platformLabels[prod.platform]?.label || prod.platform}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${prod.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {prod.status === 'pending' ? '待审核' : '已通过'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1.5 rounded hover:bg-muted" title="查看详情"><Eye size={14} className="text-muted-foreground" /></button>
                                                        {prod.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => handleApproveProduct(prod.id)} className="p-1.5 rounded hover:bg-green-50" title="通过"><CheckCircle size={14} className="text-success" /></button>
                                                                <button className="p-1.5 rounded hover:bg-red-50" title="拒绝"><XCircle size={14} className="text-destructive" /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 申报说明 */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <h4 className="font-medium text-primary mb-3 flex items-center gap-2">
                            <AlertCircle size={16} /> 申报审核说明
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                <div>
                                    <p className="font-medium">扫码提交</p>
                                    <p className="text-muted-foreground text-xs">供应商/商品可扫描二维码提交入驻/申报申请</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                <div>
                                    <p className="font-medium">自动通知</p>
                                    <p className="text-muted-foreground text-xs">提交后系统自动通知管理员进行审核</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                <div>
                                    <p className="font-medium">审核流程</p>
                                    <p className="text-muted-foreground text-xs">管理员在"申请审核"tab中进行资质审核</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">4</div>
                                <div>
                                    <p className="font-medium">结果通知</p>
                                    <p className="text-muted-foreground text-xs">审核结果通过短信/邮件通知申请人</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 计费规则 */}
            {activeTab === 'billing' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">计费规则配置</h3>
                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
                            <Plus size={14} />新增规则
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockBillingRules.map((rule) => (
                            <div key={rule.id} className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${rule.type === 'exhibition' ? 'bg-purple-100 text-purple-600' : rule.type === 'temporary' ? 'bg-orange-100 text-orange-600' : rule.type === 'shelf' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                            <DollarSign size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{rule.name}</p>
                                            <p className="text-xs text-muted-foreground">{rule.unit}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {rule.status === 'active' ? '生效中' : '已停用'}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <span className="text-2xl font-bold text-primary">¥{rule.price}</span>
                                    <span className="text-sm text-muted-foreground ml-1">/{rule.unit}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{rule.description}</p>
                                <div className="flex items-center justify-between pt-3 border-t">
                                    <span className="text-xs text-muted-foreground">最低起订: {rule.minArea} {rule.unit.includes('㎡') ? '㎡' : rule.unit.includes('件') ? '件' : rule.unit.includes('个') ? '个' : '单'}</span>
                                    <div className="flex gap-1">
                                        <button className="p-1 rounded hover:bg-muted"><Edit size={12} className="text-muted-foreground" /></button>
                                        <button className="p-1 rounded hover:bg-muted"><RefreshCw size={12} className="text-muted-foreground" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 计费说明 */}
                    <div className="bg-muted/50 border rounded-lg p-5">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Percent size={16} className="text-primary" /> 计费说明
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-muted-foreground mb-1">展位租金</p>
                                <p className="text-xs">按展位面积 × 单价 × 租赁时长计算，支持月结、季结、年结多种结算方式</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground mb-1">操作费用</p>
                                <p className="text-xs">入库/出库按件计费，盘点按次计费，包材按单计费</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground mb-1">结算周期</p>
                                <p className="text-xs">系统每月自动生成账单，支持在线支付和对公转账</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground mb-1">优惠政策</p>
                                <p className="text-xs">年付享9折，季付享95折，长期合作供应商可申请专属折扣</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <QRDialog type={qrType} open={showQRDialog} onClose={() => setShowQRDialog(false)} />
            <AddDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} type={addType} />
        </div>
    );
}
