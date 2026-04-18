"use client";

import { useState } from "react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    titleJp: "このサイトについて",
    titleId: "Tentang Website Ini",
    contentJp:
      "「Link! Like! Library! Legacy!」（LLLL）は、ラブライブ！蓮ノ空女学院スクールアイドルクラブの物語を保存・共有するためのファンメイドアーカイブサイトです。アプリ「Link! Like! Love Live!（リンクラ）」のサービス終了（2026年6月30日）に伴い、蓮の空の物語をファンの手で守り伝えるために作られました。",
    contentId:
      "\"Link! Like! Library! Legacy!\" (LLLL) adalah website arsip fan-made untuk melestarikan dan membagikan cerita Love Live! Hasunosora Joshi Gakuin School Idol Club. Dibuat untuk menjaga cerita 蓮の空 tetap hidup dan tersebar setelah aplikasi \"Link! Like! Love Live! (Linkura)\" berakhir pada 30 Juni 2026.",
  },
  {
    titleJp: "免責事項",
    titleId: "Disclaimer",
    contentJp:
      "本サイトに掲載されているすべてのコンテンツ（映像、画像、音楽、テキスト等）の著作権は、株式会社バンダイナムコエンターテインメント、ODD No.、およびラブライブ！シリーズ関連権利者に帰属します。本サイトは非営利のファン活動であり、いかなる形でも収益化されていません。",
    contentId:
      "Seluruh konten yang ditampilkan di website ini (video, gambar, musik, teks, dll.) adalah hak cipta milik Bandai Namco Entertainment, ODD No., dan pemegang hak terkait seri Love Live!. Website ini adalah aktivitas fan non-profit dan tidak dimonetisasi dalam bentuk apapun.",
  },
  {
    titleJp: "権利者の皆様へ",
    titleId: "Kepada Pemegang Hak Cipta",
    contentJp:
      "権利者様からの削除要請があった場合は、速やかに対応いたします。お問い合わせは下記メールアドレスまでお願いいたします。",
    contentId:
      "Jika pemegang hak cipta meminta penghapusan konten, kami akan segera mematuhinya. Silakan hubungi melalui email di bawah ini.",
  },
  {
    titleJp: "公式リンク",
    titleId: "Link Resmi",
    links: [
      { label: "Love Live! 蓮ノ空 公式サイト", url: "https://www.lovelive-anime.jp/hasunosora/" },
      { label: "Link! Like! Love Live! 公式", url: "https://www.lovelive-anime.jp/llll/" },
      { label: "蓮ノ空 公式 YouTube", url: "https://www.youtube.com/@hasunosora_official" },
      { label: "蓮ノ空 公式 X (Twitter)", url: "https://x.com/hasunosora_SIC" },
    ],
  },
];

export default function AboutPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const content = (
    <div className="space-y-6">
      {/* Logo / Title */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-extrabold brand-gradient-text">
          LLLL
        </h1>
        <p className="text-sm text-text-dim mt-1">Link! Like! Library! Legacy!</p>
        <p className="text-xs text-text-dim mt-0.5">蓮の空アーカイブ</p>
      </div>

      {/* Mission statement */}
      <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, #fff0f5, #f0eaff)" }}>
        <p className="text-sm text-center italic" style={{ color: "var(--linkura-primary)" }}>
          蓮の空の物語を、ファンの手で伝統にする
        </p>
        <p className="text-xs text-center text-text-dim mt-1">
          Menjadikan cerita 蓮の空 sebagai tradisi, oleh tangan para penggemar
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map((section, i) => (
        <div key={i} className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-surface-2/50">
            <h2 className="text-sm font-bold">{section.titleJp}</h2>
            <p className="text-xs text-text-dim">{section.titleId}</p>
          </div>
          <div className="px-4 py-3">
            {section.contentJp && (
              <p className="text-sm leading-relaxed text-foreground/80">
                {section.contentJp}
              </p>
            )}
            {section.contentId && (
              <p className="text-xs leading-relaxed text-text-dim mt-2">
                {section.contentId}
              </p>
            )}
            {section.links && (
              <div className="space-y-2">
                {section.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Contact */}
      <div className="rounded-xl border border-border px-4 py-3">
        <h2 className="text-sm font-bold">お問い合わせ / Kontak</h2>
        <p className="text-xs text-text-dim mt-1">
          Email: <span className="text-primary">safetyganesha@gmail.com</span>
        </p>
      </div>

      {/* Tech credits */}
      <div className="text-center text-[11px] text-text-dim/50 py-4 space-y-1">
        <p>Built with Next.js + WordPress (WPGraphQL)</p>
        <p>Fan-made project — not affiliated with Bandai Namco or ODD No.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel="About" />
        <main className="flex-1 px-3 pt-3 pb-20 overflow-y-auto">
          {content}
        </main>
        <BottomNav
          onBack={() => router.back()}
          onMenu={() => setMenuOpen(!menuOpen)}
          onHome={() => router.push("/")}
          menuOpen={menuOpen}
        />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET ===== */}
      <div className="hidden sm:flex lg:hidden flex-1 flex-col min-h-screen bg-background">
        <main className="flex-1 px-6 py-6 max-w-2xl mx-auto w-full">
          {content}
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-2xl mx-auto w-full px-8 py-8">
          {content}
        </main>
      </div>
    </>
  );
}
