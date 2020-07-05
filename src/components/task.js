import AbstractComponent from "./abstract-component";
import {formatTime, formatDate, isOverdueDate} from "../utils/common.js";
import {encode} from "he";

const DefaultData = {
  favoriteBtnText: `favorites`,
  archiveBtnText: `archive`,
};

const createBtnMarkup = (name, isActive = true) => {
  return (`<button type="button" class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
      ${name}
    </button>`);
};

const createHashTagMarkup = (tags) => {
  return tags.map((tag) => {
    return (`
        <span class="card__hashtag-inner">
          <span class="card__hashtag-name">
            #${tag}
          </span>
        </span>
        `);
  }).join(`\n`);
};

const createTaskTemplate = (task, options = {}) => {
  const {description: notSanitizedDescription, dueDate, color, repeatingDays, tags} = task;
  const {externalData} = options;
  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;
  const description = encode(notSanitizedDescription);

  const editBtn = createBtnMarkup(`edit`);
  const archiveBtn = createBtnMarkup(`${externalData.archiveBtnText}`, !task.isArchive);
  const favouritesBtn = createBtnMarkup(`${externalData.favoriteBtnText}`, !task.isFavorite);

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const tagsMarkup = createHashTagMarkup(tags);
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return (`<article class="card card--${color} ${repeatClass} ${deadlineClass}">
            <div class="card__form">
              <div class="card__inner">
                <div class="card__control">
                  ${editBtn}
                  ${archiveBtn}
                  ${favouritesBtn}
                </div>

                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <p class="card__text">${description}</p>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                  <div class="card__dates">
                  <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                  <span class="card__time">${time}</span>
                  </p>
              </div>
            </div>
            <div class="card__hashtag">
                      <div class="card__hashtag-list">
                        ${tagsMarkup}
                      </div>
                    </div>
</div>


                </div>
              </div>
            </div>
          </article>`);
};

export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
    this._externalData = DefaultData;
  }

  getTemplate() {
    return createTaskTemplate(this._task, {
      externalData: this._externalData,
    });
  }

  setEditBtnClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setArchiveBtnClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }

  setFavouriteBtnClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }
}
