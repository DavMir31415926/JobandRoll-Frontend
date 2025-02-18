

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params; // ✅ Await params before using it

  return (
    <main>
      <h1>Job Details (ID: {awaitedParams.id})</h1>
      <p>Full details about the job.</p>
    </main>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params; // ✅ Await params before using it
  return {
    title: `Job ${awaitedParams.id}`,
  };
}
