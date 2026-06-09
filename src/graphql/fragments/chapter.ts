import { gql } from "@apollo/client";

/** Story Chapter (章 / 間章) — CPT story_chapter, ACF chapterDetails. */
export const CHAPTER_FIELDS = gql`
  fragment ChapterFields on StoryChapter {
    databaseId
    title
    slug
    chapterDetails {
      chapterLabelJp
      chapterLabelId
      chapterType
      sortOrder
      colorTheme
      descriptionJp
      descriptionId
      heroImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export type ChapterImage = { node: { sourceUrl: string; altText: string } } | null;

export type ChapterNode = {
  databaseId: number;
  title: string;
  slug: string;
  chapterDetails: {
    chapterLabelJp: string | null;
    chapterLabelId: string | null;
    chapterType: string | null;
    sortOrder: number | null;
    colorTheme: string | null;
    descriptionJp: string | null;
    descriptionId: string | null;
    heroImage: ChapterImage;
  };
};
