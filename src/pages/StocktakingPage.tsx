import { useState } from 'react';
import { ClipboardList, CheckCircle, AlertTriangle, Plus, Search, ScanLine } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/use-toast';

const stocktakingTasks = [
  { id: 'ST001', type: 'cycle', name: 'B区拣货位月度盘点', zone: '拣货区B', progress: 100, total: 50, diff: 0, status: 'completed', operator: '张三', date: '2025-03-24' },
  { id: 'ST002', type: 'dynamic', name: 'A-01区临时盘点', zone: '存储区A', progress: 60, total: 20, diff: 2, status: 'in_progress', operator: '李四', date: '2025-03-24' },
  { id: 'ST003', type: 'cycle', name: 'C区展位季度盘点', zone: '展位区C', progress: 0, total: 30, diff: 0, status: 'pending', operator: '王五', date: '2025-03-25' },
  { id: 'ST004', type: 'dynamic', name: '爆款商品抽盘', zone: '存储区A', progress: 0, total: 10, diff: 0, status: 'pending', operator: '赵六', date: '2025-03-26' },
];

const stocktakingDetails = [
  { sku: 'SKU-10001', name: '蓝牙耳机 Pro Max', location: 'A-01-03', bookQty: 520, actualQty: 518, diff: -2, status: 'normal' },
  { sku: 'SKU-10002', name: '手机壳 iPhone15', location: 'A-02-01', bookQty: 2300, actualQty: 2300, diff: 0, status: 'normal' },
  { sku: 'SKU-10007', name: '无线充电器', location: 'A-01-05', bookQty: 320, actualQty: 315, diff: -5, status: 'abnormal' },
  { sku: 'SKU-10006', name: '车载手机支架', location: 'A-03-02', bookQty: 1500, actualQty: 1500, diff: 0, status: 'normal' },
];

