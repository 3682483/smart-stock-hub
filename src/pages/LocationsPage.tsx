import { locations as initialLocations } from '@/data/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { MapPin, Plus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const typeLabels: Record<string, string> = { normal: '普通库位', picking: '拣货位', exhibition: '展位' };
const zoneColors: Record<string, string> = { '存储区A': 'hsl(var(--stat-blue))', '拣货区B': 'hsl(var(--stat-green))', '展位区C': 'hsl(var(--stat-purple))' };
const zones = ['存储区A', '拣货区B', '展位区C'];
const types = ['normal', 'picking', 'exhibition'];

export default function LocationsPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const { toast } = useToast();

  const handleAddLocation = (formData: any) => {
    const newLocation = { ...formData, id: `L${Date.now()}`, status: 'available' };
    setLocations([...locations, newLocation]);
    toast({ title: '库位已添加', description: `库位 ${formData.code} 已成功添加` });
    setShowAddDialog(false);
  };

  const handleEditLocation = (formData: any) => {
    setLocations(locations.map(l => l.id === formData.id ? { ...l, ...formData } : l));
    toast({ title: '库位已更新', description: `库位 ${formData.code} 信息已更新` });
    setEditingLocation(null);
  };

  return (
    <div>
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">库位/货架管理</h1>
          <p className="wms-page-subtitle">仓库布局与库位状态管理</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <Plus size={16} />新增库位
        </button>
      </div>

      {/* Zone summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {zones.map(zone => {
          const zoneLocations = locations.filter(l => l.zone === zone);
          const totalCap = zoneLocations.reduce((s, l) => s + l.capacity, 0);
          const totalUsed = zoneLocations.reduce((s, l) => s + l.used, 0);
          const usage = totalCap > 0 ? Math.round(totalUsed / totalCap * 100) : 0;
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
              onClick={() => setEditingLocation(loc)}
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
                <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
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
                  <td className="p-3 text-center">
                    <button onClick={() => setEditingLocation(l)} className="p-1.5 rounded hover:bg-muted transition" title="编辑"><Pencil size={14} className="text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Location Dialog */}
      {showAddDialog && (
        <LocationDialog
          title="新增库位"
          onSave={handleAddLocation}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {/* Edit Location Dialog */}
      {editingLocation && (
        <LocationDialog
          title="编辑库位"
          location={editingLocation}
          onSave={handleEditLocation}
          onClose={() => setEditingLocation(null)}
        />
      )}
    </div>
  );
}

function LocationDialog({ title, location, onSave, onClose }: { title: string; location?: any; onSave: (data: any) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    id: location?.id || '',
    code: location?.code || '',
    zone: location?.zone || '存储区A',
    type: location?.type || 'normal',
    capacity: location?.capacity || 100,
    used: location?.used || 0,
    product: location?.product || '',
    status: location?.status || 'available',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-lg border shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b">
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">库位编号</label>
            <input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="如：A-01-01" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">所属库区</label>
              <select value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
                {zones.map(z => <option key={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">库位类型</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
                {types.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">容量</label>
              <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">当前使用</label>
              <input type="number" value={formData.used} onChange={e => setFormData({ ...formData, used: Number(e.target.value) })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">状态</label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none">
              <option value="available">空闲</option>
              <option value="occupied">占用</option>
              <option value="reserved">预留</option>
              <option value="maintenance">维护中</option>
            </select>
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">{location ? '保存修改' : '确认添加'}</button>
        </div>
      </div>
    </div>
  );
}
