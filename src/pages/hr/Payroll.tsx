import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import Select from '../../components/shared/forms/Select';
import DatePicker from '../../components/shared/forms/DatePicker';
import { hrService } from '../../api/services';
import type { HrApiPayroll } from '../../types';
import { DollarSign, Download, FileText } from 'lucide-react';

export default function Payroll() {
  const [payrollRecords, setPayrollRecords] = useState<HrApiPayroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [filterMonth, setFilterMonth] = useState<string>('');

  useEffect(() => {
    loadPayroll();
  }, [filterMonth]);

  const loadPayroll = async () => {
    try {
      const response = await hrService.payroll.getAll();
      let data = response.data.data || [];
      
      if (filterMonth) {
        data = data.filter(record => record.pay_period?.startsWith(filterMonth));
      }
      
      setPayrollRecords(data);
    } catch (error) {
      console.error('Failed to load payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    setFormData({ pay_period: '', status: 'Pending' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hrService.payroll.generate(formData);
      setIsModalOpen(false);
      loadPayroll();
    } catch (error) {
      console.error('Failed to generate payroll:', error);
    }
  };

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row: HrApiPayroll) => row.employee?.name || 'N/A',
    },
    {
      key: 'pay_period',
      header: 'Pay Period',
      render: (row: HrApiPayroll) => row.pay_period || 'N/A',
    },
    {
      key: 'basic_salary',
      header: 'Basic Salary',
      render: (row: HrApiPayroll) => `₹${row.basic_salary?.toLocaleString() || 0}`,
    },
    {
      key: 'allowances',
      header: 'Allowances',
      render: (row: HrApiPayroll) => `₹${row.allowances?.toLocaleString() || 0}`,
    },
    {
      key: 'deductions',
      header: 'Deductions',
      render: (row: HrApiPayroll) => `₹${row.deductions?.toLocaleString() || 0}`,
    },
    {
      key: 'net_salary',
      header: 'Net Salary',
      render: (row: HrApiPayroll) => `₹${row.net_salary?.toLocaleString() || 0}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: HrApiPayroll) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'Paid' ? 'bg-green-100 text-green-800' : row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: HrApiPayroll) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => {/* TODO: Download payslip */}}
          >
            Payslip
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Payroll Management"
        subtitle="Manage employee payroll and salary disbursement"
        action={
          <Button
            variant="primary"
            icon={<DollarSign className="w-4 h-4" />}
            onClick={handleGenerate}
          >
            Generate Payroll
          </Button>
        }
      />

      <div className="mb-6 flex gap-4">
        <DatePicker
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          placeholder="Filter by Month"
        />
      </div>

      <DataTable
        data={payrollRecords}
        columns={columns}
        emptyMessage="No payroll records found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Generate Payroll"
        submitText="Generate"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
            <input
              type="month"
              className="input-field"
              value={formData.pay_period || ''}
              onChange={(e) => setFormData({ ...formData, pay_period: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes..."
            />
          </div>
        </div>
      </FormModal>
    </Layout>
  );
}
