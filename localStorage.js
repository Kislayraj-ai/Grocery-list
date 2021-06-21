//get local
function getLocal() {
	let storage = localStorage.getItem('groceryItem');
	if (storage) {
		storage = JSON.parse(localStorage.getItem('groceryItem'));
	} else {
		storage = [];
	}
	return storage;
}

//
const checkStorage = (item) => {
	return localStorage.setItem('groceryItem', JSON.stringify(item));
};

// set items to local storage
const setItems = (id, value) => {
	const itemList = { id, value };
	const items = getLocal();
	items.push(itemList);
	checkStorage(items);
};

//remove item from localstorage
const removeItem = (id) => {
	let item = getLocal();
	item = item.filter((items) => {
		if (items.id !== id) {
			return items;
		}
	});
	checkStorage(item);
};

//edit items from localstorage

const editItem = (id, value) => {
	let item = getLocal();
	item = item.map((items) => {
		if (items.id === id) {
			items.value = value;
		}
		return items;
	});
	checkStorage(item);
};

export { setItems, removeItem, editItem, getLocal };
