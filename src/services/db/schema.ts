export const SCHEMA = {
  v1: {
    tasks: '&id, kind, priority, urgency, nextDueAt, dueAt, completedAt, createdAt',
    rewards: '&id',
    settings: '&key',
  },
  v2: {
    tasks: '&id, kind, priority, urgency, nextDueAt, dueAt, completedAt, createdAt, categoryId',
    rewards: '&id',
    settings: '&key',
    categories: '&id, name',
  },
}
