import { RuledList, type RuledItem } from "@/components/shared/ruled-list";

const USES: RuledItem[] = [
  {
    n: "01",
    t: "Tu plata deja de perder valor",
    d: "Cada mes que duerme en pesos, la devaluación le cobra arriendo. En dólares, no.",
  },
  {
    n: "02",
    t: "Cobras del exterior sin perder",
    d: "Recibes en dólares y los cambias cuando la tasa te convenga, no cuando el banco decida.",
  },
  {
    n: "03",
    t: "Pagas suscripciones sin rechazos",
    d: "Netflix, Spotify, software: se cobran en dólares y se pagan desde tu saldo en dólares.",
  },
  {
    n: "04",
    t: "Ahorras para el viaje",
    d: "Guardas 100 dólares apenas te pagan, antes de que se conviertan en cualquier otra cosa.",
  },
];

/** "Cuatro razones para empezar hoy." Four claims of equal weight, so a ruled
 *  list rather than a card grid — see components/shared/ruled-list.tsx. */
export function Uses() {
  return (
    <RuledList
      eyebrow="PARA QUÉ SIRVE"
      title="Cuatro razones para empezar hoy."
      items={USES}
    />
  );
}
