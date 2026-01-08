// app/api/genesis/questions/route.ts (PAS page.tsx, mais route.ts !)

export async function GET() {
    const mockQuestions = [
      {
        id: 'Q_PROFIL_01',
        text: 'Quel est votre âge ?',
        response_type: 'Numérique',
        min: 18,
        max: 100,
      },
      {
        id: 'Q_PROFIL_02',
        text: 'Quel est votre sexe biologique ?',
        response_type: 'Choix unique',
        options: ['Homme', 'Femme'],
      },
      {
        id: 'Q_MET_01',
        text: 'Comment évaluez-vous votre niveau d\'énergie 1-2h après un repas ?',
        response_type: 'Échelle 1-10',
      },
      {
        id: 'Q_REC_01',
        text: 'Sur une échelle de 1 à 10, comment évaluez-vous votre niveau de stress global ?',
        response_type: 'Échelle 1-10',
      },
    ];
  
    return Response.json({ questions: mockQuestions });
  }