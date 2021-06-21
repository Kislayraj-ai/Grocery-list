import { setItems, removeItem, editItem, getLocal } from './localStorage.js';

// function to select elements
const get = (select) => {
	const element = document.querySelector(select);
	if (element) return element;
	throw new Error(`Please check ${select} selector`);
};

//elements selection
const grocery = get('.grocery');
const form = get('.form');
const alert = get('.alert');
const submit = get('.submit-button');

//grocery container selection
const groceryContainer = get('.grocery-container');
const list = get('.grocery-list');
const clearBtn = get('.clear-btn');

//global edit  funciton
let editElement = undefined;
let editFlag = false;
let editId = '';

//************gloabl event listner********//
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearList);

//main function to add the items in the list

function addItem(e) {
	e.preventDefault();
	let id = new Date().getTime().toString();
	let value = grocery.value;
	if (value && !editFlag) {
		//add item function
		appendItem(id, value);
		//set items to local storage
		setItems(id, value);
		showContainer();
		displayAlert('success', 'Item added');
		setDefault();
	} else if (value && editFlag) {
		editElement.textContent = value;
		editItem(editId, value);
		setDefault();
	} else {
		displayAlert('danger', 'no item to add');
		setDefault();
	}
}

//function to display messages in various events of  grocery intput form
function displayAlert(group, message) {
	alert.textContent = message;
	alert.classList.add(group);

	setTimeout(function() {
		alert.textContent = '';
		alert.classList.remove(group);
	}, 1000);
}

//to set everything back to default
function setDefault() {
	grocery.value = '';
	submit.textContent = 'Add';
	editFlag = false;
	editId = '';
	editElement = undefined;
}

// edit and delete funciton for each element here
const toEdit = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;
	editElement = e.currentTarget.parentElement.previousElementSibling;
	grocery.value = editElement.textContent;

	editFlag = true;
	editId = id;

	submit.textContent = 'Edit';
};

const toDelete = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;
	list.removeChild(element);
	if (list.children.length === 0) hideContainer();
	removeItem(id);
	displayAlert('danger', 'Item deleted');
};

//===========clear btn function============
function clearList() {
	const itemContainer = document.querySelectorAll('.item');
	itemContainer.forEach((item) => {
		list.removeChild(item);
	});

	displayAlert('danger', 'Item cleared');
	setDefault();
	hideContainer();

	//remove all items from local storage
	localStorage.removeItem('groceryItem');
}

//hide and show the container
function showContainer() {
	return (groceryContainer.style.visibility = 'visible');
}
function hideContainer() {
	return (groceryContainer.style.visibility = 'hidden');
}

//------------------------

//======function to append the items container======//

function appendItem(id, value) {
	let groceryItem = document.createElement('div');
	groceryItem.classList.add('item');

	let attribute = document.createAttribute('data-id');
	attribute.value = id;

	groceryItem.setAttributeNode(attribute);

	groceryItem.innerHTML = `<p class="name">${value}</p>
                    <div class="btn-container">
                        <button class="edit-btn">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;

	//edit and delete button event
	const editBtn = groceryItem.querySelector('.edit-btn');
	const deleteBtn = groceryItem.querySelector('.delete-btn');

	editBtn.addEventListener('click', toEdit);
	deleteBtn.addEventListener('click', toDelete);

	list.append(groceryItem);
}

//Note:-After setting up local storage
//show all items from local storage to grocery container
//This function will fetch all items of grocerItem from localstoeage and then display each items  on window load

const loadItems = () => {
	let showAll = getLocal();
	if (showAll.length > 0) {
		showAll.forEach((item) => {
			appendItem(item.id, item.value);
		});
		showContainer();
	}
};

//event on window load
window.addEventListener('DOMContentLoaded', loadItems());
