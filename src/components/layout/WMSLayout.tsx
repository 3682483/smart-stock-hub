import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Package, MapPin, Users, Building2, LayoutDashboard,
  ShoppingCart, Truck, ClipboardList, BarChart3, Archive,
  ArrowDownToLine, ArrowUpFromLine, ScanLine, AlertTriangle,
  ChevronDown, ChevronRight, Menu, X, Bell, Search, DollarSign
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  { label: '运营看板', icon: <LayoutDashboard size={18} />, path: '/' },
  {
    label: '基础信息', icon: <Archive size={18} />,
    children: [
      { label: '商品/SKU管理', path: '/products' },
      { label: '库位/货架管理', path: '/locations' },
      { label: '供应商管理', path: '/suppliers' },
    ]
  },
  { label: '选品与招商', icon: <Users size={18} />, path: '/merchant' },
  {
    label: '采购入库', icon: <ArrowDownToLine size={18} />,
    children: [
      { label: '采购单管理', path: '/purchase-orders' },
      { label: '入库作业', path: '/inbound' },
    ]
  },
  {
    label: '销售出库', icon: <ArrowUpFromLine size={18} />,
    children: [
      { label: '订单管理', path: '/sales-orders' },
      { label: 'SKU聚合拣货', path: '/picking' },
      { label: '打包发货', path: '/packing' },
    ]
  },
  {
    label: '库内管理', icon: <MapPin size={18} />,
    children: [
      { label: '库存监控', path: '/inventory' },
      { label: '移库/补货', path: '/transfer' },
      { label: '盘点管理', path: '/stocktaking' },
    ]
  },
  {
    label: '拦截与退货', icon: <ScanLine size={18} />,
    children: [
      { label: '出库拦截', path: '/intercept' },
      { label: '退货处理', path: '/returns' },
    ]
  },
  { label: '预警中心', icon: <AlertTriangle size={18} />, path: '/alerts' },
  { label: '财务结算', icon: <DollarSign size={18} />, path: '/finance' },
];

export default function WMSLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['基础信息', '采购入库', '销售出库', '库内管理']);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 overflow-hidden"
        style={{
          width: collapsed ? 0 : 240,
          background: 'hsl(var(--sidebar-bg))',
          borderRight: '1px solid hsl(var(--sidebar-border))',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-14 shrink-0" style={{ borderBottom: '1px solid hsl(var(--sidebar-border))' }}>
          <Package size={22} className="text-primary" />
          <span className="font-bold text-base" style={{ color: 'hsl(var(--sidebar-active-fg))' }}>
            WMS+SCM
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className="wms-sidebar-item w-full justify-between"
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {expandedGroups.includes(item.label) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {expandedGroups.includes(item.label) && (
                    <div className="ml-4 border-l pl-2" style={{ borderColor: 'hsl(var(--sidebar-border))' }}>
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={`wms-sidebar-item w-full text-left ${isActive(child.path) ? 'active' : ''}`}
                        >
                          <span className="text-sm">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate(item.path!)}
                  className={`wms-sidebar-item w-full ${isActive(item.path!) ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 text-xs shrink-0" style={{ color: 'hsl(var(--sidebar-section))', borderTop: '1px solid hsl(var(--sidebar-border))' }}>
          全功能专业仓储与供应链管理系统 v1.0
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-card border-b">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索商品、订单、库位..."
                className="pl-9 pr-4 py-1.5 rounded-md bg-muted text-sm w-64 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              管
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
