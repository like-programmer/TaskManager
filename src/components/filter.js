import {createDOMElement} from "../utils.js";

const createFilterMarkup = (filter, isChecked) => {
  const {title, count} = filter;
  const disabledAttribute = count === 0 ? `disabled` : ``;

  return (`
  <input
          type="radio"
          id="filter__${title}"
          class="filter__input visually-hidden"
          name="filter"
          ${isChecked ? `checked` : ``} ${disabledAttribute}/>
        <label for="filter__${title}" class="filter__label">
          ${title} <span class="filter__${title}-count">${count}</span>
        </label>
  `);
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (`<section class="main__filter filter container">${filtersMarkup}</section>`);
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createDOMElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
