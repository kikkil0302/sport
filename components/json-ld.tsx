/**
 * Injecte un bloc de données structurées JSON-LD. Le contenu provient
 * uniquement de nos propres constantes (jamais d'entrée utilisateur),
 * donc `dangerouslySetInnerHTML` est sûr ici.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
