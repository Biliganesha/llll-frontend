import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "相関図 — 蓮ノ空",
  description: "蓮ノ空メンバーの相関図。ユニット・期生ごとの関係を視覚的に表示します。",
};

export default function RelationshipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
