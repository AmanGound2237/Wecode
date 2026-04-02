import ProblemExplorer from "@/components/ProblemExplorer";
import { getAllTags, getProblemList } from "@/lib/problems-db";

export const dynamic = "force-dynamic";

export default async function ProblemsPage() {
  const [problems, tags] = await Promise.all([
    getProblemList(),
    getAllTags(),
  ]);

  return <ProblemExplorer problems={problems} tags={tags} />;
}
