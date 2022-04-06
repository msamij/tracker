import { viewState } from 'app';
import { constructBudgetDate, formatDate } from '@utils/helpers';
import { PaginationView } from '@budgetViews/pagination/paginationView';
import { Model } from '@models/Model';
import categoryElements from '@budgetViews/categoryView';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';
import { BUDGET_PAGE_URL } from '@utils/config';
import budgetElements from '@budgetViews/budgetView';
import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';
import { CategoryComponent } from '@components/category';
import { AddButton } from '@components/addButton';
import { IncomeAndExpenseComponent } from '@components/incomeAndExpense';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';

class BudgetPaginationView extends PaginationView {
  protected data: Model;

  async updateDOMOnBudgetPagination(): Promise<void> {
    this.data = await this.updatePaginationButtonOnUI(
      `${BUDGET_PAGE_URL}${viewState.state.currentBudgetPage}/`,
      viewState.state.currentBudgetPage,
      +budgetElements.getBudgetCount(),
      budgetElements.getBudgetContainer(),
      new BudgetPaginationButton({ pageType: 'next' }).getComponentMarkup(),
      new BudgetPaginationButton({ pageType: 'prev' }).getComponentMarkup()
    );

    budgetElements.updateDate(constructBudgetDate(this.data.budgetDate));
    budgetElements.setBudget = this.data.budget;

    // Update Income Category.
    this.updateIncomeCategory();
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCategoryCount,
      categoryElements.getFormElement('incomes'),
      new CategoryPaginationButton({
        pageType: 'next',
        buttonType: 'add-income-category',
      }).getComponentMarkup()
    );

    // Update Income.
    this.validateAndUpdateIncomeAndExpense({
      type: 'income',
      incomeAndExpenseParent: incomeAndExpenseElements.getFormElement('incomes'),
      addButtonParent: categoryElements.getFormElement('expenses').parentElement,
      incomeAndExpenseMarkup: new IncomeAndExpenseComponent({
        type: 'income',
        title: this.data.incomeTitle,
        amount: '' + this.data.incomeAmount,
        date: formatDate(this.data.incomeDate),
      }).getComponentMarkup(),
      addButtonMarkup: new ExpenseCategoryButton({}).getComponentMarkup(),
      prevCount: +incomeAndExpenseElements.getFormAttributeValue('incomes'),
      nextCount: this.data.incomeCount,
      removeButton: true,
    });
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCount,
      incomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton({ pageType: 'next', buttonType: 'add-income' }).getComponentMarkup()
    );

    // Update Expense Category.
    this.validateAndUpdateExpenseCategory({
      expenseCategoryparent: categoryElements.getFormElement('expenses'),
      expenseCategoryMarkup: new CategoryComponent({
        type: 'expense',
        title: this.data.expenseCategoryTitle,
        date: formatDate(this.data.expenseCategoryDate),
      }).getComponentMarkup(),
      addExpenseButtonMarkup: new AddButton({ buttonType: 'expense' }).getComponentMarkup(),
      prevCount: +categoryElements.getFormAttributeValue('expenses'),
      nextCount: this.data.expenseCategoryCount,
    });
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCategoryCount,
      categoryElements.getFormElement('expenses'),
      new CategoryPaginationButton({ pageType: 'next', buttonType: 'add-expense-category' }).getComponentMarkup()
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

export default new BudgetPaginationView();
