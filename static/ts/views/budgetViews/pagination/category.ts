import { CategoryPaginationButton, IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { EXPENSE_CATEGORY_PAGE_URL, INCOME_CATEGORY_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class IncomeCategoryPagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${INCOME_CATEGORY_PAGE_URL}${viewState.state.currentIncomeCategoryPage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate('income')
      )}&year=${+constructDate('year', CategoryElements.getCategoryDate('income'))}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentIncomeCategoryPage,
      +CategoryElements.getFormAttributeValue('incomes'),
      CategoryElements.getFormElement('incomes'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-income-category'),
      new CategoryPaginationButton().getComponentMarkup('prev', 'add-income-category')
    );

    this.validateAndUpdateIncomeCategory();
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
  }
}

export class ExpenseCategoryPagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${EXPENSE_CATEGORY_PAGE_URL}${viewState.state.currentExpenseCategoryPage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate('expense')
      )}&year=${+constructDate('year', CategoryElements.getCategoryDate('expense'))}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentExpenseCategoryPage,
      +CategoryElements.getFormAttributeValue('expenses'),
      CategoryElements.getFormElement('expenses'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-expense-category'),
      new CategoryPaginationButton().getComponentMarkup('prev', 'add-expense-category')
    );

    this.updateExpenseCategory();
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
