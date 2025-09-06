export default function Figure({ src, alt = '', caption, credit }) {
  if (!src) {
    return <figure>{caption}{credit ? ` (${credit})` : ''}</figure>;
  }
  return (
    <figure>
      <img src={src} alt={alt} />
      {(caption || credit) && <figcaption>{caption}{credit ? ` — ${credit}` : ''}</figcaption>}
    </figure>
  );
}
