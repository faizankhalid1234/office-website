import { CategoriesManager } from "@/components/categories/categories-manager";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { expenses: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage expense categories
        </p>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
