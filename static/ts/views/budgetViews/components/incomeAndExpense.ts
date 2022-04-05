import { ViewComponent } from '@budgetViews/components/viewComponent';

interface IncomeAndExpense {
  title: string;
  amount: string;
  date: string;
  type: 'income' | 'expense';
  count?: number;
  parent?: HTMLElement;
}

export class IncomeAndExpenseComponent extends ViewComponent {
  constructor(public parent: IncomeAndExpense) {
    super();
  }

  protected componentExists(): boolean {
    return this.parent.count === 0 ? false : true;
  }

  getComponentMarkup(
    title: string,
    amount: string,
    date: string,
    componentType: 'income' | 'expense',
    count?: number,
    parent?: HTMLElement
  ): string {
    return `
    <li class="items-box__item ${componentType}-box__${componentType}">
      <p class="${componentType}-box__${componentType}-type">${title}</p>
      <p class="${componentType}-box__${componentType}-amount">${amount} Rs</p>
      <p class="${componentType}-box__${componentType}-date">${date}</p>
          <div class="action-box">
          <button type="submit" class="btn-secondary">
            <svg class="btn-secondary__icon btn-secondary__icon--white">
              <use
                xlink:href="../static/img/symbol-defs.svg#icon-cancel-circle"
              ></use>
            </svg>
          </button>
        <button class="btn-secondary">
          <svg class="btn-secondary__icon btn-secondary__icon--white">
            <use
              xlink:href="../static/img/symbol-defs.svg#icon-pen">
            </use>
          </svg>
        </button>
      </div>
    </li>`;
  }
}
