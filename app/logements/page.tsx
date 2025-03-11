interface Logement {
    name: string;
    location: string;
  }
  
  interface LogementsListProprietes {
    Logements: Logement[];
  }
  
  export default function LogementsList({ Logements }: LogementsListProprietes) {
    return (
      <>
        {Logements.map((Logement) => (
          <div className="element-item">
            <h3>{Logement.name}</h3>
            <p>Emplacement: {Logement.location}</p>
          </div>
        ))}
      </>
    );
  }
  