import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メンバー — LLLL 蓮の空アーカイブ",
  description: "蓮ノ空女学院スクールアイドルクラブのメンバー一覧。プロフィール・ユニット情報。",
};

export default function CharactersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
