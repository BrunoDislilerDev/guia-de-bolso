/**
 * Injeta JSON-LD no documento (Server Component).
 * @param {{ data: object|object[] }} props
 * @returns {import('react').JSX.Element}
 */
export default function JsonLdScript({ data }) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload.length === 1 ? payload[0] : payload),
      }}
    />
  );
}
