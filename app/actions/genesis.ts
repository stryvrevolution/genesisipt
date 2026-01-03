// app/actions/genesis.ts
'use server'

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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

    // Préparation de l'historique pour l'API
    const cleanHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })) as any[];

    // Ajout du message actuel
    cleanHistory.push({ role: 'user', content: message });

    // Appel API (Côté Serveur = Sécurisé)
    const response = await anthropic.messages.create({
      // C'est cette version précise (Juin) qui fonctionne pour tout le monde :
      model: "claude-sonnet-4-20250514",
      
      max_tokens: 1024,
      messages: messages,
    });

    const textBlock = response.content[0];
    const reply = textBlock.type === 'text' ? textBlock.text : '...';

    return { success: true, response: reply };

  } catch (error) {
    console.error('❌ [GENESIS API Error]', error);
    return { success: false, response: "Je mets à jour mes bases de données neuronales. Veuillez réessayer dans un instant." };
  }
}