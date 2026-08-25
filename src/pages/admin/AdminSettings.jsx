import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import { useToast } from '../../context/ToastContext.jsx';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [site, setSite] = useState(null);
  const [payment, setPayment] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [savingSite, setSavingSite] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingQr, setSavingQr] = useState(false);

  useEffect(() => {
    publicService.getSiteSettings().then(({ data }) => setSite(data.data)).catch(() => {});
    publicService.getPaymentSettings().then(({ data }) => setPayment(data.data)).catch(() => {});
  }, []);

  const saveSite = async (e) => {
    e.preventDefault();
    setSavingSite(true);
    try {
      await adminService.updateSetting('site_info', site);
      showToast('Site info updated.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save.', 'error');
    } finally {
      setSavingSite(false);
    }
  };

  const savePayment = async (e) => {
    e.preventDefault();
    setSavingPayment(true);
    try {
      await adminService.updateSetting('payment_info', payment);
      showToast('Payment settings updated.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save.', 'error');
    } finally {
      setSavingPayment(false);
    }
  };

  const uploadQr = async () => {
    if (!qrFile) return;
    setSavingQr(true);
    try {
      const fd = new FormData();
      fd.append('qr', qrFile);
      const { data } = await adminService.uploadPaymentQr(fd);
      setPayment(data.data);
      showToast('Payment QR updated.');
      setQrFile(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload QR.', 'error');
    } finally {
      setSavingQr(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <AdminPageHeader title="Website Settings" subtitle="Contact details, social links and payment information." />

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveSite} className="card p-6 space-y-4">
          <p className="font-display text-parchment-100 mb-1">Site Info</p>
          {site && ['flash_news', 'address', 'phone', 'whatsapp', 'email', 'facebook', 'instagram', 'youtube'].map((key) => (
            <div key={key}>
              <label className="text-xs text-slate-400 mb-1.5 block capitalize">{key.replace('_', ' ')}</label>
              <input
                value={site[key] || ''}
                onChange={(e) => setSite({ ...site, [key]: e.target.value })}
                className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
              />
            </div>
          ))}
          <button type="submit" disabled={savingSite} className="btn-primary w-full disabled:opacity-60">{savingSite ? 'Saving…' : 'Save Site Info'}</button>
        </form>

        <div className="space-y-6">
          <form onSubmit={savePayment} className="card p-6 space-y-4">
            <p className="font-display text-parchment-100 mb-1">Payment Info</p>
            {payment && (
              <>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Payment Number</label>
                  <input
                    value={payment.payment_number || ''}
                    onChange={(e) => setPayment({ ...payment, payment_number: e.target.value })}
                    className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">UPI ID</label>
                  <input
                    value={payment.upi_id || ''}
                    onChange={(e) => setPayment({ ...payment, upi_id: e.target.value })}
                    className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
                  />
                </div>
              </>
            )}
            <button type="submit" disabled={savingPayment} className="btn-primary w-full disabled:opacity-60">{savingPayment ? 'Saving…' : 'Save Payment Info'}</button>
          </form>

          <div className="card p-6 space-y-4">
            <p className="font-display text-parchment-100 mb-1">Payment QR Code</p>
            {payment?.upi_qr_url && <img src={payment.upi_qr_url} alt="Current payment QR" className="w-40 rounded-md" />}
            <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files[0])} className="text-sm text-slate-300" />
            <button onClick={uploadQr} disabled={savingQr || !qrFile} className="btn-secondary w-full disabled:opacity-60">{savingQr ? 'Uploading…' : 'Upload New QR'}</button>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettings;
