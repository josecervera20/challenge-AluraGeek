// Importa el módulo de servicios de productos
import { servicesProducts } from "../services/productServices.js";

// Selecciona el contenedor de productos y el formulario del DOM
const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

/**
 * Crea un elemento de tarjeta de producto HTML.
 *
 * @param {string} name - El nombre del producto.
 * @param {number} price - El precio del producto.
 * @param {string} image - La URL de la imagen del producto.
 * @param {string} id - El ID único del producto.
 * @returns {HTMLElement} El elemento 'article' que representa la tarjeta de producto.
 */
function createCard(name, price, image, id) {
  const card = document.createElement("article");
  card.classList.add("product-card");
  card.innerHTML = `
    <figure class="card">
        <img class="card-container--img"
            src="${image}"
            alt="${name}">
        <figcaption class="card-container--info">
            <p class="card-container--title">${name}</p>
            <div class="card-container--value">
                <p>$ ${price}</p>
                <img class="card-container--icon" src="./assets/icons/borrar.png" data-remove="${id}" alt="Eliminar producto"/>
            </div>
        </figcaption>
    </figure>
    `;
  return card;
}

/**
 * Muestra un mensaje de error visualmente en el contenedor de productos,
 * manteniendo los elementos estáticos del HTML.
 * @param {string} message - El mensaje de error a mostrar.
 * @param {string} imageSrc - La URL de la imagen de error.
 * @param {string} imageAlt - El texto alternativo para la imagen de error.
 */
function displayError(message, imageSrc, imageAlt) {
  // Primero, limpia solo las tarjetas de productos existentes
  clearProductCards();

  const errorDiv = document.createElement("div");
  errorDiv.classList.add("full-width", "error-display");

  const errorMessage = document.createElement("h3");
  errorMessage.classList.add("error");
  errorMessage.textContent = message;
  errorDiv.appendChild(errorMessage);

  const errorImage = document.createElement("img");
  errorImage.classList.add("error-image");
  errorImage.src = imageSrc;
  errorImage.alt = imageAlt;
  errorDiv.appendChild(errorImage);

  productContainer.appendChild(errorDiv);
}

/**
 * Elimina todas las tarjetas de productos existentes del contenedor.
 * Esto evita borrar otros elementos HTML estáticos dentro de data-product.
 */
function clearProductCards() {
  const existingCards = productContainer.querySelectorAll(".product-card");
  existingCards.forEach((card) => card.remove());

  // También elimina el mensaje de error si existe, para limpiar para nuevos productos
  const existingError = productContainer.querySelector(".error-display");
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Renderiza la lista de productos obteniéndolos del servicio
 * y mostrándolos en el contenedor.
 * Si ocurre un error, muestra un mensaje apropiado.
 * @async
 */
const renderProducts = async () => {
  try {
    const listProducts = await servicesProducts.productList();

    // Limpia solo las tarjetas de productos antes de renderizar para evitar duplicados
    clearProductCards();

    if (
      listProducts &&
      Array.isArray(listProducts) &&
      listProducts.length > 0
    ) {
      listProducts.forEach((product) => {
        productContainer.appendChild(
          createCard(product.name, product.price, product.image, product.id)
        );
      });
    } else {
      // Si la lista está vacía o no es un array válido, muestra un mensaje de no hay productos
      displayError(
        "No hay productos disponibles.",
        "assets/images/sin-productos.svg",
        "No hay productos"
      );
    }
  } catch (error) {
    console.error("Error al obtener y mostrar los productos:", error);
    displayError(
      "No fue posible cargar la lista de productos.",
      "assets/images/sin-conexion.svg",
      "No hay conexión"
    );
  }
};

/**
 * Maneja el envío del formulario para agregar un nuevo producto.
 * @param {Event} event - El evento de envío del formulario.
 * @async
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita el comportamiento por defecto del formulario

  // Obtiene los valores de los campos del formulario
  const name = document.querySelector("[data-name]").value;
  const price = parseFloat(
    document.querySelector("[data-price]").value
  ).toFixed(2); // Asegura que el precio sea un número y tenga 2 decimales
  const image = document.querySelector("[data-image]").value;

  try {
    await servicesProducts.sendProduct(name, price, image);
    // Vuelve a renderizar los productos para mostrar el nuevo
    renderProducts();
    form.reset(); // Limpia el formulario después de un envío exitoso
  } catch (err) {
    console.error("Error al enviar el producto:", err);
  }
});

/**
 * Maneja los clics dentro del contenedor de productos, específicamente para eliminar productos.
 * @param {Event} event - El evento de clic.
 * @async
 */
productContainer.addEventListener("click", async (event) => {
  // Busca el botón de eliminar más cercano al elemento clickeado
  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    event.preventDefault(); // Evita el comportamiento por defecto si es un enlace o botón de submit

    const itemId = removeButton.dataset.remove; // Usar data-remove directamente para el ID
    try {
      await servicesProducts.deleteProduct(itemId);
      console.log("Producto eliminado con éxito");
      // Vuelve a renderizar para actualizar la lista visualmente
      renderProducts();
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
    }
  }
});

// Inicializa la renderización de productos al cargar la página
renderProducts();
