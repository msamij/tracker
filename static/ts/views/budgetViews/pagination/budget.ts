import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdate } from '@budgetViews/pagination/paginationView';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { BUDGET_PAGE_URL } from '@utils/config';
import { constructBudgetDate } from '@utils/helpers';
import { viewState } from 'app';

export class BudgetPagination extends PaginationDOMUpdate {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
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

    this.validateAndUpdateIncomeCategory();
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCategoryCount,
      categoryElements.getFormElement('incomes'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-income-category')
    );

    this.validateAndUpdateIncomeAndExpense(
      'income',
      +incomeAndExpenseElements.getFormAttributeValue('incomes'),
      this.data.incomeCount
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
      this.data.expenseCount
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCount,
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-expense')
    );
  }
}
