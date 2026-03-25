import { useState } from 'react';
import { Package, User, Phone, Mail, Image, CheckCircle, AlertCircle, Tag, Percent } from 'lucide-react';

const categories = ['数码配件', '手机配件', '运动健康', '美妆工具', '家居百货', '汽车用品', '食品饮料', '服装鞋帽', '其他'];
const platforms = ['淘宝', '抖音', '拼多多', '京东', '天猫', '1688', '其他'];

export default function ProductApplyPage() {
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    sku: '',
    unit: '件',
    costPrice: '',
    salePrice: '',
    stock: '',
    minOrder: '1',
    platform: '',
    platformUrl: '',
    description: '',
    images: '',
  });
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h1>
          <p className="text-gray-600 mb-6">您的商品已提交，我们将在1-2个工作日内完成审核，请保持联系方式畅通。</p>
          <div className="bg-slate-50 rounded-lg p-4 text-left mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">商品信息</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">商品名称：</span>{formData.productName}</p>
              <p><span className="text-gray-500">品牌：</span>{formData.brand || '未填写'}</p>
              <p><span className="text-gray-500">成本价：</span>¥{formData.costPrice}</p>
              <p><span className="text-gray-500">销售价：</span>¥{formData.salePrice}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">审核结果将通过短信/邮件通知您</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">商品申报</h1>
              <p className="text-sm text-gray-500">快速入驻选品池，触达更多销售渠道</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-sm">
          <span className={step >= 1 ? 'text-primary font-medium' : 'text-gray-400'}>商品信息</span>
          <span className={step >= 2 ? 'text-primary font-medium' : 'text-gray-400'}>价格库存</span>
          <span className={step >= 3 ? 'text-primary font-medium' : 'text-gray-400'}>确认提交</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-primary" />
                <h2 className="text-lg font-bold">商品基本信息</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>商品名称
                </label>
                <input
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  placeholder="请输入商品名称"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    品牌
                  </label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="请输入品牌名称"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>商品类目
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
                  >
                    <option value="">请选择类目</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    SKU编码
                  </label>
                  <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="请输入SKU编码"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>单位
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
                  >
                    <option value="件">件</option>
                    <option value="个">个</option>
                    <option value="箱">箱</option>
                    <option value="盒">盒</option>
                    <option value="套">套</option>
                    <option value="斤">斤</option>
                    <option value="千克">千克</option>
                    <option value="米">米</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  商品描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="请输入商品描述、特点、卖点..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  下一步，填写价格库存
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-primary" />
                <h2 className="text-lg font-bold">价格与库存信息</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>成本价（元）
                  </label>
                  <input
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="请输入成本价"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>销售价（元）
                  </label>
                  <input
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="请输入销售价"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              {formData.costPrice && formData.salePrice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <Percent size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">建议毛利率</p>
                    <p className="text-lg font-bold text-green-600">
                      {((parseFloat(formData.salePrice) - parseFloat(formData.costPrice)) / parseFloat(formData.salePrice) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>库存数量
                  </label>
                  <input
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    type="number"
                    min="0"
                    placeholder="请输入库存数量"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>最小起订量
                  </label>
                  <input
                    name="minOrder"
                    value={formData.minOrder}
                    onChange={handleChange}
                    required
                    type="number"
                    min="1"
                    placeholder="最小起订量"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>来源平台
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
                  >
                    <option value="">请选择平台</option>
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    商品链接
                  </label>
                  <input
                    name="platformUrl"
                    value={formData.platformUrl}
                    onChange={handleChange}
                    placeholder="请输入商品链接"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">温馨提示</p>
                  <p>请确保填写的商品信息真实有效，价格库存准确。审核通过后将进入选品池。</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  上一步
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  下一步，确认信息
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={20} className="text-primary" />
                <h2 className="text-lg font-bold">确认商品信息</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">商品名称</p>
                    <p className="font-medium">{formData.productName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">品牌</p>
                    <p className="font-medium">{formData.brand || '未填写'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">类目</p>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">单位</p>
                    <p className="font-medium">{formData.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">成本价</p>
                    <p className="font-medium text-green-600">¥{formData.costPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">销售价</p>
                    <p className="font-medium text-primary">¥{formData.salePrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">库存</p>
                    <p className="font-medium">{formData.stock} {formData.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">最小起订</p>
                    <p className="font-medium">{formData.minOrder} {formData.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">来源平台</p>
                    <p className="font-medium">{formData.platform}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">SKU</p>
                    <p className="font-medium">{formData.sku || '未填写'}</p>
                  </div>
                </div>
                {formData.description && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-500 text-sm">商品描述</p>
                    <p className="font-medium text-sm">{formData.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-primary mb-1">确认即表示</p>
                  <p>我承诺所填商品信息真实有效，遵守平台规则，如有违规愿意承担相应责任。</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  修改信息
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  确认提交商品
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>如有疑问，请联系客服热线：400-888-8888</p>
          <p className="mt-1">© 2024 全功能专业仓储与供应链管理系统</p>
        </div>
      </form>
    </div>
  );
}
