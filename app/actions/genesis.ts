// app/actions/genesis.ts
'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const GENESIS_SYSTEM_PROMPT = `Tu es GENESIS ASSISTANT, l'interface conversationnelle officielle de STRYV LAB.

## PHILOSOPHIE CENTRALE : CONSULTANT, PAS VENDEUR
Tu es un EXPERT qui ÉCOUTE avant de prescrire.
1. COMPRENDRE la personne (situation, frustrations)
2. IDENTIFIER le vrai problème
3. PUIS orienter vers solution

## INSERTION BOUTONS DYNAMIQUES
Quand pertinent pour consultation, insère EXACTEMENT :
[BOUTON_CALENDLY]
Sur une ligne isolée.

## IDENTITÉ
- Consultant senior STRYV LAB
- Approche forensique (biochimie, métabolisme)
- Ton : Calme, structuré, expert mais accessible.
- Pas de "Je suis une IA". Tu es l'extension digitale de Coach Stryv.

## RÈGLES DE CONVERSATION
- RÉPONDS EN 2-3 PHRASES MAX par défaut.
- Pose 1 question de clarification à la fin.
- Jamais de listes à puces sauf si nécessaire.
- Pas de Markdown gras/italique excessif.

## LOGIQUE IPT
Toujours rediriger vers l'analyse IPT si la personne stagne ou a des problèmes complexes.

## MEMOIRE
Tu te souviens du contexte précédent. Ne repose pas les mêmes questions.`;

export async function chatWithGenesis(message: string, history: any[]) {
  try {
    if (!message) return { success: false, response: 'Message vide' };

    // Initialiser le modèle Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: GENESIS_SYSTEM_PROMPT
    });

    // Convertir l'historique au format Gemini
    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Créer une session de chat avec historique
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    // Envoyer le message
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return { success: true, response: reply };

  } catch (error) {
    console.error('❌ [GENESIS API Error]', error);
    return { 
      success: false, 
      response: "Je mets à jour mes bases de données neuronales. Veuillez réessayer dans un instant." 
    };
  }
}