/**
 * This class provide APi's to manipulate DOM for categories,
 * therefore it cannot be instantiated.
 */
export class CategoryElements {
  private constructor() {}

  static getBoxRight(type: 'income' | 'expense'): HTMLDivElement {
    return document.querySelector(`.box-right__${type}-categories`);
  }
  static getFormElement(categoryType: 'incomes' | 'expenses'): HTMLFormElement {
    return document.querySelector(`.category__${categoryType}`);
  }
  static getFormAttributeValue(categoryType: 'incomes' | 'expenses'): string {
    return this.getFormElement(categoryType).dataset.value;
  }
  static setFormAttributeValue(categoryType: 'incomes' | 'expenses', value: number): void {
    this.getFormElement(categoryType).dataset.value = '' + value;
  }
  static getCategory(categoryType: 'income' | 'expense'): HTMLLIElement {
    return document.querySelector(`.category__item--${categoryType}`);
  }
  static getCategoryTitle(categoryType: 'income' | 'expense'): string {
    if (!document.querySelector(`.category__title--${categoryType}`)) return;
    return document.querySelector(`.category__title--${categoryType}`).textContent;
  }
  static setCategoryTitle(categoryType: 'income' | 'expense', title: string): void {
    document.querySelector(`.category__title--${categoryType}`).textContent = title;
  }
  static getCategoryDate(categoryType: 'income' | 'expense'): string {
    if (!document.querySelector(`.category__date--${categoryType}`)) return;
    return document.querySelector(`.category__date--${categoryType}`).textContent;
  }
  static setCategoryDate(categoryType: 'income' | 'expense', date: string) {
    document.querySelector(`.category__date--${categoryType}`).textContent = date;
  }
  static getAddCategoryButton(categoryType: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.add-${categoryType}-category`);
  }
  static getNextCategoryButton(categoryType: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-next-${categoryType}-category`);
  }
  static getPreviousCategoryButton(categoryType: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-prev-${categoryType}-category`);
  }
}
