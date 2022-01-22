// Tost
let timeOut;
const db = window.localStorage;
const dbName = "_ourToDOs";
const div = document.getElementById("todoList");
const input = document.querySelector("input");
//tost message
function showTost(message) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  x.innerText = message;
  // Add the "show" class to DIV
  x.className = "show";
  // After 3 seconds, remove the show class from DIV
  timeOut = setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 1000 * 2);
}

input.addEventListener("keypress", function (e) {
  clearTimeout(timeOut);
  const { value } = e.target;
  if (e.key === "Enter") {
    if (!value) return;
    const newTodo = {
      _id: getTodoLists().length + 1,
      title: value,
      time: new Date().toLocaleString(),
      finished: undefined,
      isDone: false,
    };
    saveInDB(newTodo);
  }
});

//save todo in localStorage
function saveInDB(todo) {
  if (db.getItem(dbName)) {
    const old = JSON.parse(db.getItem(dbName));
    db.setItem(dbName, JSON.stringify([...old, todo]));
    clearTimeout(timeOut);
    showTost("Todo added successfully...");
  } else {
    db.setItem(dbName, JSON.stringify([todo]));
    clearTimeout(timeOut);
    showTost("Todo added successfully...");
  }
}

//get lists form localStorage
function getTodoLists() {
  if (db.getItem(dbName)) {
    return JSON.parse(db.getItem(dbName));
  }
  return [];
}

//show all list in the ui
function showTodoList(element) {
  if (db.getItem(dbName)) {
    const todoLists = getTodoLists();
    todoLists.forEach((todo) => {
      const li = `<li class="list-group-item mb-2">
              <div class="row">
                <div class="col"> <span class="${todo.isDone ? "done" : ""}" >${
        todo.title
      }</span> <span class="text-muted">${
        todo.time ? "at:" + todo.time : ""
      }</span> ${todo.finished ? "|| finished at:" + todo.finished : ""}</div>
                <div class="col-lg-2">
                  <div class="d-flex align-items-center">
                <button class="fas fa-trash-alt badge bg-danger del-btn btn-sm" data-id="${
                  todo._id
                }">:</button>
                <button class="badge bg-primary done-btn fas fa-check" data-id="${
                  todo._id
                }">:</button>
                  </div>
                </div>
              </div>
            </li>`;
      const div = document.createElement("div");
      div.innerHTML = li;
      element.appendChild(div);
      addDelete();
    });
  }
  return;
}

//add delete function to all delete buttons's
function addDelete() {
  const btns = document.querySelectorAll(".del-btn");
  const btns2 = document.querySelectorAll(".done-btn");
  btns.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = e.target.getAttribute("data-id");
      handleDelete(id);
    })
  );
  btns2.forEach((btn) =>
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const id = e.target.getAttribute("data-id");
      makeDone(id);
    })
  );
}

//delete todo->single
function handleDelete(id) {
  const exits = getTodoLists();
  const rest = exits.filter((todo) => todo._id != id) || exits;
  db.setItem(dbName, JSON.stringify(rest));
  clearTimeout(timeOut);
  showTost("deleted successfully...");
  div.textContent = "";
  showTodoList(div);
}

//mark as done
function makeDone(id) {
  const exits = getTodoLists();
  exits.forEach((todo) => {
    if (todo._id == id) {
      todo.isDone = true;
      todo.finished = new Date().toLocaleString();
      db.setItem(dbName, JSON.stringify(exits));
      clearTimeout(timeOut);
      showTost("congratulations! work done...", id);
    }
  });
}

//call to show all lists in the ui
showTodoList(div);

//get realtime changes
setInterval(() => {
  div.textContent = "";
  showTodoList(div);
}, 1000 * 1);
