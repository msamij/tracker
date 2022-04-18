class CategoryElements {
  getBoxRight(type: 'income' | 'expense'): HTMLDivElement {
    return document.querySelector(`.box-right__${type}-categories`);
  }
  getFormElement(categoryType: 'incomes' | 'expenses'): HTMLFormElement {
    return document.querySelector(`.category__${categoryType}`);
  }
  getFormAttributeValue(categoryType: 'incomes' | 'expenses'): string {
    return this.getFormElement(categoryType).dataset.value;
  }
  setFormAttributeValue(categoryType: 'incomes' | 'expenses', value: number): void {
    this.getFormElement(categoryType).dataset.value = '' + value;
  }
  getCategoryTitle(categoryType: 'income' | 'expense'): string {
    if (!document.querySelector(`.category__title--${categoryType}`)) return;
    return document.querySelector(`.category__title--${categoryType}`).textContent;
  }
  setCategoryTitle(categoryType: 'income' | 'expense', title: string): void {
    document.querySelector(`.category__title--${categoryType}`).textContent = title;
  }
  getCategoryDate(categoryType: 'income' | 'expense'): string {
    if (!document.querySelector(`.category__date--${categoryType}`)) return;
    return document.querySelector(`.category__date--${categoryType}`).textContent;
  }
  setCategoryDate(categoryType: 'income' | 'expense', date: string) {
    document.querySelector(`.category__date--${categoryType}`).textContent = date;
  }
  getAddCategoryButton(categoryType: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.add-${categoryType}-category`);
  }
  getNextCategoryButton(categoryType: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-next-${categoryType}-category`);
  }
  getPreviousCategoryButton(categoryType: 'income' | 'expense'): HTMLButtonElement {
    return document.querySelector(`.btn-prev-${categoryType}-category`);
  }
  getExpenseCategoryContainer(): HTMLDivElement {
    return document.querySelector('.box-right__expense-categories');
  }
}

export default new CategoryElements();
