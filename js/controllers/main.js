import { servicesProducts } from "../services/productServices.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");
const clearButton = document.getElementById("delete");

/**
 * Crea un elemento de tarjeta (card) para un producto.
 * @param {string} name - El nombre del producto.
 * @param {string} price - El precio del producto.
 * @param {string} image - La URL de la imagen del producto.
 * @param {string} id - El ID único del producto.
 * @returns {HTMLElement} El elemento HTML de la tarjeta del producto.
 */
function createCard(name, price, image, id) {
  const card = document.createElement("article");
  card.classList.add("card-item");
  card.innerHTML = `
        <figure class="card">
            <img class="card-container--img"
                src="${image}"
                alt="${name}"
                loading="lazy">
            <figcaption class="card-container--info">
                <p class="card-container--title">${name}</p>
                <div class="card-container--value">
                    <p>$ ${parseFloat(price).toFixed(2)}</p>
                    <img class="card-container--icon" src="./assets/icons/borrar.png" data-remove="true" data-id="${id}" alt="Eliminar producto"/>
                </div>
            </figcaption>
        </figure>
    `;
  return card;
}

/**
 * Renderiza la lista de productos en el contenedor principal.
 * Obtiene los productos del servicio y los muestra como tarjetas.
 */
const renderProducts = async () => {
  try {
    // Limpiar solo los productos existentes, manteniendo el h2
    const existingCards = productContainer.querySelectorAll(
      ".card-item, .no-products, .error-display"
    );
    existingCards.forEach((card) => card.remove());

    const listProducts = await servicesProducts.productList();

    if (Array.isArray(listProducts) && listProducts.length > 0) {
      listProducts.forEach((product) => {
        productContainer.appendChild(
          createCard(product.name, product.price, product.image, product.id)
        );
      });
    } else {
      // Mostrar un mensaje si no hay productos
      const noProductsMessage = document.createElement("div");
      noProductsMessage.classList.add("full-width", "no-products");
      noProductsMessage.innerHTML = `
                <h3 class="error">No hay productos para mostrar.</h3>
                <img class="error-image" src="assets/images/sin-conexion.svg" alt="No hay productos">
            `;
      productContainer.appendChild(noProductsMessage);
    }
  } catch (error) {
    console.error("Error al obtener y mostrar los productos:", error);
    // Limpiar solo los productos existentes antes de mostrar el error
    const existingCards = productContainer.querySelectorAll(
      ".card-item, .no-products, .error-display"
    );
    existingCards.forEach((card) => card.remove());

    // Mostrar un mensaje de error claro en la UI
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("full-width", "error-display");

    const errorMessage = document.createElement("h3");
    errorMessage.classList.add("error");
    errorMessage.textContent = "No fue posible cargar la lista de productos.";
    errorDiv.appendChild(errorMessage);

    const errorImage = document.createElement("img");
    errorImage.classList.add("error-image");
    errorImage.src = "assets/images/sin-conexion.svg";
    errorImage.alt = "Error de conexión o carga";

    errorDiv.appendChild(errorImage);
    productContainer.appendChild(errorDiv);
  }
};

/**
 * Maneja el envío del formulario para agregar un nuevo producto.
 * @param {Event} event - El evento de envío del formulario.
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const nameInput = document.querySelector("[data-name]");
  const priceInput = document.querySelector("[data-price]");
  const imageInput = document.querySelector("[data-image]");

  const name = nameInput.value;
  const price = priceInput.value;
  const image = imageInput.value;

  try {
    await servicesProducts.sendProduct(name, price, image);
    console.log("Producto agregado con éxito");
    // Limpiar el formulario después de un envío exitoso
    form.reset();
    renderProducts(); // Volver a renderizar la lista para mostrar el nuevo producto
  } catch (error) {
    console.error("Error al enviar el producto:", error);
  }
};

/**
 * Maneja el clic en el botón de eliminar producto.
 * @param {Event} event - El evento de clic.
 */
const handleDeleteProduct = async (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    const itemId = removeButton.dataset.id;
    try {
      await servicesProducts.deleteProduct(itemId);
      console.log("Producto eliminado con éxito");
      renderProducts(); // Volver a renderizar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }
};

/**
 * Maneja el clic en el botón de limpiar el formulario.
 * Limpia los campos de entrada del formulario.
 */
const handleClearForm = (event) => {
  event.preventDefault();
  form.reset();
};

// Event Listeners
form.addEventListener("submit", handleFormSubmit);
productContainer.addEventListener("click", handleDeleteProduct);
clearButton.addEventListener("click", handleClearForm);

// Initial render
renderProducts();
