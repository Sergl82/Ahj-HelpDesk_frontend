export default class Modal {
  showModal(text, name, description) {
    if (document.querySelector('.modal')) return;

    this.createModal(text, name, description);
    document.body.appendChild(this.modal);

    this.btnOk = this.modal.querySelector('.button__ok');
    this.btnCancel = this.modal.querySelector('.button__cancel');

    this.btnOk.addEventListener('click', this.onSaveTicket);
    this.btnCancel.addEventListener('click', this.onCancelModal);
  }

  onSaveTicket(event) {
    event.preventDefault();
    let { modal } = this.modal;
    if (!modal.querySelector('.form-field')) {
      this.deleteTicket(this.delId, this.delTicket);
      document.body.removeChild(modal);
      modal = null;
      return;
    }

    this.name = modal.querySelector('.name').value;
    if (this.name === '') {
      modal.querySelector('.name').style.background = '#dba1a1';
      setTimeout(() => {
        modal.querySelector('.name').style.background = '#fdfdfd';
      }, 800);
      return;
    }
    this.description = modal.querySelector('.description').value;
    if (this.description === '') {
      modal.querySelector('.description').style.background = '#dba1a1';
      setTimeout(() => {
        modal.querySelector('.description').style.background = '#fdfdfd';
      }, 800);
      return;
    }

    if (this.method === 'createTicket') {
      this.createTicket();
    }

    if (this.method === 'editTicket') {
      this.editTicket();
    }

    document.body.removeChild(modal);
    modal = null;
  }

  onCancelModal(event) {
    event.preventDefault();
    this.btnOk.removeEventListener('click', this.onSaveTicket);
    this.btnCancel.removeEventListener('click', this.onCancelModal);
    document.body.removeChild(this.modal);
    this.modal = null;
    this.name = null;
    this.description = null;
  }

  createModal(title, name, description) {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    const textareaName = name || '';
    const textareaDescription = description || '';

    let htmlBody = '';
    if (title === 'Удалить тикет') {
      htmlBody = `
       <div class="form-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</div>
       `;
    } else {
      htmlBody = `<div class="form-field">
       <label for="name" class="form-field__label">Краткое описание</label>
       <textarea type="text" id="name" class="form-field__text name" required>${textareaName}</textarea>
     </div>
     <div class="form-field">
       <label for="description" class="form-field__label">Подробное описание</label>
       <textarea type="text" id="description" class="form-field__text description" required>${textareaDescription}</textarea>
     </div>`;
    }

    this.modal.innerHTML = `
      <div class="modal__wrapper">
        <div class="modal__content">
          <h3 class="modal__title">${title}</h3>
          <form class="form">

              ${htmlBody}
              <div class="form__control">
                <button class="form-control__button button button__cancel">Отмена</button>
                <button class="form-control__button button button__ok">Ok</button>
              </div>
          </form> 
        </div>
      </div>
      `;
  }
}
