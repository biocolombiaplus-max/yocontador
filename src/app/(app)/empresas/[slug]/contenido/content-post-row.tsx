"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { updateContentStatus, deleteContentPost } from "@/lib/actions/content";
import { Badge } from "@/components/ui";
import { CONTENT_STATUS_META, MEDIA_TYPE_META, PLATFORM_META } from "@/lib/constants";

type Post = {
  id: string;
  title: string;
  caption: string;
  mediaType: keyof typeof MEDIA_TYPE_META;
  mediaUrl: string | null;
  status: keyof typeof CONTENT_STATUS_META;
  scheduledAt: Date | null;
  createdAt: Date;
  createdBy: { name: string } | null;
  targets: { socialAccount: { platform: keyof typeof PLATFORM_META } }[];
};

export default function ContentPostRow({ post, companySlug }: { post: Post; companySlug: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
      <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 sm:w-32">
        {post.mediaUrl ? (
          post.mediaType === "VIDEO" || post.mediaType === "REEL" ? (
            <video src={post.mediaUrl} className="h-full w-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.mediaUrl} alt={post.title} className="h-full w-full object-cover" />
          )
        ) : (
          <span className="text-xs text-slate-400">Sin archivo</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="font-medium text-slate-900">{post.title}</p>
          <Badge tone="neutral">{MEDIA_TYPE_META[post.mediaType].label}</Badge>
          {post.targets.map((t, i) => (
            <span key={i} className="text-xs text-slate-400">
              {PLATFORM_META[t.socialAccount.platform].label}
              {i < post.targets.length - 1 ? "," : ""}
            </span>
          ))}
        </div>
        <p className="mb-2 line-clamp-2 text-sm text-slate-600">{post.caption}</p>
        <p className="text-xs text-slate-400">
          {post.createdBy?.name ?? "Sistema"} &middot;{" "}
          {new Date(post.createdAt).toLocaleDateString("es-CO")}
          {post.scheduledAt &&
            ` · programado ${new Date(post.scheduledAt).toLocaleString("es-CO")}`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <select
          defaultValue={post.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(() =>
              updateContentStatus(
                post.id,
                companySlug,
                e.target.value as "BORRADOR" | "PROGRAMADO" | "PUBLICADO" | "FALLIDO"
              )
            )
          }
          className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-brand"
        >
          <option value="BORRADOR">Borrador</option>
          <option value="PROGRAMADO">Programado</option>
          <option value="PUBLICADO">Publicado</option>
          <option value="FALLIDO">Fallido</option>
        </select>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => deleteContentPost(post.id, companySlug))}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
          aria-label="Eliminar"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
