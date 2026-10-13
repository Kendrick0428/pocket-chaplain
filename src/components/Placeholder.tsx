/** Highlights text still wrapped in [square brackets] so departments can spot what to replace. */
export function WithPlaceholders({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[") && p.endsWith("]") ? (
          <span key={i} className="placeholder" title="Placeholder: replace in the admin area">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
