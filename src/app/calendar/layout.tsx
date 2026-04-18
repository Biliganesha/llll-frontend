import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "カレンダー — 蓮の空",
  description: "蓮の空のイベントカレンダー。エピソード配信日・スクコネ・誕生日を月別に確認。",
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
