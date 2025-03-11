"use server";

import { revalidatePath } from "next/cache";
 
export async function createUser(formData: FormData) {
  // Récupération et validation des données
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
 
  if (!username || !password) {
    return { error: "Tous les champs sont requis." };
  }
 
  // Simulation d'un délai réseau (1 seconde)
  await new Promise((resolve) => setTimeout(resolve, 1000));
 
  // Log en console côté serveur (pour la démo)
  console.log("Message reçu :", { username,password });
 
  // Optionnel : invalider le cache de la page /create-user pour rafraîchir les données
  revalidatePath("/create-user");
 
  return { success: "Connexion établie" };
}


// LIER A LA BASE DE DONNEE