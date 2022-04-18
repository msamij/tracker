import { PaginationDOMUpdate } from '@budgetViews/pagination/paginationView';
import { IncomeAndExpensePaginationButton } from '@components/paginationButtons';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { getJsonDataAsString, Model } from '@models/Model';
import { BUDGET_MENU_URL, EXPENSE_CATEGORY_PAGE_URL, INCOME_CATEGORY_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class DeleteCategory extends PaginationDOMUpdate {
  protected data: Model;

  constructor(
    private type: 'income' | 'expense',
    protected getJsonDataAsString: (url: string) => Promise<Model>,
    private requestDeleteCategory: (
      type: 'income' | 'expense',
      title: string,
      month: string,
      year: string
    ) => Promise<void>
  ) {
    super();
    this.type = type;
    this.getJsonDataAsString = getJsonDataAsString;
    this.requestDeleteCategory = requestDeleteCategory;
  }

  async delete(): Promise<void> {
    // All these must be done in the same order.
    await this.deleteCategory();
    await this.updateBudget();

    if (+categoryElements.getFormAttributeValue(`${this.type}s`) === 1) {
      this.updateUIOnPageOneDelete();
      this.updateStateOnPageOneDelete();
      this.updateButtonsForPageOne();
      this.removeAddExpenseCategoryButtonOnPageDelete();
    }
    //
    else if (+categoryElements.getFormAttributeValue(`${this.type}s`) > 1) {
      this.updateStateOnPageDelete();
      this.updateButtonsOnPageDelete();
      await this.getNewData();
      this.updateUIOnPageDelete();
    }
  }

  private async deleteCategory(): Promise<void> {
    await this.requestDeleteCategory(
      this.type,
      categoryElements.getCategoryTitle(this.type),
      constructDate('month', categoryElements.getCategoryDate(this.type)),
      constructDate('year', categoryElements.getCategoryDate(this.type))
    );
  }

  private async getNewData(): Promise<void> {
    const baseUrl = this.type === 'income' ? INCOME_CATEGORY_PAGE_URL : EXPENSE_CATEGORY_PAGE_URL;
    const currentPage = this.getCurrentPage();

    await this.saveData(
      `${baseUrl}${currentPage}/?month=${+constructDate(
        'month',
        categoryElements.getCategoryDate(`${this.type}`)
      )}&year=${+constructDate('year', categoryElements.getCategoryDate(`${this.type}`))}`
    );
  }

  private updateUIOnPageOneDelete(): void {
    while (categoryElements.getFormElement(`${this.type}s`).firstChild) {
      categoryElements.getFormElement(`${this.type}s`).firstChild.remove();
    }

    incomeAndExpenseElements.getAddButton(`${this.type}`).remove();

    if (+incomeAndExpenseElements.getFormAttributeValue(`${this.type}s`) > 0) {
      while (incomeAndExpenseElements.getFormElement(`${this.type}s`).firstChild) {
        incomeAndExpenseElements.getFormElement(`${this.type}s`).firstChild.remove();
      }
    }
  }

  private updateButtonsForPageOne(): void {
    if (categoryElements.getFormElement(`${this.type}s`).children[0] instanceof HTMLButtonElement)
      categoryElements.getFormElement(`${this.type}s`).children[0].remove();
    if (categoryElements.getFormElement(`${this.type}s`).children[2] instanceof HTMLButtonElement)
      categoryElements.getFormElement(`${this.type}s`).children[2].remove();
  }

  private updateStateOnPageOneDelete(): void {
    categoryElements.setFormAttributeValue(`${this.type}s`, 0);
    incomeAndExpenseElements.setFormAttributeValue(`${this.type}s`, 0);
  }

  private removeAddExpenseCategoryButtonOnPageDelete(): void {
    if (
      !+categoryElements.getFormAttributeValue('expenses') &&
      !+incomeAndExpenseElements.getFormAttributeValue('incomes') &&
      categoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement
    ) {
      categoryElements.getAddCategoryButton('expense').remove();
    }
  }

  // This'll execute when current page > 1
  private updateUIOnPageDelete(): void {
    this.type === 'income' ? this.validateAndUpdateIncomeCategory() : this.updateExpenseCategory();

    this.validateAndUpdateIncomeAndExpense(
      `${this.type}`,
      +incomeAndExpenseElements.getFormAttributeValue(`${this.type}s`),
      this.type === 'income' ? this.data.incomeCount : this.data.expenseCount
    );

    this.updateButtons(
      viewState.state.prevCount,
      this.type == 'income' ? this.data.incomeCount : this.data.expenseCount,
      incomeAndExpenseElements.getFormElement(`${this.type}s`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', `add-${this.type}`)
    );
    this.removeAddExpenseCategoryButtonOnPageDelete();
  }

  private updateStateOnPageDelete(): void {
    categoryElements.setFormAttributeValue(
      `${this.type}s`,
      +categoryElements.getFormAttributeValue(`${this.type}s`) - 1
    );

    if (this.getCurrentPage() > +categoryElements.getFormAttributeValue(`${this.type}s`)) {
      this.type === 'income'
        ? (viewState.state.currentIncomeCategoryPage = +categoryElements.getFormAttributeValue('incomes'))
        : (viewState.state.currentExpenseCategoryPage = +categoryElements.getFormAttributeValue('expenses'));
    }
  }

  // This'll execute when current page > 1
  private updateButtonsOnPageDelete(): void {
    if (this.getCurrentPage() === +categoryElements.getFormAttributeValue(`${this.type}s`)) {
      if (categoryElements.getFormElement(`${this.type}s`).children[1] instanceof HTMLButtonElement) {
        categoryElements.getFormElement(`${this.type}s`).children[1].remove();
      }
      if (categoryElements.getFormElement(`${this.type}s`).children[2] instanceof HTMLButtonElement) {
        categoryElements.getFormElement(`${this.type}s`).children[2].remove();
      }
    }
    // If we got back to first page.
    if (+categoryElements.getFormAttributeValue(`${this.type}s`) === 1) {
      this.updateButtonsForPageOne();
      return;
    }
  }

  private async updateBudget(): Promise<void> {
    const { budget } = await getJsonDataAsString(
      `${BUDGET_MENU_URL}budget/?month=${constructDate('month', budgetElements.getDate())}&year=${constructDate(
        'year',
        budgetElements.getDate()
      )}`
    );
    budgetElements.setBudget = budget;
  }

  private getCurrentPage(): number {
    return this.type === 'income'
      ? viewState.state.currentIncomeCategoryPage
      : viewState.state.currentExpenseCategoryPage;
  }
}
