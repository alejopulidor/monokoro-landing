import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Nav } from "./site/nav";
import { FooterSlim } from "./site/footer";
import { Wordmark } from "./site/brand";
import { routing } from "@/i18n/routing";
import { LEGAL_LAST_UPDATED_ISO } from "@/lib/config";

/**
 * Generic renderer for the legal pages.
 *
 * /terms and /privacy are the same component pointed at a different message
 * namespace — the documents are structured JSON in `messages/*.json`, not JSX,
 * so counsel can rewrite a clause without touching the app. Supported blocks:
 *
 *   p       paragraphs before the lists
 *   ul      bullets
 *   pAfter  paragraphs after the lists (closing sentences)
 *   sub     nested h3 sections, each with its own p/ul/table
 *   kv      definition list (used for the responsible-party identity block)
 *   table   header row + body rows, horizontally scrollable on mobile
 *   contact a highlighted mailto card
 *
 * `{email}` anywhere in the copy is substituted from the `email` prop, so the
 * two documents share wording while routing replies to different inboxes.
 */

type Contact = { label: string; value: string; subjectHint?: string };
type Table = { headers: string[]; rows: string[][] };
type SubSection = {
  h: string;
  p?: string[];
  ul?: string[];
  pAfter?: string[];
  table?: Table;
};
type Section = {
  h: string;
  p?: string[];
  ul?: string[];
  pAfter?: string[];
  sub?: SubSection[];
  kv?: { k: string; v: string }[];
  contact?: Contact;
  table?: Table;
};

const fillEmail = (text: string, email: string) =>
  text.replace(/\{email\}/g, email);

const isEmail = (v: string) => /@/.test(v);

function Paragraphs({ list, email }: { list: string[]; email: string }) {
  return (
    <>
      {list.map((p, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {fillEmail(p, email)}
        </p>
      ))}
    </>
  );
}

function Bullets({ list, email }: { list: string[]; email: string }) {
  return (
    <ul className="mb-4 list-outside list-disc space-y-1.5 pl-5">
      {list.map((it, i) => (
        <li key={i}>{fillEmail(it, email)}</li>
      ))}
    </ul>
  );
}

function DataTable({ table }: { table: Table }) {
  return (
    // The wrapper scrolls, not the page: a wide table must never make the
    // whole document scroll sideways on a phone.
    <div className="-mx-2 my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-white/60">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="border-b border-[var(--color-line)] px-3 py-2 text-left font-semibold text-[var(--color-ink)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[var(--color-line)] last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MaybeMailto({ value }: { value: string }) {
  return isEmail(value) ? (
    <a className="text-[var(--color-teal)] underline" href={`mailto:${value}`}>
      {value}
    </a>
  ) : (
    <>{value}</>
  );
}

function ContactBlock({ contact, email }: { contact: Contact; email: string }) {
  const value = fillEmail(contact.value, email);
  return (
    <div className="card mt-3 p-4 sm:p-5">
      <div className="ff-m text-[11px] tracking-[0.12em] text-[var(--color-teal)]">
        {contact.label}
      </div>
      <div className="mt-1.5 text-lg font-semibold">
        <MaybeMailto value={value} />
      </div>
      {contact.subjectHint && (
        <div className="mt-2 text-xs text-[var(--color-faint)]">
          {fillEmail(contact.subjectHint, email)}
        </div>
      )}
    </div>
  );
}

function SectionBlock({ s, email }: { s: Section; email: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-[clamp(22px,2.8vw,30px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]">
        {s.h}
      </h2>
      {s.p && <Paragraphs list={s.p} email={email} />}
      {s.ul && <Bullets list={s.ul} email={email} />}
      {s.kv && (
        <dl className="my-4 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[180px_1fr]">
          {s.kv.map((kv, i) => (
            <div key={i} className="contents">
              <dt className="font-semibold text-[var(--color-ink)]">{kv.k}</dt>
              <dd>
                <MaybeMailto value={fillEmail(kv.v, email)} />
              </dd>
            </div>
          ))}
        </dl>
      )}
      {s.table && <DataTable table={s.table} />}
      {s.sub?.map((sub, i) => (
        <div key={i} className="mt-5">
          <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            {sub.h}
          </h3>
          {sub.p && <Paragraphs list={sub.p} email={email} />}
          {sub.ul && <Bullets list={sub.ul} email={email} />}
          {sub.table && <DataTable table={sub.table} />}
          {sub.pAfter && <Paragraphs list={sub.pAfter} email={email} />}
        </div>
      ))}
      {s.pAfter && <Paragraphs list={s.pAfter} email={email} />}
      {s.contact && <ContactBlock contact={s.contact} email={email} />}
    </section>
  );
}

export function LegalPage({
  namespace,
  email,
}: {
  namespace: "terms" | "privacy";
  email: string;
}) {
  const t = useTranslations(namespace);
  const tLegal = useTranslations("legal");
  const fmt = useFormatter();
  const locale = useLocale();
  const sections = t.raw("sections") as Section[];

  // Spanish is the binding version; any other locale gets a courtesy notice.
  const showTranslatedNotice = locale !== routing.defaultLocale;

  // Parsed and formatted as UTC so the rendered date does not shift a day for
  // a reader west of the meridian.
  const updated = fmt.dateTime(new Date(`${LEGAL_LAST_UPDATED_ISO}T00:00:00Z`), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <>
      <Nav />
      <main className="gutter pb-16 pt-[clamp(36px,6vw,72px)]">
        <article className="mx-auto max-w-[760px] text-[17px] leading-[1.7] text-[var(--color-muted)]">
          <Link
            href="/"
            className="ff-m mb-6 inline-flex items-center gap-2 text-[11px] tracking-[0.12em] text-[var(--color-faint)] hover:text-[var(--color-teal)]"
          >
            <span aria-hidden>←</span> {tLegal("backHome").toUpperCase()}
          </Link>

          <div className="mb-4">
            <Wordmark size={32} wordSize={20} />
          </div>

          <h1 className="mb-3 text-[clamp(34px,5.4vw,60px)] font-semibold leading-[0.98] tracking-[-0.042em] text-[var(--color-ink)] text-balance">
            {t("title")}
          </h1>
          <p className="ff-m mb-6 text-[11px] tracking-[0.12em] text-[var(--color-faint)]">
            {tLegal("lastUpdated").toUpperCase()}: {updated.toUpperCase()}
          </p>

          {showTranslatedNotice && (
            <div className="mb-8 rounded-xl border border-amber-500/25 bg-amber-100/60 px-4 py-3 text-sm text-amber-900">
              {tLegal("translatedNotice")}
            </div>
          )}

          <div className="mt-8">
            {sections.map((s, i) => (
              <SectionBlock key={i} s={s} email={email} />
            ))}
          </div>
        </article>
      </main>
      <FooterSlim />
    </>
  );
}
