import { gql } from "@apollo/client";

export const EPISODE_FIELDS = gql`
  fragment EpisodeFields on Episode {
    databaseId
    title
    slug
    episodeDetails {
      releaseDate
      episodeNumber
      youtubeUrl
      youtubeVideoId
      durationSeconds
      summaryJp: ringkasanJp
      summaryId: ringkasanId
      hasSubtitleJp: subtitleJpTersedia
      hasSubtitleId: subtitleIdTersedia
      originalSource: sumberAsliOfficialUrl
      archiveNotes: catatanArsipInternal
    }
    episodeStructure {
      generation
      storyMonth
      chapterOrder
      sources
      heroImage {
        node {
          sourceUrl
          altText
        }
      }
      chapter {
        nodes {
          ... on StoryChapter {
            databaseId
            title
            slug
          }
        }
      }
    }
  }
`;

export type EpisodeStructure = {
  generation: string[] | null;
  storyMonth: string | null;
  chapterOrder: number | null;
  sources: string | null;
  heroImage: { node: { sourceUrl: string; altText: string } } | null;
  chapter: { nodes: { databaseId: number; title: string; slug: string }[] } | null;
} | null;
