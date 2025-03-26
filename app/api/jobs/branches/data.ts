// Define the base hierarchical structure for branch categories with multilingual support

interface SubCategory {
    id: string;
    name: string;
  }
  
  interface Category {
    id: string;
    name: string;
    subcategories: SubCategory[];
  }
  
  // Base structure with properly formatted names for both IDs and display names
  export const branchHierarchy = [
    {
      id: 'Technology & IT',
      name: 'Technology & IT',
      subcategories: [
        { id: 'Software Development', name: 'Software Development' },
        { id: 'IT Infrastructure', name: 'IT Infrastructure' },
        { id: 'Data Science', name: 'Data Science' },
        { id: 'Cybersecurity', name: 'Cybersecurity' },
        { id: 'AI & Machine Learning', name: 'AI & Machine Learning' },
        { id: 'Web Development', name: 'Web Development' },
        { id: 'Mobile Development', name: 'Mobile Development' },
        { id: 'DevOps', name: 'DevOps' },
        { id: 'Game Development', name: 'Game Development' },
        { id: 'Telecommunications', name: 'Telecommunications' },
        { id: 'Cloud Computing', name: 'Cloud Computing' },
        { id: 'Electronics', name: 'Electronics' }
      ]
    },
    {
      id: 'Healthcare & Medicine',
      name: 'Healthcare & Medicine',
      subcategories: [
        { id: 'Medical Practice', name: 'Medical Practice' },
        { id: 'Nursing', name: 'Nursing' },
        { id: 'Healthcare Administration', name: 'Healthcare Administration' },
        { id: 'Pharmaceuticals', name: 'Pharmaceuticals' },
        { id: 'Biotechnology', name: 'Biotechnology' },
        { id: 'Medical Research', name: 'Medical Research' },
        { id: 'Mental Health', name: 'Mental Health' },
        { id: 'Dental', name: 'Dental' },
        { id: 'Veterinary', name: 'Veterinary' },
        { id: 'Public Health', name: 'Public Health' },
        { id: 'Medical Devices', name: 'Medical Devices' },
        { id: 'Health Technology', name: 'Health Technology' }
      ]
    },
    {
      id: 'Finance & Banking',
      name: 'Finance & Banking',
      subcategories: [
        { id: 'Accounting', name: 'Accounting' },
        { id: 'Banking', name: 'Banking' },
        { id: 'Investment Banking', name: 'Investment Banking' },
        { id: 'Financial Analysis', name: 'Financial Analysis' },
        { id: 'Insurance', name: 'Insurance' },
        { id: 'Fintech', name: 'Fintech' },
        { id: 'Wealth Management', name: 'Wealth Management' },
        { id: 'Risk Management', name: 'Risk Management' },
        { id: 'Trading', name: 'Trading' },
        { id: 'Financial Planning', name: 'Financial Planning' },
        { id: 'Real Estate Finance', name: 'Real Estate Finance' },
        { id: 'Tax', name: 'Tax' }
      ]
    },
    {
      id: 'Engineering',
      name: 'Engineering',
      subcategories: [
        { id: 'Civil Engineering', name: 'Civil Engineering' },
        { id: 'Mechanical Engineering', name: 'Mechanical Engineering' },
        { id: 'Electrical Engineering', name: 'Electrical Engineering' },
        { id: 'Chemical Engineering', name: 'Chemical Engineering' },
        { id: 'Aerospace Engineering', name: 'Aerospace Engineering' },
        { id: 'Biomedical Engineering', name: 'Biomedical Engineering' },
        { id: 'Environmental Engineering', name: 'Environmental Engineering' },
        { id: 'Industrial Engineering', name: 'Industrial Engineering' },
        { id: 'Materials Engineering', name: 'Materials Engineering' },
        { id: 'Petroleum Engineering', name: 'Petroleum Engineering' },
        { id: 'Marine Engineering', name: 'Marine Engineering' },
        { id: 'Automotive Engineering', name: 'Automotive Engineering' }
      ]
    },
    {
      id: 'Construction & Architecture',
      name: 'Construction & Architecture',
      subcategories: [
        { id: 'Construction Management', name: 'Construction Management' },
        { id: 'Architecture', name: 'Architecture' },
        { id: 'Building Trades', name: 'Building Trades' },
        { id: 'Road Construction', name: 'Road Construction' },
        { id: 'Residential Construction', name: 'Residential Construction' },
        { id: 'Commercial Construction', name: 'Commercial Construction' },
        { id: 'Industrial Construction', name: 'Industrial Construction' },
        { id: 'Heavy Civil Construction', name: 'Heavy Civil Construction' },
        { id: 'Electrical Contracting', name: 'Electrical Contracting' },
        { id: 'Plumbing', name: 'Plumbing' },
        { id: 'HVAC', name: 'HVAC' },
        { id: 'Urban Planning', name: 'Urban Planning' }
      ]
    },
    {
      id: 'Manufacturing & Production',
      name: 'Manufacturing & Production',
      subcategories: [
        { id: 'Production Management', name: 'Production Management' },
        { id: 'Quality Assurance', name: 'Quality Assurance' },
        { id: 'Assembly', name: 'Assembly' },
        { id: 'Automotive Manufacturing', name: 'Automotive Manufacturing' },
        { id: 'Food Manufacturing', name: 'Food Manufacturing' },
        { id: 'Textile Manufacturing', name: 'Textile Manufacturing' },
        { id: 'Electronics Manufacturing', name: 'Electronics Manufacturing' },
        { id: 'Pharmaceutical Manufacturing', name: 'Pharmaceutical Manufacturing' },
        { id: 'Metal Manufacturing', name: 'Metal Manufacturing' },
        { id: 'Plastics Manufacturing', name: 'Plastics Manufacturing' },
        { id: 'Wood Manufacturing', name: 'Wood Manufacturing' },
        { id: 'Manufacturing Engineering', name: 'Manufacturing Engineering' }
      ]
    },
    {
      id: 'Energy & Utilities',
      name: 'Energy & Utilities',
      subcategories: [
        { id: 'Oil & Gas', name: 'Oil & Gas' },
        { id: 'Renewable Energy', name: 'Renewable Energy' },
        { id: 'Power Generation', name: 'Power Generation' },
        { id: 'Nuclear Energy', name: 'Nuclear Energy' },
        { id: 'Utilities Management', name: 'Utilities Management' },
        { id: 'Electricity Distribution', name: 'Electricity Distribution' },
        { id: 'Water Utilities', name: 'Water Utilities' },
        { id: 'Natural Gas', name: 'Natural Gas' },
        { id: 'Energy Efficiency', name: 'Energy Efficiency' },
        { id: 'Energy Storage', name: 'Energy Storage' },
        { id: 'Grid Infrastructure', name: 'Grid Infrastructure' },
        { id: 'Energy Trading', name: 'Energy Trading' }
      ]
    },
    {
      id: 'Sales & Marketing',
      name: 'Sales & Marketing',
      subcategories: [
        { id: 'Digital Marketing', name: 'Digital Marketing' },
        { id: 'Content Marketing', name: 'Content Marketing' },
        { id: 'Social Media Marketing', name: 'Social Media Marketing' },
        { id: 'SEO & SEM', name: 'SEO & SEM' },
        { id: 'Brand Management', name: 'Brand Management' },
        { id: 'Sales Management', name: 'Sales Management' },
        { id: 'Business Development', name: 'Business Development' },
        { id: 'Market Research', name: 'Market Research' },
        { id: 'Product Marketing', name: 'Product Marketing' },
        { id: 'Channel Sales', name: 'Channel Sales' },
        { id: 'Retail Sales', name: 'Retail Sales' },
        { id: 'Advertising', name: 'Advertising' }
      ]
    },
    {
      id: 'Design & Creative',
      name: 'Design & Creative',
      subcategories: [
        { id: 'Graphic Design', name: 'Graphic Design' },
        { id: 'UX/UI Design', name: 'UX/UI Design' },
        { id: 'Industrial Design', name: 'Industrial Design' },
        { id: 'Interior Design', name: 'Interior Design' },
        { id: 'Product Design', name: 'Product Design' },
        { id: 'Fashion Design', name: 'Fashion Design' },
        { id: 'Animation', name: 'Animation' },
        { id: 'Web Design', name: 'Web Design' },
        { id: 'Video Production', name: 'Video Production' },
        { id: 'Photography', name: 'Photography' },
        { id: 'Art Direction', name: 'Art Direction' },
        { id: 'Creative Direction', name: 'Creative Direction' }
      ]
    },
    {
      id: 'Education & Training',
      name: 'Education & Training',
      subcategories: [
        { id: 'K-12 Education', name: 'K-12 Education' },
        { id: 'Higher Education', name: 'Higher Education' },
        { id: 'Special Education', name: 'Special Education' },
        { id: 'Educational Administration', name: 'Educational Administration' },
        { id: 'Corporate Training', name: 'Corporate Training' },
        { id: 'E-Learning', name: 'E-Learning' },
        { id: 'Curriculum Development', name: 'Curriculum Development' },
        { id: 'Vocational Training', name: 'Vocational Training' },
        { id: 'Language Instruction', name: 'Language Instruction' },
        { id: 'Education Research', name: 'Education Research' },
        { id: 'Early Childhood Education', name: 'Early Childhood Education' },
        { id: 'Adult Education', name: 'Adult Education' }
      ]
    },
    {
      id: 'Human Resources',
      name: 'Human Resources',
      subcategories: [
        { id: 'Recruiting', name: 'Recruiting' },
        { id: 'HR Management', name: 'HR Management' },
        { id: 'Compensation & Benefits', name: 'Compensation & Benefits' },
        { id: 'Training & Development', name: 'Training & Development' },
        { id: 'HR Consulting', name: 'HR Consulting' },
        { id: 'Employee Relations', name: 'Employee Relations' },
        { id: 'HR Information Systems', name: 'HR Information Systems' },
        { id: 'Talent Management', name: 'Talent Management' },
        { id: 'Diversity & Inclusion', name: 'Diversity & Inclusion' },
        { id: 'Workforce Planning', name: 'Workforce Planning' },
        { id: 'Labor Relations', name: 'Labor Relations' },
        { id: 'Organizational Development', name: 'Organizational Development' }
      ]
    },
    {
      id: 'Legal',
      name: 'Legal',
      subcategories: [
        { id: 'Corporate Law', name: 'Corporate Law' },
        { id: 'Intellectual Property', name: 'Intellectual Property' },
        { id: 'Litigation', name: 'Litigation' },
        { id: 'Compliance', name: 'Compliance' },
        { id: 'Criminal Law', name: 'Criminal Law' },
        { id: 'Family Law', name: 'Family Law' },
        { id: 'Real Estate Law', name: 'Real Estate Law' },
        { id: 'Tax Law', name: 'Tax Law' },
        { id: 'Immigration Law', name: 'Immigration Law' },
        { id: 'Employment Law', name: 'Employment Law' },
        { id: 'Environmental Law', name: 'Environmental Law' },
        { id: 'Contract Law', name: 'Contract Law' }
      ]
    },
    {
      id: 'Government & Public Service',
      name: 'Government & Public Service',
      subcategories: [
        { id: 'Public Administration', name: 'Public Administration' },
        { id: 'Policy Development', name: 'Policy Development' },
        { id: 'Government Affairs', name: 'Government Affairs' },
        { id: 'International Relations', name: 'International Relations' },
        { id: 'Urban Planning Gov', name: 'Urban Planning' },
        { id: 'Emergency Management', name: 'Emergency Management' },
        { id: 'Public Safety', name: 'Public Safety' },
        { id: 'Military', name: 'Military' },
        { id: 'Economic Development', name: 'Economic Development' },
        { id: 'Public Health Policy', name: 'Public Health Policy' },
        { id: 'Social Services', name: 'Social Services' },
        { id: 'Regulatory Affairs', name: 'Regulatory Affairs' }
      ]
    },
    {
      id: 'Agriculture & Forestry',
      name: 'Agriculture & Forestry',
      subcategories: [
        { id: 'Farming', name: 'Farming' },
        { id: 'Livestock', name: 'Livestock' },
        { id: 'Agricultural Science', name: 'Agricultural Science' },
        { id: 'Forestry', name: 'Forestry' },
        { id: 'Fisheries', name: 'Fisheries' },
        { id: 'Agribusiness', name: 'Agribusiness' },
        { id: 'Organic Farming', name: 'Organic Farming' },
        { id: 'Agricultural Engineering', name: 'Agricultural Engineering' },
        { id: 'Food Science', name: 'Food Science' },
        { id: 'Horticulture', name: 'Horticulture' },
        { id: 'Agronomy', name: 'Agronomy' },
        { id: 'Precision Agriculture', name: 'Precision Agriculture' }
      ]
    },
    {
      id: 'Transportation & Logistics',
      name: 'Transportation & Logistics',
      subcategories: [
        { id: 'Logistics Management', name: 'Logistics Management' },
        { id: 'Supply Chain', name: 'Supply Chain' },
        { id: 'Freight Shipping', name: 'Freight Shipping' },
        { id: 'Warehousing', name: 'Warehousing' },
        { id: 'Commercial Driving', name: 'Commercial Driving' },
        { id: 'Aviation', name: 'Aviation' },
        { id: 'Rail Transport', name: 'Rail Transport' },
        { id: 'Maritime Shipping', name: 'Maritime Shipping' },
        { id: 'Fleet Management', name: 'Fleet Management' },
        { id: 'Transportation Planning', name: 'Transportation Planning' },
        { id: 'Import & Export', name: 'Import & Export' },
        { id: 'Last Mile Delivery', name: 'Last Mile Delivery' }
      ]
    },
    {
      id: 'Hospitality & Tourism',
      name: 'Hospitality & Tourism',
      subcategories: [
        { id: 'Hotel Management', name: 'Hotel Management' },
        { id: 'Restaurant Management', name: 'Restaurant Management' },
        { id: 'Food & Beverage', name: 'Food & Beverage' },
        { id: 'Event Planning', name: 'Event Planning' },
        { id: 'Tourism', name: 'Tourism' },
        { id: 'Culinary Arts', name: 'Culinary Arts' },
        { id: 'Catering', name: 'Catering' },
        { id: 'Hospitality Management', name: 'Hospitality Management' },
        { id: 'Travel Agency', name: 'Travel Agency' },
        { id: 'Cruise Lines', name: 'Cruise Lines' },
        { id: 'Attractions & Entertainment', name: 'Attractions & Entertainment' },
        { id: 'Casino & Gaming', name: 'Casino & Gaming' }
      ]
    },
    {
      id: 'Retail & Consumer Goods',
      name: 'Retail & Consumer Goods',
      subcategories: [
        { id: 'Retail Management', name: 'Retail Management' },
        { id: 'Merchandising', name: 'Merchandising' },
        { id: 'Store Operations', name: 'Store Operations' },
        { id: 'E-Commerce', name: 'E-Commerce' },
        { id: 'Consumer Products', name: 'Consumer Products' },
        { id: 'Luxury Goods', name: 'Luxury Goods' },
        { id: 'Apparel & Fashion', name: 'Apparel & Fashion' },
        { id: 'Category Management', name: 'Category Management' },
        { id: 'Purchasing & Buying', name: 'Purchasing & Buying' },
        { id: 'Retail Analytics', name: 'Retail Analytics' },
        { id: 'Visual Merchandising', name: 'Visual Merchandising' },
        { id: 'Customer Experience', name: 'Customer Experience' }
      ]
    },
    {
      id: 'Media & Entertainment',
      name: 'Media & Entertainment',
      subcategories: [
        { id: 'Broadcasting', name: 'Broadcasting' },
        { id: 'Film Production', name: 'Film Production' },
        { id: 'Music', name: 'Music' },
        { id: 'Publishing', name: 'Publishing' },
        { id: 'Digital Media', name: 'Digital Media' },
        { id: 'Gaming Industry', name: 'Gaming Industry' },
        { id: 'Advertising Agencies', name: 'Advertising Agencies' },
        { id: 'PR & Communications', name: 'PR & Communications' },
        { id: 'Sports Management', name: 'Sports Management' },
        { id: 'Talent Management Media', name: 'Talent Management' },
        { id: 'Entertainment Law', name: 'Entertainment Law' },
        { id: 'Content Creation', name: 'Content Creation' }
      ]
    },
    {
      id: 'Real Estate & Property',
      name: 'Real Estate & Property',
      subcategories: [
        { id: 'Residential Real Estate', name: 'Residential Real Estate' },
        { id: 'Commercial Real Estate', name: 'Commercial Real Estate' },
        { id: 'Property Management', name: 'Property Management' },
        { id: 'Real Estate Development', name: 'Real Estate Development' },
        { id: 'Real Estate Investment', name: 'Real Estate Investment' },
        { id: 'Facilities Management', name: 'Facilities Management' },
        { id: 'Leasing', name: 'Leasing' },
        { id: 'Real Estate Appraisal', name: 'Real Estate Appraisal' },
        { id: 'Mortgage Lending', name: 'Mortgage Lending' },
        { id: 'Real Estate Brokerage', name: 'Real Estate Brokerage' },
        { id: 'Property Investment', name: 'Property Investment' },
        { id: 'Real Estate Marketing', name: 'Real Estate Marketing' }
      ]
    },
    {
      id: 'Nonprofit & NGO',
      name: 'Nonprofit & NGO',
      subcategories: [
        { id: 'Nonprofit Management', name: 'Nonprofit Management' },
        { id: 'Fundraising', name: 'Fundraising' },
        { id: 'Grant Writing', name: 'Grant Writing' },
        { id: 'Program Management', name: 'Program Management' },
        { id: 'Volunteer Coordination', name: 'Volunteer Coordination' },
        { id: 'International Development', name: 'International Development' },
        { id: 'Humanitarian Aid', name: 'Humanitarian Aid' },
        { id: 'Community Outreach', name: 'Community Outreach' },
        { id: 'Advocacy', name: 'Advocacy' },
        { id: 'Social Enterprise', name: 'Social Enterprise' },
        { id: 'Environmental Conservation', name: 'Environmental Conservation' },
        { id: 'Human Rights', name: 'Human Rights' }
      ]
    },
    {
      id: 'Science & Research',
      name: 'Science & Research',
      subcategories: [
        { id: 'Life Sciences', name: 'Life Sciences' },
        { id: 'Physical Sciences', name: 'Physical Sciences' },
        { id: 'Environmental Science', name: 'Environmental Science' },
        { id: 'Social Sciences', name: 'Social Sciences' },
        { id: 'Research & Development', name: 'Research & Development' },
        { id: 'Laboratory Science', name: 'Laboratory Science' },
        { id: 'Astronomy', name: 'Astronomy' },
        { id: 'Geology', name: 'Geology' },
        { id: 'Chemistry', name: 'Chemistry' },
        { id: 'Physics', name: 'Physics' },
        { id: 'Neuroscience', name: 'Neuroscience' },
        { id: 'Materials Science', name: 'Materials Science' }
      ]
    },
    {
      id: 'Other Industries',
      name: 'Other Industries',
      subcategories: [
        { id: 'Security Services', name: 'Security Services' },
        { id: 'Crafts & Trades', name: 'Crafts & Trades' },
        { id: 'Personal Services', name: 'Personal Services' },
        { id: 'Consulting', name: 'Consulting' },
        { id: 'Home Services', name: 'Home Services' },
        { id: 'Waste Management', name: 'Waste Management' },
        { id: 'Arts & Culture', name: 'Arts & Culture' },
        { id: 'Fitness & Wellness', name: 'Fitness & Wellness' },
        { id: 'Funeral Services', name: 'Funeral Services' },
        { id: 'Pet Services', name: 'Pet Services' },
        { id: 'Religious Organizations', name: 'Religious Organizations' },
        { id: 'Professional Services', name: 'Professional Services' }
      ]
    }
  ];
  
  // Function to get a flat list of all branch names
  export function getAllBranchNames() {
    const allBranches = [];
    for (const category of branchHierarchy) {
      allBranches.push(category.name);
      for (const subcat of category.subcategories) {
        allBranches.push(subcat.name);
      }
    }
    return allBranches;
  }
  
  // Legacy branch mapping to properly formatted names
  export const legacyBranchMapping: { [key: string]: string } = {
    'construction-management': 'Construction Management',
    'construction': 'Construction',
    'Electric': 'Electrical Engineering',
    'software-development': 'Software Development',
    'it-infrastructure': 'IT Infrastructure',
    'data-science': 'Data Science',
    'cybersecurity': 'Cybersecurity',
    'ai-ml': 'AI & Machine Learning',
    'web-development': 'Web Development',
    'mobile-development': 'Mobile Development',
    'devops': 'DevOps',
    'game-development': 'Game Development',
    'telecommunications': 'Telecommunications',
    'cloud-computing': 'Cloud Computing',
    'electronics': 'Electronics',
    'healthcare': 'Healthcare',
    'medical-practice': 'Medical Practice',
    'nursing': 'Nursing',
    'healthcare-admin': 'Healthcare Administration',
    'pharmaceuticals': 'Pharmaceuticals',
    'biotechnology': 'Biotechnology',
    'medical-research': 'Medical Research',
    'mental-health': 'Mental Health',
    'dental': 'Dental',
    'veterinary': 'Veterinary',
    'public-health': 'Public Health',
    'medical-devices': 'Medical Devices',
    'health-tech': 'Health Technology',
    'finance': 'Finance',
    'accounting': 'Accounting',
    'banking': 'Banking',
    'investment-banking': 'Investment Banking',
    'financial-analysis': 'Financial Analysis',
    'insurance': 'Insurance',
    'fintech': 'Fintech',
    'wealth-management': 'Wealth Management',
    'risk-management': 'Risk Management',
    'trading': 'Trading',
    'financial-planning': 'Financial Planning',
    'real-estate-finance': 'Real Estate Finance',
    'tax': 'Tax',
    'manufacturing': 'Manufacturing',
    'Energy & Utilities': 'Energy'
    // Add more mappings as needed for all your branch IDs
  };
  
  // Function to map legacy branch names to new branch structure
  export function mapLegacyBranchToNew(legacyBranch: string) {
    return legacyBranchMapping[legacyBranch] || legacyBranch;
  }