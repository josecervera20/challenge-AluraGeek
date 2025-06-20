import { errortypes, messages } from "../err/customError.js";

const formFields = document.querySelectorAll("[required]");
const form = document.querySelector("[data-form]");
const clearButton = document.getElementById("delete");

/**
 * Valida un campo de entrada específico y muestra/oculta mensajes de error.
 * @param {HTMLInputElement} field - El elemento de input a validar.
 */
async function validateField(field) {
  let message = "";
  const fieldName = field.getAttribute("name");
  field.setCustomValidity("");

  if (
    fieldName === "name" &&
    (field.value.length < 3 || field.value.length > 100)
  ) {
    message =
      messages[fieldName]?.tooShort ||
      "El nombre debe tener entre 3 y 100 caracteres.";
  } else if (field.type === "url" && !(await isURLValid(field.value))) {
    message =
      messages[fieldName]?.typeMismatch || "La URL de la imagen no es válida.";
  } else {
    errortypes.some((errorType) => {
      if (field.validity[errorType]) {
        message = messages[fieldName]?.[errorType] || "";
        return true;
      }
      return false;
    });
    if (field.validity.valueMissing && !message) {
      message = messages[fieldName]?.valueMissing || "Este campo es requerido.";
    }
  }

  const errorMessageSpan = field.parentNode.querySelector(".error-message");

  if (message) {
    errorMessageSpan.textContent = message;
    field.classList.add("invalid");
  } else {
    errorMessageSpan.textContent = "";
    field.classList.remove("invalid");
  }
}

/**
 * Valida si una URL es sintácticamente correcta y si apunta a una imagen.
 * @param {string} url - La URL a validar.
 * @returns {Promise<boolean>} Una promesa que resuelve a `true` si la URL es válida y es una imagen, `false` en caso contrario.
 */
async function isURLValid(url) {
  if (!url) return false;

  const urlPattern =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/i;
  if (!urlPattern.test(url)) {
    return false;
  }

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const urlParts = url.split(".");
  const urlExtension = urlParts.length > 1 ? urlParts.pop().toLowerCase() : "";

  if (!imageExtensions.includes(urlExtension)) {
    return false;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Maneja el evento de envío del formulario.
 * Realiza la validación de todos los campos antes de permitir el envío.
 * @param {Event} event - El evento de envío del formulario.
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();
  let formIsValid = true;
  let firstErrorField = null;

  for (const field of formFields) {
    await validateField(field);

    const errorMessageSpan = field.parentNode.querySelector(".error-message");
    if (errorMessageSpan.textContent) {
      formIsValid = false;
      if (!firstErrorField) {
        firstErrorField = field;
      }
    }
  }

  if (!formIsValid) {
    if (firstErrorField) {
      firstErrorField.focus();
    }
    return;
  }
};

/**
 * Maneja el evento de clic del botón "Limpiar".
 * Limpia los campos del formulario y los mensajes de error.
 * @param {Event} event - El evento de clic.
 */
const handleClearButtonClick = (event) => {
  event.preventDefault();
  form.reset();
  formFields.forEach((field) => {
    const errorMessageSpan = field.parentNode.querySelector(".error-message");
    errorMessageSpan.textContent = "";
    field.classList.remove("invalid");
  });
};

// Event Listeners
form.addEventListener("submit", handleFormSubmit);
clearButton.addEventListener("click", handleClearButtonClick);

formFields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("invalid", (event) => event.preventDefault());
});
