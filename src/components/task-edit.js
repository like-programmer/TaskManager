import AbstractSmartComponent from "./abstract-smart-component";
import {COLORS, DAYS} from "../const.js";
import {formatTime, formatDate, isRepeating, isOverdueDate} from "../utils/common.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {encode} from "he";

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const DefaultData = {
  deleteBtnText: `Delete`,
  saveBtnText: `Save`,
};

const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH && length <= MAX_DESCRIPTION_LENGTH;
};

const createColorsMarkup = (colors, currentColor) => {
  return colors.map((color, index) => {
    return (`
        <input
          type="radio"
          id="color-${color}-${index}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
          />
        <label for="color-${color}-${index}" class="card__color card__color--${color}">${color}</label>
        `);
  }).join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day, index) => {
    const isChecked = repeatingDays[day];
    return (`
    <input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-${index}"
      name="repeat"
      value="${day}"
      ${isChecked ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${day}-${index}">${day}</label>
    `);
  }).join(`\n`);
};

const createHashTagMarkup = (tags) => {
  const tagsArray = Array.from(new Set(tags));
  return tagsArray.map((tag) => {
    return (`
        <span class="card__hashtag-inner">
                          <input
                            type="hidden"
                            name="hashtag"
                            value="${tag}"
                            class="card__hashtag-hidden-input"
                          />
                          <p class="card__hashtag-name">
                            #${tag}
                          </p>
                          <button type="button" class="card__hashtag-delete">
                            delete
                          </button>
                        </span>
        `);
  }).join(`\n`);
};

const createTaskEditTemplate = (task, options = {}) => {
  const {dueDate, color} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays, currentDescription, tags, externalData} = options;

  const description = encode(currentDescription);

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isBlockSaveBtn = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays)) || !isAllowableDescriptionLength(description);

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const tagsMarkup = createHashTagMarkup(tags);
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  const deleteBtnText = externalData.deleteBtnText;
  const saveBtnText = externalData.saveBtnText;

  return (`<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${description}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                      </button>

${isDateShowing ? `
                      <fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${date} ${time}"
                          />
                        </label>
                      </fieldset>
    ` : ``}

                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                      </button>
                      
                      ${isRepeatingTask ? `
                      <fieldset class="card__repeat-days">
                        <div class="card__repeat-days-inner">
                          ${repeatingDaysMarkup}
                        </div>
                      </fieldset>
                      ` : ``}
                    </div>
                    
                    <div class="card__hashtag">
                      <div class="card__hashtag-list">
                      ${tagsMarkup}
                      </div>

                      <label>
                        <input
                          type="text"
                          class="card__hashtag-input"
                          name="hashtag-input"
                          placeholder="Type new hashtag here"
                        />
                      </label>
                    </div>
                  </div>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      ${colorsMarkup}
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">
                  <button class="card__save" type="submit" ${isBlockSaveBtn ? `disabled` : ``}>${saveBtnText}</button>
                  <button class="card__delete" type="button">${deleteBtnText}</button>
                </div>
              </div>
            </form>
          </article>`);
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._tags = task.tags;
    this._externalData = DefaultData;
    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteBtnClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      externalData: this._externalData,
      activeRepeatingDays: this._activeRepeatingDays,
      currentDescription: this._currentDescription,
      tags: this._tags,
    });
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteBtnClickHandler(this._deleteBtnClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const task = this._task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;
    this._tags = task.tags;

    this.rerender();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteBtnClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);
    this._deleteBtnClickHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__text`).addEventListener(`input`, (evt) => {
      this._currentDescription = evt.target.value;

      const saveBtn = this.getElement().querySelector(`.card__save`);
      saveBtn.disabled = !isAllowableDescriptionLength(this._currentDescription);
    });

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;
      this.rerender();
    });

    element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._isRepeatingTask = !this._isRepeatingTask;
      this.rerender();
    });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }

    element.querySelector(`.card__hashtag-input`).addEventListener(`keydown`, (evt) => {
      const isEnter = evt.key === ` `;

      if (isEnter) {
        this._tags.push(evt.target.value);
        evt.target.value = ``;
        this.rerender();
      }
    });

    const tagDeleteBtnElements = Array.from(element.querySelectorAll(`.card__hashtag-delete`));

    tagDeleteBtnElements.forEach((btn) => {
      btn.addEventListener(`click`, () => {
        const tagName = btn.previousElementSibling.textContent.trim().substr(1);
        const index = this._tags.findIndex((name) => name === tagName);
        this._tags.splice(index, 1);
        this.rerender();
      });
    });
  }
}
