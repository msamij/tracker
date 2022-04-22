import { CategoryPaginationButton, IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { EXPENSE_CATEGORY_PAGE_URL, INCOME_CATEGORY_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class CategoryPagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected type: 'income' | 'expense', protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.type = type;
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    const baseUrl = this.type === 'income' ? INCOME_CATEGORY_PAGE_URL : EXPENSE_CATEGORY_PAGE_URL;
    const currentPage =
      this.type === 'income' ? viewState.state.currentIncomeCategoryPage : viewState.state.currentExpenseCategoryPage;

    await this.saveData(
      `${baseUrl}${currentPage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate(`${this.type}`)
      )}&year=${+constructDate('year', CategoryElements.getCategoryDate(`${this.type}`))}`
    );

    this.updateButtonsOnPageChange(
      currentPage,
      +CategoryElements.getFormAttributeValue(`${this.type}s`),
      CategoryElements.getFormElement(`${this.type}s`),
      new CategoryPaginationButton().getComponentMarkup('next', `add-${this.type}-category`),
      new CategoryPaginationButton().getComponentMarkup('prev', `add-${this.type}-category`)
    );

    this.type === 'income' ? this.validateAndUpdateIncomeCategory() : this.updateExpenseCategory();
    this.validateAndUpdateIncomeAndExpense(
      `${this.type}`,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`),
      this.type === 'income' ? this.data.incomeCount : this.data.expenseCount
    );
    this.updateButtons(
      viewState.state.prevCount,
      this.type === 'income' ? this.data.incomeCount : this.data.expenseCount,
      IncomeAndExpenseElements.getFormElement(`${this.type}s`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', `add-${this.type}`)
    );
  }
}
