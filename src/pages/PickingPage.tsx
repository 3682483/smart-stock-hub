import { skuAggregations, salesOrders } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { CheckCircle, MapPin, Package } from 'lucide-react';

export default function PickingPage() {
  const pendingOrders = salesOrders.filter(o => o.status === 'pending' || o.status === 'picking');

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">SKU聚合拣货</h1>
          <p className="wms-page-subtitle">按SKU维度聚合，一趟拿完所有需求</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
          生成拣货波次
        </button>
      </div>

      {/* Aggregation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {skuAggregations.map(agg => (
          <div key={agg.sku} className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{agg.sku}</p>
                <p className="font-semibold mt-0.5">{agg.name}</p>
              </div>
              <StatusBadge status={agg.priority} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold text-primary">{agg.totalQty}</p>
                <p className="text-[10px] text-muted-foreground">需拣数量</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold">{agg.orderCount}</p>
                <p className="text-[10px] text-muted-foreground">关联订单</p>
              </div>
              <div className="p-2 rounded-md bg-muted/50">
                <p className="text-lg font-bold text-success">{agg.availableStock}</p>
                <p className="text-[10px] text-muted-foreground">可用库存</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex items-center gap-1.5 text-sm">
                <MapPin size={14} className="text-primary" />
                <span className="font-mono font-bold">{agg.location}</span>
              </div>
              <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                <CheckCircle size={12} />确认拣完
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Picking route hint */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Package size={16} className="text-primary" />
          推荐拣货路线
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {skuAggregations
            .sort((a, b) => a.location.localeCompare(b.location))
            .map((agg, i) => (
              <div key={agg.sku} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-md bg-primary/10 border border-primary/20">
                  <p className="font-mono font-bold text-sm text-primary">{agg.location}</p>
                  <p className="text-[10px] text-muted-foreground">{agg.name} ×{agg.totalQty}</p>
                </div>
                {i < skuAggregations.length - 1 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
