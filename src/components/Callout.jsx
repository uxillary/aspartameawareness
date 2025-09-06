export default function Callout({ type = 'note', children }) {
  return <div>[{type}] {children}</div>;
}
