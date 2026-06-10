import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "声優 / Seiyuu — 蓮ノ空アーカイブ",
  description: "蓮ノ空女学院スクールアイドルクラブのキャスト（声優）一覧・プロフィール。",
};

export default function SeiyuuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
