import { viewState } from 'app';
import { constructBudgetDate, formatDate } from '@utils/helpers';
import { PaginationDomUpdate } from '@budgetViews/pagination/paginationView';
import { Model } from '@models/Model';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { BUDGET_PAGE_URL } from '@utils/config';
import budgetElements from '@DOMElements/budget';
import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';
import { CategoryComponent } from '@components/category';
import { AddButton } from '@components/addButton';
import { IncomeAndExpenseComponent } from '@components/incomeAndExpense';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';

export class BudgetPagination extends PaginationDomUpdate {
  protected data: Model;
  private url: string = `${BUDGET_PAGE_URL}${viewState.state.currentBudgetPage}/`;

  constructor(getJsonData: (url: string) => Promise<Model>) {
    super();
    this.saveData(getJsonData);
  }

  private async saveData(getJsonData: (url: string) => Promise<Model>): Promise<void> {
    this.data = await getJsonData(this.url);
  }

  updateDOMOnBudgetPagination(): void {
    this.updateButtonsOnPageChange(
      viewState.state.currentBudgetPage,
      +budgetElements.getBudgetCount(),
      budgetElements.getBudgetContainer(),
      new BudgetPaginationButton().getComponentMarkup('next'),
      new BudgetPaginationButton().getComponentMarkup('prev')
    );

    budgetElements.updateDate(constructBudgetDate(this.data.budgetDate));
    budgetElements.setBudget = this.data.budget;

    // Update Income Category.
    this.updateIncomeCategory();
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCategoryCount,
      categoryElements.getFormElement('incomes'),
      new CategoryPaginationButton().getComponentMarkup('next', 'add-income-category')
    );

    // Update Income.
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

    // Update Expense Category.
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

    // Update Expense.
    this.validateAndUpdateIncomeAndExpense({
      type: 'expense',
      incomeAndExpenseParent: incomeAndExpenseElements.getFormElement('expenses'),
      addButtonParent: categoryElements.getFormElement('expenses').parentElement,
      incomeAndExpenseMarkup: new IncomeAndExpenseComponent({
        type: 'expense',
        title: this.data.expenseTitle,
        amount: '' + this.data.expenseAmount,
        date: formatDate(this.data.expenseDate),
      }).getComponentMarkup(),
      addButtonMarkup: new ExpenseCategoryButton({}).getComponentMarkup(),
      prevCount: +incomeAndExpenseElements.getFormAttributeValue('expenses'),
      nextCount: this.data.expenseCount,
      removeButton: true,
    });
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCount,
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton({ pageType: 'next', buttonType: 'add-expense' }).getComponentMarkup()
    );
  }
}

export default new BudgetPagination();
