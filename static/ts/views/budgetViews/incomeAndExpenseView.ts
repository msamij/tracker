class IncomeAndExpenseElements {
  getFormElement(type: 'incomes' | 'expenses'): HTMLFormElement {
    return document.querySelector(`.items-box__${type}`);
  }
  getFormAttributeValue(type: 'incomes' | 'expenses'): string {
    return this.getFormElement(type).dataset.value;
  }
  setFormAttributeValue(type: 'incomes' | 'expenses', value: number): void {
    this.getFormElement(type).dataset.value = '' + value;
  }
  getBoxLeft(type: 'incomes' | 'expenses'): HTMLDivElement {
    return document.querySelector(`.box-left__${type}`);
  }
  getAddButton(type: 'income' | 'expense'): HTMLDivElement {
    return document.querySelector(`.add-${type}`);
  }
  getPreviousButton(type: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-prev-${type}`);
  }
  getNextButton(type: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-next-${type}`);
  }
  setIncomeAndExpenseTitle(type: 'income' | 'expense', title: string): void {
    document.querySelector(`.${type}-box__${type}-type`).textContent = title;
  }
  setIncomeAndExpenseAmount(type: 'income' | 'expense', amount: number): void {
    document.querySelector(`.${type}-box__${type}-amount`).textContent = '' + amount + ' Rs';
  }
  setIncomeAndExpenseDate(type: 'income' | 'expense', date: string): void {
    document.querySelector(`.${type}-box__${type}-date`).textContent = date;
  }
}

export default new IncomeAndExpenseElements();
