import { useState } from 'react';
import { Building, Users, Phone, Mail, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const businessTypes = ['有限责任公司', '股份有限公司', '个人独资企业', '合伙企业', '个体工商户'];
const categories = ['数码配件', '手机配件', '运动健康', '美妆工具', '家居百货', '汽车用品', '食品饮料', '服装鞋帽', '其他'];
const settlementCycles = ['月结', '季结', '半年结', '年结', '预付'];

export default function MerchantApplyPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    businessLicense: '',
    businessType: '',
    category: '',
    settlementCycle: '月结',
    boothRequirement: '',
    otherRequirement: '',
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
          <p className="text-gray-600 mb-6">您的入驻申请已提交，我们将在1-3个工作日内完成审核，请保持电话畅通。</p>
          <div className="bg-slate-50 rounded-lg p-4 text-left mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">申请信息</p>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">企业名称：</span>{formData.companyName}</p>
              <p><span className="text-gray-500">联系人：</span>{formData.contactPerson}</p>
              <p><span className="text-gray-500">联系电话：</span>{formData.contactPhone}</p>
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
              <Building size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">供应商入驻申请</h1>
              <p className="text-sm text-gray-500">全功能专业仓储与供应链管理系统</p>
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
          <span className={step >= 1 ? 'text-primary font-medium' : 'text-gray-400'}>基本信息</span>
          <span className={step >= 2 ? 'text-primary font-medium' : 'text-gray-400'}>资质信息</span>
          <span className={step >= 3 ? 'text-primary font-medium' : 'text-gray-400'}>确认提交</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} className="text-primary" />
                <h2 className="text-lg font-bold">企业基本信息</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>企业名称
                </label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="请输入企业全称"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>联系人姓名
                  </label>
                  <input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    placeholder="请输入联系人姓名"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>联系电话
                  </label>
                  <input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="请输入手机号码"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>电子邮箱
                </label>
                <input
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="请输入邮箱地址"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>企业类型
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
                  >
                    <option value="">请选择企业类型</option>
                    {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-red-500 mr-1">*</span>主营类目
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition bg-white"
                  >
                    <option value="">请选择主营类目</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  下一步，填写资质信息
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={20} className="text-primary" />
                <h2 className="text-lg font-bold">资质证明信息</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>统一社会信用代码
                </label>
                <input
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleChange}
                  required
                  placeholder="请输入18位统一社会信用代码"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>结算周期
                </label>
                <div className="flex gap-3 flex-wrap">
                  {settlementCycles.map(cycle => (
                    <label key={cycle} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition ${formData.settlementCycle === cycle ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="settlementCycle"
                        value={cycle}
                        checked={formData.settlementCycle === cycle}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-sm font-medium">{cycle}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  展位需求（㎡）
                </label>
                <input
                  name="boothRequirement"
                  value={formData.boothRequirement}
                  onChange={handleChange}
                  type="number"
                  min="5"
                  placeholder="请输入需要的展位面积（最小5㎡）"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  其他需求说明
                </label>
                <textarea
                  name="otherRequirement"
                  value={formData.otherRequirement}
                  onChange={handleChange}
                  rows={3}
                  placeholder="如有其他特殊需求，请在此说明..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">温馨提示</p>
                  <p>请确保填写的信息真实有效，审核人员可能会电话核实。入驻后需提供营业执照等资质证明原件。</p>
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
                <h2 className="text-lg font-bold">确认申请信息</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">企业名称</p>
                    <p className="font-medium">{formData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">企业类型</p>
                    <p className="font-medium">{formData.businessType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">联系人</p>
                    <p className="font-medium">{formData.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">联系电话</p>
                    <p className="font-medium">{formData.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">电子邮箱</p>
                    <p className="font-medium">{formData.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">主营类目</p>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">统一社会信用代码</p>
                    <p className="font-medium">{formData.businessLicense}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">结算周期</p>
                    <p className="font-medium">{formData.settlementCycle}</p>
                  </div>
                  {formData.boothRequirement && (
                    <div>
                      <p className="text-gray-500">展位需求</p>
                      <p className="font-medium">{formData.boothRequirement} ㎡</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-primary mb-1">确认即表示</p>
                  <p>我已阅读并同意《供应商入驻协议》和《平台服务条款》，承诺所填信息真实有效。</p>
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
                  确认提交申请
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
