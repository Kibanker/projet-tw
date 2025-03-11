import { ReactNode } from 'react';
import "./globals.css";

interface LayoutProprietes {
  children: ReactNode; // contenu spécifique de chaque page
}

export const metadata = {
  title: 'TITRE_APP',
};

export default function RootLayout({ children }: LayoutProprietes) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <header className="header">
          <div className="container">
            <h1>Mon Application</h1>
            <nav>
              <a href="/">Accueil</a>
            </nav>
          </div>
        </header>

        <main>
          <div className="container">
            {children} {/* Le contenu spécifique de chaque page sera inséré ici */}
          </div>
        </main>
      </body>
    </html>
  );
}