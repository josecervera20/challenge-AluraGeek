/**
 * @module customError
 * @description Define tipos de errores y mensajes personalizados para la validación de formularios.
 */

/**
 * Array de los tipos de errores de validación estándar de HTML5.
 * Estos tipos se usan para mapear las propiedades de 'ValidityState' a mensajes personalizados.
 * @type {string[]}
 */
export const errortypes = [
  "valueMissing", // El campo está vacío pero es requerido.
  "typeMismatch", // El valor no coincide con el tipo esperado (ej. email, url).
  "patternMismatch", // El valor no coincide con el patrón regex especificado.
  "tooShort", // El valor es más corto que la longitud mínima especificada.
];

/**
 * Objeto que contiene mensajes de error personalizados para cada campo del formulario
 * y cada tipo de error de validación.
 * @type {Object.<string, Object.<string, string>>}
 */
export const messages = {
  name: {
    valueMissing: "El campo nombre no puede estar vacío.",
    patternMismatch: "Por favor, ingresa un nombre válido.",
    tooShort: "El nombre debe tener al menos 3 caracteres y máximo 100.",
  },
  price: {
    valueMissing: "El campo precio no puede estar vacío.",
    tooShort: "El precio mínimo es 1.",
  },
  image: {
    valueMissing: "El campo URL no puede estar vacío.",
    typeMismatch: "Por favor, ingresa una URL de imagen válida.",
    tooShort: "La URL debe tener al menos 3 caracteres.",
  },
};
