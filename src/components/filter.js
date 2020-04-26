const createFilterMarkup = (name, count) => {
  return (`
  <input
          type="radio"
          id="filter__${name}"
          class="filter__input visually-hidden"
          name="filter"
          "checked"/>
        <label for="filter__${name}" class="filter__label">
          ${name} <span class="filter__${name}-count">${count}</span>
        </label>
  `);
};


export const createFilterTemplate = () => {
  const filterMarkup = [
    {
      name: `all`,
      count: 42,
    },
    {
      name: `overdue`,
      count: 42,
    },
    {
      name: `today`,
      count: 42,
    },
    {
      name: `favorites`,
      count: 42,
    },
    {
      name: `repeating`,
      count: 42,
    },
    {
      name: `tags`,
      count: 42,
    },
    {
      name: `archive`,
      count: 42,
    },
  ].map((it) => createFilterMarkup(it.name, it.count)).join(`\n`);

  return (`
    <section class="main__filter filter container">
    ${filterMarkup}
      </section>
    `);
};
