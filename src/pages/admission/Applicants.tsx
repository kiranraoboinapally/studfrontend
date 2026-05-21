import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import ConfirmModal from '../../components/shared/modals/ConfirmModal';
import Select from '../../components/shared/forms/Select';
import { admissionService } from '../../api/services';
import type { AdmissionApiApplicant, StatusCode } from '../../types';
import { Eye, Check, X, FileText } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState<AdmissionApiApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<AdmissionApiApplicant | null>(null);
  const [statusData, setStatusData] = useState({ status: 'Pending' as StatusCode, remarks: '' });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadApplicants();
  }, [filterStatus]);

  const loadApplicants = async () => {
    try {
      const response = await admissionService.applicants.getAll();
      let data = response.data.data || [];
      
      if (filterStatus !== 'all') {
        data = data.filter(app => app.status === filterStatus);
      }
      
      setApplicants(data);
    } catch (error) {
      console.error('Failed to load applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (applicant: AdmissionApiApplicant) => {
    setSelectedApplicant(applicant);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = (applicant: AdmissionApiApplicant) => {
    setSelectedApplicant(applicant);
    setStatusData({ status: applicant.status, remarks: '' });
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApplicant) {
      try {
        await admissionService.applicants.updateStatus(selectedApplicant.id, statusData);
        setIsStatusModalOpen(false);
        loadApplicants();
      } catch (error) {
        console.error('Failed to update status:', error);
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
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row: AdmissionApiApplicant) => `${row.first_name} ${row.last_name}`,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row: AdmissionApiApplicant) => row.email,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row: AdmissionApiApplicant) => row.phone || 'N/A',
    },
    {
      key: 'program',
      header: 'Program',
      render: (row: AdmissionApiApplicant) => row.preferred_program || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: AdmissionApiApplicant) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: AdmissionApiApplicant) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handleView(row)}
          >
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => handleStatusChange(row)}
          >
            Update Status
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
        title="Applicants"
        subtitle="Manage admission applications"
      />

      <div className="mb-6 flex gap-4">
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Under Review', label: 'Under Review' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
          ]}
          placeholder="Filter by Status"
        />
      </div>

      <DataTable
        data={applicants}
        columns={columns}
        emptyMessage="No applicants found"
      />

      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onSubmit={(e) => { e.preventDefault(); setIsViewModalOpen(false); }}
        title="Applicant Details"
        submitText="Close"
      >
        {selectedApplicant && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{`${selectedApplicant.first_name} ${selectedApplicant.last_name}`}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedApplicant.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{selectedApplicant.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{selectedApplicant.date_of_birth || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Program</label>
                <p className="text-gray-900">{selectedApplicant.preferred_program || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplicant.status)}`}>
                  {selectedApplicant.status}
                </span>
              </div>
            </div>
            {selectedApplicant.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900">{selectedApplicant.address}</p>
              </div>
            )}
          </div>
        )}
      </FormModal>

      <FormModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleStatusSubmit}
        title="Update Application Status"
        submitText="Update Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={statusData.status}
              onChange={(e) => setStatusData({ ...statusData, status: e.target.value as StatusCode })}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              className="input-field"
              rows={3}
              value={statusData.remarks}
              onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
              placeholder="Add any remarks about this decision..."
            />
          </div>
        </div>
      </FormModal>
    </Layout>
  );
}
