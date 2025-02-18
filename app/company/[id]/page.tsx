

export default async function CompanyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params; // ✅ Fix type issue

  return (
    <main>
      <h1>Company Details (ID: {awaitedParams.id})</h1>
      <p>Full details about the company.</p>
    </main>
  );
}




export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params; // ✅ Await params before using it
  return {
    title: `Company ${awaitedParams.id}`,
  };
}

