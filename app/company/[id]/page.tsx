export default function CompanyPage({ params }: { params: { id: string } }) {
    return (
        <main>
            <h1>Company Profile (ID: {params.id})</h1>
            <p>Information about the company.</p>
        </main>
    );
}
