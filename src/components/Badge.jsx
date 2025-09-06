export default function Badge({ tone = 'yellow', children }) {
  return <span>[{tone}] {children}</span>;
}
