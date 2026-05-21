import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import DataTable from '../../components/shared/tables/DataTable';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import Select from '../../components/shared/forms/Select';
import { hrService } from '../../api/services';
import type { HrApiJob, HrApiJobApplication } from '../../types';
import { Plus, Briefcase, Users, Eye } from 'lucide-react';

export default function Recruitment() {
  const [jobs, setJobs] = useState<HrApiJob[]>([]);
  const [applications, setApplications] = useState<HrApiJobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<HrApiJob | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [view, setView] = useState<'jobs' | 'applications'>('jobs');

  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = async () => {
    try {
      if (view === 'jobs') {
        const response = await hrService.jobs.getAll();
        setJobs(response.data.data || []);
      } else {
        const response = await hrService.jobApplications.getAll();
        setApplications(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    setSelectedJob(null);
    setFormData({ title: '', department: '', description: '', requirements: '', is_active: true });
    setIsJobModalOpen(true);
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hrService.jobs.create(formData);
      setIsJobModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const jobColumns = [
    {
      key: 'title',
      header: 'Job Title',
      render: (row: HrApiJob) => row.title,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row: HrApiJob) => row.department || 'N/A',
    },
    {
      key: 'vacancies',
      header: 'Vacancies',
      render: (row: HrApiJob) => row.vacancies || 0,
    },
    {
      key: 'application_deadline',
      header: 'Deadline',
      render: (row: HrApiJob) => row.application_deadline || 'N/A',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: HrApiJob) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.is_active ? 'Active' : 'Closed' }
        </span>
      ),
    },
  ];

  const applicationColumns = [
    {
      key: 'applicant',
      header: 'Applicant',
      render: (row: HrApiJobApplication) => row.applicant?.name || 'N/A',
    },
    {
      key: 'job',
      header: 'Job',
      render: (row: HrApiJobApplication) => row.job?.title || 'N/A',
    },
    {
      key: 'applied_date',
      header: 'Applied Date',
      render: (row: HrApiJobApplication) => row.applied_date || 'N/A',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: HrApiJobApplication) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Selected' ? 'bg-green-100 text-green-800' :
          row.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          row.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
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
        title="Recruitment"
        subtitle="Manage job postings and applications"
        action={
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleCreateJob}
          >
            Post Job
          </Button>
        }
      />

      <div className="mb-6 flex gap-4">
        <Button
          variant={view === 'jobs' ? 'primary' : 'secondary'}
          icon={<Briefcase className="w-4 h-4" />}
          onClick={() => setView('jobs')}
        >
          Jobs ({jobs.length})
        </Button>
        <Button
          variant={view === 'applications' ? 'primary' : 'secondary'}
          icon={<Users className="w-4 h-4" />}
          onClick={() => setView('applications')}
        >
          Applications ({applications.length})
        </Button>
      </div>

      {view === 'jobs' ? (
        <DataTable
          data={jobs}
          columns={jobColumns}
          emptyMessage="No job postings found"
        />
      ) : (
        <DataTable
          data={applications}
          columns={applicationColumns}
          emptyMessage="No applications found"
        />
      )}

      <FormModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={handleSubmitJob}
        title="Post New Job"
        submitText="Post Job"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              className="input-field"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              className="input-field"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
            <input
              type="number"
              className="input-field"
              value={formData.vacancies || ''}
              onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input-field"
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.requirements || ''}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
            <input
              type="date"
              className="input-field"
              value={formData.application_deadline || ''}
              onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.is_active ?? true}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>
      </FormModal>
    </Layout>
  );
}
