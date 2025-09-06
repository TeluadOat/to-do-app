import Sortable from "sortablejs";

const AddIconBtn = document.querySelector("#add-icon-btn");
const newTaskDialog = document.querySelector("#new-task-dialog");


AddIconBtn.addEventListener("click", () => {
    newTaskDialog.showModal();
});

document.querySelector("#cancel-btn").addEventListener("click", (e) => {
    newTaskDialog.close();
})


// Not started → show "file/document" icon
const notStartedIconSVG = `
<svg class="not-started-icon-btn" xmlns="http://www.w3.org/2000/svg"
    fill="none" viewBox="0 0 24 24"
    stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round"
    d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
    ></path>
</svg>`;

// In progress → show "Loading/Progress" icon
const inProgressIconSVG = `
<svg class="in-progress-icon-btn" xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
</svg>`;

// Done → show "done/check" icon
const doneIconSVG = `
<svg class="done-icon-btn" xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="green" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6L9 17l-5-5"></path>
</svg>`;

const deleteIconSVG = `
<svg class="delete-icon-btn" xmlns="http://www.w3.org/2000/svg"
    fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red">
    <path
        stroke-linecap="round" stroke-linejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    ></path>
</svg>`;

const editIconSVG = `
<svg class="edit-icon-btn" xmlns="http://www.w3.org/2000/svg" 
fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>`;

// add new task
const newTaskForm = document.querySelector("#new-task-form");
const tasksNotStarted = document.querySelector("#tasks-not-started");


newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(newTaskForm);
    const newTaskTitle = formData.get("new-task-title");
    const newTaskDescription = formData.get("new-task-desc");
    const newTaskItem = document.createElement("li");
    newTaskItem.classList.add("task-item");
    newTaskItem.setAttribute("draggable", "true");
    newTaskItem.dataset.state = "not-started";
    newTaskItem.innerHTML = `<div class="task-item-wrap">
					${notStartedIconSVG}
					<span class="task-details"
						><h3 class="task-title">${newTaskTitle}</h3><p
							class="task-desc"
						>
							${newTaskDescription}
						</p></span
					>
                    ${deleteIconSVG}
				</div>`
    tasksNotStarted.prepend(newTaskItem);
    saveTasks();
    updatePlaceholder();
    newTaskForm.reset();
    newTaskDialog.close();
});

const notStartedList = document.querySelector("#tasks-not-started");
const inProgressList = document.querySelector("#in-progress-tasks");
const doneList = document.querySelector("#done-tasks");

[notStartedList, inProgressList, doneList].forEach(list => {
    new Sortable(list, {
        group: "tasks",
        animation: 150,
        filter: ".placeholder",
        draggable: ".task-item",
        onEnd: (evt) => {
            console.log('task moved from', evt.from, 'to', evt.to);

            //task update
            const newList = evt.to.dataset.state;
            evt.item.dataset.state = newList;

            const taskTitle = evt.item.querySelector(".task-title");
            const iconSpan = evt.item.querySelector(".task-item-wrap svg");

            //update icon based on state
            if (newList === "not-started") {
                iconSpan.outerHTML = notStartedIconSVG;
            } else if (newList === "in-progress") {
                iconSpan.outerHTML = inProgressIconSVG;
            } else if (newList === "done") {
                iconSpan.outerHTML = doneIconSVG;
            }

            saveTasks();
            updatePlaceholder();

        }
    })
})

//edit task
/*
document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-icon-btn");
    if (!editBtn) return;

    const taskItem = editBtn.closest(".task-item");
    const taskTitleElem = taskItem.querySelector(".task-title");
    const taskDescElem = taskItem.querySelector(".task-desc");

    taskTitleElem.setAttribute("contenteditable", "true");
    taskDescElem.setAttribute("contenteditable", "true");
    taskTitleElem.focus();

    //save on blur
    const saveEdits = () => {
        taskTitleElem.removeAttribute("contenteditable");
        taskDescElem.removeAttribute("contenteditable");
        saveTasks();

        taskTitleElem.removeEventListener("blur", saveEdits);
        taskDescElem.removeEventListener("blur", saveEdits);

    }

    taskTitleElem.addEventListener("blur", saveEdits);
    taskDescElem.addEventListener("blur", saveEdits);
})*/

// delete task
document.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-icon-btn");
    if (deleteBtn) {
        const taskItem = deleteBtn.closest(".task-item");
        if (taskItem) taskItem.remove();
        saveTasks();
        updatePlaceholder();
    }
});



function updatePlaceholder() {
    document.querySelectorAll(".task-list").forEach(list => {
        const hasTask = list.querySelector(".task-item");
        const existingPlaceholder = list.querySelector(".placeholder");

        if (!hasTask && !existingPlaceholder) {
            const placeholder = document.createElement("li");
            placeholder.className = "placeholder";
            placeholder.textContent = "Drop tasks here";
            list.appendChild(placeholder)
        };

        if (hasTask && existingPlaceholder) {
            existingPlaceholder.remove();
        }
    });
}

function saveTasks() {
    const states = ["not-started", "in-progress", "done"];
    const tasks = [];

    states.forEach(state => {
        const list = document.querySelector(`[data-state="${state}"]`);
        list.querySelectorAll(".task-item").forEach((item, index) => {
            tasks.push({
                title: item.querySelector(".task-title").textContent,
                desc: item.querySelector(".task-desc").textContent,
                state: item.dataset.state,
                order: index
            });
        })
    })
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");
    savedTasks
        .sort((a, b) => a.order - b.order)
        .forEach(task => {
            const newTaskItem = document.createElement("li");
            newTaskItem.classList.add("task-item");
            newTaskItem.setAttribute("draggable", "true");
            newTaskItem.dataset.state = task.state;

            //picking the icon
            let iconSVG = notStartedIconSVG;
            if (task.state === "in-progress") iconSVG = inProgressIconSVG;
            else if (task.state === "done") iconSVG = doneIconSVG;


            newTaskItem.innerHTML = `<div class="task-item-wrap">
					${iconSVG}
					<span class="task-details"
						><h3 class="task-title">${task.title}</h3><p
							class="task-desc"
						>
							${task.desc}
						</p></span
					>
                    ${deleteIconSVG}
				</div>`;


            const targetList = document.querySelector(`[data-state="${task.state}"]`);
            if (targetList) targetList.appendChild(newTaskItem);
        })
}

//initial load
loadTasks();
updatePlaceholder();

