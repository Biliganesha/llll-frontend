import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "検索 — 蓮ノ空",
  description: "蓮ノ空アーカイブ内のエピソード・スクコネ・メンバー・ユニットを横断検索。",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
