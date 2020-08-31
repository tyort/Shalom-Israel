(function () {
  'use strict';

  const renderComponent = (container, element, place) => {
    switch (place) {
      case `afterBegin`:
        container.prepend(element.getElement());
        break;
      case `afterEnd`:
        container.after(element.getElement());
        break;
      default:
        container.append(element.getElement());
    }
  };

  const createElement = (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  };

  class AbstractComponent {
    constructor() {
      if (new.target === AbstractComponent) {
        throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
      }

      this._element = null;
    }

    getTemplate() {
      throw new Error(`Abstract method not implemented: getTemplate`);
    }

    getElement() {
      if (!this._element) {
        this._element = createElement(this.getTemplate());
      }
      return this._element;
    }

    removeElement() {
      this._element = null;
    }
  }

  const createCatalogueTemplate = () =>
    (
      `<div class="page-catalogue">
      <div class="page-catalogue__inner">
        <h2>Программы</h2>
        <div class="catalogue-details">
          <ul class="catalogue-details__list">
            <li class="catalogue-details__item">
              <svg width="28" height="33">
                <use xlink:href="img/sprite_auto.svg#icon-star"></use>
              </svg>
              Общие
            </li>
            <li class="catalogue-details__item">
              <svg width="36" height="35">
                <use xlink:href="img/sprite_auto.svg#icon-cap"></use>
              </svg>
              Академические
            </li>
            <li class="catalogue-details__item">
              <svg width="32" height="25">
                <use xlink:href="img/sprite_auto.svg#icon-portfolio"></use>
              </svg>
              Стажировки
            </li>
            <li class="catalogue-details__item">
              <svg width="32" height="29">
                <use xlink:href="img/sprite_auto.svg#icon-heart"></use>
              </svg>
              Волонтёрство
            </li>
            <li class="catalogue-details__item">
              <svg width="28" height="33">
                <use xlink:href="img/sprite_auto.svg#icon-candles"></use>
              </svg>
              Религиозные
            </li>
          </ul>
          <div class="catalogue-details__description">
          </div>
        </div>
      </div>
    </div>`
    );

  class Catalogue extends AbstractComponent {
    getTemplate() {
      return createCatalogueTemplate();
    }
  }

  const main = document.querySelector(`main`);
  const catalogue = new Catalogue();
  renderComponent(main, catalogue);

}());

//# sourceMappingURL=main.js.map
