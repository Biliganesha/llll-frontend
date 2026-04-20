import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-4xl font-extrabold brand-gradient-text mb-2">404</h1>
        <p className="text-lg font-bold text-foreground mb-1">
          ページが見つかりません
        </p>
        <p className="text-sm text-text-dim mb-6">
          Halaman tidak ditemukan. Mungkin halaman sudah dipindahkan atau dihapus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white brand-gradient-bg hover:opacity-90 transition-opacity"
          >
            ホームに戻る
          </Link>
          <Link
            href="/search"
            className="px-6 py-2.5 rounded-xl text-sm font-medium border border-border text-text-dim hover:text-foreground hover:border-primary transition-colors"
          >
            検索する
          </Link>
        </div>
      </div>
    </div>
  );
}
