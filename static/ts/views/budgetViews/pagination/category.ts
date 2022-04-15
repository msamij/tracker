import { viewState } from 'app';
import { Model } from '@models/Model';
import { constructDate } from '@utils/helpers';
import categoryElements from '@DOMElements/category';
import { PaginationDomUpdate } from './paginationView';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { INCOME_CATEGORY_PAGE_URL, EXPENSE_CATEGORY_PAGE_URL } from '@utils/config';
import { CategoryPaginationButton, IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';

export class IncomeCategoryPagination extends PaginationDomUpdate {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${INCOME_CATEGORY_PAGE_URL}${viewState.state.currentIncomeCategoryPage}/?month=${+constructDate(
        'month',
        categoryElements.getCategoryDate('income')
      )}&year=${+constructDate('year', categoryElements.getCategoryDate('income'))}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentIncomeCategoryPage,
      +categoryElements.getFormAttributeValue('incomes'),
      categoryElements.getFormElement('incomes'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-income-category'),
      new CategoryPaginationButton().getComponentMarkup('prev', 'add-income-category')
    );

    this.validateAndUpdateIncomeCategory();
    this.validateAndUpdateIncomeAndExpense(
      'income',
      +incomeAndExpenseElements.getFormAttributeValue('incomes'),
      this.data.incomeCount,
      false
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCount,
      incomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-income')
    );
  }
}

export class ExpenseCategoryPagination extends PaginationDomUpdate {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${EXPENSE_CATEGORY_PAGE_URL}${viewState.state.currentExpenseCategoryPage}/?month=${+constructDate(
        'month',
        categoryElements.getCategoryDate('expense')
      )}&year=${+constructDate('year', categoryElements.getCategoryDate('expense'))}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentExpenseCategoryPage,
      +categoryElements.getFormAttributeValue('expenses'),
      categoryElements.getFormElement('expenses'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-expense-category'),
      new CategoryPaginationButton().getComponentMarkup('prev', 'add-expense-category')
    );

    this.updateExpenseCategory();
    this.validateAndUpdateIncomeAndExpense(
      'expense',
      +incomeAndExpenseElements.getFormAttributeValue('expenses'),
      this.data.expenseCount,
      false
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCount,
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-expense')
    );
  }
}
