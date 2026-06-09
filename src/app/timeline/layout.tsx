import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "タイムライン — 蓮ノ空",
  description: "蓮ノ空3年間の物語を時系列で振り返るタイムライン。活動記録・スクコネ・誕生日を一覧表示。",
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
