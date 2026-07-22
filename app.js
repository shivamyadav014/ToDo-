const taskInput = document.getElementById('taskInput')
const addTaskButton = document.getElementById('addTaskButton')
const todoList = document.getElementById('todoList')
const taskCount = document.getElementById('taskCount')
const clearCompletedButton = document.getElementById('clearCompletedButton')

const STORAGE_KEY = 'todo-web-app-tasks'
let tasks = []

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY)
  tasks = raw ? JSON.parse(raw) : []
}

function updateCount() {
  const total = tasks.length
  const completed = tasks.filter((task) => task.done).length
  taskCount.textContent = `${total} task${total === 1 ? '' : 's'} · ${completed} completed`
}

function renderTasks() {
  todoList.innerHTML = ''
  tasks.forEach((task) => {
    const item = document.createElement('li')
    item.className = 'todo-item' + (task.done ? ' done' : '')

    const label = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = task.done
    checkbox.addEventListener('change', () => toggleTask(task.id))

    const text = document.createElement('span')
    text.textContent = task.text

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.textContent = 'Delete'
    deleteButton.addEventListener('click', () => removeTask(task.id))

    label.appendChild(checkbox)
    label.appendChild(text)
    item.appendChild(label)
    item.appendChild(deleteButton)
    todoList.appendChild(item)
  })
  updateCount()
}

function addTask() {
  const text = taskInput.value.trim()
  if (!text) return
  tasks.unshift({ id: Date.now().toString(), text, done: false })
  taskInput.value = ''
  saveTasks()
  renderTasks()
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, done: !task.done } : task
  )
  saveTasks()
  renderTasks()
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId)
  saveTasks()
  renderTasks()
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done)
  saveTasks()
  renderTasks()
}

addTaskButton.addEventListener('click', addTask)
taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') addTask()
})
clearCompletedButton.addEventListener('click', clearCompleted)

loadTasks()
renderTasks()
