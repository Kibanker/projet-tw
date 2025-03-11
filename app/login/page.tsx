"use client";
 
import { useState, useTransition } from "react";
import { createUser } from "@/app/login/login";
import { useRouter } from "next/navigation";
 
export default function login_page() {
    const [feedback, setFeedback] = useState<string | null | undefined>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
 
    // Nous utilisons la Server Action directement dans le formulaire.
    // Next.js 14+ gère automatiquement la conversion du FormData en appel serveur.
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
 
        // Démarrer la transition pour éviter de bloquer l'UI
        startTransition(async () => {
            // Appel direct de la Server Action via l'attribut "action"
            const result = await createUser(new FormData(event.currentTarget));
            if (result?.success) {
                setFeedback(result.success);
                router.refresh();
            } else {
                setFeedback(result.error);
            }
        });
    }
 
    return (
        <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg">
            <h1 className="text-xl font-bold mb-4">Entrez vos Informations :</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="username"
                    placeholder="Votre nom"
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Votre mot de passe"
                    required
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className={`w-full py-2 rounded ${isPending ? "bg-gray-400" : "bg-blue-500 text-white"
                        }`}
                >
                    {isPending ? "Envoi en cours..." : "Envoyer"}
                </button>
            </form>
            {feedback && <p className="mt-2 text-center text-green-500">{feedback}</p>}
        </div>
    );
}