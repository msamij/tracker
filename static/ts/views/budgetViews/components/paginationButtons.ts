import { ViewComponent } from '@budgetViews/components/viewComponent';

export class CategoryPaginationButton extends ViewComponent {
  constructor(protected componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 1 ? false : true;
  }

  getComponentMarkup(page: 'next' | 'prev', buttonType: 'add-income-category' | 'add-expense-category'): string {
    return `
     <button type="submit" class="btn-secondary ${
       buttonType === 'add-income-category' ? `btn-${page}-income-category` : `btn-${page}-expense-category`
     }">
        <svg class="btn-secondary__icon btn-secondary__icon--orange">
            <use xlink:href="../static/img/symbol-defs.svg#icon-arrow-with-circle-${
              page === 'next' ? 'right' : 'left'
            }">
          </use>
        </svg>
    </button>
    `;
  }
}

export class IncomeAndExpensePaginationButton extends ViewComponent {
  constructor(protected componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 1 ? false : true;
  }

  getComponentMarkup(page: 'next' | 'prev', buttonType: 'add-income' | 'add-expense'): string {
    return `
      <button type="submit" class="btn-secondary btn-${page}-${buttonType === 'add-income' ? 'income' : 'expense'}">
        <svg class="btn-secondary__icon btn-secondary__icon--${buttonType === 'add-income' ? 'green' : 'pink'}">
          <use xlink:href="../static/img/symbol-defs.svg#icon-arrow-with-circle-${page === 'next' ? 'right' : 'left'}">
          </use>
        </svg>
      </button>`;
  }
}

export class BudgetPaginationButton extends ViewComponent {
  constructor(protected componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount === 1 ? false : true;
  }

  getComponentMarkup(page: 'next' | 'prev'): string {
    return `
      <button type="submit" class="btn-secondary btn-${page}-month">
        <svg class="btn-secondary__icon btn-secondary__icon--grey">
          <use xlink:href="../static/img/symbol-defs.svg#icon-arrow-with-circle-${page === 'next' ? 'right' : 'left'}">
          </use>
        </svg>
      </button>`;
  }
}
