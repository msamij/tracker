import { viewState } from 'app';
import { formatDate } from '@utils/helpers';
import { Model, getJsonData } from '@models/Model';
import categoryElements from '@budgetViews/categoryView';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';

// This class is reponsible to update pagination buttons on UI.
// Eg --> when user changes page it'll be responsible to render appropriate buttons.
// Eg --> if we are on last page only render back button.
class PaginationButtonView {
  protected async updatePaginationButtonOnUI(
    apiURL: string,
    currentPage: number,
    totalPages: number,
    buttonParent: HTMLFormElement,
    nextButton: string,
    prevButton: string
  ): Promise<Model> {
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
    return await getJsonData(apiURL);
  }
}

interface UpdateExpenseCategory {
  prevCount: number;
  nextCount: number;
  expenseCategoryMarkup: string;
  addExpenseButtonMarkup: string;
  expenseCategoryparent: HTMLFormElement;
}
interface UpdateIncomeAndExpense {
  prevCount: number;
  nextCount: number;
  removeButton: boolean;
  addButtonMarkup: string;
  type: 'income' | 'expense';
  addButtonParent: HTMLElement;
  incomeAndExpenseMarkup: string;
  incomeAndExpenseParent: HTMLFormElement;
}
export abstract class PaginationView extends PaginationButtonView {
  protected abstract data: Model;

  protected updateIncomeCategory(): void {
    if (!categoryElements.getFormAttributeValue('incomes')) {
    }
    categoryElements.setCategoryTitle('income', this.data.incomeCategoryTitle);
    categoryElements.setCategoryDate('income', formatDate(this.data.incomeCategoryDate));
    // Save previous state before updating.
    viewState.state.prevCount = +categoryElements.getFormAttributeValue('incomes');
    categoryElements.setFormAttributeValue('incomes', this.data.incomeCategoryCount);
  }

  protected validateAndUpdateIncomeAndExpense(args: UpdateIncomeAndExpense): void {
    if (args.nextCount >= 1) {
      // Update previous data if it already exists.
      if (args.prevCount >= 1) this.updateIncomeAndExpense(args.type);
      // Add new item with new data.
      else {
        if (args.type === 'income' && !(args.addButtonParent.children[0] instanceof HTMLButtonElement)) {
          // render add expense category button.
          args.addButtonParent.insertAdjacentHTML('afterbegin', args.addButtonMarkup);
        }
        // Render income or expense.
        args.incomeAndExpenseParent.insertAdjacentHTML('afterbegin', args.incomeAndExpenseMarkup);
      }
      // Save previous state before updating.
      viewState.state.prevCount = +incomeAndExpenseElements.getFormAttributeValue(`${args.type}s`);
      // Update dataset attribute.
      incomeAndExpenseElements.setFormAttributeValue(
        `${args.type}s`,
        args.type === 'income' ? this.data.incomeCount : this.data.expenseCount
      );
    }

    // Remove prev Income or expense.
    else if (args.prevCount >= 1) {
      args.incomeAndExpenseParent.removeChild(
        args.type === 'income'
          ? document.querySelector('.income-box__income')
          : document.querySelector('.expense-box__expense')
      );

      // If we doing pagination on just income category, and we don't have any incomes for current category,
      // Don't remove add expense category button.(Since we only want to update income category and incomes).
      if (args.type === 'income' && args.removeButton) {
        args.addButtonParent.removeChild(document.querySelector('.add-expense-category'));
      }

      incomeAndExpenseElements.setFormAttributeValue(`${args.type}s`, 0);
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

  protected validateAndUpdateExpenseCategory(args: UpdateExpenseCategory): void {
    if (args.nextCount >= 1) {
      // Update previous expense category data if it exists.
      if (args.prevCount >= 1) this.updateExpenseCategory();
      // Render new expense category.
      else {
        args.expenseCategoryparent.insertAdjacentHTML('beforeend', args.expenseCategoryMarkup);
        // Render add expense button.
        document.querySelector('.box-left__expenses').insertAdjacentHTML('afterbegin', args.addExpenseButtonMarkup);
        viewState.state.prevCount = +categoryElements.getFormAttributeValue('expenses');
        // Update dataset attribute.
        categoryElements.setFormAttributeValue('expenses', this.data.expenseCategoryCount);
      }
    }

    // Remove previous expense category.
    else if (args.prevCount >= 1) {
      // remove expense category.
      const expCategory = document.querySelector('.category__item--expense');
      expCategory.parentElement.removeChild(expCategory);
      // remove add expense button.
      const addExpenseButton = document.querySelector('.btn-primary--red');
      addExpenseButton.parentElement.removeChild(addExpenseButton);
      categoryElements.setFormAttributeValue('expenses', 0);
    }
  }

  protected updateExpenseCategory(): void {
    categoryElements.setCategoryTitle('expense', this.data.expenseCategoryTitle);
    categoryElements.setCategoryDate('expense', formatDate(this.data.expenseCategoryDate));
    // Save previous state be updating.
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
