"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { StatusBar } from "@/components/ui/StatusBar";
import { BottomNav } from "@/components/ui/BottomNav";
import { MenuOverlay } from "@/components/ui/MenuOverlay";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTr } from "@/lib/language";

const GET_RELATIONSHIP_DATA = gql`
  query GetRelationshipData {
    characters(first: 50) {
      nodes {
        databaseId
        title
        slug
        characterDetails {
          nameJp
          nameRomaji
          colorTheme
          generation
          imageMain {
            node {
              sourceUrl
            }
          }
          unit {
            nodes {
              ... on Unit {
                databaseId
                title
                slug
                unitDetails {
                  nameJp
                  colorPrimary
                  colorSecondary
                }
              }
            }
          }
        }
      }
    }
  }
`;

type CharNode = {
  databaseId: number;
  title: string;
  slug: string;
  characterDetails: {
    nameJp: string;
    nameRomaji: string;
    colorTheme: string | null;
    generation: string[] | null;
    imageMain: { node: { sourceUrl: string } } | null;
    unit: {
      nodes: {
        databaseId: number;
        title: string;
        slug: string;
        unitDetails: {
          nameJp: string;
          colorPrimary: string | null;
          colorSecondary: string | null;
        };
      }[];
    } | null;
  };
};

type QueryData = { characters: { nodes: CharNode[] } };

type UnitGroup = {
  id: number;
  name: string;
  nameJp: string;
  slug: string;
  color: string;
  colorSecondary: string;
  members: CharNode[];
};

function generationLabel(gen: string[] | null): string {
  if (!gen || gen.length === 0) return "";
  const g = gen[0];
  if (g.includes("103")) return "103期生";
  if (g.includes("104")) return "104期生";
  if (g.includes("105")) return "105期生";
  if (g.includes("106")) return "106期生";
  return g;
}

function generationNumber(gen: string[] | null): number {
  if (!gen || gen.length === 0) return 0;
  const g = gen[0];
  if (g.includes("103")) return 103;
  if (g.includes("104")) return 104;
  if (g.includes("105")) return 105;
  if (g.includes("106")) return 106;
  return 0;
}

