import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

const ssgHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

export default ssgHelper;
