import { type FallbackProps } from 'react-error-boundary';

export function GlobalError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <p>Something went wrong - {String(error)}</p>
      <button onClick={() => resetErrorBoundary()}>Retry</button>
    </div>
  );
}
