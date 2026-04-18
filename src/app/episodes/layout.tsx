import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "活動記録 — 蓮の空",
  description: "蓮の空の活動記録（エピソード）一覧。リンクラの物語をタイムラインで振り返る。",
};

export default function EpisodesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
