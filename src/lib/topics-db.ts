import { prisma } from "@/lib/db";

export type TopicListItem = {
  slug: string;
  title: string;
  category: string | null;
  summary: string;
  videoUrl: string;
};

export type TopicDetail = TopicListItem & {
  theory: string;
};

export const getTopicList = async (): Promise<TopicListItem[]> => {
  const topics = await prisma.topic.findMany({ orderBy: { title: "asc" } });
  return topics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    summary: topic.summary,
    videoUrl: topic.videoUrl,
  }));
};

export const getTopicDetail = async (
  slug: string
): Promise<TopicDetail | null> => {
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) {
    return null;
  }

  return {
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    summary: topic.summary,
    theory: topic.theory,
    videoUrl: topic.videoUrl,
  };
};