// Position characters in a constellation layout
function computeLayout(
  unitGroups: UnitGroup[],
  width: number,
  height: number
): { unitId: number; charId: number; x: number; y: number }[] {
  const positions: { unitId: number; charId: number; x: number; y: number }[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const unitCount = unitGroups.length;
  // Radius for unit cluster centers
  const clusterRadius = Math.min(width, height) * 0.32;
  // Radius for members around cluster center
  const memberRadius = Math.min(width, height) * 0.1;

  unitGroups.forEach((unit, ui) => {
    const angle = (ui / unitCount) * Math.PI * 2 - Math.PI / 2;
    const ucx = cx + Math.cos(angle) * clusterRadius;
    const ucy = cy + Math.sin(angle) * clusterRadius;

    const members = unit.members;
    if (members.length === 1) {
      positions.push({ unitId: unit.id, charId: members[0].databaseId, x: ucx, y: ucy });
    } else {
      members.forEach((m, mi) => {
        const mAngle = (mi / members.length) * Math.PI * 2 - Math.PI / 2;
        const mx = ucx + Math.cos(mAngle) * memberRadius;
        const my = ucy + Math.sin(mAngle) * memberRadius;
        positions.push({ unitId: unit.id, charId: m.databaseId, x: mx, y: my });
      });
    }
  });

  return positions;
}

// Generation color bands
const GEN_COLORS: Record<number, string> = {
  103: "#FF8FA3",
  104: "#64B5F6",
  105: "#81C784",
  106: "#FFD54F",
};

export default function RelationshipsPage() {
  const { data, loading, error } = useQuery<QueryData>(GET_RELATIONSHIP_DATA);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [showGenerations, setShowGenerations] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
  const router = useRouter();
  const tr = useTr();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 300),
          height: Math.max(rect.height, 300),
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const unitGroups = useMemo<UnitGroup[]>(() => {
    if (!data?.characters?.nodes) return [];
    const groups: Record<number, UnitGroup> = {};
    for (const c of data.characters.nodes) {
      const unit = c.characterDetails.unit?.nodes[0];
      if (!unit) continue;
      if (!groups[unit.databaseId]) {
        groups[unit.databaseId] = {
          id: unit.databaseId,
          name: unit.title,
          nameJp: unit.unitDetails.nameJp,
          slug: unit.slug,
          color: unit.unitDetails.colorPrimary || "#8b82f5",
          colorSecondary: unit.unitDetails.colorSecondary || unit.unitDetails.colorPrimary || "#8b82f5",
          members: [],
        };
      }
      groups[unit.databaseId].members.push(c);
    }
    return Object.values(groups);
  }, [data]);

  const positions = useMemo(
    () => computeLayout(unitGroups, dimensions.width, dimensions.height),
    [unitGroups, dimensions]
  );

  const charMap = useMemo(() => {
    const map = new Map<number, CharNode>();
    for (const g of unitGroups) {
      for (const m of g.members) {
        map.set(m.databaseId, m);
      }
    }
    return map;
  }, [unitGroups]);

  const posMap = useMemo(() => {
    const map = new Map<number, { x: number; y: number }>();
    for (const p of positions) {
      map.set(p.charId, { x: p.x, y: p.y });
    }
    return map;
  }, [positions]);

  // Find same-generation connections (cross-unit)
  const genConnections = useMemo(() => {
    if (!showGenerations) return [];
    const byGen: Record<number, number[]> = {};
    for (const [id, c] of charMap) {
      const gen = generationNumber(c.characterDetails.generation);
      if (gen > 0) {
        if (!byGen[gen]) byGen[gen] = [];
        byGen[gen].push(id);
      }
    }
    const connections: { from: number; to: number; gen: number }[] = [];
    for (const [gen, ids] of Object.entries(byGen)) {
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          // Only cross-unit connections
          const u1 = charMap.get(ids[i])?.characterDetails.unit?.nodes[0]?.databaseId;
          const u2 = charMap.get(ids[j])?.characterDetails.unit?.nodes[0]?.databaseId;
          if (u1 !== u2) {
            connections.push({ from: ids[i], to: ids[j], gen: Number(gen) });
          }
        }
      }
    }
    return connections;
  }, [showGenerations, charMap]);

  const activeChar = selectedChar ?? hoveredChar;
  const activeCharData = activeChar ? charMap.get(activeChar) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-dim">{tr("読み込み中...", "Memuat...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-400">データ取得エラー</p>
      </div>
    );
  }

  const nodeRadius = Math.min(dimensions.width, dimensions.height) < 500 ? 22 : 28;

  const svgContent = (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    >
      <defs>
        {/* Clip paths for character images */}
        {positions.map((p) => (
          <clipPath key={`clip-${p.charId}`} id={`clip-${p.charId}`}>
            <circle cx={p.x} cy={p.y} r={nodeRadius - 2} />
          </clipPath>
        ))}
      </defs>

      {/* Unit connection lines */}
      {unitGroups.map((unit) => {
        const members = unit.members;
        const lines: React.ReactNode[] = [];
        for (let i = 0; i < members.length; i++) {
          for (let j = i + 1; j < members.length; j++) {
            const p1 = posMap.get(members[i].databaseId);
            const p2 = posMap.get(members[j].databaseId);
            if (p1 && p2) {
              const isHighlighted =
                activeChar &&
                (members[i].databaseId === activeChar || members[j].databaseId === activeChar);
              lines.push(
                <line
                  key={`${members[i].databaseId}-${members[j].databaseId}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={unit.color}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeOpacity={activeChar ? (isHighlighted ? 0.7 : 0.1) : 0.25}
                  strokeDasharray={isHighlighted ? "none" : "4,4"}
                />
              );
            }
          }
        }
        return <g key={`lines-${unit.id}`}>{lines}</g>;
      })}

      {/* Generation cross-unit lines */}
      {genConnections.map((conn) => {
        const p1 = posMap.get(conn.from);
        const p2 = posMap.get(conn.to);
        if (!p1 || !p2) return null;
        const color = GEN_COLORS[conn.gen] || "#999";
        return (
          <line
            key={`gen-${conn.from}-${conn.to}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={color}
            strokeWidth={1.5}
            strokeOpacity={0.4}
            strokeDasharray="6,3"
          />
        );
      })}

      {/* Unit label backgrounds */}
      {unitGroups.map((unit) => {
        const memberPositions = unit.members
          .map((m) => posMap.get(m.databaseId))
          .filter(Boolean) as { x: number; y: number }[];
        if (memberPositions.length === 0) return null;
        const avgX = memberPositions.reduce((s, p) => s + p.x, 0) / memberPositions.length;
        const avgY = memberPositions.reduce((s, p) => s + p.y, 0) / memberPositions.length;
        // Place label above cluster center
        const labelY = Math.min(...memberPositions.map((p) => p.y)) - nodeRadius - 14;
        return (
          <g key={`label-${unit.id}`}>
            <text
              x={avgX}
              y={labelY}
              textAnchor="middle"
              fill={unit.color}
              fontSize={11}
              fontWeight="bold"
              opacity={0.8}
            >
              {unit.nameJp}
            </text>
          </g>
        );
      })}

      {/* Character nodes */}
      {positions.map((p) => {
        const c = charMap.get(p.charId);
        if (!c) return null;
        const unitColor =
          c.characterDetails.unit?.nodes[0]?.unitDetails.colorPrimary || "#8b82f5";
        const charColor = c.characterDetails.colorTheme || unitColor;
        const isActive = activeChar === p.charId;
        const isDimmed = activeChar !== null && !isActive;
        const imgUrl = c.characterDetails.imageMain?.node.sourceUrl;

        return (
          <g
            key={p.charId}
            className="cursor-pointer"
            onClick={() => setSelectedChar(isActive ? null : p.charId)}
            onMouseEnter={() => setHoveredChar(p.charId)}
            onMouseLeave={() => setHoveredChar(null)}
            opacity={isDimmed ? 0.35 : 1}
            style={{ transition: "opacity 0.2s" }}
          >
            {/* Glow ring */}
            {isActive && (
              <circle
                cx={p.x}
                cy={p.y}
                r={nodeRadius + 4}
                fill="none"
                stroke={charColor}
                strokeWidth={2}
                opacity={0.6}
              >
                <animate
                  attributeName="r"
                  values={`${nodeRadius + 3};${nodeRadius + 7};${nodeRadius + 3}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.2;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Border ring */}
            <circle
              cx={p.x}
              cy={p.y}
              r={nodeRadius}
              fill={imgUrl ? "#1a1a2e" : charColor}
              stroke={charColor}
              strokeWidth={isActive ? 3 : 2}
            />

            {/* Character image */}
            {imgUrl ? (
              <image
                href={imgUrl}
                x={p.x - nodeRadius + 2}
                y={p.y - nodeRadius + 2}
                width={(nodeRadius - 2) * 2}
                height={(nodeRadius - 2) * 2}
                clipPath={`url(#clip-${p.charId})`}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <text
                x={p.x}
                y={p.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={nodeRadius * 0.6}
                fontWeight="bold"
              >
                {c.characterDetails.nameJp[0]}
              </text>
            )}

            {/* Name label below */}
            <text
              x={p.x}
              y={p.y + nodeRadius + 14}
              textAnchor="middle"
              fill="var(--linkura-foreground)"
              fontSize={10}
              fontWeight={isActive ? "bold" : "normal"}
              opacity={isDimmed ? 0.5 : 0.9}
            >
              {c.characterDetails.nameJp}
            </text>

            {/* Generation badge */}
            {showGenerations && c.characterDetails.generation && (
              <g>
                <circle
                  cx={p.x + nodeRadius - 4}
                  cy={p.y - nodeRadius + 4}
                  r={8}
                  fill={GEN_COLORS[generationNumber(c.characterDetails.generation)] || "#999"}
                  stroke="var(--linkura-background)"
                  strokeWidth={1.5}
                />
                <text
                  x={p.x + nodeRadius - 4}
                  y={p.y - nodeRadius + 5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={7}
                  fontWeight="bold"
                >
                  {generationNumber(c.characterDetails.generation) % 100}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );

  // Info panel for selected character
  const infoPanel = activeCharData && (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: `${activeCharData.characterDetails.colorTheme || "#8b82f5"}10`,
        borderColor: `${activeCharData.characterDetails.colorTheme || "#8b82f5"}30`,
      }}
    >
      <div className="flex items-center gap-3">
        {activeCharData.characterDetails.imageMain?.node.sourceUrl ? (
          <img
            src={activeCharData.characterDetails.imageMain.node.sourceUrl}
            alt={activeCharData.characterDetails.nameJp}
            className="w-12 h-12 rounded-full object-cover"
            style={{ border: `2px solid ${activeCharData.characterDetails.colorTheme || "#8b82f5"}` }}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: activeCharData.characterDetails.colorTheme || "#8b82f5" }}
          >
            {activeCharData.characterDetails.nameJp[0]}
          </div>
        )}
        <div>
          <h3 className="font-bold text-sm">{activeCharData.characterDetails.nameJp}</h3>
          <p className="text-xs text-text-dim">{activeCharData.characterDetails.nameRomaji}</p>
          <div className="flex gap-2 mt-1">
            {activeCharData.characterDetails.unit?.nodes[0] && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white"
                style={{
                  background: activeCharData.characterDetails.unit.nodes[0].unitDetails.colorPrimary || "#8b82f5",
                }}
              >
                {activeCharData.characterDetails.unit.nodes[0].unitDetails.nameJp}
              </span>
            )}
            {activeCharData.characterDetails.generation && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white"
                style={{
                  background: GEN_COLORS[generationNumber(activeCharData.characterDetails.generation)] || "#999",
                }}
              >
                {generationLabel(activeCharData.characterDetails.generation)}
              </span>
            )}
          </div>
        </div>
      </div>
      <Link
        href={`/characters/${activeCharData.slug}`}
        className="mt-3 block text-center text-xs font-medium py-2 rounded-lg transition-colors hover:opacity-80"
        style={{
          background: `${activeCharData.characterDetails.colorTheme || "#8b82f5"}20`,
          color: activeCharData.characterDetails.colorTheme || "#8b82f5",
        }}
      >
        プロフィールを見る →
      </Link>
    </div>
  );

  // Legend
  const legend = (
    <div className="flex flex-wrap gap-3 text-[11px] text-text-dim">
      {unitGroups.map((u) => (
        <div key={u.id} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: u.color }} />
          <span>{u.nameJp}</span>
        </div>
      ))}
      {showGenerations &&
        Object.entries(GEN_COLORS).map(([gen, color]) => (
          <div key={gen} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full border"
              style={{ background: color, borderColor: `${color}60` }}
            />
            <span>{gen}期</span>
          </div>
        ))}
    </div>
  );

  const toggleBtn = (
    <button
      onClick={() => setShowGenerations(!showGenerations)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        showGenerations
          ? "bg-primary/15 text-primary"
          : "bg-surface-2 text-text-dim hover:text-foreground"
      }`}
    >
      {showGenerations ? tr("期生ライン ON", "Garis Angkatan ON") : tr("期生ラインを表示", "Tampilkan Garis Angkatan")}
    </button>
  );

  return (
    <>
      {/* ===== PHONE ===== */}
      <div className="sm:hidden flex-1 flex flex-col min-h-screen bg-background relative">
        <StatusBar episodeCount={0} unitLabel={tr("相関図", "Peta Relasi")} />
        <main className="flex-1 px-3 pt-2 pb-20 overflow-y-auto">
          <h1 className="text-lg font-bold brand-gradient-text">{tr("相関図", "Peta Relasi")}</h1>
          <p className="text-xs text-text-dim mt-1 mb-3">{tr("メンバーの関係をタップで確認", "Ketuk untuk melihat hubungan anggota")}</p>

          <div className="flex items-center justify-between mb-2">
            {toggleBtn}
          </div>

          <div
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden border border-border"
            style={{ height: "55vh", background: "var(--linkura-surface)" }}
          >
            {svgContent}
          </div>

          <div className="mt-3">{legend}</div>
          {infoPanel && <div className="mt-3">{infoPanel}</div>}
        </main>
        <BottomNav
          onBack={() => router.back()}
          onMenu={() => setMenuOpen(!menuOpen)}
          onHome={() => router.push("/")}
          menuOpen={menuOpen}
        />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* ===== TABLET ===== */}
      <div className="hidden sm:flex lg:hidden flex-1 flex-col min-h-screen bg-background">
        <main className="flex-1 px-6 py-6">
          <h1 className="text-2xl font-bold brand-gradient-text">{tr("相関図", "Peta Relasi")}</h1>
          <p className="text-sm text-text-dim mt-1 mb-4">
            {tr("メンバーをタップして関係を確認しましょう", "Ketuk anggota untuk melihat hubungan")}
          </p>

          <div className="flex items-center justify-between mb-3">
            {legend}
            {toggleBtn}
          </div>

          <div className="flex gap-5">
            <div
              ref={!containerRef.current ? containerRef : undefined}
              className="flex-1 rounded-xl overflow-hidden border border-border"
              style={{ height: "60vh", background: "var(--linkura-surface)" }}
            >
              {svgContent}
            </div>
            {infoPanel && <div className="w-56 shrink-0">{infoPanel}</div>}
          </div>
        </main>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:flex flex-1 flex-col min-h-screen bg-background">
        <main className="max-w-5xl mx-auto w-full px-8 py-8">
          <h1 className="text-3xl font-bold brand-gradient-text">{tr("相関図", "Peta Relasi")}</h1>
          <p className="text-sm text-text-dim mt-2 mb-5">
            {tr(
              "蓮ノ空メンバーの関係を視覚的に。ノードをクリックして詳細を表示。",
              "Visualisasi hubungan anggota 蓮ノ空. Klik node untuk melihat detail."
            )}
          </p>

          <div className="flex items-center justify-between mb-4">
            {legend}
            {toggleBtn}
          </div>

          <div className="flex gap-6">
            <div
              ref={!containerRef.current ? containerRef : undefined}
              className="flex-1 rounded-xl overflow-hidden border border-border"
              style={{ height: "65vh", background: "var(--linkura-surface)" }}
            >
              {svgContent}
            </div>
            <div className="w-64 shrink-0">
              {infoPanel || (
                <div className="rounded-xl p-4 border border-border bg-surface-2 text-center">
                  <p className="text-3xl mb-2">👆</p>
                  <p className="text-sm text-text-dim">
                    メンバーをクリックして
                    <br />
                    詳細を表示
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
