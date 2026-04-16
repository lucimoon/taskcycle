import { create } from 'zustand'
import type { Category, CategoryDraft } from '@/types/category'
import * as categoryService from '@/services/db/categoryService'
import { useTaskStore } from './taskStore'

interface CategoryStore {
  categories: Category[]
  loadCategories: () => Promise<void>
  addCategory: (draft: CategoryDraft) => Promise<Category>
  updateCategory: (id: string, changes: Partial<Category>) => Promise<void>
  removeCategory: (id: string) => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],

  loadCategories: async () => {
    const categories = await categoryService.listCategories()
    set({ categories })
  },

  addCategory: async (draft) => {
    const category = await categoryService.createCategory(draft)
    const categories = await categoryService.listCategories()
    set({ categories })
    return category
  },

  updateCategory: async (id, changes) => {
    await categoryService.updateCategory(id, changes)
    const categories = await categoryService.listCategories()
    set({ categories })
  },

  removeCategory: async (id) => {
    await categoryService.deleteCategory(id)
    const categories = await categoryService.listCategories()
    set({ categories })
    // Reload tasks so cleared categoryIds are reflected in the task store
    await useTaskStore.getState().loadTasks()
  },
}))
