/* ============================================================
   TODO APP
============================================================ */
const taskInput    = document.getElementById('task-input');
const addBtn       = document.getElementById('add-btn');
const taskList     = document.getElementById('task-list');
const allBtn       = document.getElementById('all-btn');
const activeBtn    = document.getElementById('active-btn');
const completedBtn = document.getElementById('completed-btn');
const clearBtn     = document.getElementById('clear-completed');
const countEl      = document.getElementById('task-count');

let tasks  = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
  const total     = tasks.length;
  const done      = tasks.filter(t => t.completed).length;
  const remaining = total - done;

  if (countEl) countEl.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;

  const totalEl  = document.getElementById('stat-total');
  const activeEl = document.getElementById('stat-active');
  const doneEl   = document.getElementById('stat-done');
  if (totalEl)  totalEl.textContent  = total;
  if (activeEl) activeEl.textContent = remaining;
  if (doneEl)   doneEl.textContent   = done;
}

function setActiveFilter(f) {
  filter = f;
  [allBtn, activeBtn, completedBtn].forEach(b => b && b.classList.remove('active'));
  const map = { all: allBtn, active: activeBtn, completed: completedBtn };
  if (map[f]) map[f].classList.add('active');
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    const msgs = {
      all:       { icon: '📋', text: 'No tasks yet. Add one above!' },
      active:    { icon: '✅', text: 'All tasks done — you crushed it!' },
      completed: { icon: '⏳', text: 'Nothing completed yet. Keep going!' }
    };
    const m = msgs[filter];
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${m.icon}</div>
        <p>${m.text}</p>
      </div>
    `;
    updateStats();
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-check" role="button" aria-label="Toggle complete" tabindex="0"></div>
      <span class="task-text">${escapeHTML(task.text)}</span>
      <div class="task-actions">
        <button class="complete-btn" aria-label="${task.completed ? 'Undo' : 'Complete'}">
          ${task.completed ? 'Undo' : '✓ Done'}
        </button>
        <button class="delete-btn" aria-label="Delete task">🗑</button>
      </div>
    `;

    const check   = li.querySelector('.task-check');
    const compBtn = li.querySelector('.complete-btn');
    const delBtn  = li.querySelector('.delete-btn');

    const toggle = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    check.addEventListener('click', toggle);
    check.addEventListener('keydown', e => e.key === 'Enter' && toggle());
    compBtn.addEventListener('click', toggle);

    delBtn.addEventListener('click', () => {
      li.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      }, 200);
    });

    taskList.appendChild(li);
  });

  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.style.borderColor = 'var(--primary)';
    taskInput.focus();
    setTimeout(() => taskInput.style.borderColor = '', 1200);
    return;
  }

  tasks.unshift({ id: Date.now(), text, completed: false });
  saveTasks();
  taskInput.value = '';
  taskInput.focus();
  setActiveFilter('all');
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

// Events
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => e.key === 'Enter' && addTask());

allBtn       && allBtn.addEventListener('click',       () => setActiveFilter('all'));
activeBtn    && activeBtn.addEventListener('click',    () => setActiveFilter('active'));
completedBtn && completedBtn.addEventListener('click', () => setActiveFilter('completed'));

clearBtn && clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// Init
setActiveFilter('all');