import { viewState } from 'app';
import { Model } from '@models/Model';
import { PaginationView } from './paginationView';
import categoryElements from '@budgetViews/categoryView';
import { constructDate, formatDate } from '@utils/helpers';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';
import { INCOME_CATEGORY_PAGE_URL, EXPENSE_CATEGORY_PAGE_URL } from '@utils/config';
import { IncomeAndExpenseComponent } from '@budgetViews/components/incomeAndExpense';
import { ExpenseCategoryButton } from '@budgetViews/components/expenseCategoryButton';
import { CategoryPaginationButton, IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';

class IncomeCategoryPaginationView extends PaginationView {
  protected data: Model;

  async paginateIncomeCategory(): Promise<void> {
    const url = `${INCOME_CATEGORY_PAGE_URL}${viewState.state.currentIncomeCategoryPage}/?month=${+constructDate(
      'month',
      categoryElements.getCategoryDate('income')
    )}&year=${+constructDate('year', categoryElements.getCategoryDate('income'))}`;

    this.data = await this.updatePaginationButtonOnUI(
      url,
      viewState.state.currentIncomeCategoryPage,
      +categoryElements.getFormAttributeValue('incomes'),
      categoryElements.getFormElement('incomes'),
      new CategoryPaginationButton({
        pageType: 'next',
        buttonType: 'add-income-category',
      }).getComponentMarkup(),
      new CategoryPaginationButton({
        pageType: 'prev',
        buttonType: 'add-income-category',
      }).getComponentMarkup()
    );

    this.updateIncomeCategory();

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
      removeButton: false,
    });
    this.updateButtons(
      viewState.state.prevCount,
      this.data.incomeCount,
      incomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton({ pageType: 'next', buttonType: 'add-income' }).getComponentMarkup()
    );
  }
}

class ExpenseCategoryPaginationView extends PaginationView {
  protected data: Model;

  async paginateExpenseCategory(): Promise<void> {
    const url = `${EXPENSE_CATEGORY_PAGE_URL}${viewState.state.currentExpenseCategoryPage}/?month=${+constructDate(
      'month',
      categoryElements.getCategoryDate('expense')
    )}&year=${+constructDate('year', categoryElements.getCategoryDate('expense'))}`;

    this.data = await this.updatePaginationButtonOnUI(
      url,
      viewState.state.currentExpenseCategoryPage,
      +categoryElements.getFormAttributeValue('expenses'),
      categoryElements.getFormElement('expenses'),
      new CategoryPaginationButton({
        pageType: 'next',
        buttonType: 'add-expense-category',
      }).getComponentMarkup(),
      new CategoryPaginationButton({
        pageType: 'prev',
        buttonType: 'add-expense-category',
      }).getComponentMarkup()
    );

    this.updateExpenseCategory();
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
      removeButton: false,
    });
    this.updateButtons(
      viewState.state.prevCount,
      this.data.expenseCount,
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton({ pageType: 'next', buttonType: 'add-expense' }).getComponentMarkup()
    );
  }
}

export const incomeCategoryPaginationView = new IncomeCategoryPaginationView();
export const expenseCategoryPaginationView = new ExpenseCategoryPaginationView();
