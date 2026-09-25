import SectionHeader from "../components/SectionHeader";
import CategoryIcon from "../components/CategoryIcon";
import { categories } from "../data/categories";

export default function Categories() {
  return (
    <div className="container-page py-10">
      <SectionHeader eyebrow="Explore everything" title="All Categories" description="Browse ACoupon by the way you shop, travel, eat and pay." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category) => <CategoryIcon key={category.slug} category={category} />)}
      </div>
    </div>
  );
}
