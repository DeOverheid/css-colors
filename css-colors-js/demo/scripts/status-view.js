const SUCCESS_COLOR = "hsl(160 60% 35%)";
const ERROR_COLOR = "hsl(0 75% 45%)";

const writeMessage = (element, message, color) => {
  if (!(element instanceof HTMLElement)) {
    return;
  }
  element.textContent = message;
  if (color) {
    element.style.color = color;
  }
};

export const createStatusReporter = (element) => {
  if (!(element instanceof HTMLElement)) {
    return {
      success: () => {},
      error: () => {},
      clear: () => {},
    };
  }

  return {
    success: (message) => writeMessage(element, message, SUCCESS_COLOR),
    error: (message) => writeMessage(element, message, ERROR_COLOR),
    clear: () => writeMessage(element, "", SUCCESS_COLOR),
  };
};
