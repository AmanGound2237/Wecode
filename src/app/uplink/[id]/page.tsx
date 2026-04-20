import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import NeuralWorkspace from "@/components/NeuralWorkspace";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PaperWorkspacePage({ params }: Props) {
  const { id } = await params;

  const paper = await prisma.researchPaper.findUnique({
    where: { id },
    include: {
      prerequisites: { orderBy: { order: "asc" } },
      steps: { orderBy: { order: "asc" } },
    },
  });

  if (!paper) notFound();

  return <NeuralWorkspace paper={paper} />;
}
