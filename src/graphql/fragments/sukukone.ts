import { gql } from "@apollo/client";

export const SUKUKONE_FIELDS = gql`
  fragment SukukoneFields on SukukoneVideo {
    databaseId
    title
    slug
    sukukoneVideoDetails {
      tabType
      airDate
      youtubeUrl
      youtubeVideoId
      durationSeconds
      summaryJp
      summaryId
      hasSubtitleJp
      hasSubtitleId
      archiveNotes
      thumbnail {
        node {
          sourceUrl
          altText
        }
      }
      performers {
        nodes {
          ... on Character {
            databaseId
            title
            slug
          }
        }
      }
      unit {
        nodes {
          ... on Unit {
            databaseId
            title
            slug
          }
        }
      }
      episodeRelation {
        nodes {
          ... on Episode {
            databaseId
            title
            slug
          }
        }
      }
    }
  }
`;
