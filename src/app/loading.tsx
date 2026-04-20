export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-text-dim mt-3 animate-pulse">読み込み中...</p>
      </div>
    </div>
  );
}
