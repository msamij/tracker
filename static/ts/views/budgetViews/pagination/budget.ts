import { viewState } from 'app';
import { Model } from '@models/Model';
import { BUDGET_PAGE_URL } from '@utils/config';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import { constructBudgetDate } from '@utils/helpers';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { PaginationDomUpdate } from '@budgetViews/pagination/paginationView';
import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';

export class BudgetPagination extends PaginationDomUpdate {
  protected data: Model;
  protected getJsonData: (url: string) => Promise<Model>;

  constructor(getJsonData: (url: string) => Promise<Model>) {
    super();
    this.getJsonData = getJsonData;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(`${BUDGET_PAGE_URL}${viewState.state.currentBudgetPage}/`);

    this.updateButtonsOnPageChange(
      viewState.state.currentBudgetPage,
      +budgetElements.getBudgetCount(),
      budgetElements.getBudgetContainer(),
      new BudgetPaginationButton().getComponentMarkup('next'),
      new BudgetPaginationButton().getComponentMarkup('prev')
    );

    budgetElements.updateDate(constructBudgetDate(this.data.budgetDate));
    budgetElements.setBudget = this.data.budget;

    this.updateIncomeCategory();
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCategoryCount,
      categoryElements.getFormElement('incomes'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-income-category')
    );

    this.validateAndUpdateIncomeAndExpense(
      'income',
      +incomeAndExpenseElements.getFormAttributeValue('incomes'),
      this.data.incomeCount,
      true
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCount,
      incomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-income')
    );

    this.validateAndUpdateExpenseCategory(
      +categoryElements.getFormAttributeValue('expenses'),
      this.data.expenseCategoryCount
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCategoryCount,
      categoryElements.getFormElement('expenses'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-expense-category')
    );

    this.validateAndUpdateIncomeAndExpense(
      'expense',
      +incomeAndExpenseElements.getFormAttributeValue('expenses'),
      this.data.expenseCount,
      true
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCount,
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-expense')
    );
  }
}
