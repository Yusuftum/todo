document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    var taskInput = document.getElementById('new-task');
    var taskDate = document.getElementById('task-date');
    var taskCategory = document.getElementById('task-category');
    var taskPriority = document.getElementById('task-priority');
    var taskNotes = document.getElementById('task-notes');
    var taskList = document.getElementById('task-list');

    if (taskInput.value.length > 18) {
        alert('Görev en fazla 18 karakter uzunluğunda olmalı');
        return;
    }

    if (taskNotes.value.length > 18) {
        alert('Notlar en fazla 18 karakter uzunluğunda olmalı');
        return;
    }
    
    if (taskInput.value !== '') {
        var listItem = createTaskElement(taskInput.value, taskDate.value, taskCategory.value, taskPriority.value, taskNotes.value, false);
        taskList.appendChild(listItem);
        saveTasks();
        taskInput.value = '';
        taskDate.value = '';
        taskCategory.value = 'Genel';
        taskPriority.value = 'Düşük';
        taskNotes.value = '';
        alert('Görev eklendi');
    }
}

document.getElementById('add-task').addEventListener('click', addTask);

document.getElementById('new-task').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

document.getElementById('clear-tasks').addEventListener('click', function() {
    var taskList = document.getElementById('task-list');
    var completedTaskList = document.getElementById('completed-task-list');
    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';
    saveTasks();
    alert('Tüm görevler silindi');
});

document.getElementById('filter-tasks').addEventListener('change', function() {
    filterTasks(this.value);
});

function createTaskElement(taskText, taskDate, taskCategory, taskPriority, taskNotes, completed) {
    var listItem = document.createElement('li');

    var taskSpan = document.createElement('span');
    taskSpan.textContent = `${taskText} (Kategori: ${taskCategory}) ${taskDate ? 'Tarih: ' + taskDate : ''} ${taskPriority ? 'Öncelik: ' + taskPriority : ''}`;
    
    var taskNotesDiv = document.createElement('div');
    taskNotesDiv.textContent = taskNotes ? 'Notlar: ' + taskNotes : '';
    
    var checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.checked = completed;
    checkBox.addEventListener('change', function() {
        taskSpan.classList.toggle('completed');
        moveTask(this);
        saveTasks();
    });

    var editButton = document.createElement('button');
    editButton.textContent = 'Düzenle';
    editButton.classList.add('edit');
    editButton.addEventListener('click', function() {
        var newTaskText = prompt('Görevi düzenle:', taskText);
        var newTaskDate = prompt('Görev tarihini düzenle:', taskDate);
        var newTaskCategory = prompt('Görev kategorisini düzenle:', taskCategory);
        var newTaskPriority = prompt('Görev önceliğini düzenle:', taskPriority);
        var newTaskNotes = prompt('Görev notlarını düzenle:', taskNotes);

        if (newTaskText !== null && newTaskText.length > 18) {
            alert('Görev en fazla 18 karakter uzunluğunda olmalı');
            return;
        }

        if (newTaskNotes !== null && newTaskNotes.length > 18) {
            alert('Notlar en fazla 18 karakter uzunluğunda olmalı');
            return;
        }

        if (newTaskText !== null && newTaskText !== '') {
            taskSpan.textContent = `${newTaskText} (Kategori: ${newTaskCategory}) ${newTaskDate ? 'Tarih: ' + newTaskDate : ''} ${newTaskPriority ? 'Öncelik: ' + newTaskPriority : ''}`;
            taskNotesDiv.textContent = newTaskNotes ? 'Notlar: ' + newTaskNotes : '';
            saveTasks();
        }
    });
    
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Sil';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', function() {
        listItem.remove();
        saveTasks();
        alert('Görev silindi');
    });

    var restoreButton = document.createElement('button');
    restoreButton.textContent = 'Geri Al';
    restoreButton.classList.add('restore');
    restoreButton.addEventListener('click', function() {
        checkBox.checked = false;
        moveTask(checkBox);
        saveTasks();
    });
    
    listItem.appendChild(checkBox);
    listItem.appendChild(taskSpan);
    listItem.appendChild(taskNotesDiv);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    if (completed) {
        taskSpan.classList.add('completed');
        listItem.appendChild(restoreButton);
        document.getElementById('completed-task-list').appendChild(listItem);
    } else {
        document.getElementById('task-list').appendChild(listItem);
    }
    
    return listItem;
}

function moveTask(checkBox) {
    var listItem = checkBox.parentElement;
    var taskList = checkBox.checked ? 'completed-task-list' : 'task-list';
    if (checkBox.checked) {
        var restoreButton = listItem.querySelector('.restore');
        if (!restoreButton) {
            restoreButton = document.createElement('button');
            restoreButton.textContent = 'Geri Al';
            restoreButton.classList.add('restore');
            restoreButton.addEventListener('click', function() {
                checkBox.checked = false;
                moveTask(checkBox);
                saveTasks();
            });
            listItem.appendChild(restoreButton);
        }
    } else {
        var restoreButton = listItem.querySelector('.restore');
        if (restoreButton) {
            restoreButton.remove();
        }
    }
    document.getElementById(taskList).appendChild(listItem);
}

function filterTasks(filter) {
    var taskListItems = document.querySelectorAll('#task-list li');
    var completedTaskListItems = document.querySelectorAll('#completed-task-list li');
    
    if (filter === 'all') {
        taskListItems.forEach(function(item) {
            item.style.display = 'flex';
        });
        completedTaskListItems.forEach(function(item) {
            item.style.display = 'flex';
        });
    } else if (filter === 'active') {
        taskListItems.forEach(function(item) {
            item.style.display = 'flex';
        });
        completedTaskListItems.forEach(function(item) {
            item.style.display = 'none';
        });
    } else if (filter === 'completed') {
        taskListItems.forEach(function(item) {
            item.style.display = 'none';
        });
        completedTaskListItems.forEach(function(item) {
            item.style.display = 'flex';
        });
    }
}

function saveTasks() {
    var tasks = [];
    document.querySelectorAll('#task-list li').forEach(function(item) {
        tasks.push({ 
            text: item.querySelector('span').textContent.split(' (')[0], 
            date: item.querySelector('span').textContent.split('Tarih: ')[1] || '', 
            category: item.querySelector('span').textContent.split('Kategori: ')[1].split(') ')[0], 
            priority: item.querySelector('span').textContent.split('Öncelik: ')[1] || '', 
            notes: item.querySelector('div').textContent.split('Notlar: ')[1] || '',
            completed: false 
        });
    });
    document.querySelectorAll('#completed-task-list li').forEach(function(item) {
        tasks.push({ 
            text: item.querySelector('span').textContent.split(' (')[0], 
            date: item.querySelector('span').textContent.split('Tarih: ')[1] || '', 
            category: item.querySelector('span').textContent.split('Kategori: ')[1].split(') ')[0], 
            priority: item.querySelector('span').textContent.split('Öncelik: ')[1] || '', 
            notes: item.querySelector('div').textContent.split('Notlar: ')[1] || '',
            completed: true 
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        createTaskElement(task.text, task.date, task.category, task.priority, task.notes, task.completed);
    });
}
