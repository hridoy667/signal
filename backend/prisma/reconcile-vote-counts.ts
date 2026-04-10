/**
 * Rebuilds posts.upvoats / downvoats / neutralvoats from post_votes rows.
 * Run once after fixing voting bugs or if counts drifted negative: `npm run reconcile:votes` (from backend/).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({ select: { id: true } });
  for (const { id } of posts) {
    const [upvoats, downvoats, neutralvoats] = await Promise.all([
      prisma.postVote.count({ where: { postId: id, vote: "UPVOTE" } }),
      prisma.postVote.count({ where: { postId: id, vote: "DOWNVOTE" } }),
      prisma.postVote.count({ where: { postId: id, vote: "NEUTRAL" } }),
    ]);
    await prisma.post.update({
      where: { id },
      data: { upvoats, downvoats, neutralvoats },
    });
  }
  console.log(`Reconciled vote totals for ${posts.length} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
