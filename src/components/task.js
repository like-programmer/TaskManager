import AbstractComponent from "./abstract-component";
import {MONTH_NAMES} from "../const.js";
import {formatTime} from "../utils/common.js";

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

const createTaskTemplate = (task) => {
  const {description, dueDate, color, repeatingDays, tags} = task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const editBtn = createBtnMarkup(`edit`);
  const archiveBtn = createBtnMarkup(`archive`, !task.isArchive);
  const favouritesBtn = createBtnMarkup(`favorites`, !task.isFavourite);

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
  }

  getTemplate() {
    return createTaskTemplate(this._task);
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
}
