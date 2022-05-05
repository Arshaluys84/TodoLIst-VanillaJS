let todos = [];

const selectAll = document.querySelector(".selectAll");
const input = document.getElementById("title");
const filter = document.querySelector(".filter");
const active = document.querySelector(".filter-active");
const all = document.querySelector(".filter-all");
const completed = document.querySelector(".filter-completed");
const clearCompleted = document.querySelector(".filter-clear");
const form = document.querySelector("form");
const itemsLeft = document.getElementById("filter-left");
const list = document.querySelector(".todo-list");
const item = document.querySelector(".todo-item");

let isActive = false;
let isCompleted = false;
let inputValue;

filter.remove();
clearCompleted.remove();

function itemsLeftFn() {
  itemsLeft.innerHTML = `${todos.filter((i) => !i.checked).length} 
  ${todos.filter((i) => !i.checked).length === 1 ? "todo" : "todos"} left`;
}
function addItem(todos) {
  const checkbox = document.createElement("input");
  checkbox.className = "checkbox";
  const todoElem = document.createElement("span");
  checkbox.type = "checkbox";
  const deleteSpan = document.createElement("span");
  deleteSpan.innerHTML = "X";
  const container = document.createElement("div");
  container.id = Date.now();
  container.append(checkbox, todoElem, deleteSpan);
  todoElem.innerHTML = inputValue;
  input.value = "";
  todos.push({
    id: container.id,
    checked: checkbox.checked,
    text: todoElem.innerHTML,
  });
  item.append(container);
}
input.addEventListener("input", (e) => {
  inputValue = e.target.value;
});
item.addEventListener("dblclick", (e) => {
  if (e.target.tagName == "SPAN" && e.target.innerHTML !== "X") {
    let editting = todos.find((i) => i.id === e.target.closest("div").id);
    let refactoredText;
    let editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    let deleteButton = document.createElement("span");
    deleteButton.innerHTML = "X";
    let deletingButton = e.target.closest("div").lastElementChild;
    deletingButton.remove();
    e.target.hidden = true;
    editInput.value = editting.text;
    e.target.closest("div").append(editInput, deleteButton);
    editInput.focus();
    editInput.addEventListener("input", (e) => {
      refactoredText = e.target.value;
    });

    editInput.addEventListener("keyup", (e) => {
      e.preventDefault();

      if (e.key === "Enter") {
        if (!refactoredText) {
          return;
        }
        e.target.closest("div").children[1].innerHTML = refactoredText;
        e.target.closest("div").children[1].hidden = false;
        editting.checked
          ? e.target.closest("div").children[1].classList.add("line-through")
          : "";
        editting.text = refactoredText;
        todos = todos.map((i) => {
          if (i.id === e.target.closest("div").id) {
            return {
              ...i,
              checked: e.target.closest("div").children[0].checked,
              text: refactoredText,
            };
          } else {
            return i;
          }
        });
        itemsLeftFn();
        e.target.hidden = true;
      }
    });
    editInput.addEventListener("blur", (e) => {
      e.target.closest("div").children[1].innerHTML =
        refactoredText || editting.text || "";
      e.target.closest("div").children[1].hidden = false;
      e.target.remove();
    });
  }
});

item.addEventListener("click", (e) => {
  if (e.target.innerHTML !== "X") {
    return;
  }

  todos = todos.filter((i) => i.id !== e.target.closest("div").id);
  e.target.closest("div").remove();
  itemsLeftFn();
  if (todos.length === 0) {
    filter.remove();
  }
  if (todos.filter((i) => i.checked).length === 0) {
    clearCompleted.remove();
  }
  return todos;
});
item.addEventListener("change", (e) => {
  if (e.target.tagName != "INPUT") {
    return;
  }
  if (todos.filter((i) => !i.checked).length > 0) {
    filter.append(clearCompleted);
  }
  let checkingItemIndex = todos.findIndex(
    (i) => i.id === e.target.closest("div").id
  );
  todos[checkingItemIndex].checked = e.target.checked;
  itemsLeftFn();
  if (e.target.checked) {
    e.target.nextElementSibling.classList.add("line-through");
  } else {
    e.target.nextElementSibling.classList.remove("line-through");
  }
  if (isActive) {
    activeFilter();
  }
  if (isCompleted) {
    completedFilter();
  }
  return todos;
});
function activeFilter() {
  let todosActive = todos.filter((i) => !i.checked);
  item.innerHTML = todosActive
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${i.checked}><span ${
        i.checked ? 'class = "line-through"' : ""
      }>${i.text}</span><span>X</span></div>`;
    })
    .join("");
  return todos;
}
function completedFilter() {
  let todosCompleted = todos.filter((i) => i.checked);
  item.innerHTML = todosCompleted
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${
        i.checked ? "checked" : false
      }><span ${i.checked ? 'class = "line-through"' : ""} >${
        i.text
      }</span><span>X</span></div>`;
    })
    .join("");
  return todos;
}
active.addEventListener("click", (e) => {
  isActive = true;
  if (isActive) {
    activeFilter();
  }
});
all.addEventListener("click", () => {
  isActive = false;
  isCompleted = false;
  let all = [...todos];
  item.innerHTML = all
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${
        i.checked ? "checked" : false
      }><span ${i.checked ? 'class = "line-through"' : ""}>${
        i.text
      }</span><span>X</span></div>`;
    })
    .join("");
  return todos;
});
completed.addEventListener("click", () => {
  isCompleted = true;
  if (isCompleted) {
    completedFilter();
  }
});
clearCompleted.addEventListener("click", () => {
  todos = todos.filter((i) => !i.checked);
  item.innerHTML = todos
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${
        i.checked ? "checked" : false
      }><span>${i.text}</span><span>X</span></div>`;
    })
    .join("");
  clearCompleted.remove();
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addItem(todos);
  itemsLeftFn();
  if (todos.length === 1) {
    list.append(filter);
  }

  selectAll.addEventListener("click", (e) => {
    e.target.classList.toggle("selectAll-color");
    let filteredChecks = todos.filter((i) => i.checked).length;
    todos = todos.map((i) => {
      return {
        ...i,
        checked: filteredChecks !== todos.length ? true : false,
      };
    });
    item.innerHTML = todos
      .map((i) => {
        return `<div id =${i.id}><input type = "checkbox" ${
          i.checked ? "checked" : ""
        } ><span class=${i.checked ? "line-through" : ""}>${
          i.text
        }</span><span>X</span></div>`;
      })
      .join("");
    itemsLeftFn();
  });
});
