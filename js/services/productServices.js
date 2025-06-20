/**
 * Proporciona servicios para interactuar con la API de productos.
 * @module productServices
 */

const API_URL = "http://localhost:3000/products";

/**
 * Obtiene la lista de todos los productos desde la API.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con un array de objetos de producto.
 * @throws {Error} Si la respuesta de la red no es exitosa o hay un error al procesar la solicitud.
 */
const productList = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      // Lanza un error si la respuesta HTTP no es 2xx
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error);
    throw error; // Re-lanza el error para que sea manejado por el código que llama
  }
};

/**
 * Envía un nuevo producto a la API.
 * @param {string} name - El nombre del producto.
 * @param {string} price - El precio del producto.
 * @param {string} image - La URL de la imagen del producto.
 * @returns {Promise<Object>} Una promesa que resuelve con el objeto del producto creado.
 * @throws {Error} Si hay un problema al enviar el producto a la API.
 */
const sendProduct = async (name, price, image) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        // Asegurar que el precio se envíe como número si es necesario para tu backend
        price: Number(price),
        image,
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Error HTTP al enviar producto: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al enviar el producto:", error);
    throw error; // Re-lanza el error para que sea manejado por el código que llama
  }
};

/**
 * Elimina un producto de la API por su ID.
 * @param {string} id - El ID del producto a eliminar.
 * @returns {Promise<Object>} Una promesa que resuelve con el resultado de la operación de eliminación.
 * @throws {Error} Si hay un problema al eliminar el producto de la API.
 */
const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Error HTTP al eliminar producto: ${response.status} ${response.statusText}`
      );
    }
    // Generalmente, DELETE puede retornar un 204 No Content.
    // Si tu API retorna un JSON vacío o un mensaje, lo puedes parsear.
    // Si retorna 204, response.json() podría fallar. Se puede manejar así:
    if (response.status === 204) {
      return {}; // Retorna un objeto vacío o null para indicar éxito sin contenido
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${id}:`, error);
    throw error; // Re-lanza el error para que sea manejado por el código que llama
  }
};

export const servicesProducts = {
  productList,
  sendProduct,
  deleteProduct,
};
