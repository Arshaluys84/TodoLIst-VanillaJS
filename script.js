let arr = [];
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
  itemsLeft.innerHTML = `${arr.filter((i) => !i.checked).length} 
  ${arr.filter((i) => !i.checked).length === 1 ? "todo" : "todos"} left`;
}
input.addEventListener("input", (e) => {
  inputValue = e.target.value;
});
item.addEventListener("dblclick", (e) => {
  if (e.target.tagName == "SPAN" && e.target.innerHTML !== "X") {
    let editting = arr.find((i) => i.id === e.target.closest("div").id);
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
        arr = arr.map((i) => {
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

  arr = arr.filter((i) => i.id !== e.target.closest("div").id);
  e.target.closest("div").remove();
  itemsLeftFn();
  if (arr.length === 0) {
    filter.remove();
  }
  if (arr.filter((i) => i.checked).length === 0) {
    clearCompleted.remove();
  }
  return arr;
});
item.addEventListener("change", (e) => {
  if (e.target.tagName != "INPUT") {
    return;
  }
  if (arr.filter((i) => !i.checked).length > 0) {
    filter.append(clearCompleted);
  }
  let checkingItemIndex = arr.findIndex(
    (i) => i.id === e.target.closest("div").id
  );
  arr[checkingItemIndex].checked = e.target.checked;
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
  return arr;
});
function activeFilter() {
  let arrActive = arr.filter((i) => !i.checked);
  item.innerHTML = arrActive
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${i.checked}><span ${
        i.checked ? 'class = "line-through"' : ""
      }>${i.text}</span><span>X</span></div>`;
    })
    .join("");
  return arr;
}
function completedFilter() {
  let arrCompleted = arr.filter((i) => i.checked);
  item.innerHTML = arrCompleted
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${
        i.checked ? "checked" : false
      }><span ${i.checked ? 'class = "line-through"' : ""} >${
        i.text
      }</span><span>X</span></div>`;
    })
    .join("");
  return arr;
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
  let all = [...arr];
  item.innerHTML = all
    .map((i) => {
      return `<div id =${i.id}><input type = "checkbox" ${
        i.checked ? "checked" : false
      }><span ${i.checked ? 'class = "line-through"' : ""}>${
        i.text
      }</span><span>X</span></div>`;
    })
    .join("");
  return arr;
});
completed.addEventListener("click", () => {
  isCompleted = true;
  if (isCompleted) {
    completedFilter();
  }
});
clearCompleted.addEventListener("click", () => {
  arr = arr.filter((i) => !i.checked);
  item.innerHTML = arr
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
  function addItem(arr) {
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
    arr.push({
      id: container.id,
      checked: checkbox.checked,
      text: todoElem.innerHTML,
    });
    item.append(container);
  }
  addItem(arr);

  itemsLeftFn();
  if (arr.length === 1) {
    list.append(filter);
  }

  selectAll.addEventListener("click", (e) => {
    e.target.classList.toggle("selectAll-color");
    let filteredChecks = arr.filter((i) => i.checked).length;
    arr = arr.map((i) => {
      return {
        ...i,
        checked: filteredChecks !== arr.length ? true : false,
      };
    });
    item.innerHTML = arr
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
