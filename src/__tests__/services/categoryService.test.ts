import { db } from '@/services/db/db'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  listCategories,
} from '@/services/db/categoryService'
import { createTask } from '@/services/db/taskService'
import type { CategoryDraft } from '@/types/category'
import type { TaskDraft } from '@/types/task'

const draft: CategoryDraft = { name: 'Work', color: '#3b82f6' }

beforeEach(async () => {
  await db.categories.clear()
  await db.tasks.clear()
})

describe('createCategory', () => {
  it('persists a category and returns it with id and createdAt', async () => {
    const cat = await createCategory(draft)
    expect(cat.id).toBeTruthy()
    expect(cat.createdAt).toBeTruthy()
    expect(cat.name).toBe('Work')
    expect(cat.color).toBe('#3b82f6')
  })

  it('appears in listCategories after creation', async () => {
    await createCategory(draft)
    const cats = await listCategories()
    expect(cats).toHaveLength(1)
    expect(cats[0].name).toBe('Work')
  })
})

describe('updateCategory', () => {
  it('persists changes', async () => {
    const cat = await createCategory(draft)
    const updated = await updateCategory(cat.id, { name: 'Personal' })
    expect(updated.name).toBe('Personal')
    const fetched = await getCategory(cat.id)
    expect(fetched?.name).toBe('Personal')
  })
})

describe('deleteCategory', () => {
  it('removes the category', async () => {
    const cat = await createCategory(draft)
    await deleteCategory(cat.id)
    const cats = await listCategories()
    expect(cats).toHaveLength(0)
  })

  it('clears categoryId from tasks that referenced it', async () => {
    const cat = await createCategory(draft)
    const taskDraft: TaskDraft = {
      kind: 'once',
      title: 'Report',
      steps: [],
      priority: 1,
      urgency: 1,
      categoryId: cat.id,
    }
    const task = await createTask(taskDraft)
    expect(task.categoryId).toBe(cat.id)

    await deleteCategory(cat.id)

    const updated = await db.tasks.get(task.id)
    expect(updated?.categoryId).toBeUndefined()
  })

  it('does not affect tasks in other categories', async () => {
    const cat1 = await createCategory(draft)
    const cat2 = await createCategory({ name: 'Health', color: '#22c55e' })
    const taskDraft: TaskDraft = {
      kind: 'once',
      title: 'Gym',
      steps: [],
      priority: 2,
      urgency: 2,
      categoryId: cat2.id,
    }
    const task = await createTask(taskDraft)
    await deleteCategory(cat1.id)

    const unchanged = await db.tasks.get(task.id)
    expect(unchanged?.categoryId).toBe(cat2.id)
  })
})
