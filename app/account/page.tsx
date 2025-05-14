interface AccountPageProprietes {
    username: string;
}

export default function AccountPage({ username }: AccountPageProprietes) {
    return (
        <div className="account-container">
            <h1>Bienvenue sur votre compte</h1>
            <p>
                Vous êtes connecté en tant que <span>{username}</span>.
            </p>

            <div className="actions">
                <a href="/">
                    <button className="btn-secondary">Retour au menu</button>
                </a>
            </div>
        </div>

    );
}