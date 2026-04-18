import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "検索 — 蓮の空",
  description: "蓮の空アーカイブ内のエピソード・スクコネ・メンバー・ユニットを横断検索。",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
