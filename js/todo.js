// Tost
let timeOut;

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

const div = document.getElementById("todoList");
const input = document.querySelector("input");
input.addEventListener("keypress", function (e) {
  clearTimeout(timeOut);
  const { value } = e.target;
  //   showTost(`${e.key}:${e.keyCode}`);
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
  const db = window.localStorage;
  const dbName = "_ourToDOs";
  if (db.getItem(dbName)) {
    const old = JSON.parse(db.getItem(dbName));
    db.setItem(dbName, JSON.stringify([...old, todo]));
    showTost("Todo added successfully...");
    // div.textContent = "";
    // showTodoList(div);
  } else {
    db.setItem(dbName, JSON.stringify([todo]));
    showTost("Todo added successfully...");
    // div.textContent = "";
    // showTodoList(div);
  }
}

function getTodoLists() {
  const db = window.localStorage;
  const dbName = "_ourToDOs";
  if (db.getItem(dbName)) {
    return JSON.parse(db.getItem(dbName));
  }
  return [];
}

function showTodoList(element) {
  const db = window.localStorage;
  const dbName = "_ourToDOs";
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
    });
    addDelete();
  }
  return;
}

//delete todo

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

//delete
function handleDelete(id) {
  if (window.confirm("are you sure?")) {
    const db = window.localStorage;
    const dbName = "_ourToDOs";
    const exits = getTodoLists();
    exits.forEach((todo) => {
      if (todo._id == id) {
        db.setItem(dbName, JSON.stringify(arrayRemove(exits, todo)));
        showTost("deleted successfully..", id);
        div.textContent = "";
        showTodoList(div);
      }
    });
  }
}

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele !== value;
  });
}

function makeDone(id) {
  if (window.confirm("are you sure?")) {
    const db = window.localStorage;
    const dbName = "_ourToDOs";
    const exits = getTodoLists();
    exits.forEach((todo) => {
      if (todo._id == id) {
        todo.isDone = true;
        todo.finished = new Date().toLocaleString();
        db.setItem(dbName, JSON.stringify(exits));
        showTost("congratulations! work done...", id);
      }
    });
  }
}

showTodoList(div);

setInterval(() => {
  div.textContent = "";
  showTodoList(div);
}, 1000 * 1);
