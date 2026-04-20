"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useLanguage } from "@/lib/language";

const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(where: { contentId: $postId, orderby: COMMENT_DATE, order: DESC }) {
      nodes {
        databaseId
        content
        date
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      comment {
        databaseId
        content
        date
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

type CommentNode = {
  databaseId: number;
  content: string;
  date: string;
  author: {
    node: {
      name: string;
      avatar: { url: string } | null;
    };
  };
};

type CommentsQueryData = {
  comments: { nodes: CommentNode[] } | null;
};

type CreateCommentData = {
  createComment: {
    success: boolean;
    comment: CommentNode | null;
  };
};

type Props = {
  postDatabaseId: number;
  accentColor?: string;
};

function formatCommentDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export function CommentSection({ postDatabaseId, accentColor = "#8b82f5" }: Props) {
  const { lang } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data, loading, refetch } = useQuery<CommentsQueryData>(GET_COMMENTS, {
    variables: { postId: String(postDatabaseId) },
  });

  const [createComment, { loading: submitting }] = useMutation<CreateCommentData>(CREATE_COMMENT);

  const comments: CommentNode[] = data?.comments?.nodes ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!authorName.trim() || !content.trim()) {
      setSubmitError(lang === "jp" ? "名前とコメントを入力してください" : "Isi nama dan komentar");
      return;
    }

    try {
      await createComment({
        variables: {
          input: {
            commentOn: postDatabaseId,
            content: content.trim(),
            author: authorName.trim(),
            authorEmail: authorEmail.trim() || undefined,
          },
        },
      });
      setContent("");
      setSubmitSuccess(true);
      setShowForm(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
      refetch();
    } catch (err) {
      setSubmitError(
        lang === "jp"
          ? "コメントの送信に失敗しました。しばらくしてからお試しください。"
          : "Gagal mengirim komentar. Coba lagi nanti."
      );
      console.error("Comment error:", err);
    }
  };

  const sectionTitle = lang === "jp" ? "コメント" : "Komentar";
  const writeLabel = lang === "jp" ? "コメントを書く" : "Tulis Komentar";
  const cancelLabel = lang === "jp" ? "キャンセル" : "Batal";
  const sendLabel = lang === "jp" ? "送信" : "Kirim";
  const namePlaceholder = lang === "jp" ? "名前 *" : "Nama *";
  const emailPlaceholder = lang === "jp" ? "メール（任意）" : "Email (opsional)";
  const commentPlaceholder = lang === "jp" ? "コメントを入力... *" : "Tulis komentar... *";
  const emptyMessage = lang === "jp" ? "まだコメントはありません" : "Belum ada komentar";
  const pendingMessage =
    lang === "jp"
      ? "コメントは承認後に表示されます"
      : "Komentar akan muncul setelah disetujui";

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-text-dim">
          {sectionTitle} ({comments.length})
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ background: accentColor }}
          >
            {writeLabel}
          </button>
        )}
      </div>

      {/* Success banner */}
      {submitSuccess && (
        <div className="mb-3 p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700">
          {pendingMessage}
        </div>
      )}

      {/* Comment form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 rounded-xl border border-border p-3 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={namePlaceholder}
              className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-surface-2 focus:outline-none focus:border-primary"
              maxLength={50}
            />
            <input
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder={emailPlaceholder}
              className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-surface-2 focus:outline-none focus:border-primary"
              maxLength={100}
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={commentPlaceholder}
            className="w-full px-3 py-2 rounded-lg border border-border text-sm bg-surface-2 focus:outline-none focus:border-primary resize-none"
            rows={3}
            maxLength={1000}
          />
          {submitError && (
            <p className="text-xs text-red-500">{submitError}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setSubmitError(null); }}
              className="px-3 py-1.5 rounded-lg text-xs text-text-dim hover:text-foreground cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
              style={{ background: accentColor }}
            >
              {submitting ? "..." : sendLabel}
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 p-3 rounded-xl bg-surface-2/50">
              <div className="w-8 h-8 rounded-full bg-border/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-border/40 rounded w-24" />
                <div className="h-3 bg-border/30 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-text-dim text-sm">
          <p className="text-2xl mb-2">💬</p>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.databaseId}
              className="flex gap-3 p-3 rounded-xl"
              style={{ background: "var(--linkura-surface)" }}
            >
              {/* Avatar */}
              {comment.author.node.avatar?.url ? (
                <img
                  src={comment.author.node.avatar.url}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: accentColor }}
                >
                  {comment.author.node.name[0]?.toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{comment.author.node.name}</span>
                  <span className="text-[10px] text-text-dim">
                    {formatCommentDate(comment.date)}
                  </span>
                </div>
                <div
                  className="text-sm text-foreground/80 mt-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
