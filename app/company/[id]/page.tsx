// Import necessary Next.js types
import { Metadata } from 'next';

// Make the page function async
export default async function CompanyPage({ params }: { params: { id: string } }) {
  // Await the params to ensure the id is available
  const { id } = await params;
  
  if (!id) {
    return <p>Loading...</p>;
  }

  const decodedId = decodeURIComponent(id);

  return (
    <div>
      <h1>Company {decodedId}</h1>
      {/* other content */}
    </div>
  );
}

// Metadata generation function (also async)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return {
      title: "Company",
      description: "Loading...",
    };
  }
  const decodedId = decodeURIComponent(id);

  return {
    title: `Company ${decodedId}`,
    description: "Company details",
  };
}
