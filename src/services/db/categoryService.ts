import type { Category, CategoryDraft } from '@/types/category'
import { db } from './db'

export async function listCategories(): Promise<Category[]> {
  return db.categories.toArray()
}

export async function getCategory(id: string): Promise<Category | undefined> {
  return db.categories.get(id)
}

export async function createCategory(draft: CategoryDraft): Promise<Category> {
  const category: Category = {
    ...draft,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await db.categories.add(category)
  return category
}

export async function updateCategory(id: string, changes: Partial<Category>): Promise<Category> {
  await db.categories.update(id, changes)
  const updated = await getCategory(id)
  if (!updated) throw new Error(`Category ${id} not found after update`)
  return updated
}

export async function deleteCategory(id: string): Promise<void> {
  await db.categories.delete(id)
  // Clear categoryId from any tasks that reference this category
  const affected = await db.tasks.where('categoryId').equals(id).toArray()
  await Promise.all(affected.map((t) => db.tasks.update(t.id, { categoryId: undefined })))
}
