'use strict';

window.addEventListener('DOMContentLoaded', () => {
    function renderElement(element, parent) {
        parent.append(element);
    }
    
    function createElement(name, parent, text = '', classesEl = []) {
        const element = document.createElement(name);
        if (classesEl.length) {
        element.classList.add(...classesEl);
        }
        if(text) {
        element.textContent = text;
        }
        renderElement(element, parent);
        return element;
    }

    function AddCapitalLetter(value) {
        return value[0].toUpperCase() + value.slice(1).toLowerCase();
    }

    function openModal(modal) {
        const modalContent = modal.querySelector('.modal__content');
        modal.classList.add('is-open-modal');
        modalContent.classList.add('modal-open');
        setTimeout(() => modalContent.classList.add('animate-open'), 300);
    }

    function closeModal(modal) {
        modal.classList.remove('is-open-modal');
        modal.querySelector('.modal__content')
             .classList.remove('modal-open', 'animate-open');
        modal.querySelectorAll('.modal-form__placeholder--small')
             .forEach(placeholder =>
                 placeholder.classList.remove('modal-form__placeholder--small')
        );

        // Don't forget!!!
        
        formAdd.reset();
        contactsContainerFormAdd.innerHTML = '';
        addContactsFormAdd
            .classList
            .remove('modal-form__add-contacts--large-padding');
        contactsContainerFormAdd
            .classList
            .remove('modal-form__contacts-container--margin-bottom');
        addContactBtn.classList.remove('hide');
        errorsFormAdd.innerHTML = '';
        inputsFormAdd.forEach(input =>
            input.classList.remove('modal-form__input--error')
        );
    }

    function createContactInput (parent) {
        const contact = createElement('div', parent, '', ['contact']);
        contact.innerHTML =`
            <select class="contact__select">
                <option value="Телефон">Телефон</option>
                <option value="Email">Email</option>
                <option value="Vk">Vk</option>
                <option value="Facebook">Facebook</option>
                <option value="Другое">Другое</option>
            </select>
            <input
                class="contact__input"
                type="text"
                placeholder="Введите данные контакта"
            >
            <button
                class="btn-reset contact__delete-btn"
                type="button"
                aria-label="Удалить контакт"
            >
                <svg
                    class="contact__svg-delete"
                    width="12" height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6
                        12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6
                        10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354
                        1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646
                        8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3
                        3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9
                        8.154L6.846 6L9 3.846L8.154 3Z"
                    />
                </svg>                                    
            </button>
        `;
        new Choices(contact.querySelector('.contact__select'), {
            itemSelectText: '',
            searchEnabled: false,
            position: 'bottom',
            shouldSort: false,
        });
        setTimeout(() => contact.classList.add('animate-add'), 10);
        contact.querySelector('.contact__delete-btn')
               .addEventListener('click', () => {
            contact.classList.remove('animate-add');
            setTimeout(() => {
                contact.remove();
                const amountImputs = contactsContainerFormAdd
                                        .querySelectorAll('.contact').length;
                if (!amountImputs) {
                    addContactsFormAdd.classList.remove(
                        'modal-form__add-contacts--large-padding'
                    );
                    contactsContainerFormAdd
                        .classList
                        .remove(
                            'modal-form__contacts-container--margin-bottom'
                        );
                }
                if (amountImputs < 10 &&
                    addContactBtn.classList.contains('hide')) {
                    addContactBtn.classList.remove('hide');
                    contactsContainerFormAdd
                        .classList
                        .add('modal-form__contacts-container--margin-bottom');
                }
            }, 350);
        });
    }

    function renderClient (obj, parent) {
        const client = createElement('tr', parent, '', ['client']);
        client.innerHTML =`
            <td class="table__client-cell client__id">${obj.id}</td>
            <td class="table__client-cell client__name">${obj.name}</td>
            <td class="table__client-cell client__creation">
                <span class="client__creation-date">21.02.2021</span>
                <span class="client__creation-time">12:41</span>
            </td>
            <td class="table__client-cell client__change">
                <span class="client__change-date">21.02.2021</span>
                <span class="client__change-time">14:50</span>
            </td>
            <td class="table__client-cell client__contacts">
                <div class="client__contacts-wrap"></div>
            </td>
            <td class="table__client-cell client__actions">
                <button class="client__change-btn btn-reset">Изменить</button>
                <button class="client__delete-btn btn-reset">Удалить</button>
            </td>
        `;
    }

    function renderTable(arr, parent) {
        const copyArr = [...arr];
        parent.innerHTML = '';

        copyArr.forEach(client => renderClient(client, parent));
    }

    async function getData(url) {
        const result = await fetch(url);
        return result.json();
    }

    async function postData(url, data) {
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await result.json();
    }

    const tBody = document.querySelector('.table__body'),
          modalAdd = document.querySelector('#modal-add'),
          formAdd = modalAdd.querySelector('.modal-form'),
          inputsFormAdd = formAdd.querySelectorAll('.modal-form__input'),
          addContactsFormAdd = formAdd.querySelector(
            '.modal-form__add-contacts'
          ),
          contactsContainerFormAdd = formAdd.querySelector(
              '.modal-form__contacts-container'
          ),
          addContactBtn = formAdd.querySelector('.add-contact-btn'),
          errorsFormAdd = formAdd.querySelector('.modal-form__errors-box'),
          acceptAddBtn = formAdd.querySelector('.accept-btn'),
          modalChange = document.querySelector('#modal-change'),
          modalDelete = document.querySelector('#modal-delete');

    document.querySelector('.add-client-btn').addEventListener('click', () => {
        openModal(modalAdd);
    });

    modalAdd.addEventListener('click', e => {
        const event = e.target;

        if (event === modalAdd ||
            event.closest('.close-btn') ||
            event.closest('.cansel-btn')) {
            closeModal(modalAdd);
        }

        if (event.closest('.add-contact-btn')) {
            if (!addContactsFormAdd.classList
                    .contains('modal-form__add-contacts--large-padding')) {
                addContactsFormAdd.classList.add(
                    'modal-form__add-contacts--large-padding'
                );
            }
            if (!contactsContainerFormAdd.classList
                    .contains('modal-form__contacts-container--margin-bottom')) {
                contactsContainerFormAdd
                    .classList
                    .add('modal-form__contacts-container--margin-bottom');
            }

            createContactInput(contactsContainerFormAdd);

            if (contactsContainerFormAdd
                    .querySelectorAll('.contact').length >= 10) {
                addContactBtn.classList.add('hide');
                contactsContainerFormAdd
                    .classList
                    .remove('modal-form__contacts-container--margin-bottom');
            }
        }

        if (event.closest('.choices')) {
            contactsContainerFormAdd.querySelectorAll('.contact')
                .forEach(contact =>
                    contact.classList.remove('contact--z-index'));
            event.closest('.contact').classList.add('contact--z-index');
        } 
    });

    document.querySelectorAll('.modal-form__input').forEach(input => {
        input.addEventListener('change', () => {
            if (input.value) {
                input.nextElementSibling
                     .classList.add('modal-form__placeholder--small');
            } else {
                input.nextElementSibling
                     .classList.remove('modal-form__placeholder--small');
            }
        });
    });

    formAdd.addEventListener('submit', e => {
        e.preventDefault();
        errorsFormAdd.innerHTML = '';
        acceptAddBtn.classList.add('accept-btn--load');
        acceptAddBtn.disabled = true;

        const formInputs = formAdd.querySelectorAll('.modal-form__input'),
              formContacts = formAdd.querySelectorAll('.contact'),
              newClient = {};
              formInputs.forEach(input => {
                  if (input.value.trim()) {
                      newClient[input.name] = AddCapitalLetter(input.value);
                  }
              });
        newClient.contacts = [];
        formContacts.forEach(item => {
            const selectEl = item.querySelector('.contact__select'),
                  inputEl = item.querySelector('.contact__input'),
                  contactObj = {
                      type: selectEl.value,
                      value: inputEl.value
                  };
            newClient.contacts.push(contactObj);
        });

        postData('http://localhost:3500/api/clients', newClient)
            .then((data) => {
                if (data.errors) {
                    data.errors.forEach(error => {
                        createElement('span', errorsFormAdd, error.message);
                        inputsFormAdd.forEach(input => {
                            if (input.name === error.field) {
                                input.classList.add('modal-form__input--error');
                            }
                        });
                    });
                } else {
                    closeModal(modalAdd);
                }
            })
            .catch(() =>
                createElement('span', errorsFormAdd, 'Что-то пошло не так')
            )
            .finally(() => {
                acceptAddBtn.classList.remove('accept-btn--load');
                acceptAddBtn.disabled = false;
            });
    });

    getData('http://localhost:3500/api/clients')
        .then(data => renderTable(data, tBody))
        .catch(() => console.log('Что-то пошло не так'));
});
