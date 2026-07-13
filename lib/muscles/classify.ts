/**
 * Range un maillage anatomique du modèle 3D (muscles.glb, noms anglais type
 * « long head of biceps brachii ») dans l'un des 18 groupes musculaires fins
 * (cf. groups.ts) — ou `null` s'il n'est pas ciblé (rien, en pratique : les 72
 * muscles du modèle sont tous couverts ; le squelette est traité à part).
 *
 * L'ORDRE compte : on teste les jambes avant les bras pour que « biceps
 * femoris » (ischio) parte en jambes et non en biceps, et on cible les mots
 * précis (« teres major/minor », « extensor digitorum longus »…) pour ne pas
 * confondre bras et jambe.
 */
export type GroupId = string;

export function classify(rawName: string): GroupId | null {
  // three.js remplace les espaces des noms par des underscores au chargement
  // (« biceps brachii » → « biceps_brachii ») : on les reconvertit en espaces,
  // sinon les muscles à plusieurs mots ne seraient plus reconnus.
  const n = rawName.toLowerCase().replace(/[_\s]+/g, " ");

  // ----- Cou -----
  if (/sternocleidomastoid|omohyoid|sternohyoid|hyoid|scalen|splenius/.test(n)) return "cou";

  // ----- Jambes (avant les bras) -----
  if (
    /gastrocnemius|soleus|calcaneal|tibialis|fibularis|peroneus|plantaris|popliteus|hallucis|digitorum longus/.test(
      n,
    )
  )
    return "mollets";
  if (/biceps femoris|semimembranosus|semitendinosus/.test(n)) return "ischios";
  if (/adductor|pectineus|gracilis/.test(n)) return "adducteurs";
  if (/rectus femoris|vastus|sartorius/.test(n)) return "quadriceps";
  if (/gluteus|tensor fasciae/.test(n)) return "fessiers";

  // ----- Torse -----
  if (/iliocostalis|longissimus|spinalis|erector|multifidus|quadratus lumborum/.test(n))
    return "lombaires";
  if (/serratus/.test(n)) return "dentele";
  if (/latissimus|teres major/.test(n)) return "dorsaux";
  if (/infraspinatus|supraspinatus|subscapularis|teres minor/.test(n)) return "coiffe";
  if (/trapezius/.test(n)) return "trapezes";
  if (/pectoralis/.test(n)) return "pectoraux";
  if (/abdominal|abdominis|pyramidalis/.test(n)) return "abdominaux";
  if (/oblique/.test(n)) return "obliques";

  // ----- Bras -----
  if (/deltoid/.test(n)) return "deltoides";
  if (/biceps brachii|brachialis|coracobrachialis/.test(n)) return "biceps";
  if (/triceps|anconeus/.test(n)) return "triceps";
  if (
    /pronator|flexor carpi|flexor digitorum superficialis|flexor pollicis|palmaris|extensor carpi|extensor digitorum$|extensor digiti|extensor pollicis|abductor pollicis|brachioradialis|supinator/.test(
      n,
    )
  )
    return "avant-bras";

  return null;
}
