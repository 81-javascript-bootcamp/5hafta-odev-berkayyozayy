import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$addBtn = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$addBtn.textContent = 'Adding Task...';
    this.$addBtn.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$addBtn.textContent = 'Add Task';
        this.$addBtn.disabled = false;
      });
  }

  addTaskToTable(task) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title}<td>
    <button id=${task.id} class='btn-delete'><i
    class="fas fa-trash"
  ></i></button></td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
      this.handleDeleteTask();
    });
  }

  getDeleteButtons() {
    return this.$tableTbody.querySelectorAll('.btn-delete');
  }

  getRows() {
    return this.$tableTbody.querySelectorAll('tr');
  }

  handleDeleteTask() {
    const $deleteBtn = this.getDeleteButtons();
    $deleteBtn.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        deleteTaskFromApi(button.id).then((res) => {
          if (res.status == 200) {
            const $trs = this.getRows();
            $trs.forEach((tr) => {
              tr.remove();
            });
            this.fillTasksTable();
          }
        });
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
