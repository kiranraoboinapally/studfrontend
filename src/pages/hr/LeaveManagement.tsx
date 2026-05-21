import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import Select from '../../components/shared/forms/Select';
import DatePicker from '../../components/shared/forms/DatePicker';
import { hrService } from '../../api/services';
import type { HrApiLeaveRequest, StatusCode } from '../../types';
import { Check, X, Calendar } from 'lucide-react';

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<HrApiLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HrApiLeaveRequest | null>(null);
  const [actionData, setActionData] = useState({ status: 'Approved' as StatusCode, remarks: '' });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadLeaveRequests();
  }, [filterStatus]);

  const loadLeaveRequests = async () => {
    try {
      const response = await hrService.leaveRequests.getAll();
      let data = response.data.data || [];
      
      if (filterStatus !== 'all') {
        data = data.filter(req => req.status === filterStatus);
      }
      
      setLeaveRequests(data);
    } catch (error) {
      console.error('Failed to load leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (request: HrApiLeaveRequest) => {
    setSelectedRequest(request);
    setActionData({ status: request.status, remarks: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      try {
        await hrService.leaveRequests.update(selectedRequest.id, actionData);
        setIsModalOpen(false);
        loadLeaveRequests();
      } catch (error) {
        console.error('Failed to update leave request:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (row: HrApiLeaveRequest) => row.employee?.name || 'N/A',
    },
    {
      key: 'leave_type',
      header: 'Leave Type',
      render: (row: HrApiLeaveRequest) => row.leave_type?.name || 'N/A',
    },
    {
      key: 'dates',
      header: 'Duration',
      render: (row: HrApiLeaveRequest) => `${row.start_date} to ${row.end_date}`,
    },
    {
      key: 'days',
      header: 'Days',
      render: (row: HrApiLeaveRequest) => row.total_days || 0,
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row: HrApiLeaveRequest) => row.reason || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: HrApiLeaveRequest) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: HrApiLeaveRequest) => (
        <div className="flex gap-2">
          {row.status === 'Pending' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={<Check className="w-4 h-4" />}
                onClick={() => handleAction(row)}
              >
                Approve/Reject
              </Button>
            </>
          )}
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
        title="Leave Management"
        subtitle="Manage employee leave requests"
      />

      <div className="mb-6 flex gap-4">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
          placeholder="Filter by Status"
        />
      </div>

      <DataTable
        data={leaveRequests}
        columns={columns}
        emptyMessage="No leave requests found"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Update Leave Request"
        submitText="Update Status"
      >
        <div className="space-y-4">
          {selectedRequest && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p><strong>Employee:</strong> {selectedRequest.employee?.name}</p>
              <p><strong>Leave Type:</strong> {selectedRequest.leave_type?.name}</p>
              <p><strong>Dates:</strong> {selectedRequest.start_date} to {selectedRequest.end_date}</p>
              <p><strong>Reason:</strong> {selectedRequest.reason}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={actionData.status}
              onChange={(e) => setActionData({ ...actionData, status: e.target.value as StatusCode })}
              options={[
                { value: 'Approved', label: 'Approve' },
                { value: 'Rejected', label: 'Reject' },
              ]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              className="input-field"
              rows={3}
              value={actionData.remarks}
              onChange={(e) => setActionData({ ...actionData, remarks: e.target.value })}
              placeholder="Add any remarks..."
            />
          </div>
        </div>
      </FormModal>
    </Layout>
  );
}
