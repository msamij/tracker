import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { IncomeAndExpensePaginationButton } from '@components/paginationButtons';
import { BudgetElements } from '@DOMElements/budget';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { BUDGET_MENU_URL, EXPENSE_CATEGORY_PAGE_URL, INCOME_CATEGORY_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class DeleteCategory extends PaginationDOMUpdateAdapter {
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

    if (+CategoryElements.getFormAttributeValue(`${this.type}s`) === 1) {
      this.updateUIOnPageOneDelete();
      this.updateStateOnPageOneDelete();
      this.updateButtonsForPageOne();
      this.removeAddExpenseCategoryButtonOnPageDelete();
    }
    //
    else if (+CategoryElements.getFormAttributeValue(`${this.type}s`) > 1) {
      this.updateStateOnPageDelete();
      this.updateButtonsOnPageDelete();
      await this.getNewData();
      this.updateUIOnPageDelete();
    }
  }

  private async deleteCategory(): Promise<void> {
    await this.requestDeleteCategory(
      this.type,
      CategoryElements.getCategoryTitle(this.type),
      constructDate('month', CategoryElements.getCategoryDate(this.type)),
      constructDate('year', CategoryElements.getCategoryDate(this.type))
    );
  }

  private async getNewData(): Promise<void> {
    const baseUrl = this.type === 'income' ? INCOME_CATEGORY_PAGE_URL : EXPENSE_CATEGORY_PAGE_URL;
    const currentPage = this.getCurrentPage();

    await this.saveData(
      `${baseUrl}${currentPage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate(`${this.type}`)
      )}&year=${+constructDate('year', CategoryElements.getCategoryDate(`${this.type}`))}`
    );
  }

  private updateUIOnPageOneDelete(): void {
    while (CategoryElements.getFormElement(`${this.type}s`).firstChild) {
      CategoryElements.getFormElement(`${this.type}s`).firstChild.remove();
    }

    IncomeAndExpenseElements.getAddButton(`${this.type}`).remove();

    if (+IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`) > 0) {
      while (IncomeAndExpenseElements.getFormElement(`${this.type}s`).firstChild) {
        IncomeAndExpenseElements.getFormElement(`${this.type}s`).firstChild.remove();
      }
    }
  }

  private updateButtonsForPageOne(): void {
    if (CategoryElements.getFormElement(`${this.type}s`).children[0] instanceof HTMLButtonElement)
      CategoryElements.getFormElement(`${this.type}s`).children[0].remove();
    if (CategoryElements.getFormElement(`${this.type}s`).children[2] instanceof HTMLButtonElement)
      CategoryElements.getFormElement(`${this.type}s`).children[2].remove();
  }

  private updateStateOnPageOneDelete(): void {
    CategoryElements.setFormAttributeValue(`${this.type}s`, 0);
    IncomeAndExpenseElements.setFormAttributeValue(`${this.type}s`, 0);
  }

  private removeAddExpenseCategoryButtonOnPageDelete(): void {
    if (
      !+CategoryElements.getFormAttributeValue('expenses') &&
      !+IncomeAndExpenseElements.getFormAttributeValue('incomes') &&
      CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement
    ) {
      CategoryElements.getAddCategoryButton('expense').remove();
    }
  }

  // This'll execute when current page > 1
  private updateUIOnPageDelete(): void {
    this.type === 'income' ? this.validateAndUpdateIncomeCategory() : this.updateExpenseCategory();

    this.validateAndUpdateIncomeAndExpense(
      `${this.type}`,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.type}s`),
      this.type === 'income' ? this.data.incomeCount : this.data.expenseCount
    );

    this.updateButtons(
      viewState.state.prevCount,
      this.type == 'income' ? this.data.incomeCount : this.data.expenseCount,
      IncomeAndExpenseElements.getFormElement(`${this.type}s`),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', `add-${this.type}`)
    );
    this.removeAddExpenseCategoryButtonOnPageDelete();
  }

  private updateStateOnPageDelete(): void {
    CategoryElements.setFormAttributeValue(
      `${this.type}s`,
      +CategoryElements.getFormAttributeValue(`${this.type}s`) - 1
    );

    if (this.getCurrentPage() > +CategoryElements.getFormAttributeValue(`${this.type}s`)) {
      this.type === 'income'
        ? (viewState.state.currentIncomeCategoryPage = +CategoryElements.getFormAttributeValue('incomes'))
        : (viewState.state.currentExpenseCategoryPage = +CategoryElements.getFormAttributeValue('expenses'));
    }
  }

  // This'll execute when current page > 1
  private updateButtonsOnPageDelete(): void {
    if (this.getCurrentPage() === +CategoryElements.getFormAttributeValue(`${this.type}s`)) {
      if (CategoryElements.getFormElement(`${this.type}s`).children[1] instanceof HTMLButtonElement) {
        CategoryElements.getFormElement(`${this.type}s`).children[1].remove();
      }
      if (CategoryElements.getFormElement(`${this.type}s`).children[2] instanceof HTMLButtonElement) {
        CategoryElements.getFormElement(`${this.type}s`).children[2].remove();
      }
    }
    // If we got back to first page.
    if (+CategoryElements.getFormAttributeValue(`${this.type}s`) === 1) {
      this.updateButtonsForPageOne();
      return;
    }
  }

  private async updateBudget(): Promise<void> {
    const { budget } = await this.getJsonDataAsString(
      `${BUDGET_MENU_URL}budget/?month=${constructDate('month', BudgetElements.getDate())}&year=${constructDate(
        'year',
        BudgetElements.getDate()
      )}`
    );
    BudgetElements.setBudget = budget;
  }

  private getCurrentPage(): number {
    return this.type === 'income'
      ? viewState.state.currentIncomeCategoryPage
      : viewState.state.currentExpenseCategoryPage;
  }
}
