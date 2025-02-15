type Params = {
    params: {
      id: string;
    };
  };
  
  export default function CompanyPage({ params }: Params) {
    const { id } = params;
    return (
      <div>
        <h1>Company Profile</h1>
        <p>Company ID: {id}</p>
      </div>
    );
  }
  

