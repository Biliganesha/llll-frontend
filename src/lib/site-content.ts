/**
 * site-content.ts — sumber tunggal teks "tentang situs", disclaimer, dan kontak.
 * Dipakai oleh halaman /about dan FirstVisitModal (T&C saat pertama buka situs),
 * supaya kalimatnya konsisten dan mudah diperbarui di satu tempat (poin 17).
 */

export const MISSION_JP = "蓮ノ空の物語を、ファンの手で伝統にする";
export const MISSION_ID =
  "Menjadikan cerita 蓮ノ空 sebagai tradisi, oleh tangan para penggemar";

export const CONTACT_EMAIL = "safetyganesha@gmail.com";

export type AboutSection = {
  id: string;
  titleJp: string;
  titleId: string;
  contentJp: string;
  contentId: string;
};

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    id: "about",
    titleJp: "このサイトについて",
    titleId: "Tentang Website Ini",
    contentJp:
      "「Link! Like! Library! Legacy!」（略称：LLLL）は、スマートフォン向けアプリ「Link! Like! ラブライブ！（リンクラ）」で紡がれてきた『ラブライブ！蓮ノ空女学院スクールアイドルクラブ』の物語を、未来へ残すための非営利ファンメイド・アーカイブです。2026年6月30日のサービス終了とともに失われてしまう活動記録やスクールアイドルコネクトの映像・ストーリーを記録し、ファンの手で語り継いで「伝統」にしていくことを目的としています。",
    contentId:
      "“Link! Like! Library! Legacy!” (disingkat LLLL) adalah arsip fan-made non-profit untuk menyimpan kisah “Love Live! Hasunosora Gakuin School Idol Club” yang selama ini terjalin lewat aplikasi “Link! Like! Love Live! (Linkura)”, agar tetap lestari ke masa depan. Tujuannya merekam 活動記録 serta video dan cerita School Idol Connect yang akan hilang saat layanan berakhir pada 30 Juni 2026 — supaya kisah 蓮ノ空 terus diceritakan oleh tangan para penggemar hingga menjadi sebuah “tradisi”.",
  },
  {
    id: "disclaimer",
    titleJp: "免責事項",
    titleId: "Disclaimer",
    contentJp:
      "本サイトに掲載されている映像・画像・音楽・キャラクター・テキストなど、すべてのコンテンツの著作権および各種権利は、株式会社バンダイナムコエンターテインメント、ODD No.、ならびに『ラブライブ！』シリーズの関連権利者に帰属します。本サイトはファンによる非営利の保存活動であり、公式・権利者とは一切関係がなく、広告・課金・寄付などを含むいかなる方法でも収益を得ていません。本アーカイブは、作品への愛と敬意のもとに運営されています。",
    contentId:
      "Hak cipta dan seluruh hak atas semua konten di website ini (video, gambar, musik, karakter, teks, dan lainnya) sepenuhnya milik Bandai Namco Entertainment Inc., ODD No., serta para pemegang hak terkait seri “Love Live!”. Website ini adalah kegiatan pelestarian non-profit oleh penggemar, tidak berafiliasi dengan pihak resmi maupun pemegang hak, dan tidak memperoleh keuntungan dalam bentuk apa pun — termasuk iklan, pembayaran, maupun donasi. Arsip ini dijalankan atas dasar cinta dan rasa hormat terhadap karya.",
  },
  {
    id: "rights-holders",
    titleJp: "権利者の皆様へ",
    titleId: "Kepada Pemegang Hak Cipta",
    contentJp:
      "私たちは権利者の皆様の権利を最大限に尊重いたします。本サイトの内容に問題がある場合、または掲載コンテンツの削除をご希望の場合は、下記の連絡先までご連絡ください。確認のうえ、速やかに対応・削除いたします。コンテンツの公開は、公式の活動を応援し、より多くの方に作品の魅力を知っていただきたいという願いから行っているものです。",
    contentId:
      "Kami menghormati sepenuhnya hak para pemegang hak cipta. Apabila terdapat konten di website ini yang dianggap bermasalah, atau Anda menghendaki penghapusannya, silakan hubungi kontak di bawah ini. Kami akan memeriksa dan segera menindaklanjuti maupun menghapusnya. Penyajian konten ini dilakukan dengan harapan dapat mendukung kegiatan resmi dan memperkenalkan pesona karya kepada lebih banyak orang.",
  },
];

export const OFFICIAL_LINKS: { label: string; url: string }[] = [
  { label: "Love Live! 蓮ノ空 公式サイト", url: "https://www.lovelive-anime.jp/hasunosora/" },
  { label: "Link! Like! Love Live! 公式", url: "https://www.lovelive-anime.jp/llll/" },
  { label: "蓮ノ空 公式 YouTube", url: "https://www.youtube.com/@hasunosora_official" },
  { label: "蓮ノ空 公式 X (Twitter)", url: "https://x.com/hasunosora_SIC" },
];
