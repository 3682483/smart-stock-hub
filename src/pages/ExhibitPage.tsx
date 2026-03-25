import { useState } from 'react';
import { Store, Package, Users, DollarSign, Calendar, MapPin, AlertCircle, CheckCircle, Clock, TrendingUp, Plus, Search, MoreVertical, Eye, Edit, Trash2, FileText, Building2, X } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

// 展位数据
const booths = [
  { id: 'B001', code: 'EX-A-01', name: '数码精品馆', zone: 'A区1楼', type: 'standard', size: '20㎡', price: 2800, status: 'rented', tenant: '深圳优品科技', tenantId: 'T001', contractNo: 'CT-2025-001', expireDate: '2026-03-15', area: 20 },
  { id: 'B002', code: 'EX-A-02', name: '智能生活馆', zone: 'A区1楼', type: 'standard', size: '15㎡', price: 2200, status: 'rented', tenant: '义乌壳王贸易', tenantId: 'T002', contractNo: 'CT-2025-002', expireDate: '2026-06-20', area: 15 },
  { id: 'B003', code: 'EX-A-03', name: '运动户外馆', zone: 'A区2楼', type: 'standard', size: '25㎡', price: 3200, status: 'available', tenant: null, tenantId: null, contractNo: null, expireDate: null, area: 25 },
  { id: 'B004', code: 'EX-B-01', name: '美妆护肤馆', zone: 'B区1楼', type: 'premium', size: '30㎡', price: 4500, status: 'rented', tenant: '广州力健运动', tenantId: 'T003', contractNo: 'CT-2025-003', expireDate: '2025-12-31', area: 30 },
  { id: 'B005', code: 'EX-B-02', name: '家居生活馆', zone: 'B区1楼', type: 'standard', size: '18㎡', price: 2400, status: 'expiring', tenant: '浙江美家工贸', tenantId: 'T004', contractNo: 'CT-2024-088', expireDate: '2025-04-01', area: 18 },
  { id: 'B006', code: 'EX-B-03', name: '汽车用品馆', zone: 'B区2楼', type: 'standard', size: '22㎡', price: 3000, status: 'available', tenant: null, tenantId: null, contractNo: null, expireDate: null, area: 22 },
  { id: 'B007', code: 'EX-C-01', name: '临展特卖区', zone: 'C区1楼', type: 'temporary', size: '10㎡', price: 800, status: 'reserved', tenant: '佛山星光照明', tenantId: 'T005', contractNo: 'CT-2025-TEMP-001', expireDate: '2025-04-15', area: 10 },
];

// 租户数据
const tenants = [
  { id: 'T001', name: '深圳优品科技', contact: '张经理', phone: '13800001111', category: '数码配件', booths: 2, totalArea: 35, monthlyRent: 5000, settleType: '月结', status: 'active' },
  { id: 'T002', name: '义乌壳王贸易', contact: '李总', phone: '13800002222', category: '综合', booths: 1, totalArea: 15, monthlyRent: 2200, settleType: '季结', status: 'active' },
  { id: 'T003', name: '广州力健运动', contact: '王经理', phone: '13800003333', category: '运动健康', booths: 1, totalArea: 30, monthlyRent: 4500, settleType: '月结', status: 'active' },
  { id: 'T004', name: '浙江美家工贸', contact: '陈总', phone: '13800004444', category: '家居百货', booths: 1, totalArea: 18, monthlyRent: 2400, settleType: '预付', status: 'expiring' },
  { id: 'T005', name: '佛山星光照明', contact: '刘经理', phone: '13800005555', category: '灯具照明', booths: 1, totalArea: 10, monthlyRent: 800, settleType: '日结', status: 'temporary' },
];

