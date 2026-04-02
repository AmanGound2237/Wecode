import Link from "next/link";
import { getTopicList } from "@/lib/topics-db";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const topics = await getTopicList();
  const grouped = topics.reduce<Record<string, typeof topics>>((acc, topic) => {
    const category = topic.category ?? "General";
    acc[category] = acc[category] ?? [];
    acc[category].push(topic);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          Learn
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Topic guides</h1>
        <p className="mt-3 text-[#4b3f35]">
          Read short explanations and watch the CampusX walkthroughs before
          practicing.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {categories.map((category) => (
          <section key={category} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{category}</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
                {grouped[category].length} topics
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {grouped[category].map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/learn/${topic.slug}`}
                  className="card-surface rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-semibold">{topic.title}</h3>
                  <p className="mt-2 text-sm text-[#4b3f35]">{topic.summary}</p>
                  <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
                    Learn
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
