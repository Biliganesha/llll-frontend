import type { Lang } from "./language";

const dict = {
  // Navigation
  "nav.home": { jp: "ホーム", id: "Beranda" },
  "nav.episodes": { jp: "活動記録", id: "Catatan Aktivitas" },
  "nav.sukukone": { jp: "スクコネ", id: "SukuKone" },
  "nav.members": { jp: "メンバー", id: "Anggota" },
  "nav.units": { jp: "ユニット", id: "Unit" },
  "nav.calendar": { jp: "カレンダー", id: "Kalender" },
  "nav.relationships": { jp: "相関図", id: "Peta Relasi" },
  "nav.search": { jp: "検索", id: "Cari" },
  "nav.menu": { jp: "メニュー", id: "Menu" },
  "nav.seiyuu": { jp: "声優", id: "Seiyuu" },

  // Common
  "common.loading": { jp: "読み込み中...", id: "Memuat..." },
  "common.error": { jp: "エラー", id: "Error" },
  "common.back": { jp: "戻る", id: "Kembali" },
  "common.notFound": { jp: "見つかりません", id: "Tidak ditemukan" },
  "common.viewProfile": { jp: "プロフィールを見る →", id: "Lihat Profil →" },

  // Episodes
  "episodes.title": { jp: "活動記録", id: "Catatan Aktivitas" },
  "episodes.airDate": { jp: "配信日", id: "Tanggal Tayang" },
  "episodes.duration": { jp: "再生時間", id: "Durasi" },
  "episodes.episodeNumber": { jp: "話数", id: "Episode" },
  "episodes.subtitleJp": { jp: "JP字幕", id: "Subtitle JP" },
  "episodes.subtitleId": { jp: "ID字幕", id: "Subtitle ID" },
  "episodes.synopsis": { jp: "あらすじ", id: "Sinopsis" },
  "episodes.originalSource": { jp: "オリジナルソース →", id: "Sumber Asli →" },
  "episodes.noVideo": { jp: "動画未収録", id: "Video belum tersedia" },
  "episodes.backToList": { jp: "← 活動記録一覧", id: "← Daftar Episode" },

  // Sukukone
  "sukukone.title": { jp: "スクールアイドルコネクト", id: "School Idol Connect" },
  "sukukone.backToList": { jp: "← スクコネ", id: "← SukuKone" },
  "sukukone.type": { jp: "タイプ", id: "Tipe" },
  "sukukone.unit": { jp: "ユニット", id: "Unit" },
  "sukukone.subtitle": { jp: "字幕", id: "Subtitle" },
  "sukukone.relatedEp": { jp: "関連話", id: "Episode Terkait" },
  "sukukone.performers": { jp: "出演メンバー", id: "Penampil" },
  "sukukone.summary": { jp: "概要", id: "Ringkasan" },
  "sukukone.summaryId": { jp: "Ringkasan (ID)", id: "Ringkasan (ID)" },
  "sukukone.preparing": { jp: "動画は準備中です", id: "Video sedang disiapkan" },

  // Characters
  "characters.title": { jp: "メンバー", id: "Anggota" },
  "characters.allUnits": { jp: "全員", id: "Semua" },
  "characters.birthday": { jp: "誕生日", id: "Ulang Tahun" },
  "characters.generation": { jp: "期生", id: "Angkatan" },
  "characters.class": { jp: "学年", id: "Kelas" },
  "characters.hobby": { jp: "趣味", id: "Hobi" },
  "characters.cv": { jp: "CV", id: "Pengisi Suara" },
  "characters.bio": { jp: "紹介", id: "Profil" },
  "characters.reading": { jp: "ふりがな", id: "Baca" },
  "characters.nameRow": { jp: "名前", id: "Kanji" },
  "characters.romajiRow": { jp: "ふりがな", id: "Romaji" },
  "characters.gender": { jp: "性別", id: "Jenis Kelamin" },
  "characters.genderFemale": { jp: "女性", id: "Perempuan" },
  "characters.signature": { jp: "サイン", id: "Tanda Tangan" },
  "characters.iconSignature": { jp: "アイコン＆サイン", id: "Ikon & Tanda Tangan" },
  "characters.secBasic": { jp: "基本情報", id: "Profil Dasar" },
  "characters.secStats": { jp: "ステータス", id: "Statistik" },
  "characters.secFavorites": { jp: "好きなもの", id: "Kesukaan" },
  "characters.secFamily": { jp: "家族", id: "Keluarga" },
  "characters.secLinks": { jp: "リンク", id: "Tautan" },
  "characters.affiliation": { jp: "所属", id: "Afiliasi" },
  "characters.debut": { jp: "デビュー", id: "Debut" },
  "characters.appearance": { jp: "外見", id: "Penampilan" },
  "characters.background": { jp: "生い立ち", id: "Latar Belakang" },
  "characters.relations": { jp: "関係", id: "Relasi" },
  "characters.trivia": { jp: "豆知識", id: "Trivia" },
  "characters.introVideo": { jp: "自己紹介動画", id: "Video Perkenalan" },
  "characters.clubName": { jp: "蓮ノ空女学院スクールアイドルクラブ", id: "Klub School Idol SMA Putri Hasunosora" },
  "characters.officialPage": { jp: "公式メンバーページ", id: "Halaman Resmi" },
  "characters.height": { jp: "身長", id: "Tinggi" },
  "characters.hometown": { jp: "出身地", id: "Asal" },
  "characters.family": { jp: "家族", id: "Keluarga" },
  "characters.skill": { jp: "特技", id: "Keahlian" },
  "characters.favFood": { jp: "好きな食べ物", id: "Makanan Favorit" },
  "characters.motto": { jp: "好きな言葉", id: "Motto" },
  "characters.favSubject": { jp: "好きな教科", id: "Pelajaran Favorit" },
  "characters.favAnimal": { jp: "好きな動物", id: "Hewan Favorit" },
  "characters.colorName": { jp: "メンバーカラー", id: "Warna" },
  "characters.status": { jp: "状況", id: "Status" },
  "characters.statusEnrolled": { jp: "在籍中", id: "Aktif" },
  "characters.statusGraduated": { jp: "卒業生", id: "Lulus" },

  // Seiyuu
  "seiyuu.title": { jp: "声優", id: "Seiyuu" },
  "seiyuu.nickname": { jp: "愛称", id: "Julukan" },
  "seiyuu.agency": { jp: "事務所", id: "Agensi" },
  "seiyuu.origin": { jp: "出身", id: "Asal" },
  "seiyuu.occupation": { jp: "職業", id: "Profesi" },
  "seiyuu.voices": { jp: "担当キャラ", id: "Mengisi suara" },
  "seiyuu.sourceNote": { jp: "出典", id: "Sumber" },

  // Units
  "units.title": { jp: "ユニット", id: "Unit" },
  "units.abbreviation": { jp: "略称", id: "Singkatan" },
  "units.formed": { jp: "結成", id: "Dibentuk" },
  "units.songCount": { jp: "楽曲数", id: "Jumlah Lagu" },
  "units.description": { jp: "紹介", id: "Deskripsi" },
  "units.members": { jp: "メンバー", id: "Anggota" },

  // Calendar
  "calendar.title": { jp: "カレンダー", id: "Kalender" },
  "calendar.today": { jp: "今日の蓮ノ空", id: "Hasunosora Hari Ini" },

  // Timeline
  "timeline.title": { jp: "タイムライン", id: "Garis Waktu" },

  // Search
  "search.title": { jp: "検索", id: "Pencarian" },
  "search.placeholder": { jp: "キーワードで検索...", id: "Cari dengan kata kunci..." },

  // Gameplay
  "gameplay.title": { jp: "ゲームプレイ", id: "Arsip Gameplay" },

  // About
  "about.title": { jp: "このサイトについて", id: "Tentang Situs Ini" },

  // Relationships
  "relationships.title": { jp: "相関図", id: "Peta Relasi" },
  "relationships.clickToInspect": { jp: "メンバーをクリックして詳細を表示", id: "Klik anggota untuk melihat detail" },
  "relationships.tapToInspect": { jp: "メンバーの関係をタップで確認", id: "Ketuk untuk melihat hubungan anggota" },
  "relationships.genToggleOn": { jp: "期生ライン ON", id: "Garis Angkatan ON" },
  "relationships.genToggleOff": { jp: "期生ラインを表示", id: "Tampilkan Garis Angkatan" },

  // Language
  "lang.jp": { jp: "日本語", id: "Jepang" },
  "lang.id": { jp: "インドネシア語", id: "Indonesia" },
} as const;

export type TranslationKey = keyof typeof dict;

export function translate(key: TranslationKey, lang: Lang): string {
  const entry = dict[key];
  return entry[lang] || entry.jp;
}
