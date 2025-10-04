"use client";
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useUser } from '@/app/context/UserContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Heart, Send, Search, User } from 'lucide-react';

import { 
  Building2, 
  Briefcase, 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  created_at: string;
}

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  created_at: string;
  salary_min?: number;
  salary_max?: number;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { user, token, isLoading: userLoading } = useUser();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'jobs'>('overview');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    itemId: number | null;
    itemName: string;
    type: 'job' | 'company';
  }>({
    isOpen: false,
    itemId: null,
    itemName: '',
    type: 'job'
  });

  useEffect(() => {
    console.log('Dashboard useEffect triggered');
    console.log('userLoading:', userLoading);
    console.log('user:', user);
    console.log('token:', token);
    
    // Only fetch data if we have a valid user and haven't already loaded data
    if (!userLoading && user && token && loading) {  // Add && loading check
      console.log('Conditions met, user role:', user.role);
      if (user.role === 'employer') {
        fetchEmployerData();
      } else {
        fetchJobSeekerData();
      }
    } else if (!userLoading && (!user || !token)) {
      // If user context is loaded but user/token is null, stop loading
      setLoading(false);
      console.log('No user/token, stopping loading state');
    } else {
      console.log('Conditions not met for fetching data');
    }
  }, [user, userLoading, token]); // Remove loading from dependencies to prevent loops

  const fetchEmployerData = async () => {
    console.log('Starting fetchEmployerData');
    try {
      setLoading(true);
      
      // Fetch user's companies
      try {
        const companiesResponse = await fetch('/api/user/companies', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Companies response status:', companiesResponse.status);
        
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          console.log('Companies data:', companiesData);
          setCompanies(companiesData.companies || []);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
  
      // Fetch user's jobs
      try {
        const jobsResponse = await fetch('/api/user/jobs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Jobs response status:', jobsResponse.status);
        
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          console.log('Jobs data:', jobsData);
          setJobs(jobsData.jobs || []);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    } catch (error) {
      console.error('Error in fetchEmployerData:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };
  
  const fetchJobSeekerData = async () => {
    console.log('Starting fetchJobSeekerData');
    try {
      setLoading(true);
      // For job seekers, we might fetch saved jobs, applications, etc.
      // This is a placeholder for now
    } catch (error) {
      console.error('Error fetching job seeker data:', error);
    } finally {
      console.log('Setting loading to false for job seeker');
      setLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: number, name: string, type: 'job' | 'company') => {
    setDeleteConfirm({
      isOpen: true,
      itemId: id,
      itemName: name,
      type: type
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.itemId) return;
    
    try {
      const endpoint = deleteConfirm.type === 'job' 
        ? `/api/jobs/${deleteConfirm.itemId}`
        : `/api/companies/${deleteConfirm.itemId}`;
        
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete ${deleteConfirm.type}`);
      }
      
      // Refresh the appropriate list
      if (deleteConfirm.type === 'job') {
        const jobsResponse = await fetch('/api/user/jobs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData.jobs || []);
        }
      } else {
        const companiesResponse = await fetch('/api/user/companies', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData.companies || []);
        }
      }
      
      // Close confirmation dialog
      setDeleteConfirm({
        isOpen: false,
        itemId: null,
        itemName: '',
        type: 'job'
      });
      
    } catch (error) {
      console.error('Delete error:', error);
      // You could add error toast notification here
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({
      isOpen: false,
      itemId: null,
      itemName: '',
      type: 'job'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    } else if (min) {
      return `€${min.toLocaleString()}+`;
    }
    return 'Salary not specified';
  };

  // Check both loading states
  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">{t('loadingDashboard') || 'Loading dashboard...'}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="container mx-auto p-8">        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcome') || `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'employer' 
              ? (t('employerSubtitle') || "Manage your companies and job postings") 
              : (t('jobseekerSubtitle') || "Track your job applications and saved positions")
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm text-gray-600 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('overview') || 'Overview'}
              </button>
              
              {user?.role === 'employer' && (
                <>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm text-gray-600 ${
                      activeTab === 'companies'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t('companies') || 'Companies'}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm text-gray-600 ${
                      activeTab === 'jobs'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t('jobs') || 'Jobs'}
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {user?.role === 'employer' ? (
              <>
                {/* Companies Count */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{t('totalCompanies') || 'Total Companies'}</p>
                      <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Jobs Count */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Briefcase className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{t('activeJobs') || 'Active Jobs'}</p>
                      <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-600">{t('quickActions') || 'Quick Actions'}</h3>
                  <div className="space-y-2">
                    <Link 
                      href="/companies/create"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('createCompany') || 'Create Company'}
                    </Link>
                    <Link 
                      href="/post-job"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('postJob') || 'Post New Job'}
                    </Link>
                    <Link 
                      href="/profile"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t('editProfile') || 'Edit Profile'}
                    </Link>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                {/* Job Seeker Overview */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{t('savedJobs') || 'Saved Jobs'}</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{t('applications') || 'Applications'}</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </motion.div>

                {/* Job Seeker Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <h3 className="text-lg font-semibold mb-4">{t('quickActions') || 'Quick Actions'}</h3>
                  <div className="space-y-2">
                    <Link 
                      href="/jobs"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {t('searchJobs') || 'Search Jobs'}
                    </Link>
                    <Link 
                      href="/profile"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {t('editProfile') || 'Edit Profile'}
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && user?.role === 'employer' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('myCompanies') || 'My Companies'}</h2>
              <Link 
                href="/companies/create"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addCompany') || 'Add Company'}
              </Link>
            </div>

            {companies.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{t('noCompanies') || 'No companies found'}</p>
                <Link 
                  href="/companies/create"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {t('createFirstCompany') || 'Create Your First Company'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md border border-gray-100 p-6"
                  >
                    <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
                    <p className="text-gray-600 mb-2">{company.industry}</p>
                    <p className="text-gray-500 text-sm mb-4 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">{company.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {t('created') || 'Created'}: {formatDate(company.created_at)}
                      </span>
                      <div className="flex flex-col space-y-1">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/companies/${company.id}`}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link 
                            href={`/companies/${company.id}/edit`}
                            className="text-gray-600 hover:text-gray-800 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(company.id, company.name, 'company')}
                          className="text-red-600 hover:text-red-800 p-1 flex justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && user?.role === 'employer' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t('myJobs') || 'My Jobs'}</h2>
              <Link 
                href="/post-job"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('postJob') || 'Post Job'}
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">{t('noJobs') || 'No jobs posted yet'}</p>
                <Link 
                  href="/post-job"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {t('postFirstJob') || 'Post Your First Job'}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-md border border-gray-100 p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                        <p className="text-gray-600 mb-2">{job.company_name}</p>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="mr-4">{job.location}</span>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(job.created_at)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                          <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {job.job_type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1 ml-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link 
                            href={`/jobs/${job.id}/edit`}
                            className="text-gray-600 hover:text-gray-800 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(job.id, job.title, 'job')}
                          className="text-red-600 hover:text-red-800 p-1 flex justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('confirmDelete') || 'Confirm Delete'}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('deleteConfirmMessage') || `Are you sure you want to delete "${deleteConfirm.itemName}"? This action cannot be undone.`}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {t('cancel') || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  {t('delete') || 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </main>
    </ProtectedRoute>
  );
}