interface CreateUserProprietes {
    error?: string;
    reussite?: string;
  }
  
  export default function CreateUser({ error, reussite }: CreateUserProprietes) {
    return (
      <div className="create-user">
        <h1>Créer un utilisateur</h1>
  
        {error && <p className="error">{error}</p>}
  
        {reussite && <p className="reussite">{reussite}</p>}
  
        <form action="/create-user" method="POST" className="form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="btn-primary">
            Créer l'utilisateur
          </button>
        </form>
  
        <a href="/">
          <button className="btn-secondary">Retour à l'accueil</button>
        </a>
      </div>
    );
  }
  