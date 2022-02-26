import { ViewComponent } from '@budgetViews/components/viewComponent';

interface ExpCategoryButton {
  count?: number;
  parent?: HTMLElement;
}

export class ExpenseCategoryButton extends ViewComponent {
  constructor(public props: ExpCategoryButton) {
    super();
  }

  protected componentExists(): boolean {
    return this.props.count > 1 ? true : false;
  }

  getComponentMarkup(): string {
    return `
    <button class="btn-primary btn-primary--orange add-expense-category">add expense category</button>`;
  }
}
