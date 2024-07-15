// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"))||[];

let nextId = JSON.parse(localStorage.getItem("nextId"))|| 1;
;

// Todo: create a function to generate a unique task id
function generateTaskId() {

    return nextId++;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let cardClass = "";
    const dueDate = dayjs(task.dueDate);
    const now = dayjs();
    if (dueDate.isBefore(now, 'day')) {
      cardClass = "bg-danger text-white";
    } else if (dueDate.isSame(now, 'day') || dueDate.diff(now, 'day') <= 2) {
      cardClass = "bg-warning";}
    // }
    // // function changeColour(){
    // //     let newColor=documenet.queryselector(".card-body")
    // //     if(task.staus==="to-do"){
            
    // //         newColor.style.backgroundColor="red"
    // //     }
    // }
  
    return  `
    
        <div class="card mb-3 ${cardClass} " data-id="${task.id}">
        <div class="card-body">
        <h4 class ="card-title">${task.title}</h4>
        <p class ="card-text">${task.description}</p>
        <p class ="card-due-date">${task.dueDate}</p>
        <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
        </div> `

}



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // $('#todo-cards, #in-progress-cards, #done-cards').empty();
    if(!taskList) {
        taskList = [];
    }

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    todoList.empty();

    const doneList = $('#done-cards');
    todoList.empty();

    taskList.forEach(task => {
        //let taskHtml=createTaskCard(task)
        if(task.status==="to-do"){
            todoList.append(createTaskCard(task));
        }else if(task.status==="in-progress"){
            inProgressList.append(createTaskCard(task))
            }else if(task.status==="done"){
                todoList.append(createTaskCard(task))

            }
        }) 
        // making card draggable
        $('.card').draggable({
            helper: "clone",
            revert: "invalid",
            start: function(event, ui) {
                $(ui.helper).css('z-index', 1000);
            }
          });
        //   attaching a delete event
          $(document).on('click', '.delete-task', handleDeleteTask);
}


      
        //   $('.delete-task').click(handleDeleteTask);

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault()
    let newTask = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        description: $('#taskDescription').val(),
        dueDate: $('#taskDueDate').val(),
        status: 'to-do'
      };
      taskList.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));
  $('#taskForm')[0].reset();

  // Close the modal
  $('#formModal').modal('hide');

  // Re-render the task list
  renderTaskList();
}

// Event handler for form submission to add a new task
// $('#taskform').submit(handleAddTask)

// (renderTaskList())
// (handleAddTask)


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).closest('.card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Re-render the task list
    renderTaskList();

}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) { 
    const taskId = ui.draggable.data('id');
    console.log(taskId)
    const newStatus = $(this).attr('id').replace('-cards', '');
console.log(newStatus)
    taskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Re-render the task list
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#taskForm').submit(handleAddTask);

    // Make lanes droppable
    $('.lane').droppable({
        accept: ".card",
        drop: handleDrop
    });

    // Make the due date field a date picker
    $('#taskDueDate').datepicker({ dateFormat: 'yy-mm-dd' });
});

