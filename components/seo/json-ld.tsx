/**
 * Serializes JSON-LD into a script tag.
 *
 * Exists to centralize one escape: a stray `</script>` inside any string would
 * close the tag early. Keeping it here means no call site can forget it — and
 * the FAQ answers do contain user-authored copy.
 */
export function JsonLd({ data }: { data: object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
