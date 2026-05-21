import React, { useState, useMemo } from 'react';
import { Appointment, Service, Staff } from '../types';
import { reportingService } from '../services/reportingService';

interface SalonReportsTabProps {
  appointments: Appointment[];
  services: Service[];
  staff: Staff[];
}

const SalonReportsTab: React.FC<SalonReportsTabProps> = ({ appointments, services, staff }) => {
  const [dateRange, setDateRange] = useState<'this_month' | 'last_month' | 'last_30_days'>('this_month');

  const metrics = useMemo(() => {
    return reportingService.getReportMetrics(appointments, services, dateRange);
  }, [appointments, services, dateRange]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Raporlar & İstatistikler</h2>
        <select 
          value={dateRange}
          onChange={(e: any) => setDateRange(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-2"
        >
          <option value="this_month">Bu Ay</option>
          <option value="last_month">Geçen Ay</option>
          <option value="last_30_days">Son 30 Gün</option>
        </select>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
        <strong>Not:</strong> Bu gelir tahmini, uygulama üzerinden oluşturulan (ve iptal edilmeyen) randevulardaki güncel hizmet fiyatlarına göre hesaplanır. Tahsilat garantisi veya kesin finansal tablo değildir.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Toplam Randevu', value: metrics.totalAppointments },
          { label: 'Tamamlanan', value: metrics.completedAppointments, color: 'text-green-600' },
          { label: 'İptal Edilen', value: metrics.canceledAppointments, color: 'text-red-600' },
          { label: 'Tahmini Gelir', value: `₺${metrics.estimatedRevenue}`, color: 'text-blue-600' },
          { label: 'Ort. Randevu Değeri', value: `₺${metrics.averageAppointmentValue.toFixed(0)}` },
        ].map((m, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-gray-500 uppercase">{m.label}</div>
            <div className={`mt-2 text-2xl font-bold ${m.color || 'text-gray-900 dark:text-white'}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">En Çok Tercih Edilen Hizmet</h3>
          <div className="text-xl font-medium text-accent">{metrics.mostBookedService || 'Yeterli veri yok'}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">En Yüksek Ciro Getiren Hizmet</h3>
          <div className="text-xl font-medium text-green-600">
            {metrics.topRevenueService || 'Yeterli veri yok'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonReportsTab;
