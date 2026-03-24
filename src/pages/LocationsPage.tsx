import { locations } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Plus } from 'lucide-react';

const typeLabels: Record<string, string> = { normal: '普通库位', picking: '拣货位', exhibition: '展位' };
const zoneColors: Record<string, string> = { '存储区A': 'hsl(var(--stat-blue))', '拣货区B': 'hsl(var(--stat-green))', '展位区C': 'hsl(var(--stat-purple))' };

export default function LocationsPage() {
  const zones = [...new Set(locations.map(l => l.zone))];

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">库位/货架管理</h1>
          <p className="wms-page-subtitle">仓库布局与库位状态管理</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">
          <Plus size={16} />新增库位
        </button>
      </div>

      {/* Zone summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {zones.map(zone => {
          const zoneLocations = locations.filter(l => l.zone === zone);
          const totalCap = zoneLocations.reduce((s, l) => s + l.capacity, 0);
          const totalUsed = zoneLocations.reduce((s, l) => s + l.used, 0);
          const usage = Math.round(totalUsed / totalCap * 100);
          return (
            <div key={zone} className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} style={{ color: zoneColors[zone] }} />
                <span className="font-semibold">{zone}</span>
                <span className="text-xs text-muted-foreground ml-auto">{zoneLocations.length} 个库位</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${usage}%`, background: zoneColors[zone] }} />
              </div>
              <p className="text-xs text-muted-foreground">使用率 {usage}% · {totalUsed}/{totalCap}</p>
            </div>
          );
        })}
      </div>

      {/* Visual grid */}
      <div className="bg-card rounded-lg border p-5">
        <h3 className="font-semibold mb-4">库位平面图</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {locations.map(loc => (
            <div
              key={loc.id}
              className="aspect-square rounded-md border-2 flex flex-col items-center justify-center text-xs cursor-pointer hover:scale-105 transition-transform"
              style={{
                borderColor: loc.status === 'occupied' ? 'hsl(var(--stat-blue))' : loc.status === 'available' ? 'hsl(var(--stat-green))' : loc.status === 'reserved' ? 'hsl(var(--stat-orange))' : 'hsl(var(--border))',
                background: loc.status === 'occupied' ? 'hsl(var(--stat-blue) / 0.08)' : loc.status === 'available' ? 'hsl(var(--stat-green) / 0.08)' : 'hsl(var(--muted))',
              }}
            >
              <span className="font-mono font-bold text-[10px]">{loc.code}</span>
              <span className="text-[9px] text-muted-foreground">{typeLabels[loc.type]}</span>
              {loc.used > 0 && <span className="text-[9px] font-medium">{Math.round(loc.used / loc.capacity * 100)}%</span>}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2" style={{ borderColor: 'hsl(var(--stat-green))' }} />空闲</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2" style={{ borderColor: 'hsl(var(--stat-blue))', background: 'hsl(var(--stat-blue) / 0.08)' }} />占用</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2" style={{ borderColor: 'hsl(var(--stat-orange))' }} />预留</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border mt-6">
        <div className="overflow-x-auto">
          <table className="wms-data-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">库位编号</th>
                <th className="text-left p-3 font-medium text-muted-foreground">所属库区</th>
                <th className="text-left p-3 font-medium text-muted-foreground">类型</th>
                <th className="text-right p-3 font-medium text-muted-foreground">容量</th>
                <th className="text-right p-3 font-medium text-muted-foreground">已用</th>
                <th className="text-right p-3 font-medium text-muted-foreground">使用率</th>
                <th className="text-left p-3 font-medium text-muted-foreground">商品</th>
                <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(l => (
                <tr key={l.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono font-medium">{l.code}</td>
                  <td className="p-3">{l.zone}</td>
                  <td className="p-3">{typeLabels[l.type]}</td>
                  <td className="p-3 text-right">{l.capacity}</td>
                  <td className="p-3 text-right">{l.used}</td>
                  <td className="p-3 text-right">{l.capacity > 0 ? Math.round(l.used / l.capacity * 100) : 0}%</td>
                  <td className="p-3 font-mono text-xs">{l.product || '-'}</td>
                  <td className="p-3 text-center"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
