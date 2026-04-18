import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "スクールアイドルコネクト — LLLL 蓮の空アーカイブ",
  description: "スクコネ（WithxMEETS・FesxLIVE・WithxSTATION・MV）のアーカイブ。蓮の空のスクールアイドルコネクト配信を振り返る。",
};

export default function SukukoneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
