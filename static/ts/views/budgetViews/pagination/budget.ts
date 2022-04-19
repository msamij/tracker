import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { BudgetElements } from '@DOMElements/budget';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { BUDGET_PAGE_URL } from '@utils/config';
import { constructBudgetDate } from '@utils/helpers';
import { viewState } from 'app';

export class BudgetPagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  protected validateAddExpenseCategoryButtonRender(): boolean {
    if (this.data.incomeCount > 0 || this.data.expenseCategoryCount > 0) {
      if (!(CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement)) return true;
    }
    return;
  }

  protected validateAddExpenseCategoryButtonRemove(): boolean {
    if (!this.data.incomeCount && !this.data.expenseCategoryCount) {
      if (!(CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement)) return true;
    }
    return;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(`${BUDGET_PAGE_URL}${viewState.state.currentBudgetPage}/`);

    this.updateButtonsOnPageChange(
      viewState.state.currentBudgetPage,
      +BudgetElements.getBudgetCount(),
      BudgetElements.getBudgetContainer(),
      new BudgetPaginationButton().getComponentMarkup('next'),
      new BudgetPaginationButton().getComponentMarkup('prev')
    );

    BudgetElements.updateDate(constructBudgetDate(this.data.budgetDate));
    BudgetElements.setBudget = this.data.budget;

    this.validateAndUpdateIncomeCategory();
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCategoryCount,
      CategoryElements.getFormElement('incomes'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-income-category')
    );

    this.validateAndUpdateIncomeAndExpense(
      'income',
      +IncomeAndExpenseElements.getFormAttributeValue('incomes'),
      this.data.incomeCount
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCount,
      IncomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-income')
    );

    this.validateAndUpdateExpenseCategory(
      +CategoryElements.getFormAttributeValue('expenses'),
      this.data.expenseCategoryCount
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCategoryCount,
      CategoryElements.getFormElement('expenses'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-expense-category')
    );

    this.validateAndUpdateIncomeAndExpense(
      'expense',
      +IncomeAndExpenseElements.getFormAttributeValue('expenses'),
      this.data.expenseCount
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCount,
      IncomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-expense')
    );
  }
}
