import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jobandroll-backend-production.up.railway.app';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jopoly.com';

  try {
    // Fetch all jobs
    const jobsResponse = await fetch(`${backendUrl}/api/jobs/search?limit=1000`);
    const jobsData = await jobsResponse.json();
    const jobs = jobsData.jobs || [];

    // Fetch all companies
    const companiesResponse = await fetch(`${backendUrl}/api/companies?limit=1000`);
    const companiesData = await companiesResponse.json();
    const companies = companiesData.companies || [];

    // Generate job URLs
    const jobUrls = jobs.map((job: any) => ({
      url: `${siteUrl}/jobs/${job.id}`,
      lastModified: new Date(job.updated_at || job.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Generate company URLs
    const companyUrls = companies.map((company: any) => ({
      url: `${siteUrl}/companies/${company.id}`,
      lastModified: new Date(company.updated_at || company.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Static pages
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${siteUrl}/jobs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${siteUrl}/companies`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${siteUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${siteUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...jobUrls,
      ...companyUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the homepage if fetch fails
    return [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}