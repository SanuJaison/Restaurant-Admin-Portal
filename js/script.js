const currentUser = JSON.parse(localStorage.getItem("smartBitesUser"));
if (!currentUser) {
    window.location.href = "login.html";
}
const foodKey = `foods_${currentUser.email}`;
let foodItems = JSON.parse(localStorage.getItem(foodKey)) || [];
let editIndex = null;
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const itemWindow = document.getElementById("itemWindow");
const cardContainer = document.getElementById("cardContainer");
const foodForm = document.getElementById("foodForm");
const totalItems = document.getElementById("totalItems");
const availableItems = document.getElementById("availableItems");
const outStockItems = document.getElementById("outStockItems");
const searchBar = document.getElementById("searchBar");
const filterBox = document.getElementById("filterBox");
const noItems = document.getElementById("noItems");

addBtn.addEventListener("click", () => {
    editIndex = null;
    foodForm.reset();
    itemWindow.classList.remove("hidden");
    itemWindow.classList.add("flex");
});

closeBtn.addEventListener("click", () => {
    itemWindow.classList.remove("flex");
    itemWindow.classList.add("hidden");
});

foodForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!foodForm.checkValidity()) {
        foodForm.reportValidity();
        return;
    }
    const foodName = document.getElementById("foodName").value;
    const foodPrice = document.getElementById("foodPrice").value;
    const foodCategory = document.getElementById("foodCategory").value;
    const foodImg = document.getElementById("foodImg").value;
    const foodDesc = document.getElementById("foodDesc").value;
    const tick = document.getElementById("tick").checked;
    const status = tick ? "Available" : "Out Of Stock";
    const foodData = {
        name: foodName,
        price: foodPrice,
        category: foodCategory,
        image: foodImg,
        desc: foodDesc,
        status: status
    };
    if (editIndex !== null) {
        foodItems[editIndex] = foodData;
    } else {
        foodItems.push(foodData);
    }
    localStorage.setItem(foodKey, JSON.stringify(foodItems));
    displayFoods();
    updateCounts();
    itemWindow.classList.remove("flex");
    itemWindow.classList.add("hidden");
    foodForm.reset();
    editIndex = null;
});

function displayFoods() {
    cardContainer.innerHTML = "";
    const searchValue = searchBar.value.toLowerCase();
    const selectedCategory = filterBox.value;
    const filteredFoods = foodItems.filter((food) => {
        const matchesSearch = food.name.toLowerCase().includes(searchValue);
        const matchesCategory = selectedCategory === "All Categories" || food.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    if (filteredFoods.length === 0) {
        noItems.classList.remove("hidden");
    } else {
        noItems.classList.add("hidden");
    }
    filteredFoods.forEach((food) => {
        const originalIndex = foodItems.indexOf(food);
        const statusColor = food.status === "Available" ? "bg-[#22e55c]" : "bg-red-500";
        const card = document.createElement("div");
        card.className = "rounded-xl overflow-hidden shadow bg-white";
        card.innerHTML = `
        <div class="flex justify-center w-full relative">
          <img class="object-cover w-full h-52" src="${food.image}" alt="" />
          <div class="flex justify-between absolute w-full p-3 text-sm">
            <p class="bg-[#ffffffe6] text-[#1f2937] font-semibold rounded-full px-2">${food.category}</p>
            <p class="${statusColor} text-white font-semibold rounded-full px-2">${food.status}</p>
          </div>
        </div>
        <div class="flex flex-col p-3 gap-3">
          <div class="flex justify-between text-lg font-semibold">
            <p>${food.name}</p>
            <p class="text-orange-400">$ ${food.price}</p>
          </div>
          <p class="w-full text-sm">${food.desc}</p>
          <div class="text-center text-[#4b5563] text-sm space-x-2">
            <button onclick="editFood(${originalIndex})" class="bg-slate-200 px-6 py-1 rounded-2xl">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button onclick="deleteFood(${originalIndex})" class="bg-slate-200 px-6 py-1 rounded-2xl">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
        `;
        cardContainer.appendChild(card);
    });
}

searchBar.addEventListener("input", () => {
    displayFoods();
});

filterBox.addEventListener("change", () => {
    displayFoods();
});

function editFood(index) {
    editIndex = index;
    const food = foodItems[index];
    itemWindow.classList.remove("hidden");
    itemWindow.classList.add("flex");
    document.getElementById("foodName").value = food.name;
    document.getElementById("foodPrice").value = food.price;
    document.getElementById("foodCategory").value = food.category;
    document.getElementById("foodImg").value = food.image;
    document.getElementById("foodDesc").value = food.desc;
    document.getElementById("tick").checked = food.status === "Available";
}

function deleteFood(index) {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
    foodItems.splice(index, 1);
    localStorage.setItem(foodKey, JSON.stringify(foodItems));
    displayFoods();
    updateCounts();
}

function updateCounts() {
    totalItems.textContent = foodItems.length;
    const availableCount = foodItems.filter(food => food.status === "Available").length;
    const outStockCount = foodItems.filter(food => food.status === "Out Of Stock").length;
    availableItems.textContent = availableCount;
    outStockItems.textContent = outStockCount;
}

displayFoods();
updateCounts();