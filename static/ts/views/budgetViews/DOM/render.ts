import { IncomeAndExpenseComponent } from '@budgetViews/components/incomeAndExpense';
import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';
import { AddButton } from '@components/addButton';
import { CategoryComponent } from '@components/category';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';
import { BudgetElements } from '@DOMElements/budget';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { ViewElements } from '@DOMElements/view';
import { Model } from '@models/Model';
import { BUDGET_MENU_URL } from '@utils/config';
import { constructBudgetDate, constructDate, formatDate, validDate } from '@utils/helpers';
import { renderMessage } from '@views/errorView';
import { viewState } from 'app';

abstract class RenderValidator {
  protected abstract renderComponent(): void;
  protected componentId: 'income' | 'expense';

  protected validateAndRenderComponent(response: string): void {
    if (response !== 'success') renderMessage(ViewElements.getMessageElement(), response);
    else {
      if (viewState.state.buttonType === 'add-income' || viewState.state.buttonType === 'add-income-category')
        this.componentId = 'income';
      else this.componentId = 'expense';
      this.renderMessage();
      this.renderComponent();
    }
  }

  protected renderMessage(): void {
    renderMessage(ViewElements.getMessageElement(), 'Successfully added 😀');
  }
}

export class RenderCategory extends RenderValidator {
  constructor(
    private getJsonDataAsString: (url: string) => Promise<Model>,
    private saveCategory: (buttonType: string, inputDate: string, inputTitle: string) => Promise<string>
  ) {
    super();
  }

  async render(): Promise<void> {
    if (viewState.state.buttonType === 'add-expense-category') {
      if (!validDate(viewState.state.inputDate, formatDate(BudgetElements.getDate()))) {
        renderMessage(
          ViewElements.getMessageElement(),
          `Date field must contain month ${constructDate('month', BudgetElements.getDate())} and year ${constructDate(
            'year',
            BudgetElements.getDate()
          )}.`
        );
        return;
      }
    }

    if (await this.validateAndRenderBudgetPageButtons()) return;

    this.validateAndRenderComponent(
      await this.saveCategory(viewState.state.buttonType, viewState.state.inputDate, viewState.state.inputTitle)
    );
  }

  protected renderComponent(): void {
    const categoryComponent = new CategoryComponent(
      CategoryElements.getFormElement(`${this.componentId}s`),
      +CategoryElements.getFormAttributeValue(`${this.componentId}s`)
    );
    categoryComponent.renderComponent(
      'beforeend',
      categoryComponent.getComponentMarkup(
        this.componentId,
        viewState.state.inputTitle,
        formatDate(viewState.state.inputDate)
      )
    );

    this.renderCategoryPageButtons();

    const addButton = new AddButton(
      IncomeAndExpenseElements.getBoxLeft(`${this.componentId}s`),
      +CategoryElements.getFormAttributeValue(`${this.componentId}s`)
    );
    addButton.renderComponent('afterbegin', addButton.getComponentMarkup(this.componentId));

    this.updateComponentState();
    this.updateBudgetUI();
  }

  private renderCategoryPageButtons(): void {
    if (+CategoryElements.getFormAttributeValue(`${this.componentId}s`) > 0) {
      const categoryPageButton = new CategoryPaginationButton(
        CategoryElements.getFormElement(`${this.componentId}s`),
        +CategoryElements.getFormAttributeValue(`${this.componentId}s`)
      );
      categoryPageButton.renderComponent(
        'beforeend',
        categoryPageButton.getComponentMarkup(
          'next',
          viewState.state.buttonType as 'add-income-category' | 'add-expense-category'
        )
      );
    }
  }

  private updateComponentState(): void {
    CategoryElements.setFormAttributeValue(
      `${this.componentId}s`,
      +CategoryElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );
  }

  private async validateAndRenderBudgetPageButtons(): Promise<boolean> {
    if (BudgetElements.getDate()) {
      if (
        constructDate('month', viewState.state.inputDate) !== constructDate('month', BudgetElements.getDate()) ||
        constructDate('year', viewState.state.inputDate) !== constructDate('year', BudgetElements.getDate())
      ) {
        if (await this.saveCategoryOnExistingBudget()) return true;
        this.renderBudgetPageButtons();
        await this.save();
        // Exit when render budget page buttons.
        return true;
      }
    }
  }

