interface LoginPageProprietes {
    error?: string;
  }
  
  export default function LoginPage({ error }: LoginPageProprietes) {
    return (
      <div className="login">
        <h1>Connexion</h1>
        
        {error && <p className="error">{error}</p>}  {/*affiche error si elle existe sinon rien*/}
  
        <form action="/login" method="POST" className="form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="btn-primary">
            Se connecter
          </button>
        </form>
  
        <a href="/create-user">
          <button className="btn-secondary">Créer un compte</button>
        </a>
      </div>
    );
  }
  