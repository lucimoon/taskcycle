export interface Category {
  id: string
  name: string
  color: string
  createdAt: string
}

export type CategoryDraft = Omit<Category, 'id' | 'createdAt'>
