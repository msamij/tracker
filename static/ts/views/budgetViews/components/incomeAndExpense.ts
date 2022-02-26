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
  constructor(public props: IncomeAndExpense) {
    super();
  }

  protected componentExists(): boolean {
    return this.props.count === 0 ? false : true;
  }

  getComponentMarkup(): string {
    return `
    <li class="items-box__item ${this.props.type}-box__${this.props.type}">
      <p class="${this.props.type}-box__${this.props.type}-type">${this.props.title}</p>
      <p class="${this.props.type}-box__${this.props.type}-amount">${this.props.amount} Rs</p>
      <p class="${this.props.type}-box__${this.props.type}-date">${this.props.date}</p>
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
