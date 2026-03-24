const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: '正常', className: 'wms-badge-success' },
  inactive: { label: '停用', className: 'wms-badge-danger' },
  low_stock: { label: '低库存', className: 'wms-badge-warning' },
  out_of_stock: { label: '缺货', className: 'wms-badge-danger' },
  available: { label: '空闲', className: 'wms-badge-success' },
  occupied: { label: '占用', className: 'wms-badge-info' },
  reserved: { label: '预留', className: 'wms-badge-warning' },
  maintenance: { label: '维护', className: 'wms-badge-danger' },
  pending: { label: '待处理', className: 'wms-badge-warning' },
  partial: { label: '部分完成', className: 'wms-badge-info' },
  completed: { label: '已完成', className: 'wms-badge-success' },
  abnormal: { label: '异常', className: 'wms-badge-danger' },
  draft: { label: '草稿', className: 'wms-badge-info' },
  picking: { label: '拣货中', className: 'wms-badge-info' },
  packed: { label: '已打包', className: 'wms-badge-success' },
  shipped: { label: '已发货', className: 'wms-badge-success' },
  cancelled: { label: '已取消', className: 'wms-badge-danger' },
  intercepted: { label: '已拦截', className: 'wms-badge-danger' },
  suspended: { label: '暂停', className: 'wms-badge-warning' },
  high: { label: '高', className: 'wms-badge-danger' },
  medium: { label: '中', className: 'wms-badge-warning' },
  low: { label: '低', className: 'wms-badge-success' },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = statusMap[status] || { label: status, className: 'wms-badge-info' };
  return <span className={`wms-badge ${cfg.className}`}>{cfg.label}</span>;
}
