(function () {
    function createAppTitle(Title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = Title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    let currentPathName = window.location.pathname;
    let arrItems = [];
    let arrStates = [];
    let todoObjectsArray = [];

    function createTodoObject(todoName, todoState) {
        todoObjectsArray = [];
        for (let z = 0; z < todoName.length; z++) {
            todoObjectsArray[z] = { name: todoName[z], done: todoState[z] };
        }
        return todoObjectsArray;
    }

    function getLocalValues(currentPage) {
        // console.log(currentPathName);
        let objectOfValues = JSON.parse(localStorage.getItem(currentPage));
        return objectOfValues;
    }

    function saveLocalValues(sum) {
        let sumString = JSON.stringify(sum);
        localStorage.setItem(currentPathName, sumString);
    }

    if (currentPathName === '/') {
        currentPathName = '/index.html';
    }

    window.getLocalValues = getLocalValues(currentPathName);

    function createTodoApp(container, title = 'Список дел', itemData) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        todoItemForm.button.disabled = true;

        todoItemForm.input.addEventListener('input', function () {
            todoItemForm.button.disabled = false;
            if (todoItemForm.input.value === '') {
                todoItemForm.button.disabled = true;
            }
        })
        if (itemData !== null) {
            for (let k = 0; k < itemData.length; ++k) {
                let todoItemLoad;
                arrItems.push(itemData[k].name);
                arrStates.push(itemData[k].done);
                todoItemLoad = createTodoItem(arrItems[k]);
                if (arrStates[k] === true) {
                    todoItemLoad.item.classList.add('list-group-item-success');
                }


                todoItemLoad.deleteButton.addEventListener('click', function () {
                    let arrDel = [];
                    for (let i = 0; i < todoItemLoad.item.innerText.length - 15; i++) {
                        arrDel.push(todoItemLoad.item.innerText[i]);
                    }
                    arrDel = arrDel.join('');
                    if (confirm('Вы уверены?')) {
                        arrStates.splice(arrItems.indexOf(arrDel), 1);
                        arrItems.splice(arrItems.indexOf(arrDel), 1);
                        todoItemLoad.item.remove();
                        saveLocalValues(createTodoObject(arrItems, arrStates));
                    }
                })

                todoList.append(todoItemLoad.item);
                todoItemLoad.doneButton.addEventListener('click', function () {
                    todoItemLoad.item.classList.toggle('list-group-item-success');
                    let li = document.querySelectorAll('li');

                    for (let k = 0; k < li.length; k++) {
                        if (li[k].textContent === todoItemLoad.item.textContent) {
                            arrStates[k] = !arrStates[k];
                        }
                    }
                    saveLocalValues(createTodoObject(arrItems, arrStates));
                });
            }
        }

        todoItemForm.form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);


            let li = document.querySelectorAll('li');
            for (let k = 0; k < li.length; k++) {
                if (todoItemForm.input.value + 'ГотовоУдалить' === li[k].textContent) {
                    todoItemForm.input.value = '';
                    todoItemForm.button.disabled = true;
                    alert(`Это дело уже есть в списке под номером ${k + 1}`)
                    return;
                }
            }

            arrStates.push(false);

            todoItem.deleteButton.addEventListener('click', function () {
                let arrDel = [];
                for (let i = 0; i < todoItem.item.innerText.length - 15; i++) {
                    arrDel.push(todoItem.item.innerText[i]);
                }
                arrDel = arrDel.join('');
                if (confirm('Вы уверены?')) {
                    arrStates.splice(arrItems.indexOf(arrDel), 1);
                    arrItems.splice(arrItems.indexOf(arrDel), 1);
                    todoItem.item.remove();
                    // console.log(createTodoObject(arrItems, arrStates));
                    saveLocalValues(createTodoObject(arrItems, arrStates));
                }
            })

            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                let li = document.querySelectorAll('li');

                for (let k = 0; k < li.length; k++) {
                    if (li[k].textContent === todoItem.item.textContent) {
                        arrStates[k] = !arrStates[k];
                    }
                }
                // console.log(createTodoObject(arrItems, arrStates));
                saveLocalValues(createTodoObject(arrItems, arrStates));
            });

            todoList.append(todoItem.item);


            arrItems.push(todoItemForm.input.value);
            // console.log(createTodoObject(arrItems, arrStates));
            saveLocalValues(createTodoObject(arrItems, arrStates));
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        })

    }



    // document.addEventListener('DOMContentLoaded', function () {
    //     createTodoApp(document.getElementById('my-todos'), 'Мои дела');
    //     createTodoApp(document.getElementById('mom-todos'), 'Дела мамы');
    //     createTodoApp(document.getElementById('dad-todos'), 'Дела папы');
    // })

    window.createTodoApp = createTodoApp;
})();

