import { gql } from "@apollo/client";

/** Episode Part (パート) — CPT episode_part, ACF partDetails. */
export const PART_FIELDS = gql`
  fragment PartFields on EpisodePart {
    databaseId
    title
    slug
    menuOrder
    partDetails {
      partNumber
      youtubeUrl
      youtubeVideoId
      mirrorUrl
      durationSeconds
      summaryJp
      summaryId
      hasSubtitleJp
      hasSubtitleId
      parentEpisode {
        nodes {
          ... on Episode {
            databaseId
            slug
          }
        }
      }
    }
  }
`;

export type PartNode = {
  databaseId: number;
  title: string;
  slug: string;
  menuOrder: number | null;
  partDetails: {
    partNumber: number | null;
    youtubeUrl: string | null;
    youtubeVideoId: string | null;
    mirrorUrl: string | null;
    durationSeconds: number | null;
    summaryJp: string | null;
    summaryId: string | null;
    hasSubtitleJp: boolean | null;
    hasSubtitleId: boolean | null;
    parentEpisode: { nodes: { databaseId: number; slug: string }[] } | null;
  };
};
