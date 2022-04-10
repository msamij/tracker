import { viewState } from 'app';
import { Model } from '@models/Model';
import { formatDate } from '@utils/helpers';
import { AddButton } from '@components/addButton';
import categoryElements from '@DOMElements/category';
import { CategoryComponent } from '@components/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { IncomeAndExpenseComponent } from '@components/incomeAndExpense';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';

export abstract class PaginationDomUpdate {
  protected abstract data: Model;
  protected abstract getJsonData: (url: string) => Promise<Model>;

  private incomeAndExpenseParent: (type: 'incomes' | 'expenses') => HTMLFormElement =
    incomeAndExpenseElements.getFormElement;

  private addExpenseButton: string = new AddButton().getComponentMarkup('expense');
  private addExpenseCategoryButton: string = new ExpenseCategoryButton().getComponentMarkup();
  private expenseCategoryparent: HTMLFormElement = categoryElements.getFormElement('expenses');
  private addExpenseCategoryButtonParent: HTMLElement = categoryElements.getFormElement('expenses').parentElement;

  protected async saveData(url: string): Promise<void> {
    this.data = await this.getJsonData(url);
  }

  protected updateButtonsOnPageChange(
    currentPage: number,
    totalPages: number,
    buttonParent: HTMLFormElement,
    nextButton: string,
    prevButton: string
  ): void {
    // For page 1 render next button only.
    if (currentPage === 1 && totalPages > 1) {
      if (buttonParent.children[0] instanceof HTMLButtonElement) buttonParent.removeChild(buttonParent.children[0]);
      if (!(buttonParent.children[1] instanceof HTMLButtonElement))
        buttonParent.insertAdjacentHTML('beforeend', nextButton);
    }
    // For middle pages render both buttons.
    else if (currentPage > 1 && currentPage < totalPages) {
      if (!(buttonParent.children[0] instanceof HTMLButtonElement))
        buttonParent.insertAdjacentHTML('afterbegin', prevButton);
      if (!(buttonParent.children[2] instanceof HTMLButtonElement))
        buttonParent.insertAdjacentHTML('beforeend', nextButton);
    }
    // For last page render only next button.
    else if (currentPage === totalPages) {
      if (!(buttonParent.children[0] instanceof HTMLButtonElement))
        buttonParent.insertAdjacentHTML('afterbegin', prevButton);
      if (buttonParent.children[1] instanceof HTMLButtonElement) buttonParent.removeChild(buttonParent.children[1]);
      if (buttonParent.children[2] instanceof HTMLButtonElement) buttonParent.removeChild(buttonParent.children[2]);
    }
  }

  protected updateIncomeCategory(): void {
    if (!categoryElements.getFormAttributeValue('incomes')) {
      const categoryComponent = new CategoryComponent(
        categoryElements.getFormElement('incomes'),
        +categoryElements.getFormAttributeValue('incomes')
      );
      categoryComponent.renderComponent(
        'beforeend',
        categoryComponent.getComponentMarkup(
          'income',
          viewState.state.inputTitle,
          formatDate(viewState.state.inputDate)
        )
      );
    } else {
      categoryElements.setCategoryTitle('income', this.data.incomeCategoryTitle);
      categoryElements.setCategoryDate('income', formatDate(this.data.incomeCategoryDate));
    }
    // Save previous state before updating.
    viewState.state.prevCount = +categoryElements.getFormAttributeValue('incomes');
    categoryElements.setFormAttributeValue('incomes', this.data.incomeCategoryCount);
  }

