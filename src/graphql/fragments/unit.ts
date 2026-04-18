import { gql } from "@apollo/client";

export const UNIT_FIELDS = gql`
  fragment UnitFields on Unit {
    databaseId
    title
    slug
    unitDetails {
      nameJp
      nameRomaji
      nameShort
      descriptionJp
      descriptionId
      taglineJp
      taglineId
      colorPrimary
      colorSecondary
      debutDate
      songsCount
      officialUrl
      logo {
        node {
          sourceUrl
          altText
        }
      }
      imageGroup {
        node {
          sourceUrl
          altText
        }
      }
      members {
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
