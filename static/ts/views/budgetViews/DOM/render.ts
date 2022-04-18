import { IncomeAndExpenseComponent } from '@budgetViews/components/incomeAndExpense';
import {
  BudgetPaginationButton,
  CategoryPaginationButton,
  IncomeAndExpensePaginationButton,
} from '@budgetViews/components/paginationButtons';
import { AddButton } from '@components/addButton';
import { CategoryComponent } from '@components/category';
import { ExpenseCategoryButton } from '@components/expenseCategoryButton';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import viewElements from '@DOMElements/view';
import { getJsonDataAsString, saveCategory, saveIncomeAndExpense } from '@models/Model';
import { BUDGET_MENU_URL } from '@utils/config';
import { constructBudgetDate, constructDate, formatDate, validDate } from '@utils/helpers';
import { renderMessage } from '@views/errorView';
import { viewState } from 'app';

abstract class RenderValidator {
  protected abstract renderComponent(): void;
  protected componentId: 'income' | 'expense';

  protected validateAndRenderComponent(response: string): void {
    if (response !== 'success') renderMessage(viewElements.getMessageElement(), response);
    else {
      if (viewState.state.buttonType === 'add-income' || viewState.state.buttonType === 'add-income-category')
        this.componentId = 'income';
      else this.componentId = 'expense';
      this.renderMessage();
      this.renderComponent();
    }
  }

  protected renderMessage(): void {
    renderMessage(viewElements.getMessageElement(), 'Successfully added 😀');
  }
}

class RenderCategory extends RenderValidator {
  async render(): Promise<void> {
    if (viewState.state.buttonType === 'add-expense-category') {
      if (!validDate(viewState.state.inputDate, formatDate(budgetElements.getDate()))) {
        renderMessage(
          viewElements.getMessageElement(),
          `Date field must contain month ${constructDate('month', budgetElements.getDate())} and year ${constructDate(
            'year',
            budgetElements.getDate()
          )}.`
        );
        return;
      }
    }

    if (await this.validateAndRenderBudgetPageButtons()) return;

    this.validateAndRenderComponent(
      await saveCategory(viewState.state.buttonType, viewState.state.inputDate, viewState.state.inputTitle)
    );
  }

  protected renderComponent(): void {
    const categoryComponent = new CategoryComponent(
      categoryElements.getFormElement(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`)
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
      incomeAndExpenseElements.getBoxLeft(`${this.componentId}s`),
      +categoryElements.getFormAttributeValue(`${this.componentId}s`)
    );
    addButton.renderComponent('afterbegin', addButton.getComponentMarkup(this.componentId));

    this.updateComponentState();
    this.updateBudgetUI();
  }

  private renderCategoryPageButtons(): void {
    if (+categoryElements.getFormAttributeValue(`${this.componentId}s`) > 0) {
      const categoryPageButton = new CategoryPaginationButton(
        categoryElements.getFormElement(`${this.componentId}s`),
        +categoryElements.getFormAttributeValue(`${this.componentId}s`)
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
    categoryElements.setFormAttributeValue(
      `${this.componentId}s`,
      +categoryElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );
  }

  private async validateAndRenderBudgetPageButtons(): Promise<boolean> {
    if (budgetElements.getDate()) {
      if (
        constructDate('month', viewState.state.inputDate) !== constructDate('month', budgetElements.getDate()) ||
        constructDate('year', viewState.state.inputDate) !== constructDate('year', budgetElements.getDate())
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
    await saveCategory(viewState.state.buttonType, viewState.state.inputDate, viewState.state.inputTitle);
    this.renderMessage();
  }

  private renderBudgetPageButtons(): void {
    const budgetPageButton = new BudgetPaginationButton(
      budgetElements.getBudgetContainer(),
      +budgetElements.getBudgetCount()
    );
    budgetPageButton.renderComponent('beforeend', budgetPageButton.getComponentMarkup('next'));
    budgetElements.getBudgetContainer().dataset.value = (+budgetElements.getBudgetCount() + 1).toString();
  }

  private updateBudgetUI(): void {
    if (+budgetElements.getBudgetContainer().dataset.value >= 1) return;
    else budgetElements.getBudgetContainer().dataset.value = '1';

    if (budgetElements.getDate() === '') budgetElements.updateDate(constructBudgetDate(viewState.state.inputDate));
  }

  private async budgetExists(): Promise<boolean> {
    const { budget } = await getJsonDataAsString(
      `${BUDGET_MENU_URL}budget/?month=${constructDate('month', viewState.state.inputDate)}&year=${constructDate(
        'year',
        viewState.state.inputDate
      )}`
    );
    // Server can response 'null'.
    return budget !== null ? true : false;
  }
}

class RenderIncomeAndExpense extends RenderValidator {
  async render(): Promise<void> {
    if (!validDate(viewState.state.inputDate, viewState.state.categoryDate)) {
      renderMessage(
        viewElements.getMessageElement(),
        `Date field must contain month ${constructDate('month', viewState.state.categoryDate)} and year ${constructDate(
          'year',
          viewState.state.categoryDate
        )}.`
      );
      return;
    }

    this.validateAndRenderComponent(
      await saveIncomeAndExpense(
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
      incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
      +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
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
    if (+incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`) > 0) {
      const incomeAndExpensePageButton = new IncomeAndExpensePaginationButton(
        incomeAndExpenseElements.getFormElement(`${this.componentId}s`),
        +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
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
    incomeAndExpenseElements.setFormAttributeValue(
      `${this.componentId}s`,
      +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`) + 1
    );
  }

  private renderExpenseCategoryButton(): void {
    if (
      this.componentId === 'income' &&
      !(categoryElements.getExpenseCategoryContainer().children[0] instanceof HTMLButtonElement)
    ) {
      const expenseCategoryButton = new ExpenseCategoryButton(
        categoryElements.getExpenseCategoryContainer(),
        +incomeAndExpenseElements.getFormAttributeValue(`${this.componentId}s`)
      );
      expenseCategoryButton.renderComponent('afterbegin', expenseCategoryButton.getComponentMarkup());
    }
  }

  private updateBudget(): void {
    budgetElements.updateBudget(viewState.state.inputAmount, `${this.componentId}`);
  }
}

export const renderCategory = new RenderCategory();
export const renderIncomeAndExpense = new RenderIncomeAndExpense();