  protected validateAndUpdateIncomeAndExpense(
    type: 'income' | 'expense',
    prevCount: number,
    nextCount: number,
    removeButton: boolean
  ): void {
    if (nextCount >= 1) {
      // Update previous data if it already exists.
      if (prevCount >= 1) this.updateIncomeAndExpense(type);
      // Add new item with new data.
      else {
        if (type === 'income' && !(this.addExpenseCategoryButtonParent.children[0] instanceof HTMLButtonElement)) {
          this.addExpenseCategoryButtonParent.insertAdjacentHTML('afterbegin', this.addExpenseCategoryButton);
        }
        // Render income or expense.
        this.incomeAndExpenseParent(`${type}s`).insertAdjacentHTML(
          'afterbegin',
          new IncomeAndExpenseComponent().getComponentMarkup(
            type,
            type === 'income' ? this.data.incomeTitle : this.data.expenseTitle,
            type === 'income' ? '' + this.data.incomeAmount : '' + this.data.expenseAmount,
            formatDate(type === 'income' ? this.data.incomeDate : this.data.expenseDate)
          )
        );
      }
      // Save previous state before updating.
      viewState.state.prevCount = +incomeAndExpenseElements.getFormAttributeValue(`${type}s`);
      // Update dataset attribute.
      incomeAndExpenseElements.setFormAttributeValue(
        `${type}s`,
        type === 'income' ? this.data.incomeCount : this.data.expenseCount
      );
    }

    // Remove prev Income or expense.
    else if (prevCount >= 1) {
      this.incomeAndExpenseParent(`${type}s`).removeChild(
        type === 'income'
          ? document.querySelector('.income-box__income')
          : document.querySelector('.expense-box__expense')
      );

      // If we're paginating 'income category', and we don't have any incomes for current income category,
      // Don't remove 'add expense category button', Since we only want to update income category and incomes.
      if (type === 'income' && removeButton) {
        this.addExpenseCategoryButtonParent.removeChild(document.querySelector('.add-expense-category'));
      }
      incomeAndExpenseElements.setFormAttributeValue(`${type}s`, 0);
    }
  }

  protected updateIncomeAndExpense(type: 'income' | 'expense'): void {
    incomeAndExpenseElements.setIncomeAndExpenseTitle(
      type,
      type === 'income' ? this.data.incomeTitle : this.data.expenseTitle
    );
    incomeAndExpenseElements.setIncomeAndExpenseAmount(
      type,
      type === 'income' ? this.data.incomeAmount : this.data.expenseAmount
    );
    incomeAndExpenseElements.setIncomeAndExpenseDate(
      type,
      formatDate(type === 'income' ? this.data.incomeDate : this.data.expenseDate)
    );
  }

  protected validateAndUpdateExpenseCategory(prevCount: number, nextCount: number): void {
    if (nextCount >= 1) {
      // Update previous expense category data if it exists.
      if (prevCount >= 1) this.updateExpenseCategory();
      else {
        this.expenseCategoryparent.insertAdjacentHTML(
          'beforeend',
          new CategoryComponent().getComponentMarkup(
            'expense',
            this.data.expenseCategoryTitle,
            formatDate(this.data.expenseCategoryDate)
          )
        );
        // Render add expense button.
        document.querySelector('.box-left__expenses').insertAdjacentHTML('afterbegin', this.addExpenseButton);
        viewState.state.prevCount = +categoryElements.getFormAttributeValue('expenses');

        categoryElements.setFormAttributeValue('expenses', this.data.expenseCategoryCount);
      }
    }

    // Remove previous expense category.
    else if (prevCount >= 1) {
      const expCategory = document.querySelector('.category__item--expense');
      expCategory.parentElement.removeChild(expCategory);

      const addExpenseButton = document.querySelector('.btn-primary--red');
      addExpenseButton.parentElement.removeChild(addExpenseButton);
      categoryElements.setFormAttributeValue('expenses', 0);
    }
  }

  protected updateExpenseCategory(): void {
    categoryElements.setCategoryTitle('expense', this.data.expenseCategoryTitle);
    categoryElements.setCategoryDate('expense', formatDate(this.data.expenseCategoryDate));

    viewState.state.prevCount = +categoryElements.getFormAttributeValue('expenses');
    categoryElements.setFormAttributeValue('expenses', this.data.expenseCategoryCount);
  }

  protected updateButtons(prevCount: number, nextCount: number, parent: HTMLFormElement, buttonMarkup: string): void {
    if (parent.children[0] instanceof HTMLButtonElement) parent.removeChild(parent.children[0]);
    if (prevCount > 1 && nextCount > 1 && parent.lastElementChild instanceof HTMLButtonElement) return;
    else if ((prevCount >= 1 && nextCount > 1) || (!prevCount && nextCount > 1))
      parent.insertAdjacentHTML('beforeend', buttonMarkup);
    else if ((prevCount > 1 && nextCount === 1) || (prevCount > 1 && !nextCount)) {
      if (parent.lastElementChild instanceof HTMLButtonElement) {
        parent.removeChild(parent.lastElementChild);
      }
    }
  }
}
