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
  v3: {
    tasks: '&id, kind, priority, urgency, nextDueAt, dueAt, completedAt, createdAt, categoryId',
    rewards: '&id',
    settings: '&key',
    categories: '&id, name',
    wheels: '&id, status, createdAt',
  },
  v4: {
    tasks: '&id, kind, priority, urgency, nextDueAt, dueAt, completedAt, createdAt, *categoryIds',
    rewards: '&id',
    settings: '&key',
    categories: '&id, name',
    wheels: '&id, status, createdAt',
  },
  v5: {
    tasks: '&id, kind, priority, urgency, nextDueAt, dueAt, completedAt, createdAt, *categoryIds',
    rewards: '&id',
    settings: '&key',
    categories: '&id, name',
    wheels: '&id, status, createdAt',
    instances: '&id, taskId, completedAt',
  },
}
