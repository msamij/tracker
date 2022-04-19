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
      new CategoryComponent(
        CategoryElements.getFormElement('incomes'),
        +CategoryElements.getFormAttributeValue('incomes')
      ).renderComponent(
        'beforeend',
        new CategoryComponent().getComponentMarkup(
          'income',
          this.data.incomeCategoryTitle,
          formatDate(this.data.incomeCategoryDate)
        )
      );

      new AddButton(
        IncomeAndExpenseElements.getBoxLeft('incomes'),
        +CategoryElements.getFormAttributeValue('incomes')
      ).renderComponent('afterbegin', new AddButton().getComponentMarkup('income'));
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

    // Save previous state before updating.
    viewState.state.prevCount = +CategoryElements.getFormAttributeValue('incomes');
    CategoryElements.setFormAttributeValue('incomes', this.data.incomeCategoryCount);
  }

  protected validateAndUpdateIncomeAndExpense(type: 'income' | 'expense', prevCount: number, currCount: number): void {
    if (currCount >= 1) {
      if (prevCount >= 1) this.updateIncomeAndExpense(type);
      else this.renderIncomeAndExpenseComponent(type);
    }

    //
    else if (prevCount >= 1) {
      this.removeIncomeAndExpenseComponent(type);
      this.removeAddExpenseCategoryButton();
    }

    this.renderAddExpenseCategoryButton();
    this.updateStateForIncomeAndExpenseComponent(currCount, type);
  }

  private renderAddExpenseCategoryButton(): void {
    if (this.validateAddExpenseCategoryButtonRender()) {
      CategoryElements.getBoxRight('expense').insertAdjacentHTML(
        'afterbegin',
        new ExpenseCategoryButton().getComponentMarkup()
      );
    }
  }

  private removeAddExpenseCategoryButton(): void {
    if (this.validateAddExpenseCategoryButtonRemove()) {
      CategoryElements.getBoxRight('expense').removeChild(CategoryElements.getAddCategoryButton('expense'));
    }
  }

  private renderIncomeAndExpenseComponent(type: 'income' | 'expense'): void {
    IncomeAndExpenseElements.getFormElement(`${type}s`).insertAdjacentHTML(
      'afterbegin',
      new IncomeAndExpenseComponent().getComponentMarkup(
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

  protected validateAndUpdateExpenseCategory(prevCount: number, nextCount: number): void {
    if (nextCount >= 1) {
      if (prevCount >= 1) this.updateExpenseCategory();
      else {
        CategoryElements.getFormElement('expenses').insertAdjacentHTML(
          'beforeend',
          new CategoryComponent().getComponentMarkup(
            'expense',
            this.data.expenseCategoryTitle,
            formatDate(this.data.expenseCategoryDate)
          )
        );

        IncomeAndExpenseElements.getBoxLeft('expenses').insertAdjacentHTML(
          'afterbegin',
          new AddButton().getComponentMarkup('expense')
        );
        viewState.state.prevCount = +CategoryElements.getFormAttributeValue('expenses');
        CategoryElements.setFormAttributeValue('expenses', this.data.expenseCategoryCount);
      }
    }

    //
    else if (prevCount >= 1) {
      CategoryElements.getCategory('expense').remove();
      IncomeAndExpenseElements.getAddButton('expense').remove();
      CategoryElements.setFormAttributeValue('expenses', 0);
    }
  }

  protected updateExpenseCategory(): void {
    CategoryElements.setCategoryTitle('expense', this.data.expenseCategoryTitle);
    CategoryElements.setCategoryDate('expense', formatDate(this.data.expenseCategoryDate));

    viewState.state.prevCount = +CategoryElements.getFormAttributeValue('expenses');
    CategoryElements.setFormAttributeValue('expenses', this.data.expenseCategoryCount);
  }

  protected updateButtons(prevCount: number, nextCount: number, parent: HTMLFormElement, buttonMarkup: string): void {
    if (parent.children[0] instanceof HTMLButtonElement) parent.removeChild(parent.children[0]);
    if (prevCount > 1 && nextCount > 1 && parent.lastElementChild instanceof HTMLButtonElement) return;
    else if ((prevCount >= 1 && nextCount > 1) || (!prevCount && nextCount > 1))
      parent.insertAdjacentHTML('beforeend', buttonMarkup);
    else if ((prevCount > 1 && nextCount === 1) || (prevCount > 1 && !nextCount)) {
      if (parent.lastElementChild instanceof HTMLButtonElement) parent.removeChild(parent.lastElementChild);
    }
  }
}

/**
 * This class provides default implementation of the following methods,
 * as they not required by IncomePagination and ExpensePagination classes.
 *
 * validateAddExpenseCategoryButtonRender()
 * validateAddExpenseCategoryButtonRemove()
 */
export abstract class PaginationDOMUpdateAdapter extends PaginationDOMUpdate {
  protected validateAddExpenseCategoryButtonRender(): boolean {
    return;
  }
  protected validateAddExpenseCategoryButtonRemove(): boolean {
    return;
  }
}
