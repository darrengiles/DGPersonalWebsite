export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className="size-10 rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
    </div>
  );
}
