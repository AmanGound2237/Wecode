import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/auth";

const problemSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(120),
  topicSlug: z.string().min(2),
  summary: z.string().min(10).max(280),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.string().min(2),
  prompt: z.string().min(10),
  inputFormat: z.string().min(3),
  outputFormat: z.string().min(3),
  constraints: z.string().optional(),
  starterCode: z.string().optional(),
});

type ProblemPayload = z.infer<typeof problemSchema>;

const parseList = (input: string, delimiter: RegExp) =>
  input
    .split(delimiter)
    .map((value) => value.trim())
    .filter(Boolean);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.user || !isAdminEmail(session.user.email)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = (await request.json()) as ProblemPayload;
  const parsed = problemSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ error: "Invalid problem details." }, { status: 400 });
  }

  const tagList = parseList(parsed.data.tags, /,/g);
  const constraintList = parsed.data.constraints
    ? parseList(parsed.data.constraints, /\n/g)
    : [];

  const topic = await prisma.topic.findUnique({
    where: { slug: parsed.data.topicSlug },
  });

  if (!topic) {
    return Response.json({ error: "Topic not found." }, { status: 400 });
  }

  const created = await prisma.problem.create({
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      difficulty: parsed.data.difficulty,
      prompt: parsed.data.prompt,
      inputFormat: parsed.data.inputFormat,
      outputFormat: parsed.data.outputFormat,
      constraints: constraintList,
      starterCode: parsed.data.starterCode ?? "",
      topicId: topic.id,
      tags: {
        create: tagList.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    },
  });

  return Response.json({ id: created.id });
}