  private async saveCategoryOnExistingBudget(): Promise<boolean> {
    if (await this.budgetExists()) {
      await this.save();
      return true;
    }
    return false;
  }

  private async save(): Promise<void> {
    await this.saveCategory(viewState.state.buttonType, viewState.state.inputDate, viewState.state.inputTitle);
    this.renderMessage();
  }

  private renderBudgetPageButtons(): void {
    const budgetPageButton = new BudgetPaginationButton(
      BudgetElements.getBudgetContainer(),
      +BudgetElements.getBudgetCount()
    );
    budgetPageButton.renderComponent('beforeend', budgetPageButton.getComponentMarkup('next'));
    BudgetElements.getBudgetContainer().dataset.value = (+BudgetElements.getBudgetCount() + 1).toString();
  }

  private updateBudgetUI(): void {
    if (+BudgetElements.getBudgetContainer().dataset.value >= 1) return;
    else BudgetElements.getBudgetContainer().dataset.value = '1';

    if (BudgetElements.getDate() === '') BudgetElements.updateDate(constructBudgetDate(viewState.state.inputDate));
  }

  private async budgetExists(): Promise<boolean> {
    const { budget } = await this.getJsonDataAsString(
      `${BUDGET_MENU_URL}budget/?month=${constructDate('month', viewState.state.inputDate)}&year=${constructDate(
        'year',
        viewState.state.inputDate
      )}`
    );
    // Server can response 'null'.
    return budget !== null ? true : false;
  }
}

export class RenderIncomeAndExpense extends RenderValidator {
  constructor(
    private saveIncomeAndExpense: (
      buttonType: string,
      inputDate: string,
      inputTitle: string,
      inputAmount: string,
      categoryTitle: string
    ) => Promise<string>
  ) {
    super();
  }

  async render(): Promise<void> {
    if (!validDate(viewState.state.inputDate, viewState.state.categoryDate)) {
      renderMessage(
        ViewElements.getMessageElement(),
        `Date field must contain month ${constructDate('month', viewState.state.categoryDate)} and year ${constructDate(
          'year',
          viewState.state.categoryDate
        )}.`
      );
      return;
    }

    this.validateAndRenderComponent(
      await this.saveIncomeAndExpense(
        viewState.state.buttonType,
        viewState.state.inputDate,
        viewState.state.inputTitle,
        viewState.state.inputAmount,
        viewState.state.categoryTitle
      )
    );
  }

  protected renderComponent(): void {
    const incomeAndExpense = new IncomeAndExpenseComponent(
      IncomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
    );
    incomeAndExpense.renderComponent(
      'beforeend',
      incomeAndExpense.getComponentMarkup(
        this.componentId,
        viewState.state.inputTitle,
        viewState.state.inputAmount,
        formatDate(viewState.state.inputDate)
      )
    );

    this.renderPageButtons();
    this.updateComponentState();
    this.renderExpenseCategoryButton();
    this.updateBudget();
  }

  private renderPageButtons(): void {
    if (+IncomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`) > 0) {
      const incomeAndExpensePageButton = new IncomeAndExpensePaginationButton(
        IncomeAndExpenseElements.getFormElement(`${this.componentId}s`),
        +IncomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
      );
      incomeAndExpensePageButton.renderComponent(
        'beforeend',
        incomeAndExpensePageButton.getComponentMarkup(
          'next',
          viewState.state.buttonType as 'add-income' | 'add-expense'
        )
      );
    }
  }

  private updateComponentState(): void {
    IncomeAndExpenseElements.setFormAttributeValue(
      `${this.componentId}s`,
      +IncomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );
  }

  private renderExpenseCategoryButton(): void {
    if (
      this.componentId === 'income' &&
      !(CategoryElements.getBoxRight('expense').children[0] instanceof HTMLButtonElement)
    ) {
      const expenseCategoryButton = new ExpenseCategoryButton(
        CategoryElements.getBoxRight('expense'),
        +IncomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
      );
      expenseCategoryButton.renderComponent('afterbegin', expenseCategoryButton.getComponentMarkup());
    }
  }

  private updateBudget(): void {
    BudgetElements.updateBudget(viewState.state.inputAmount, `${this.componentId}`);
  }
}
