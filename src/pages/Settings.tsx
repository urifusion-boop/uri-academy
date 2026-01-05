import { useEffect, useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../services/api';
import type { StudentProfile } from '../types/schema';
import { useToast } from '../context/ToastContext';

export function Settings() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    location: '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    courseUpdates: true,
    assignmentDueDates: true,
    gradePosted: true,
    communityMentions: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getCurrentUserProfile();
        setProfile(data);
        if (data.user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const userAny = data.user as any;
          const names = data.user.name.split(' ');
          setFormData({
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            bio: userAny.bio || '',
            phone: data.user.phoneNumber || '',
            location: userAny.location || '',
          });
          // Initialize notifications if available in user data
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        addToast('Failed to load profile settings', 'error');
      } finally {
        setDataLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await api.users.updateMe({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phone,
        bio: formData.bio,
        location: formData.location,
      });
      addToast('Profile updated successfully', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySave = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      await api.users.updatePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      addToast('Password updated successfully', 'success');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      addToast('Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    try {
      await api.users.updateNotifications(notificationSettings);
      addToast('Notification preferences saved', 'success');
    } catch {
      addToast('Failed to update notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (activeTab === 'profile') handleProfileSave();
    else if (activeTab === 'security') handleSecuritySave();
    else if (activeTab === 'notifications') handleNotificationsSave();
  };

  if (dataLoading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  const user = profile?.user;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your profile and preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Navigation for Settings */}
        <div className="md:col-span-1 space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'profile'
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'security'
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Security
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === 'notifications'
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Profile Information
                  </h2>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-3xl font-bold border-4 border-white shadow-lg">
                        {user?.initials || '??'}
                      </div>
                      <button
                        type="button"
                        aria-label="Upload profile photo"
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm text-gray-500 hover:text-brand-600 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Profile Photo
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload a professional photo for your certificate.
                        <br />
                        Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        className="input-field"
                        placeholder="Tell us about yourself..."
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email Address
                        </span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user?.email}
                        className="input-field bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Phone Number
                        </span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+234 801 234 5678"
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> Location
                        </span>
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Security Settings
                  </h2>

                  <div className="space-y-6 max-w-md">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="input-field pr-10"
                          value={securityData.currentPassword}
                          onChange={(e) =>
                            setSecurityData({
                              ...securityData,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          className="input-field pr-10"
                          value={securityData.newPassword}
                          onChange={(e) =>
                            setSecurityData({
                              ...securityData,
                              newPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="input-field pr-10"
                          value={securityData.confirmPassword}
                          onChange={(e) =>
                            setSecurityData({
                              ...securityData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-4">
                      Two-Factor Authentication
                    </h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Two-factor authentication
                          </p>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Toggle two-factor authentication"
                        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 bg-gray-200"
                      >
                        <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="notif-course"
                          type="checkbox"
                          checked={notificationSettings.courseUpdates}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              courseUpdates: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor="notif-course"
                          className="font-medium text-gray-900 block text-sm"
                        >
                          Course Updates
                        </label>
                        <p className="text-sm text-gray-500">
                          Get notified when new modules are released.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="notif-due"
                          type="checkbox"
                          checked={notificationSettings.assignmentDueDates}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              assignmentDueDates: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor="notif-due"
                          className="font-medium text-gray-900 block text-sm"
                        >
                          Assignment Due Dates
                        </label>
                        <p className="text-sm text-gray-500">
                          Reminders about upcoming deadlines.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="notif-grade"
                          type="checkbox"
                          checked={notificationSettings.gradePosted}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              gradePosted: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor="notif-grade"
                          className="font-medium text-gray-900 block text-sm"
                        >
                          Grade Posted
                        </label>
                        <p className="text-sm text-gray-500">
                          Get notified when your assignments are graded.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          id="notif-mentions"
                          type="checkbox"
                          checked={notificationSettings.communityMentions}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              communityMentions: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor="notif-mentions"
                          className="font-medium text-gray-900 block text-sm"
                        >
                          Community Mentions
                        </label>
                        <p className="text-sm text-gray-500">
                          When someone mentions you in a discussion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
                {!loading && <Save className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
