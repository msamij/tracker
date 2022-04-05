import { ViewComponent } from '@budgetViews/components/viewComponent';

export class ExpenseCategoryButton extends ViewComponent {
  constructor(public componentParent?: HTMLElement, protected componentCount?: number) {
    super();
  }

  protected componentExists(): boolean {
    return this.componentCount > 1 ? true : false;
  }

  getComponentMarkup(): string {
    return `
    <button class="btn-primary btn-primary--orange add-expense-category">add expense category</button>`;
  }
}
