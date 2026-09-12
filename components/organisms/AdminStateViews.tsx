export function EmptyAdminView({ title, message }: { title?: string; message: string }) {
  return <section className="zopping-page">{title ? <h1>{title}</h1> : null}<div className="zopping-empty"><span aria-hidden="true">▧</span><p>{message}</p></div></section>;
}

export function LoadingAdminView({ title }: { title?: string }) {
  return (
    <section className="zopping-page" aria-busy="true" aria-label="Loading content">
      {title ? <h1>{title}</h1> : null}
      <div className="zopping-skeleton-table">
        <div className="zopping-skeleton-heading">{Array.from({ length: 5 }, (_, index) => <span key={index} className="zopping-skeleton-line" />)}</div>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <div key={rowIndex} className="zopping-skeleton-row">{Array.from({ length: 5 }, (_, cellIndex) => <span key={cellIndex} className={`zopping-skeleton-line ${cellIndex === 1 ? "wide" : ""}`} />)}</div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </section>
  );
}
