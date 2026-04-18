import { gql } from "@apollo/client";
import { CHARACTER_FIELDS } from "@/graphql/fragments";

export const GET_ALL_CHARACTERS = gql`
  ${CHARACTER_FIELDS}
  query GetAllCharacters {
    characters(first: 50) {
      nodes {
        ...CharacterFields
      }
    }
  }
`;