export default function StocktakingPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState<typeof stocktakingTasks[0] | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const { toast } = useToast();

  const handleStartTask = (task: typeof stocktakingTasks[0]) => {
    setSelectedTask(task);
    toast({ title: '开始盘点', description: `盘点任务 ${task.id} 已开始` });
  };

  const handleConfirmDiff = (item: typeof stocktakingDetails[0]) => {
    toast({ title: '差异已确认', description: `${item.sku} 差异 ${item.diff} 已提交复核` });
  };

  return (
    <div className="space-y-6">
      <div className="wms-page-header">
        <div>
          <h1 className="wms-page-title">盘点管理</h1>
          <p className="wms-page-subtitle">周期性盘点、动态盘点、差异报告</p>
        </div>
        <button
          onClick={() => setShowNewDialog(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <Plus size={16} />新建盘点任务
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '待执行', value: 2, color: 'text-warning' },
          { label: '进行中', value: 1, color: 'text-primary' },
          { label: '已完成', value: 15, color: 'text-success' },
          { label: '差异待处理', value: 3, color: 'text-destructive' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { key: 'tasks', label: '盘点任务' },
          { key: 'details', label: '盘点明细' },
          { key: 'diff', label: '差异记录' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-1 text-sm font-medium ${activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'tasks' && (
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <table className="wms-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">任务编号</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">任务名称</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">类型</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">库区</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">进度</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">差异数</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {stocktakingTasks.map(task => (
                  <tr key={task.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs font-medium">{task.id}</td>
                    <td className="p-3 text-sm font-medium">{task.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${task.type === 'cycle' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                        {task.type === 'cycle' ? '周期盘点' : '动态盘点'}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{task.zone}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {task.diff > 0 && <span className="text-destructive font-medium">{task.diff}</span>}
                      {task.diff === 0 && <span className="text-muted-foreground">0</span>}
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={task.status === 'completed' ? 'active' : task.status === 'in_progress' ? 'pending' : 'warning'} />
                    </td>
                    <td className="p-3 text-center">
                      {task.status === 'pending' && (
                        <button onClick={() => handleStartTask(task)} className="text-xs text-primary hover:underline">开始盘点</button>
                      )}
                      {task.status === 'in_progress' && (
                        <button onClick={() => setSelectedTask(task)} className="text-xs text-primary hover:underline">继续盘点</button>
                      )}
                      {task.status === 'completed' && (
                        <button onClick={() => toast({ title: '查看报告', description: '盘点报告生成中...' })} className="text-xs text-muted-foreground hover:underline">查看报告</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="bg-card rounded-lg border">
          <div className="p-4 border-b flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="搜索SKU或商品名称..." className="w-full pl-9 pr-4 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="wms-data-table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">商品名称</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">库位</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">账面数</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">实盘数</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">差异</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">状态</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {stocktakingDetails.map(item => (
                  <tr key={item.sku} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{item.sku}</td>
                    <td className="p-3 text-sm font-medium">{item.name}</td>
                    <td className="p-3 font-mono text-xs">{item.location}</td>
                    <td className="p-3 text-right font-mono">{item.bookQty}</td>
                    <td className="p-3 text-right font-mono">{item.actualQty}</td>
                    <td className="p-3 text-right">
                      {item.diff !== 0 ? (
                        <span className={`font-mono font-medium ${item.diff > 0 ? 'text-success' : 'text-destructive'}`}>
                          {item.diff > 0 ? '+' : ''}{item.diff}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.status === 'normal' ? (
                        <span className="flex items-center justify-center gap-1 text-success text-xs"><CheckCircle size={12} />正常</span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-destructive text-xs"><AlertTriangle size={12} />异常</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {item.status === 'abnormal' && (
                        <button onClick={() => handleConfirmDiff(item)} className="text-xs text-primary hover:underline">确认差异</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'diff' && (
        <div className="space-y-4">
          {stocktakingDetails.filter(d => d.diff !== 0).map(item => (
            <div key={item.sku} className="bg-card rounded-lg border p-4 flex items-start gap-4">
              <div className={`p-2 rounded-md ${item.diff > 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <AlertTriangle size={20} className={item.diff > 0 ? 'text-success' : 'text-destructive'} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{item.sku}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  账面: {item.bookQty} · 实盘: {item.actualQty} · 差异: <span className={`font-medium ${item.diff > 0 ? 'text-success' : 'text-destructive'}`}>{item.diff > 0 ? '+' : ''}{item.diff}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">库位: {item.location}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleConfirmDiff(item)} className="px-3 py-1.5 text-xs rounded-md border hover:bg-muted transition">确认盘亏</button>
                <button onClick={() => toast({ title: '申请复核', description: '已提交复核申请' })} className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">申请复核</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Dialog */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b sticky top-0 bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedTask.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedTask.id} · {selectedTask.zone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">进度</p>
                    <p className="font-bold">{selectedTask.progress}%</p>
                  </div>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${selectedTask.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <input placeholder="扫描SKU或库位..." className="w-full pl-10 pr-4 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <ScanLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition">扫描</button>
              </div>
              <div className="space-y-3">
                {stocktakingDetails.map(item => (
                  <div key={item.sku} className="p-4 rounded-lg border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.sku} · {item.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">账面: <span className="font-mono">{item.bookQty}</span></p>
                        <input type="number" placeholder="实盘数" className="w-20 px-2 py-1 rounded bg-muted text-sm text-right mt-1 outline-none focus:ring-1 focus:ring-primary/30" defaultValue={item.bookQty} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 border-t flex justify-between">
              <button onClick={() => setSelectedTask(null)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">暂不保存</button>
              <button onClick={() => { toast({ title: '保存成功', description: '盘点数据已保存' }); setSelectedTask(null); }} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">保存盘点数据</button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Dialog */}
      {showNewDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewDialog(false)}>
          <div className="bg-card rounded-lg border shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold">新建盘点任务</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">任务名称</label>
                <input type="text" placeholder="请输入任务名称" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">盘点类型</label>
                <select className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="cycle">周期盘点</option>
                  <option value="dynamic">动态盘点</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">盘点库区</label>
                <select className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30">
                  <option>存储区A</option>
                  <option>拣货区B</option>
                  <option>展位区C</option>
                  <option>全仓盘点</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">备注</label>
                <textarea placeholder="可选填写备注信息" className="w-full px-3 py-2 rounded-md bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30 h-20 resize-none" />
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setShowNewDialog(false)} className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">取消</button>
              <button onClick={() => { toast({ title: '任务已创建', description: '盘点任务已提交待执行' }); setShowNewDialog(false); }} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition">创建任务</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
