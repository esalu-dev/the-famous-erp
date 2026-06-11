import { TagGroup, Tag } from '@heroui/react';

type CategoryTagsProps = {
  categories: {
    id: string;
    label: string;
  }[];
};

export function CategoryTags({ categories }: CategoryTagsProps) {
  return (
    <TagGroup aria-label="Categorías" selectionMode="single" size="lg">
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
