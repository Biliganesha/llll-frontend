import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — LLLL 蓮の空アーカイブ",
  description: "LLLL（Link! Like! Library! Legacy!）について。免責事項・クレジット・公式リンク。",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
