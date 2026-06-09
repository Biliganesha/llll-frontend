import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ゲームプレイアーカイブ — 蓮ノ空",
  description: "リンクラのゲームプレイ映像アーカイブ。ストーリーイベント・ガチャ・ライブショーの記録。",
};

export default function GameplayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
