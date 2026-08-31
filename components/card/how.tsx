import { SectionHead } from "@/components/shared/section-head";
import { AgentChat } from "@/components/shared/agent-chat";
import { ColoredSteps } from "@/components/shared/colored-steps";
import { CARD_CHAT, CARD_CHAT_MS, CARD_STEPS } from "@/content/card";

/** "Dos mensajes y ya tienes tarjeta." The chat plays the promise; the three
 *  cards next to it state it. */
export function CardHow() {
  return (
    <section id="como" className="sec-lg gutter">
      <div className="shell">
        <SectionHead
          eyebrow="CÓMO SE CREA"
          title="Dos mensajes y ya tienes tarjeta."
          lede="No hay formulario, no hay sucursal, no hay espera de días hábiles. Le escribes al agente, confirmas y los datos de la tarjeta llegan al chat."
        />

        <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap gap-5">
          <AgentChat
            script={CARD_CHAT}
            durations={CARD_CHAT_MS}
            label="Ejemplo de la conversación en WhatsApp: pides tu tarjeta, confirmas el monto y los datos llegan al chat."
          />
          <ColoredSteps steps={CARD_STEPS} />
        </div>
      </div>
    </section>
  );
}
