export default class Modal {
    modal: HTMLElement;

    constructor(modalSelector: string) {
      this.modal = document.querySelector(modalSelector);
      this._closeByEscape = this._closeByEscape.bind(this);
      this._closeByClick = this._closeByClick.bind(this);
    }
  
    open(): void {
      this.modal.classList.add('modal_active');
      document.addEventListener('keydown', this._closeByEscape);
    }
  
    close(): void {
      this.modal.classList.remove('modal_active');
      document.removeEventListener('keydown', this._closeByEscape);
    }
  
    _closeByEscape(evt: KeyboardEvent): void {
      if (evt.key === 'Escape') {
        this.close();
      }
    }
  
    _closeByClick(evt: MouseEvent): void {
      if (evt.target === this.modal || (evt.target as HTMLElement).classList.contains('modal__close')) {
        this.close();
      }
    }
  
    setEventListeners(): void {
      this.modal.addEventListener('click', this._closeByClick);
    }
}

