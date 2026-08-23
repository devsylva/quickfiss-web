import { CategoryPageContent } from "./CategoryPageContent";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPageContent slug={slug} />;
}
