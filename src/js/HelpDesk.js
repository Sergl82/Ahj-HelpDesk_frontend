import Modal from './Modal';
import createRequest from './createRequest';

function formatDate(string) {
  let date = new Date(string);
  date = date.toLocaleString('ru');
  date = date.substr(0, 17).replace(',', '');
  return date;
}

function getHtmlTicket(name, createdStr) {
  return `
  <div class="ticket__status circle"></div>
  <div class="ticket__description">
    <div class="ticket__description-name">${name}</div>
    <div class="ticket__description-full"></div>
  </div>
  <div class="ticket__date">${createdStr}</div>
  <div class="ticket__controll">
    <div class="ticket__controll-edit circle">✎</div>
    <div class="ticket__controll-delete circle">✘</div>
  </div>`;
}

export default class HelpDesk {
  constructor(elem) {
    if (typeof elem === 'string') {
      // eslint-disable-next-line no-param-reassign
      elem = document.querySelector(elem);
    }
    this.modal = new Modal();
    this.element = elem;
    this.submitBtn = this.element.querySelector('.helpdesk__button');
    this.ticketsList = this.element.querySelector('.helpdesk__list');

    this.onClick = this.onClick.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);
    this.createTicket = this.createTicket.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.getTicketsList = this.getTicketsList.bind(this);

    this.modal.showModal = this.modal.showModal.bind(this.modal);
    this.modal.createModal = this.modal.createModal.bind(this.modal);
    this.modal.onSaveTicket = this.modal.onSaveTicket.bind(this);
    this.modal.onCancelModal = this.modal.onCancelModal.bind(this.modal);
  }

  bindToDOM() {
    this.element.addEventListener('click', this.onClick);
    this.getTicketsList();
  }

  getTicketsList() {
    try {
      const allTickets = createRequest({ method: 'allTickets' });
      allTickets.then((resolve) => {
        this.tickets = resolve;
        this.renderTicketsList(this.tickets);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  renderTicketsList(tickets) {
    this.ticketsList.innerHTML = '';
    tickets.forEach((date) => {
      const createdStr = formatDate(date.created);
      const tickethtml = getHtmlTicket(date.name, createdStr);
      const ticket = document.createElement('div');
      ticket.classList.add('ticket');
      ticket.setAttribute('data-id', date.id);
      ticket.innerHTML = tickethtml;
      this.ticketsList.appendChild(ticket);
      if (date.status === true) {
        ticket.querySelector('.ticket__status').textContent = '✔';
      }
    });
  }

  onClick(event) {
    const { target } = event;

    if (target.classList.contains('helpdesk__button')) {
      this.onClickAdd();
      return;
    }

    if (!target.closest('.ticket')) return;

    const ticket = target.closest('.ticket');
    const { id } = ticket.dataset;

    if (target.classList.contains('ticket__status')) {
      this.changeStatus(id, ticket);
      return;
    }

    if (target.classList.contains('ticket__controll-edit')) {
      this.onClickEdit(id, ticket);
      return;
    }

    if (target.classList.contains('ticket__controll-delete')) {
      this.onClickDelete(id);
      return;
    }

    if (target.closest('.ticket')) {
      this.getDescription(id, ticket);
    }
  }

  onClickAdd() {
    this.method = 'createTicket';
    this.modal.showModal('Добавить тикет');
  }

  async changeStatus(id, ticket) {
    this.method = 'changeStatus';
    const changeStatus = createRequest({
      method: this.method,
      id,
    });
    changeStatus.then((resolve) => {
      if (resolve === true) {
        // eslint-disable-next-line no-param-reassign
        ticket.querySelector('.ticket__status').textContent = '✔';
      }
      if (resolve === false) {
        // eslint-disable-next-line no-param-reassign
        ticket.querySelector('.ticket__status').textContent = '';
      }
    });
  }

  async getDescription(id, ticket) {
    const descriptionBlock = ticket.querySelector('.ticket__description-full');
    if (descriptionBlock.textContent !== '') {
      descriptionBlock.classList.toggle('hidden');
      return;
    }
    this.method = 'ticketById';
    const createTicket = createRequest({
      method: this.method,
      id,
    });
    createTicket.then((resolve) => {
      descriptionBlock.textContent = resolve.description;
    });
  }

  async createTicket() {
    const createTicket = createRequest({
      method: this.method,
      name: this.name,
      description: this.description,
      id: null,
    });
    createTicket.then(() => {
      this.getTicketsList();
    });
  }

  onClickEdit(id, ticket) {
    const name = ticket.querySelector('.ticket__description-name').textContent;
    const description = ticket.querySelector('.ticket__description-full').textContent;
    this.method = 'editTicket';
    this.id = id;
    this.modal.showModal('Изменить тикет', name, description);
  }

  editTicket() {
    const editTicket = createRequest({
      method: this.method,
      name: this.name,
      description: this.description,
      id: this.id,
    });
    editTicket.then(() => {
      this.getTicketsList();
    });
  }

  onClickDelete(id) {
    this.modal.showModal('Удалить тикет');
    this.delId = id;
  }

  async deleteTicket(id) {
    this.method = 'deleteTicket';
    const deleteTicket = createRequest({
      method: this.method,
      id,
    });
    deleteTicket.then(() => {
      this.getTicketsList();
    });
  }
}
