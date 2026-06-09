import { Tag, TagGroup } from '@heroui/react';

export function FilterTags({ categories }: { categories: { id: string; label: string }[] }) {
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
