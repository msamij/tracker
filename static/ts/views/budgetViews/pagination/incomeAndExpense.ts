import { IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { EXPENSE_PAGE_URL, INCOME_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class IncomeAndExpensePagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected type: 'income' | 'expense', protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.type = type;
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    const baseUrl = this.type === 'income' ? INCOME_PAGE_URL : EXPENSE_PAGE_URL;
    const currentPage = this.type === 'income' ? viewState.state.currentIncomePage : viewState.state.currentExpensePage;

    await this.saveData(
      `${baseUrl}${currentPage}/?month=${+constructDate(
        'month',
        IncomeAndExpenseElements.getIncomeAndExpenseDate(`${this.type}`)
      )}&year=${+constructDate(
        'year',
        IncomeAndExpenseElements.getIncomeAndExpenseDate(`${this.type}`)
      )}&title=${CategoryElements.getCategoryTitle(`${this.type}`)}`
    );

    this.updateButtonsOnPageChange(
      currentPage,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`),
      IncomeAndExpenseElements.getFormElement(`${this.type}s`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', `add-${this.type}`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('prev', `add-${this.type}`)
    );
    this.updateIncomeAndExpense(`${this.type}`);
  }
}
