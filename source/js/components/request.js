import AbstractSmartComponent from './abstract-smart-component.js';
import {setActualFeaturesNames} from '../formulas.js';


const FIRST_REQUEST_NUMBER = 11;
const creditNames = new Map([
  [`mortgage`, `Ипотека`],
  [`automobile`, `Автокредит`],
  [`consumer`, `Потребительский кредит`],
]);

const createRequestTemplate = (options = {}) => {
  const {requestNumber, creditType, propertyCost, firstPayment, yearsCount, isElementHidden} = options;
  const showElement = creditNames.has(creditType) && !isElementHidden ? `` : `visually-hidden`;

  let requestNumberView = String(requestNumber);
  requestNumberView = (`№ 00`).slice(0, 6 - requestNumberView.length) + requestNumberView;

  return (`<div class="page-calculation__request ${showElement}">
            <h3>Шаг 3. Оформление заявки</h3>
            <table class="page-calculation__request-information">
              <tr>
                <td class="request-article">Номер заявки</td>
                <td>${requestNumberView}</td>
              </tr>
              <tr>
                <td class="request-article">Цель кредита</td>
                <td>${creditNames.get(creditType)}</td>
              </tr>
              <tr>
                <td class="request-article">${setActualFeaturesNames(creditType).creditTypeTitle}</td>
                <td>${propertyCost} рублей</td>
              </tr>
    ${firstPayment
      ? `<tr>
          <td class="request-article">Первоначальный взнос</td>
          <td>${firstPayment} рублей</td>
        </tr>`
      : ``}
              <tr>
                <td class="request-article">Срок кредитования</td>
                <td>${yearsCount} лет</td>
              </tr>
            </table>
            <form class="page-calculation__form">
              <fieldset class="field--name__field">
                <input 
                  class="field--name__input"
                  type="text"
                  name="name"
                  value=""
                  id="block-name"
                  placeholder="ФИО"
                  autocomplete="off"
                  required
                />
              </fieldset>
              <fieldset class="field--phone__field">
                <input
                  class="field--phone__input"
                  type="tel"
                  name="phone"
                  value=""
                  id="block-phone"
                  placeholder="Телефон"
                  autocomplete="off"
                  required
                />
              </fieldset>
              <fieldset class="field--email__field">
                <input
                  class="field--email__input"
                  type="text"
                  name="email"
                  value=""
                  id="block-email"
                  placeholder="E-mail"
                  autocomplete="off"
                  required
                />
              </fieldset>
              <div class="btn-section">
                <button class="calculation__send-btn" type="submit">Отправить</button>
              </div>
            </form>
          </div>`);
};

export default class Request extends AbstractSmartComponent {
  constructor() {
    super();

    this._requestNumber = FIRST_REQUEST_NUMBER;
    this._creditType = ``;
    this._firstPayment = null;
    this._propertyCost = null;
    this._yearsCount = null;
    this._isElementHidden = true;
    this._showPopup = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createRequestTemplate({
      requestNumber: this._requestNumber,
      creditType: this._creditType,
      propertyCost: this._propertyCost,
      firstPayment: this._firstPayment,
      yearsCount: this._yearsCount,
      isElementHidden: this._isElementHidden
    });
  }

  setShowPopupHandler(handler) {
    this._showPopup = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  reRender(request) {
    this._creditType = request.creditType;
    this._propertyCost = request.propertyCost;
    this._firstPayment = request.firstPayment;
    this._yearsCount = request.yearsCount;
    this._isElementHidden = request.isRequestHidden;
    super.reRender();
    this.recoveryListeners();
  }


  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`form`)
        .addEventListener(`input`, (evt) => {
          const phoneSample = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
          const mailSample = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

          if (evt.target.className === `field--phone__input`) {
            if (!phoneSample.test(evt.target.value)) {
              evt.target.setCustomValidity(`Напиши номер правильно`);
            } else {
              evt.target.setCustomValidity(``);
            }

          } else if (evt.target.className === `field--email__input`) {
            if (!mailSample.test(evt.target.value)) {
              evt.target.setCustomValidity(`Напиши email правильно`);
            } else {
              evt.target.setCustomValidity(``);
            }
          }
        });

    element.querySelector(`form`)
        .addEventListener(`submit`, (evt) => {
          evt.preventDefault();
          this._requestNumber += 1;
          element.querySelector(`form`).reset();
          this._showPopup();
        });
  }
}