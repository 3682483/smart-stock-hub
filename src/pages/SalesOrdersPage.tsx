import { salesOrders } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

const platformLabels: Record<string, { label: string; color: string }> = {
  taobao: { label: '淘宝', color: 'hsl(15, 85%, 55%)' },
  douyin: { label: '抖音', color: 'hsl(220, 80%, 50%)' },
  pdd: { label: '拼多多', color: 'hsl(350, 80%, 55%)' },
  member: { label: '会员商城', color: 'hsl(152, 60%, 40%)' },
};

export default function SalesOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const filtered = statusFilter === 'all' ? salesOrders : salesOrders.filter(o => o.status === statusFilter);

  const statusCounts = salesOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">订单管理</h1>
          <p className="wms-page-subtitle">多平台订单统一处理</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: '全部', count: salesOrders.length },
          { key: 'pending', label: '待处理', count: statusCounts.pending || 0 },
          { key: 'picking', label: '拣货中', count: statusCounts.picking || 0 },
          { key: 'packed', label: '已打包', count: statusCounts.packed || 0 },
          { key: 'shipped', label: '已发货', count: statusCounts.shipped || 0 },
          { key: 'cancelled', label: '已取消', count: statusCounts.cancelled || 0 },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm border transition ${statusFilter === tab.key ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
          >
            {tab.label} <span className="ml-1 opacity-70">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">订单号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">平台</th>
                <th className="text-left p-3 font-medium text-muted-foreground">商品</th>
                <th className="text-right p-3 font-medium text-muted-foreground">金额</th>
                <th className="text-left p-3 font-medium text-muted-foreground">买家</th>
                <th className="text-left p-3 font-medium text-muted-foreground">下单时间</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const platform = platformLabels[o.platform];
                return (
                  <tr key={o.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="p-3 font-mono text-xs">{o.orderNo}</td>
                    <td className="p-3">
                      <span className="wms-badge" style={{ background: `${platform.color}15`, color: platform.color }}>
                        {platform.label}
                      </span>
                    </td>
                    <td className="p-3">
                      {o.items.map((item, i) => (
                        <div key={i} className="text-sm">{item.name} × {item.qty}</div>
                      ))}
                    </td>
                    <td className="p-3 text-right font-mono font-medium">¥{o.totalAmount}</td>
                    <td className="p-3 text-sm">{o.buyer}</td>
                    <td className="p-3 text-sm text-muted-foreground">{o.createdAt}</td>
                    <td className="p-3 text-center"><StatusBadge status={o.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
