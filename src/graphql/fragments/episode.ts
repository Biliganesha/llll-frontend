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
      hasSubtitleJp: subtitleJpTersedia
      hasSubtitleId: subtitleIdTersedia
      originalSource: sumberAsliOfficialUrl
      archiveNotes: catatanArsipInternal
    }
  }
`;
