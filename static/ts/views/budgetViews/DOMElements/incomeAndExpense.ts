/**
 * This class provide APi's to manipulate DOM for incomes and expenses,
 * therefore it cannot be instantiated.
 */
export class IncomeAndExpenseElements {
  private constructor() {}

  static getBoxLeft(type: 'incomes' | 'expenses'): HTMLDivElement {
    return document.querySelector(`.box-left__${type}`);
  }
  static getFormElement(type: 'incomes' | 'expenses'): HTMLFormElement {
    return document.querySelector(`.items-box__${type}`);
  }
  static getIncomeAndExpense(type: 'income' | 'expense'): HTMLLIElement {
    return document.querySelector(`.${type}-box__${type}`);
  }
  static getFormAttributeValue(type: 'incomes' | 'expenses'): string {
    return this.getFormElement(type).dataset.value;
  }
  static setFormAttributeValue(type: 'incomes' | 'expenses', value: number): void {
    this.getFormElement(type).dataset.value = '' + value;
  }
  static getAddButton(type: 'income' | 'expense'): HTMLDivElement {
    return document.querySelector(`.add-${type}`);
  }
  static getPreviousButton(type: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-prev-${type}`);
  }
  static getNextButton(type: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-next-${type}`);
  }
  static setIncomeAndExpenseTitle(type: 'income' | 'expense', title: string): void {
    document.querySelector(`.${type}-box__${type}-type`).textContent = title;
  }
  static setIncomeAndExpenseAmount(type: 'income' | 'expense', amount: number): void {
    document.querySelector(`.${type}-box__${type}-amount`).textContent = '' + amount + ' Rs';
  }
  static setIncomeAndExpenseDate(type: 'income' | 'expense', date: string): void {
    document.querySelector(`.${type}-box__${type}-date`).textContent = date;
  }
}
