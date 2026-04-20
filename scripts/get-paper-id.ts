import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const paper = await prisma.researchPaper.findFirst({ orderBy: { createdAt: "desc" }, select: { id: true, title: true } });
  console.log("PAPER_ID=", paper?.id);
  console.log("TITLE=", paper?.title);
}
main().catch(console.error).finally(() => prisma.$disconnect());
