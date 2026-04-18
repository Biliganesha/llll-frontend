import { gql } from "@apollo/client";

export const GAMEPLAY_FIELDS = gql`
  fragment GameplayFields on GameplayArchive {
    databaseId
    title
    slug
    gameplayArchiveDetails {
      eventType
      sourceQuality
      archiveDate
      youtubeUrl
      youtubeVideoId
      summaryJp
      summaryId
      archiveNotes
      screenshot {
        node {
          sourceUrl
          altText
        }
      }
      relatedEpisode {
        nodes {
          ... on Episode {
            databaseId
            title
            slug
          }
        }
      }
      relatedCharacters {
        nodes {
          ... on Character {
            databaseId
            title
            slug
          }
        }
      }
    }
  }
`;
