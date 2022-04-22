import { AddButton } from '@components/addButton';
import { CategoryComponent } from '@components/category';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';
import { IncomeAndExpenseComponent } from '@components/incomeAndExpense';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { formatDate } from '@utils/helpers';
import { viewState } from 'app';

abstract class PaginationDOMUpdate {
  protected abstract data: Model;
  protected abstract getJsonDataAsString: (url: string) => Promise<Model>;
  protected abstract validateAddExpenseCategoryButtonRender(): boolean;
  protected abstract validateAddExpenseCategoryButtonRemove(): boolean;

  protected async saveData(url: string): Promise<void> {
    this.data = await this.getJsonDataAsString(url);
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

  protected validateAndUpdateIncomeCategory(): void {
    // Nothing exists.
    if (!+CategoryElements.getFormAttributeValue('incomes') && !this.data.incomeCategoryCount) return;
    // No Previous BUT current exists.
    else if (!+CategoryElements.getFormAttributeValue('incomes') && this.data.incomeCategoryCount > 0) {
      this.renderCategoryComponent('income');
      this.renderAddIncomeAndExpenseButton('income');
    }

    // Previous exists but NOT current.
    else if (+CategoryElements.getFormAttributeValue('incomes') > 0 && !this.data.incomeCategoryCount) {
      CategoryElements.getCategory('income').remove();
      IncomeAndExpenseElements.getAddButton('income').remove();
    }

    // Both exists, Update only and don't render :)
    else {
      CategoryElements.setCategoryTitle('income', this.data.incomeCategoryTitle);
      CategoryElements.setCategoryDate('income', formatDate(this.data.incomeCategoryDate));
    }

    this.updateStateForCategoryComponent(this.data.incomeCategoryCount, 'income');
  }

  protected validateAndUpdateIncomeAndExpense(type: 'income' | 'expense', prevCount: number, currCount: number): void {
    if (currCount >= 1) {
      if (prevCount >= 1) this.updateIncomeAndExpense(type);
      else this.renderIncomeAndExpenseComponent(type);
    }
    //
    else if (prevCount >= 1) this.removeIncomeAndExpenseComponent(type);

    this.renderAddExpenseCategoryButton();
    this.removeAddExpenseCategoryButton();
    this.updateStateForIncomeAndExpenseComponent(currCount, type);
  }

  protected updateIncomeAndExpense(type: 'income' | 'expense'): void {
    IncomeAndExpenseElements.setIncomeAndExpenseTitle(
      type,
      type === 'income' ? this.data.incomeTitle : this.data.expenseTitle
    );
    IncomeAndExpenseElements.setIncomeAndExpenseAmount(
      type,
      type === 'income' ? this.data.incomeAmount : this.data.expenseAmount
    );
    IncomeAndExpenseElements.setIncomeAndExpenseDate(
      type,
      formatDate(type === 'income' ? this.data.incomeDate : this.data.expenseDate)
    );
  }

  protected validateAndUpdateExpenseCategory(prevCount: number, currCount: number): void {
    if (currCount >= 1) {
      if (prevCount >= 1) this.updateExpenseCategory();
      else {
        this.renderCategoryComponent('expense');
        this.renderAddIncomeAndExpenseButton('expense');
      }
    }
    //
    else if (prevCount >= 1) {
      CategoryElements.getCategory('expense').remove();
      IncomeAndExpenseElements.getAddButton('expense').remove();
    }
    this.updateStateForCategoryComponent(this.data.expenseCategoryCount, 'expense');
  }

  protected updateExpenseCategory(): void {
    CategoryElements.setCategoryTitle('expense', this.data.expenseCategoryTitle);
    CategoryElements.setCategoryDate('expense', formatDate(this.data.expenseCategoryDate));
  }

  protected updateButtons(prevCount: number, currCount: number, parent: HTMLFormElement, buttonMarkup: string): void {
    if (parent.children[0] instanceof HTMLButtonElement) parent.removeChild(parent.children[0]);
    if (prevCount > 1 && currCount > 1 && parent.lastElementChild instanceof HTMLButtonElement) return;
    else if ((prevCount >= 1 && currCount > 1) || (!prevCount && currCount > 1))
      parent.insertAdjacentHTML('beforeend', buttonMarkup);
    else if ((prevCount > 1 && currCount === 1) || (prevCount > 1 && !currCount)) {
      if (parent.lastElementChild instanceof HTMLButtonElement) parent.removeChild(parent.lastElementChild);
    }
  }

  private renderAddExpenseCategoryButton(): void {
    if (this.validateAddExpenseCategoryButtonRender()) {
      const expenseCategoryButton = new ExpenseCategoryButton(
        CategoryElements.getBoxRight('expense'),
        +IncomeAndExpenseElements.getFormAttributeValue('incomes')
      );
      expenseCategoryButton.renderComponent('afterbegin', expenseCategoryButton.getComponentMarkup());
    }
  }

  private removeAddExpenseCategoryButton(): void {
    if (this.validateAddExpenseCategoryButtonRemove()) {
      CategoryElements.getBoxRight('expense').removeChild(CategoryElements.getAddCategoryButton('expense'));
    }
  }

  private renderIncomeAndExpenseComponent(type: 'income' | 'expense'): void {
    const incomeAndExpenseComponent = new IncomeAndExpenseComponent(
      IncomeAndExpenseElements.getFormElement(`${type}s`),
      +IncomeAndExpenseElements.getFormAttributeValue(`${type}s`)
    );
    incomeAndExpenseComponent.renderComponent(
      'beforeend',
      incomeAndExpenseComponent.getComponentMarkup(
        type,
        type === 'income' ? this.data.incomeTitle : this.data.expenseTitle,
        type === 'income' ? '' + this.data.incomeAmount : '' + this.data.expenseAmount,
        formatDate(type === 'income' ? this.data.incomeDate : this.data.expenseDate)
      )
    );
  }

  private removeIncomeAndExpenseComponent(type: 'income' | 'expense'): void {
    if (IncomeAndExpenseElements.getFormElement(`${type}s`).children.length > 0) {
      IncomeAndExpenseElements.getFormElement(`${type}s`).removeChild(
        IncomeAndExpenseElements.getIncomeAndExpense(type)
      );
    }
  }

  private updateStateForIncomeAndExpenseComponent(count: number, type: 'income' | 'expense'): void {
    if (count >= 1) {
      viewState.state.prevCount = +IncomeAndExpenseElements.getFormAttributeValue(`${type}s`);
      IncomeAndExpenseElements.setFormAttributeValue(
        `${type}s`,
        type === 'income' ? this.data.incomeCount : this.data.expenseCount
      );
    } else IncomeAndExpenseElements.setFormAttributeValue(`${type}s`, 0);
  }

  private renderCategoryComponent(type: 'income' | 'expense'): void {
    const categoryComponent = new CategoryComponent(
      CategoryElements.getFormElement(`${type}s`),
      +CategoryElements.getFormAttributeValue(`${type}s`)
    );
    categoryComponent.renderComponent(
      'beforeend',
      categoryComponent.getComponentMarkup(
        type,
        type === 'income' ? this.data.incomeCategoryTitle : this.data.expenseCategoryTitle,
        formatDate(type === 'income' ? this.data.incomeCategoryDate : this.data.expenseCategoryDate)
      )
    );
  }

  private updateStateForCategoryComponent(count: number, type: 'income' | 'expense'): void {
    if (count >= 1) {
      viewState.state.prevCount = +CategoryElements.getFormAttributeValue(`${type}s`);
      CategoryElements.setFormAttributeValue(
        `${type}s`,
        type === 'income' ? this.data.incomeCategoryCount : this.data.expenseCategoryCount
      );
    } else CategoryElements.setFormAttributeValue(`${type}s`, 0);
  }

  private renderAddIncomeAndExpenseButton(type: 'income' | 'expense'): void {
    const addButton = new AddButton(
      IncomeAndExpenseElements.getBoxLeft(`${type}s`),
      +CategoryElements.getFormAttributeValue(`${type}s`)
    );
    addButton.renderComponent('afterbegin', addButton.getComponentMarkup(`${type}`));
  }
}

/**
 * This class provides default implementation of the following methods,
 * but are overridden by budgetPagination class.
 *
 * validateAddExpenseCategoryButtonRender()
 * validateAddExpenseCategoryButtonRemove()
 */
export abstract class PaginationDOMUpdateAdapter extends PaginationDOMUpdate {
  protected validateAddExpenseCategoryButtonRender(): boolean {
    if (this.data.incomeCount > 0 || +CategoryElements.getFormAttributeValue('expenses') > 0) {
      if (!(CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement)) return true;
    }
    return;
  }
  protected validateAddExpenseCategoryButtonRemove(): boolean {
    if (!this.data.incomeCount && !+CategoryElements.getFormAttributeValue('expenses')) {
      if (CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement) return true;
    }
    return;
  }
}
