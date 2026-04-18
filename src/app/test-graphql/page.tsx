"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  EPISODE_FIELDS,
  CHARACTER_FIELDS,
  UNIT_FIELDS,
  SUKUKONE_FIELDS,
  GAMEPLAY_FIELDS,
} from "@/graphql/fragments";

interface CPTNode {
  databaseId: number;
  title: string;
  [key: string]: unknown;
}

interface TestQueryData {
  episodes: { nodes: CPTNode[] };
  characters: { nodes: CPTNode[] };
  units: { nodes: CPTNode[] };
  sukukoneVideos: { nodes: CPTNode[] };
  gameplayArchives: { nodes: CPTNode[] };
}

const TEST_QUERY = gql`
  ${EPISODE_FIELDS}
  ${CHARACTER_FIELDS}
  ${UNIT_FIELDS}
  ${SUKUKONE_FIELDS}
  ${GAMEPLAY_FIELDS}

  query TestAllCPTs {
    episodes {
      nodes {
        ...EpisodeFields
      }
    }
    characters {
      nodes {
        ...CharacterFields
      }
    }
    units {
      nodes {
        ...UnitFields
      }
    }
    sukukoneVideos {
      nodes {
        ...SukukoneFields
      }
    }
    gameplayArchives {
      nodes {
        ...GameplayFields
      }
    }
  }
`;

export default function TestGraphQL() {
  const { data, loading, error } = useQuery<TestQueryData>(TEST_QUERY);

  if (loading) {
    return (
      <div className="p-8 text-white bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">GraphQL Test</h1>
        <p className="text-yellow-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-white bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">GraphQL Test</h1>
        <div className="bg-red-900/50 border border-red-500 rounded p-4">
          <p className="text-red-400 font-bold">Error:</p>
          <pre className="text-red-300 text-sm mt-2 whitespace-pre-wrap">
            {error.message}
          </pre>
        </div>
      </div>
    );
  }

  const sections = [
    { title: "Episodes (活動記録)", data: data?.episodes?.nodes },
    { title: "Characters (メンバー)", data: data?.characters?.nodes },
    { title: "Units (ユニット)", data: data?.units?.nodes },
    { title: "Sukukone (スクコネ)", data: data?.sukukoneVideos?.nodes },
    {
      title: "Gameplay Archive (ゲームプレイ)",
      data: data?.gameplayArchives?.nodes,
    },
  ];

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">GraphQL Pipeline Test</h1>
      <p className="text-gray-400 mb-6 text-sm">
        WP → WPGraphQL → Apollo Client → React
      </p>

      {sections.map((section) => (
        <div key={section.title} className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-cyan-400">
            {section.title}
            <span className="text-gray-500 text-sm ml-2">
              ({section.data?.length ?? 0} items)
            </span>
          </h2>

          {section.data && section.data.length > 0 ? (
            <div className="space-y-3">
              {section.data.map((item: CPTNode) => (
                <details
                  key={item.databaseId as number}
                  className="bg-gray-800 rounded border border-gray-700"
                >
                  <summary className="p-3 cursor-pointer hover:bg-gray-750">
                    <span className="text-green-400">
                      #{item.databaseId as number}
                    </span>{" "}
                    — {item.title as string}
                  </summary>
                  <pre className="p-3 text-xs text-gray-300 overflow-auto border-t border-gray-700">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </details>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No data found</p>
          )}
        </div>
      ))}
    </div>
  );
}
