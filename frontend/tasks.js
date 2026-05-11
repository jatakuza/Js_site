

document.addEventListener('DOMContentLoaded', () => {

    let tasks =
        JSON.parse(localStorage.getItem('tasks')) || [];

    let draggedTaskId = null;

    const form = document.getElementById('task-form');

    const notification =
        document.getElementById('notification');

    const searchInput =
        document.getElementById('search-input');

    const counter =
        document.getElementById('task-counter');



    const columns = {
        todo: document.getElementById('todo'),
        progress: document.getElementById('progress'),
        review: document.getElementById('review'),
        done: document.getElementById('done')
    };



    // ================= SAVE =================
    function saveTasks() {

        localStorage.setItem(
            'tasks',
            JSON.stringify(tasks)
        );
    }



    // ================= NOTIFICATION =================
    function showNotification(text) {

        notification.textContent = text;

        setTimeout(() => {
            notification.textContent = '';
        }, 2000);
    }



    // ================= COUNTER =================
    function updateCounter() {

        counter.textContent =
            `Total tasks: ${tasks.length}`;
    }



    // ================= CREATE TASK CARD =================
    function createTaskCard(task) {

        const card = document.createElement('div');

        card.className = 'task-card';

        card.draggable = true;

        card.dataset.id = task.id;

        card.innerHTML = `
            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <p>
                <strong>Priority:</strong>
                ${task.priority}
            </p>

            <div class="task-buttons">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;



        // ================= DELETE =================
        card.querySelector('.delete-btn')
            .addEventListener('click', () => {

                tasks = tasks.filter(
                    t => t.id !== task.id
                );

                saveTasks();

                renderTasks();

                showNotification('Task deleted');
            });



        // ================= EDIT =================
        card.querySelector('.edit-btn')
            .addEventListener('click', () => {

                const newTitle = prompt(
                    'Task title',
                    task.title
                );

                if (!newTitle) return;

                const newDescription = prompt(
                    'Task description',
                    task.description
                );

                task.title = newTitle;
                task.description = newDescription;

                saveTasks();

                renderTasks();

                showNotification('Task updated');
            });



        // ================= DRAG =================
        card.addEventListener('dragstart', () => {

            draggedTaskId = task.id;

            card.classList.add('dragging');
        });


        card.addEventListener('dragend', () => {

            card.classList.remove('dragging');
        });

        return card;
    }



    // ================= RENDER =================
    function renderTasks(filter = '') {

        Object.values(columns).forEach(column => {
            column.innerHTML = '';
        });

        tasks
            .filter(task =>
                task.title
                    .toLowerCase()
                    .includes(filter.toLowerCase())
            )
            .forEach(task => {

                const card = createTaskCard(task);

                columns[task.status]
                    .appendChild(card);
            });

        updateCounter();
    }



    // ================= ADD TASK =================
    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const title =
            document.getElementById('task-title').value;

        const description =
            document.getElementById('task-description').value;

        const priority =
            document.getElementById('task-priority').value;



        const task = {
            id: Date.now(),
            title,
            description,
            priority,
            status: 'todo'
        };



        tasks.push(task);

        saveTasks();

        renderTasks();

        form.reset();

        showNotification('Task created');
    });



    // ================= SEARCH =================
    searchInput.addEventListener('input', (e) => {

        renderTasks(e.target.value);
    });



    // ================= DRAG & DROP =================
    document.querySelectorAll('.task-list')
        .forEach(column => {

            // hover
            column.addEventListener('dragover', (e) => {

                e.preventDefault();

                column.parentElement
                    .classList.add('drag-over');
            });


            // leave
            column.addEventListener('dragleave', () => {

                column.parentElement
                    .classList.remove('drag-over');
            });


            // drop
            column.addEventListener('drop', () => {

                column.parentElement
                    .classList.remove('drag-over');

                const task = tasks.find(
                    t => t.id === draggedTaskId
                );

                if (!task) return;

                task.status = column.id;

                saveTasks();

                renderTasks();

                showNotification(
                    `Task moved to ${column.id}`
                );
            });
        });



    renderTasks();

});