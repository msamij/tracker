import { ViewComponent } from '@budgetViews/components/viewComponent';

interface PageButton {
  pageType: 'next' | 'prev';
  buttonType: string;
  parent?: HTMLElement;
  count?: number;
}

interface BudgetPageButton {
  pageType: 'next' | 'prev';
  parent?: HTMLElement;
  count?: number;
}

export class CategoryPaginationButton extends ViewComponent {
  constructor(protected props: PageButton) {
    super();
  }

  // (Render pagination button only when count === 1).
  protected componentExists(): boolean {
    return this.props.count === 1 ? false : true;
  }

  getComponentMarkup(): string {
    return `
     <button type="submit" class="btn-secondary ${
       this.props.buttonType === 'add-income-category'
         ? `btn-${this.props.pageType}-income-category`
         : `btn-${this.props.pageType}-expense-category`
     }">
        <svg class="btn-secondary__icon btn-secondary__icon--orange">
            <use xlink:href="../static/img/symbol-defs.svg#icon-arrow-with-circle-${
              this.props.pageType === 'next' ? 'right' : 'left'
            }"
          ></use>
        </svg>
    </button>
    `;
  }
}

export class IncomeAndExpensePaginationButton extends ViewComponent {
  constructor(protected props: PageButton) {
    super();
  }

  // (Render pagination button only when count === 1).
  protected componentExists(): boolean {
    return this.props.count === 1 ? false : true;
  }

  getComponentMarkup(): string {
    return `
      <button type="submit" class="btn-secondary btn-${this.props.pageType}-${
      this.props.buttonType === 'add-income' ? 'income' : 'expense'
    }">
        <svg class="btn-secondary__icon btn-secondary__icon--${
          this.props.buttonType === 'add-income' ? 'green' : 'pink'
        }">
          <use xlink:href="../static/img/symbol-defs.svg#icon-arrow-with-circle-${
            this.props.pageType === 'next' ? 'right' : 'left'
          }">
          </use>
        </svg>
      </button>`;
  }
}

export class BudgetPaginationButton extends ViewComponent {
  constructor(protected props: BudgetPageButton) {
    super();
  }

  // (Render pagination button only when count === 1).
  protected componentExists(): boolean {
    return this.props.count === 1 ? false : true;
  }

  getComponentMarkup(): string {
    return `
      <button type="submit" class="btn-secondary btn-${this.props.pageType}-month">
        <svg class="btn-secondary__icon btn-secondary__icon--grey">
          <use xlink:href="../static/img/symbol-defs.svg#icon-arrow-with-circle-${
            this.props.pageType === 'next' ? 'right' : 'left'
          }">
          </use>
        </svg>
      </button>`;
  }
}
