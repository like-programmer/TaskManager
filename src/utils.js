const setTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = date.getHours();
  const dayHalfWord = hours >= 12 ? `PM` : `AM`;
  const halfHoursFormat = setTimeFormat(hours % 12);
  const formattedHours = halfHoursFormat ? halfHoursFormat : 12;
  const minutes = setTimeFormat(date.getMinutes());

  return `${formattedHours}:${minutes}${dayHalfWord}`;
};


export const createDOMElement = (template) => {
  const newDOMElement = document.createElement(`div`);
  newDOMElement.innerHTML = template;
  return newDOMElement.firstChild;
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
