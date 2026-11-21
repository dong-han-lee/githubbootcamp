const STORAGE_KEY = 'todo-list-items';
const THEME_STORAGE_KEY = 'todo-list-theme';
const FILTER_STORAGE_KEY = 'todo-list-filter';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedButton = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeLabel = document.getElementById('theme-label');
const filterButtons = document.querySelectorAll('.btn-filter');

let todos = loadTodos();
let currentFilter = loadFilter();
let hasManualTheme = false;
let currentTheme = 'light';

// 讀取上次選擇的篩選條件，無效值會安全回退為全部。
function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
  return savedFilter === 'active' || savedFilter === 'completed'
    ? savedFilter
    : 'all';
}

// 從瀏覽器儲存空間讀取格式正確的待辦事項。
function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((todo) =>
      todo &&
      typeof todo.id === 'string' &&
      typeof todo.text === 'string' &&
      typeof todo.completed === 'boolean'
    );
  } catch (error) {
    console.warn('讀取待辦事項失敗，將以空清單開始。', error);
    return [];
  }
}

// 將目前的待辦事項儲存到瀏覽器。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 依照待辦資料更新清單、空狀態提示與未完成數量。
function render() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '刪除';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  emptyState.hidden = visibleTodos.length > 0;
  if (todos.length === 0) {
    emptyState.textContent = '還沒有任何待辦事項,新增一個吧!';
  } else if (currentFilter === 'active') {
    emptyState.textContent = '太棒了，沒有未完成的待辦事項！';
  } else if (currentFilter === 'completed') {
    emptyState.textContent = '目前沒有已完成的待辦事項；項目仍保留，只是不符合篩選條件。';
  }

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  remainingCount.textContent = `未完成:${todos.filter((todo) => !todo.completed).length} 項`;
  const completedCount = todos.filter((todo) => todo.completed).length;
  clearCompletedButton.hidden = completedCount === 0;
}

// 套用指定主題，並同步更新切換按鈕。
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  updateThemeButton(theme);
}

// 依目前有效的主題更新按鈕圖示與文字。
function updateThemeButton(theme) {
  const isDark = theme === 'dark';
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeLabel.textContent = isDark ? '淺色模式' : '深色模式';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

// 保留系統自動配色，並同步更新按鈕顯示。
function applySystemTheme(prefersDark) {
  currentTheme = prefersDark ? 'dark' : 'light';
  document.documentElement.removeAttribute('data-theme');
  updateThemeButton(currentTheme);
}

// 首次使用時依照系統配色，手動選擇後則使用儲存的主題。
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    hasManualTheme = true;
    applyTheme(savedTheme);
    return;
  }

  applySystemTheme(systemTheme.matches);

  systemTheme.addEventListener('change', (event) => {
    if (!hasManualTheme) {
      applySystemTheme(event.matches);
    }
  });
}

// 使用時間與隨機字串產生待辦事項識別碼。
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
    render();
  });
});

themeToggle.addEventListener('click', () => {
  hasManualTheme = true;
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  applyTheme(nextTheme);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: createId(), text, completed: false });
  saveTodos();
  render();
  input.value = '';
  input.focus();
});

list.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'checkbox') return;

  const item = event.target.closest('.todo-item');
  if (!item) return;

  todos = todos.map((todo) =>
    todo.id === item.dataset.id ? { ...todo, completed: event.target.checked } : todo
  );
  saveTodos();
  render();
});

list.addEventListener('click', (event) => {
  if (!(event.target instanceof HTMLButtonElement) || !event.target.matches('.btn-delete')) return;

  const item = event.target.closest('.todo-item');
  if (!item) return;

  todos = todos.filter((todo) => todo.id !== item.dataset.id);
  saveTodos();
  render();
});

clearCompletedButton.addEventListener('click', () => {
  const completedCount = todos.filter((todo) => todo.completed).length;
  if (completedCount === 0) return;

  if (!window.confirm(`確定要清除全部 ${completedCount} 筆已完成的事項嗎？此操作無法復原。`)) {
    return;
  }

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

initTheme();
render();
