let dataP;
fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then((res) => res.json())
  .then((data) => {
    dataP = data.meals;
    renderFoodItems(data.meals);
  })
  .catch((error) => {
    console.log(error);
  });

let allFoods = [];

const renderFoodItems = (foods) => {
  const foodBox = document.getElementById("foods");
  foodBox.innerHTML = "";

  if (foods.length === 0) {
    foodBox.innerHTML = "<p>No results found. Try searching again.</p>";
  }

  foods.forEach((food) => {
    createFoodCard(food);
  });
};

const createFoodCard = (food) => {
  const foodBox = document.getElementById("foods");

  const card = document.createElement("div");
  card.classList.add("col", "d-flex", "justify-content-center");

  // Create the card structure
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card", "h-100");

  const cardImg = document.createElement("img");
  cardImg.src = food.strMealThumb;
  cardImg.classList.add("card-img-top");
  cardImg.alt = food.strMeal;

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.innerText = food.strMeal;

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.innerText = food.strCategory;

  const cardPrice = document.createElement("p");
  cardPrice.innerText = "Price: $2.99"; // Set this dynamically if needed

  // Create Add to Cart Button
  const addToCartButton = document.createElement("button");
  addToCartButton.classList.add("btn", "btn-primary");
  addToCartButton.innerText = "Add to Cart";
  addToCartButton.onclick = () =>
    addToCart(food.idMeal, food.strMeal, food.strMealThumb, addToCartButton);

  // Create Details Button
  const detailsButton = document.createElement("button");
  detailsButton.classList.add("btn", "btn-info", "mt-2");
  detailsButton.innerText = "Details";
  detailsButton.onclick = () => showFoodDetailsModal(food);

  // Append elements to cardBody
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardBody.appendChild(cardPrice);
  cardBody.appendChild(addToCartButton);
  cardBody.appendChild(detailsButton);

  // Assemble the card
  cardDiv.appendChild(cardImg);
  cardDiv.appendChild(cardBody);

  // Append the card to the foodBox
  card.appendChild(cardDiv);
  foodBox.appendChild(card);
};

const showFoodDetailsModal = (food) => {
  const modalImage = document.getElementById("foodDetailImage");
  const modalName = document.getElementById("foodDetailName");
  const modalCategory = document.getElementById("foodDetailCategory");
  const modalInstructions = document.getElementById("foodDetailInstructions");
  const modalPrice = document.getElementById("foodDetailPrice");

  modalImage.src = food.strMealThumb;
  modalName.innerText = food.strMeal;
  modalCategory.innerText = food.strCategory;
  modalInstructions.innerText = food.strInstructions;
  modalPrice.innerText = "$2.99";

  const modal = new bootstrap.Modal(
    document.getElementById("foodDetailsModal")
  );
  modal.show();
};

const addToCart = (id, name, img, button) => {
  const cartCount = document.getElementById("count");
  let itemCount = parseInt(cartCount.innerText);

  if (allFoods.includes(id)) {
    showNotification("This item is already in the cart!");
    return;
  }

  if (itemCount >= 12) {
    showNotification("You can only add up to 12 items to the cart!");
    return;
  }

  allFoods.push(id);
  itemCount++;
  cartCount.innerText = itemCount;

  const cartList = document.getElementById("foodList");
  const div = document.createElement("div");
  div.classList.add("food-item", "d-flex", "align-items-center", "my-2");

  div.innerHTML = `
    <img src="${img}" alt="${name}" class="rounded-circle" style="width: 40px; height: 40px;">
    <span class="ms-2">${name}</span>
  `;
  cartList.appendChild(div);

  button.innerText = "Added to Cart";
  button.classList.add("btn-secondary");
  button.classList.remove("btn-primary");
  button.disabled = true;
};

const removeButton = () => {
  allFoods = [];
  document.getElementById("foodList").innerHTML = "";
  document.getElementById("count").innerText = "0";
};

const showNotification = (message) => {
  const alertBox = document.getElementById("notificationAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.innerText = message;
  alertBox.classList.remove("d-none");

  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 1000);
};

const searchPlayer = () => {
  const searchInput = document.getElementById("searchFild").value.toLowerCase();
  const filteredFoods = dataP.filter((food) =>
    food.strMeal.toLowerCase().includes(searchInput)
  );

  renderFoodItems(filteredFoods);
};

document.getElementById("home").addEventListener("click", () => {
  document.getElementById("searchFild").value = "";
  renderFoodItems(dataP);
});
