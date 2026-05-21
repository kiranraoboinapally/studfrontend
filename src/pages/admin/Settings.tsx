import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/shared/forms/Button';
import FormModal from '../../components/shared/modals/FormModal';
import { Settings, Save, Bell, Shield, Database, Palette } from 'lucide-react';

interface SystemSettings {
  university_name: string;
  university_code: string;
  support_email: string;
  support_phone: string;
  session_timeout_minutes: number;
  max_file_size_mb: number;
  enable_notifications: boolean;
  enable_email_alerts: boolean;
  maintenance_mode: boolean;
  academic_year: string;
  current_semester: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>({
    university_name: '',
    university_code: '',
    support_email: '',
    support_phone: '',
    session_timeout_minutes: 30,
    max_file_size_mb: 10,
    enable_notifications: true,
    enable_email_alerts: true,
    maintenance_mode: false,
    academic_year: '',
    current_semester: '',
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await settingsService.get();
      // setSettings(response.data);
      
      // Mock data for now
      setSettings({
        university_name: 'Example University',
        university_code: 'EU',
        support_email: 'support@example.edu',
        support_phone: '+91 1234567890',
        session_timeout_minutes: 30,
        max_file_size_mb: 10,
        enable_notifications: true,
        enable_email_alerts: true,
        maintenance_mode: false,
        academic_year: '2024-2025',
        current_semester: 'Odd',
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      // await settingsService.update(settings);
      console.log('Settings saved:', settings);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: 'General Settings',
      icon: Settings,
      fields: [
        { key: 'university_name', label: 'University Name', type: 'text' },
        { key: 'university_code', label: 'University Code', type: 'text' },
        { key: 'support_email', label: 'Support Email', type: 'email' },
        { key: 'support_phone', label: 'Support Phone', type: 'text' },
      ],
    },
    {
      title: 'Security Settings',
      icon: Shield,
      fields: [
        { key: 'session_timeout_minutes', label: 'Session Timeout (minutes)', type: 'number' },
      ],
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      fields: [
        { key: 'enable_notifications', label: 'Enable Notifications', type: 'checkbox' },
        { key: 'enable_email_alerts', label: 'Enable Email Alerts', type: 'checkbox' },
      ],
    },
    {
      title: 'System Settings',
      icon: Database,
      fields: [
        { key: 'max_file_size_mb', label: 'Max File Size (MB)', type: 'number' },
        { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'checkbox' },
      ],
    },
    {
      title: 'Academic Settings',
      icon: Palette,
      fields: [
        { key: 'academic_year', label: 'Academic Year', type: 'text' },
        { key: 'current_semester', label: 'Current Semester', type: 'select', options: ['Odd', 'Even'] },
      ],
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
        title="System Settings"
        subtitle="Configure university-wide system settings"
        action={
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Save Settings
          </Button>
        }
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <section.icon className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={field.key}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={settings[field.key as keyof SystemSettings] as boolean}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            [field.key]: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor={field.key} className="ml-2 block text-sm text-gray-900">
                        {settings[field.key as keyof SystemSettings] ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      className="input-field"
                      value={settings[field.key as keyof SystemSettings] as string}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [field.key]: e.target.value,
                        })
                      }
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="input-field"
                      value={settings[field.key as keyof SystemSettings] as string | number}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [field.key]:
                            field.type === 'number'
                              ? parseInt(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        title="Confirm Save"
        submitText="Save Changes"
        loading={saving}
      >
        <p className="text-gray-700">
          Are you sure you want to save these settings? Changes will take effect immediately.
        </p>
      </FormModal>
    </Layout>
  );
}
