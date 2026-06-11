import { Tag, TagGroup } from '@heroui/react';

export function FilterTags({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: { id: string; label: string }[];
  selectedCategory: string;
  onCategoryChange: (key: string) => void;
}) {
  return (
    <TagGroup
      aria-label="Categorías"
      selectionMode="single"
      size="lg"
      selectedKeys={[selectedCategory]}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0];
        if (selected) {
          onCategoryChange(selected as string);
        }
      }}
    >
      <TagGroup.List className="gap-4">
        {categories.map((category) => (
          <Tag key={category.id} id={category.id} className="rounded-2xl">
            {category.label}
          </Tag>
        ))}
      </TagGroup.List>
    </TagGroup>
  );
}
