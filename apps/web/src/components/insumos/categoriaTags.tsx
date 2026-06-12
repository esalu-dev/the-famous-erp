import { Tag, TagGroup } from '@heroui/react';

type CategoryTagsProps = {
  categories: {
    id: string;
    label: string;
  }[];
  selectedCategory: string;
  onCategoryChange: (key: string) => void;
};

export function CategoryTags({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryTagsProps) {
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

