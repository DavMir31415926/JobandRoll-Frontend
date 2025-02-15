export default function JobDetailsPage({ params }: { params: { id: string } }) {
    return (
        <main>
            <h1>Job Details (ID: {params.id})</h1>
            <p>Full description of the job offer.</p>
        </main>
    );
}
