export type CharacterData = {
  databaseId: number;
  title: string;
  slug: string;
  characterDetails: {
    nameJp: string;
    nameRomaji: string;
    nameId: string | null;
    bioJp: string | null;
    bioId: string | null;
    birthday: string | null;
    hobby: string | null;
    seiyuu: string | null;
    schoolClass: string | null;
    colorTheme: string | null;
    generation: string[] | null;
    officialWikiUrl: string | null;
    imageMain: {
      node: { sourceUrl: string; altText: string };
    } | null;
    imageChibi: {
      node: { sourceUrl: string; altText: string };
    } | null;
    unit: {
      nodes: {
        databaseId: number;
        title: string;
        slug: string;
      }[];
    } | null;
  };
};

export type UnitInfo = {
  title: string;
  slug: string;
  colorPrimary: string | null;
};
