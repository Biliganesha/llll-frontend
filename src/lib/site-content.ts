/**
 * site-content.ts — sumber tunggal teks "tentang situs", disclaimer, dan kontak.
 * Dipakai oleh halaman /about dan FirstVisitModal (T&C saat pertama buka situs),
 * supaya kalimatnya konsisten dan mudah diperbarui di satu tempat (poin 17).
 */

export const MISSION_JP = "蓮ノ空の物語を、ファンの手で伝統にする";
export const MISSION_ID =
  "Menjadikan cerita Hasunosora sebagai tradisi, oleh tangan para penggemar";

export const CONTACT_EMAIL = "faris.wa2099@gmail.com";

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
      "“Link! Like! Library! Legacy!” (disingkat LLLL) adalah arsip fan-made non-profit untuk menyimpan kisah “Love Live! Hasunosora Gakuin School Idol Club” yang selama ini terjalin lewat aplikasi “Link! Like! Love Live! (Linkura)”, agar tetap lestari ke masa depan. Tujuannya merekam Catatan Aktivitas (活動記録) serta video dan cerita School Idol Connect yang akan hilang saat layanan berakhir pada 30 Juni 2026 — supaya kisah Hasunosora terus diceritakan oleh tangan para penggemar hingga menjadi sebuah “tradisi”.",
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
    // Teks revisi atasan (2026-06-11) — nada penuh harapan + membuka ruang diskusi/nego.
    contentJp:
      "蓮ノ空女学院スクールアイドルクラブの物語を生み出してくださった制作者の皆様、そして著作権者の皆様に、心の底から感謝申し上げます。この素晴らしい作品との出会いは、私たちにとって小さな奇跡のように感じられ、心から幸せに思っております。\n\nこのウェブサイトは、蓮ノ空女学院スクールアイドルクラブという物語への愛と感謝の気持ちから、純粋な想いで生まれたものです。蓮ノ空が描く「伝統」というテーマは、私たちの心に深く響きました。ファンとして、私たちはこの「伝統」の翼を広げ、これからも多くの方々に知っていただき、感じていただけることを願っております。\n\nこのウェブサイトは、Odd Number、Bushiroad、その他関係者の皆様とは一切関係がなく、非営利で運営されております。いかなる形でも収益を得ることはなく、掲載されているすべてのコンテンツの著作権は、正当な権利者の皆様に帰属いたします。\n\n私たちは著作権者の皆様への敬意を持って、このウェブサイトを運営しております。本サイトおよび掲載内容に関してお話しいただきたいことがございましたら、いつでも歓迎いたします。皆様との繋がりを大切に、下記の連絡先までお気軽にご連絡くださいませ。",
    contentId:
      "Dengan sepenuh hati, kami menyampaikan rasa terima kasih yang sebesar-besarnya kepada para kreator dan pemegang hak cipta yang telah menghadirkan kisah 蓮ノ空女学院スクールアイドルクラブ ke dunia. Pertemuan kami dengan karya yang luar biasa ini terasa seperti sebuah keajaiban kecil yang sangat kami syukuri.\n\nWebsite ini lahir murni dari rasa cinta dan syukur kami terhadap kisah 蓮ノ空女学院スクールアイドルクラブ. Tema 「伝統」 (Tradisi) yang diusungnya begitu menyentuh hati kami. Sebagai penggemar, kami ingin mengembangkan sayap \"Tradisi\" itu agar dapat terus dikenal dan dirasakan oleh lebih banyak orang di masa depan.\n\nWebsite ini tidak berafiliasi dengan pihak manapun, baik Odd Number, Bushiroad, maupun pihak terkait lainnya. Website ini bersifat non-profit, tidak memungut biaya maupun menerima keuntungan dalam bentuk apapun dari pihak manapun. Seluruh konten yang ditampilkan adalah hak cipta dari pemilik dan pemegang hak yang sah.\n\nKami menjalankan website ini dengan penuh rasa hormat terhadap para pemegang hak cipta. Apabila terdapat hal yang perlu didiskusikan terkait website ini maupun konten yang ditampilkan, kami dengan senang hati membuka diri untuk terhubung dan berdiskusi bersama. Silakan hubungi kami melalui kontak yang tersedia di bawah ini.",
  },
];

export const OFFICIAL_LINKS: { label: string; url: string }[] = [
  { label: "Love Live! 蓮ノ空 公式サイト", url: "https://www.lovelive-anime.jp/hasunosora/" },
  { label: "Link! Like! Love Live! 公式", url: "https://www.lovelive-anime.jp/llll/" },
  { label: "蓮ノ空 公式 YouTube", url: "https://www.youtube.com/@lovelive_hasu" },
  { label: "蓮ノ空 公式 X (Twitter)", url: "https://x.com/hasunosora_SIC" },
];
