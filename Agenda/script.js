// Lista de tarefas
let tasks = [];

//adicionar uma tarefa à lista
function addTask(description, details, priority) {
  const task = {
    description: description,
    details: details,
    priority: priority,
    completed: false,
    completedAt: null,
    createdAt: new Date()
  };

  tasks.push(task);
  sortTasks();
  updateTable();
  saveTasks();
}
//marcar uma tarefa como concluída
function completeTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) {
      tasks[index].completedAt = new Date();
    } else {
      tasks[index].completedAt = null;
    }
    sortTasks();
    updateTable();
    saveTasks();
  }
}

// excluir uma tarefa
function deleteTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    updateTable();
    saveTasks();
  }
}
//ordenar as tarefas
function sortTasks() {
  tasks.sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    } else if (!a.completed && b.completed) {
      return -1;
    } else if (a.priority === 'Muito Urgente' && b.priority !== 'Muito Urgente') {
      return -1;
    } else if (a.priority !== 'Muito Urgente' && b.priority === 'Muito Urgente') {
      return 1;
    } else if (a.priority === 'Urgente' && b.priority === 'Normal') {
      return -1;
    } else if (a.priority === 'Normal' && b.priority === 'Urgente') {
      return 1;
    } else if (a.createdAt < b.createdAt) {
      return -1;
    } else if (a.createdAt > b.createdAt) {
      return 1;
    } else {
      return 0;
    }
  });
}

//atualizar a tabela com as tarefas
function updateTable() {
  const taskList = document.getElementById('taskList');
  const showCompleted = document.getElementById('showCompleted').checked;
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    if (!task.completed || showCompleted) {
      const row = document.createElement('tr');
      const completeCell = document.createElement('td');
      const descriptionCell = document.createElement('td');
      const detailsCell = document.createElement('td');
      const priorityCell = document.createElement('td');
      const completedAtCell = document.createElement('td');
      const deleteCell = document.createElement('td');

      const completeCheckbox = document.createElement('input');
      completeCheckbox.type = 'checkbox';
      completeCheckbox.checked = task.completed;
      completeCheckbox.addEventListener('change', function() {
        completeTask(index);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.addEventListener('click', function() {
        deleteTask(index);
      });

      row.appendChild(completeCell);
      row.appendChild(descriptionCell);
      row.appendChild(detailsCell);
      row.appendChild(priorityCell);
      row.appendChild(completedAtCell);
      row.appendChild(deleteCell);

      completeCell.appendChild(completeCheckbox);
      descriptionCell.textContent = task.description;
      detailsCell.textContent = task.details;
      priorityCell.textContent = task.priority;
      completedAtCell.textContent = task.completed ? task.completedAt.toLocaleString() : '';
      deleteCell.appendChild(deleteButton);

      if (task.completed) {
        row.classList.add('completed');
      }

      if (task.priority === 'Normal') {
        row.classList.add('normal');
      } else if (task.priority === 'Urgente') {
        row.classList.add('urgente');
      } else if (task.priority === 'Muito Urgente') {
        row.classList.add('muito-urgente');
      }

      taskList.appendChild(row);
    }
  });
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    updateTable();
  }
}

// Evento de envio do formulário
const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const descriptionInput = document.getElementById('description');
  const detailsInput = document.getElementById('details');
  const priorityInput = document.getElementById('priority');

  const description = descriptionInput.value;
  const details = detailsInput.value;
  const priority = priorityInput.value;

  addTask(description, details, priority);

  descriptionInput.value = '';
  detailsInput.value = '';
  priorityInput.value = 'Normal';
});

// Carregar as tarefas ao carregar a página
loadTasks();