// 账单数据
const bills = [
  { id: 'BILL001', tenant: '深圳优品科技', booth: 'EX-A-01', period: '2025-03', rent: 2800, service: 200, utility: 150, total: 3150, status: 'paid', paidAt: '2025-03-05' },
  { id: 'BILL002', tenant: '深圳优品科技', booth: 'EX-A-02', period: '2025-03', rent: 2200, service: 150, utility: 100, total: 2450, status: 'paid', paidAt: '2025-03-05' },
  { id: 'BILL003', tenant: '义乌壳王贸易', booth: 'EX-A-03', period: '2025-03', rent: 2200, service: 150, utility: 120, total: 2470, status: 'unpaid' },
  { id: 'BILL004', tenant: '广州力健运动', booth: 'EX-B-01', period: '2025-03', rent: 4500, service: 300, utility: 200, total: 5000, status: 'unpaid' },
  { id: 'BILL005', tenant: '浙江美家工贸', booth: 'EX-B-02', period: '2025-03', rent: 2400, service: 180, utility: 100, total: 2680, status: 'overdue' },
];

export default function ExhibitPage() {
  const [activeTab, setActiveTab] = useState<'booths' | 'tenants' | 'bills' | 'contracts'>('booths');
  const [searchValue, setSearchValue] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const [showBoothModal, setShowBoothModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string, item: any) => {
    toast({ title: action, description: `${item.name || item.code} - ${action}操作已执行` });
  };

  const handleSubmitContract = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: '合同签订成功', description: '新合同已成功创建' });
    setShowContractModal(false);
  };

  const handleSubmitBooth = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: '展位创建成功', description: '新展位已成功添加' });
    setShowBoothModal(false);
  };

  const handleSubmitLocation = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: '库位创建成功', description: '新库位已成功添加' });
    setShowLocationModal(false);
  };

  // 统计数据
  const stats = {
    totalBooths: booths.length,
    rentedBooths: booths.filter(b => b.status === 'rented' || b.status === 'expiring').length,
    availableBooths: booths.filter(b => b.status === 'available').length,
    totalTenants: tenants.length,
    monthlyRent: tenants.reduce((sum, t) => sum + t.monthlyRent, 0),
    pendingBills: bills.filter(b => b.status === 'unpaid' || b.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">展位/库位租赁管理</h1>
          <p className="wms-page-subtitle">招商赋能 · 展位库位一体化租赁 · 费用结算</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBoothModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <Plus size={16} /> 新增展位
          </button>
          <button onClick={() => setShowLocationModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md border hover:bg-muted transition">
            <MapPin size={16} /> 新增库位
          </button>
          <button onClick={() => setShowContractModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition">
            <FileText size={16} /> 新签合同
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Store size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalBooths}</p>
              <p className="text-xs text-muted-foreground">展位总数</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/10">
              <CheckCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rentedBooths}</p>
              <p className="text-xs text-muted-foreground">已租展位</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-warning/10">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.availableBooths}</p>
              <p className="text-xs text-muted-foreground">可租展位</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-500/10">
              <Users size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalTenants}</p>
              <p className="text-xs text-muted-foreground">入驻商家</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-500/10">
              <DollarSign size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">¥{(stats.monthlyRent).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">月租金(元)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2 border-b pb-3">
        {[
          { key: 'booths', label: '展位管理', icon: <MapPin size={16} /> },
          { key: 'tenants', label: '租户管理', icon: <Building2 size={16} /> },
          { key: 'contracts', label: '合同管理', icon: <FileText size={16} /> },
          { key: 'bills', label: '账单结算', icon: <DollarSign size={16} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索展位/租户/合同号..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select className="px-3 py-2 rounded-md bg-muted text-sm outline-none">
          <option>全部区域</option>
          <option>A区1楼</option>
          <option>A区2楼</option>
          <option>B区1楼</option>
          <option>B区2楼</option>
          <option>C区1楼</option>
        </select>
        <select className="px-3 py-2 rounded-md bg-muted text-sm outline-none">
          <option>全部状态</option>
          <option>已出租</option>
          <option>空置中</option>
          <option>即将到期</option>
          <option>已预约</option>
        </select>
      </div>

      {/* 展位管理 */}
      {activeTab === 'booths' && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="wms-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">展位编号</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">展位名称</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">区域位置</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">面积</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">月租金</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">当前租户</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">到期时间</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {booths.map(booth => (
                  <tr key={booth.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono font-medium">{booth.code}</td>
                    <td className="p-3 font-medium">{booth.name}</td>
                    <td className="p-3 text-sm text-muted-foreground">{booth.zone}</td>
                    <td className="p-3 text-sm">{booth.size}</td>
                    <td className="p-3 text-right font-mono">¥{booth.price}</td>
                    <td className="p-3 text-sm">{booth.tenant || '-'}</td>
                    <td className="p-3 text-sm font-mono">{booth.expireDate || '-'}</td>
                    <td className="p-3 text-center">
                      {booth.status === 'rented' && <span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">已出租</span>}
                      {booth.status === 'available' && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">可租</span>}
                      {booth.status === 'expiring' && <span className="px-2 py-0.5 rounded-full text-xs bg-warning/10 text-warning">即将到期</span>}
                      {booth.status === 'reserved' && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">已预约</span>}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleAction('查看详情', booth)} className="p-1.5 rounded hover:bg-muted">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                        <button onClick={() => handleAction('编辑', booth)} className="p-1.5 rounded hover:bg-muted">
                          <Edit size={16} className="text-muted-foreground" />
                        </button>
                        <button onClick={() => handleAction('删除', booth)} className="p-1.5 rounded hover:bg-muted">
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 租户管理 */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="wms-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">商家名称</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">联系人</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">联系电话</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">经营类目</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">展位数</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">总面积</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">月租金</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">结算方式</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium">{tenant.name}</td>
                    <td className="p-3 text-sm">{tenant.contact}</td>
                    <td className="p-3 text-sm font-mono">{tenant.phone}</td>
                    <td className="p-3 text-sm">{tenant.category}</td>
                    <td className="p-3 text-center">{tenant.booths}个</td>
                    <td className="p-3 text-right">{tenant.totalArea}㎡</td>
                    <td className="p-3 text-right font-mono">¥{tenant.monthlyRent.toLocaleString()}</td>
                    <td className="p-3 text-sm">{tenant.settleType}</td>
                    <td className="p-3 text-center">
                      {tenant.status === 'active' && <span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">正常</span>}
                      {tenant.status === 'expiring' && <span className="px-2 py-0.5 rounded-full text-xs bg-warning/10 text-warning">即将到期</span>}
                      {tenant.status === 'temporary' && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">临时</span>}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleAction('查看详情', tenant)} className="p-1.5 rounded hover:bg-muted">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                        <button onClick={() => handleAction('编辑', tenant)} className="p-1.5 rounded hover:bg-muted">
                          <Edit size={16} className="text-muted-foreground" />
                        </button>
                        <button onClick={() => handleAction('账单', tenant)} className="p-1.5 rounded hover:bg-muted">
                          <DollarSign size={16} className="text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 合同管理 */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="wms-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">合同编号</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">展位</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">租户</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">租期</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">月租金</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">签约日期</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">到期日期</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {booths.filter(b => b.contractNo).map(booth => (
                  <tr key={booth.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-sm">{booth.contractNo}</td>
                    <td className="p-3 text-sm">{booth.code} - {booth.name}</td>
                    <td className="p-3 font-medium">{booth.tenant}</td>
                    <td className="p-3 text-sm">12个月</td>
                    <td className="p-3 text-right font-mono">¥{booth.price}</td>
                    <td className="p-3 text-sm font-mono">2025-03-15</td>
                    <td className="p-3 text-sm font-mono">{booth.expireDate}</td>
                    <td className="p-3 text-center">
                      {booth.status === 'rented' && <span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">生效中</span>}
                      {booth.status === 'expiring' && <span className="px-2 py-0.5 rounded-full text-xs bg-warning/10 text-warning">即将到期</span>}
                      {booth.status === 'reserved' && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">临时</span>}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleAction('查看合同', booth)} className="p-1.5 rounded hover:bg-muted">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                        <button onClick={() => handleAction('续签', booth)} className="p-1.5 rounded hover:bg-muted">
                          <FileText size={16} className="text-primary" />
                        </button>
                        <button onClick={() => handleAction('终止', booth)} className="p-1.5 rounded hover:bg-muted">
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 账单结算 */}
      {activeTab === 'bills' && (
        <div className="space-y-4">
          {/* 账单统计 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">本月应收</p>
              <p className="text-2xl font-bold text-primary">¥15,750</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">已收款</p>
              <p className="text-2xl font-bold text-success">¥5,600</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">待收款</p>
              <p className="text-2xl font-bold text-destructive">¥10,150</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="wms-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">账单编号</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">租户</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">展位</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">账期</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">租金</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">服务费</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">水电费</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">合计</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-sm">{bill.id}</td>
                    <td className="p-3 font-medium">{bill.tenant}</td>
                    <td className="p-3 text-sm">{bill.booth}</td>
                    <td className="p-3 text-sm font-mono">{bill.period}</td>
                    <td className="p-3 text-right font-mono">¥{bill.rent}</td>
                    <td className="p-3 text-right font-mono">¥{bill.service}</td>
                    <td className="p-3 text-right font-mono">¥{bill.utility}</td>
                    <td className="p-3 text-right font-mono font-bold">¥{bill.total}</td>
                    <td className="p-3 text-center">
                      {bill.status === 'paid' && <span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">已付款</span>}
                      {bill.status === 'unpaid' && <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">待付款</span>}
                      {bill.status === 'overdue' && <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">已逾期</span>}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleAction('查看账单', bill)} className="p-1.5 rounded hover:bg-muted">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                        {bill.status !== 'paid' && (
                          <button onClick={() => handleAction('确认收款', bill)} className="p-1.5 rounded hover:bg-muted">
                            <CheckCircle size={16} className="text-success" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 底部说明 */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
          <TrendingUp size={16} /> 招商赋能说明
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">展位即库位</p>
            <p className="text-muted-foreground">展位作为特殊计费库位，支持仓储+展示一体化管理</p>
          </div>
          <div>
            <p className="font-medium">灵活计费</p>
            <p className="text-muted-foreground">按展位面积、租期自动核算租金，支持多种结算周期</p>
          </div>
          <div>
            <p className="font-medium">招商平台</p>
            <p className="text-muted-foreground">支持临时展位、特卖活动等短期租赁场景</p>
          </div>
        </div>
      </div>

      {/* 新签合同模态框 */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowContractModal(false)} />
          <div className="relative bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={20} className="text-primary" /> 新签合同
              </h2>
              <button onClick={() => setShowContractModal(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitContract} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">合同编号</label>
                  <input type="text" defaultValue={`CT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`} className="w-full px-3 py-2 rounded-md border bg-muted font-mono" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">签约日期</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">选择展位/库位</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="">请选择...</option>
                    <option value="EX-A-01">EX-A-01 数码精品馆 (20㎡)</option>
                    <option value="EX-A-02">EX-A-02 智能生活馆 (15㎡)</option>
                    <option value="EX-A-03">EX-A-03 运动户外馆 (25㎡)</option>
                    <option value="EX-B-01">EX-B-01 美妆护肤馆 (30㎡)</option>
                    <option value="EX-B-02">EX-B-02 家居生活馆 (18㎡)</option>
                    <option value="EX-B-03">EX-B-03 汽车用品馆 (22㎡)</option>
                    <option value="EX-C-01">EX-C-01 临展特卖区 (10㎡)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">选择租户</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="">请选择...</option>
                    <option value="T001">深圳优品科技</option>
                    <option value="T002">义乌壳王贸易</option>
                    <option value="T003">广州力健运动</option>
                    <option value="T004">浙江美家工贸</option>
                    <option value="T005">佛山星光照明</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">租期（月）</label>
                  <input type="number" defaultValue="12" min="1" max="60" className="w-full px-3 py-2 rounded-md border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">月租金（元）</label>
                  <input type="number" defaultValue="2800" min="0" className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">租金结算方式</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="月结">月结</option>
                    <option value="季结">季结</option>
                    <option value="半年结">半年结</option>
                    <option value="年结">年结</option>
                    <option value="预付">预付</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">合同生效日期</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">合同到期日期</label>
                <input type="date" className="w-full px-3 py-2 rounded-md border" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">备注</label>
                <textarea rows={3} placeholder="请输入合同备注信息..." className="w-full px-3 py-2 rounded-md border resize-none" />
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">费用明细</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">租金:</span>
                    <span className="font-mono">¥2,800/月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">服务费:</span>
                    <span className="font-mono">¥200/月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">合计:</span>
                    <span className="font-mono font-bold text-primary">¥3,000/月</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowContractModal(false)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">
                  取消
                </button>
                <button type="submit" className="px-6 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                  确认签约
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 新增展位模态框 */}
      {showBoothModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBoothModal(false)} />
          <div className="relative bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Plus size={20} className="text-primary" /> 新增展位
              </h2>
              <button onClick={() => setShowBoothModal(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitBooth} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">展位编号</label>
                  <input type="text" defaultValue={`EX-${new Date().getFullYear()}-${String(Math.random()).slice(2,6)}`} className="w-full px-3 py-2 rounded-md border font-mono" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">展位名称</label>
                  <input type="text" placeholder="如：数码精品馆" className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">所在区域</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="">请选择...</option>
                    <option>A区1楼</option>
                    <option>A区2楼</option>
                    <option>B区1楼</option>
                    <option>B区2楼</option>
                    <option>C区1楼</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">展位类型</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="">请选择...</option>
                    <option value="standard">标准展位</option>
                    <option value="premium">优质展位</option>
                    <option value="temporary">临时展位</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">面积（㎡）</label>
                  <input type="number" placeholder="如：20" min="1" className="w-full px-3 py-2 rounded-md border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">月租金（元）</label>
                  <input type="number" placeholder="如：2800" min="0" className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">备注</label>
                <textarea rows={2} placeholder="请输入备注信息..." className="w-full px-3 py-2 rounded-md border resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowBoothModal(false)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">
                  取消
                </button>
                <button type="submit" className="px-6 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 新增库位模态框 */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLocationModal(false)} />
          <div className="relative bg-card rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MapPin size={20} className="text-primary" /> 新增库位
              </h2>
              <button onClick={() => setShowLocationModal(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitLocation} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">库位编号</label>
                  <input type="text" placeholder="如：A-01-01" className="w-full px-3 py-2 rounded-md border font-mono" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">库位类型</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="">请选择...</option>
                    <option value="normal">普通库位</option>
                    <option value="picking">拣货位</option>
                    <option value="exhibition">展位</option>
                    <option value="temporary">临时库位</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">所属库区</label>
                  <select className="w-full px-3 py-2 rounded-md border" required>
                    <option value="">请选择...</option>
                    <option>存储区A</option>
                    <option>拣货区B</option>
                    <option>展位区C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">容量</label>
                  <input type="number" placeholder="如：200" min="1" className="w-full px-3 py-2 rounded-md border" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">库位用途</label>
                <textarea rows={2} placeholder="请输入库位用途说明..." className="w-full px-3 py-2 rounded-md border resize-none" />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">系统推荐</h4>
                <div className="text-sm text-muted-foreground">
                  <p>推荐库区：存储区A - A-01-04（空闲容量最大）</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowLocationModal(false)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">
                  取消
                </button>
                <button type="submit" className="px-6 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
