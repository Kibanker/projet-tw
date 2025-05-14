interface HomePageProprietes {
    message: string;
    username?: string;
}

export default function HomePage({ message, username }: HomePageProprietes) {
    return (
        <div className="home">
            <h2>{message}</h2>
            {username ? ( 
                <>
                    <p>Bienvenue, {username} !</p>
                    <a href="/account">
                        <button className="btn-primary">Mon compte</button>
                    </a>
                    <a href="/logout">
                        <button className="btn-secondary">Se déconnecter</button>
                    </a>
                </> 
            ) : ( 
                <>
                    <a href="/login">
                        <button className="btn-secondary">Se connecter</button>
                    </a>
                    <a href="/create-user">
                        <button className="btn-secondary">S'inscrire</button>
                    </a>
                </>
            )}
        </div>
    );
}
