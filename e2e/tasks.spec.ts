import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() =>
    new Promise<void>((resolve) => {
      const req = indexedDB.deleteDatabase('taskcycle')
      req.onsuccess = () => resolve()
      req.onerror = () => resolve()
    }),
  )
  await page.reload()
})

test('create a one-off task', async ({ page }) => {
  await page.getByRole('button', { name: /new task/i }).click()
  await page.getByPlaceholder(/what needs to be done/i).fill('Buy groceries')
  await page.getByRole('button', { name: /save task/i }).click()

  await expect(page.getByText('Buy groceries', { exact: true })).toBeVisible()
  await expect(page.getByText('Once')).toBeVisible()
})

test('create a recurring task with a step', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.getByRole('button', { name: /recurring/i }).click()
  await page.getByPlaceholder(/what needs to be done/i).fill('Do laundry')

  // Set recurrence to 2 days
  await page.getByLabel('Repeat amount').fill('2')
  await page.getByRole('combobox').selectOption('days')

  // Add a step
  await page.getByRole('button', { name: /add step/i }).click()
  await page.getByPlaceholder('Step 1').fill('Start washer')

  await page.getByRole('button', { name: /save task/i }).click()

  await expect(page.getByText('Do laundry', { exact: true })).toBeVisible()
  await expect(page.getByText('Recurring')).toBeVisible()
  await expect(page.getByText('0/1 steps')).toBeVisible()
})

test('edit a task', async ({ page }) => {
  // Create a task first
  await page.getByRole('button', { name: /new task/i }).click()
  await page.getByPlaceholder(/what needs to be done/i).fill('Buy groceries')
  await page.getByRole('button', { name: /save task/i }).click()
  await expect(page.getByText('Buy groceries', { exact: true })).toBeVisible()

  // Edit it
  await page.getByRole('button', { name: /edit task/i }).click()
  const titleInput = page.getByPlaceholder(/what needs to be done/i)
  await titleInput.clear()
  await titleInput.fill('Buy groceries (updated)')
  await page.getByRole('button', { name: /save task/i }).click()

  await expect(page.getByText('Buy groceries (updated)', { exact: true })).toBeVisible()
  await expect(page.getByText('Buy groceries', { exact: true })).not.toBeVisible()
})

test('step timer appears and starts for a timed step', async ({ page }) => {
  await page.goto('/tasks/new')
  await page.getByPlaceholder(/what needs to be done/i).fill('Laundry')
  await page.getByRole('button', { name: /add step/i }).click()
  await page.getByPlaceholder('Step 1').fill('Start washer')
  // set duration to 30 minutes
  await page.getByRole('spinbutton', { name: /duration in minutes/i }).fill('30')
  await page.getByRole('button', { name: /save task/i }).click()

  // Expand steps on the card
  await page.getByRole('button', { name: /expand steps/i }).click()
  // Timer should show initial countdown 30:00
  await expect(page.getByLabel('Timer countdown')).toHaveText('30:00')
  // Start the timer
  await page.getByRole('button', { name: /start timer/i }).click()
  await expect(page.getByRole('button', { name: /pause timer/i })).toBeVisible()
})

test('delete a task', async ({ page }) => {
  // Create a task first
  await page.getByRole('button', { name: /new task/i }).click()
  await page.getByPlaceholder(/what needs to be done/i).fill('Temporary task')
  await page.getByRole('button', { name: /save task/i }).click()
  await expect(page.getByText('Temporary task', { exact: true })).toBeVisible()

  // Delete it — accept the confirm dialog
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: /delete task/i }).click()

  await expect(page.getByText('Temporary task', { exact: true })).not.toBeVisible()
})
