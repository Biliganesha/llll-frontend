import { gql } from "@apollo/client";

export const CHARACTER_FIELDS = gql`
  fragment CharacterFields on Character {
    databaseId
    title
    slug
    characterDetails {
      nameJp
      nameRomaji
      nameId
      bioJp
      bioId
      birthday
      hobby
      seiyuu
      schoolClass
      colorTheme
      generation
      officialWikiUrl
      imageMain {
        node {
          sourceUrl
          altText
        }
      }
      imageChibi {
        node {
          sourceUrl
          altText
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
    }
  }
`;
