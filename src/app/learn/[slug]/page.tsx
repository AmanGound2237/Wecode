import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicDetail } from "@/lib/topics-db";

export const dynamic = "force-dynamic";

type LearnDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function LearnDetailPage({ params }: LearnDetailProps) {
  const resolvedParams = await params;
  const topic = await getTopicDetail(resolvedParams.slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          Learn
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{topic.title}</h1>
        <p className="mt-3 text-[#4b3f35]">{topic.summary}</p>
      </div>

      <div className="card-surface rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Simple explanation</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#4b3f35]">
          {topic.theory}
        </p>
      </div>

      <div className="card-surface rounded-3xl p-6">
        <h2 className="text-xl font-semibold">CampusX video</h2>
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-white/70">
          <iframe
            className="h-full w-full"
            src={topic.videoUrl}
            title={`${topic.title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <Link className="mt-4 inline-flex text-sm font-semibold text-[#2a9d8f]" href="/problems">
          Practice problems
        </Link>
      </div>
    </div>
  );
}
