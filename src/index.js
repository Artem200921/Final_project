// Imports

import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

// Variables

let page = 0;
let itemsPerPage = 20;
let country = 'US';
const inputSearch = document.querySelector('#header__searching');
const inputDropDown = document.querySelector('#header__country');
const inputDropDownSvg = document.querySelector('#up');
const inputDropDownContent = document.querySelector('.dropdown-content');
const inputDropDownWrap = document.querySelector('.dropdown__wrap');
const list = document.querySelector('.js-articles-container');
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';
let searchQuery = '';

// Media requests

if (window.matchMedia('(min-width: 768px)').matches) {
  itemsPerPage = 21;
} else {
  itemsPerPage = 20;
}

if (window.matchMedia('(min-width: 1280px)').matches) {
  itemsPerPage = 20;
}

// Search system

findEvent(searchQuery, page, itemsPerPage, country).then(elem => {
  eventRender(elem._embedded.events);
  pagination(elem);

  // list.addEventListener('click', e => {
  //   if (e.target.nodeName == 'P') {
  //     const modalBack = document.querySelector('.modal__back');
  //     modalBack.classList.remove('hide');
  //     modalBack.classList.add('visible');
  //     modalBack.addEventListener('click', e => {
  //       modalBack.classList.add('hide');
  //       modalBack.classList.remove('visible');
  //     });
  //   }
  // });

});

inputSearch.addEventListener('input', e => {
  e.preventDefault();
  list.innerHTML = '';
  page = 0;
  searchQuery = inputSearch.value;
  window.setTimeout(() => {
    findEvent(searchQuery, page, itemsPerPage, country)
      .then(e => {
        console.log(e);
        eventRender(e._embedded.events);
        pagination(e);
      })
      .catch(error => {
        alert('No events found for this search!');
      });
  }, 500);
});

// Country system

// Hover

inputDropDown.addEventListener('mouseover', e => {
  inputDropDownSvg.setAttribute(
    'href',
    '/symbol-defs.a8b2e413.svg#drop-down_menu--up'
  );
});
inputDropDown.addEventListener('mouseout', e => {
  inputDropDownSvg.setAttribute(
    'href',
    '/symbol-defs.a8b2e413.svg#drop-down_menu'
  );
});
inputDropDownContent.addEventListener('mouseover', e => {
  inputDropDownSvg.setAttribute(
    'href',
    '/symbol-defs.a8b2e413.svg#drop-down_menu--up'
  );
});
inputDropDownContent.addEventListener('mouseout', e => {
  inputDropDownSvg.setAttribute(
    'href',
    '/symbol-defs.a8b2e413.svg#drop-down_menu'
  );
});

// System

const arrayOfCountries = ['US', 'GB', 'DE', 'ES', 'PL', 'NL', 'SE', 'NO'];
let countryLink;
for (let i = 0; i < arrayOfCountries.length; i += 1) {
  countryLink = document.createElement('h3');
  countryLink.classList.add('dropdown__link');
  countryLink.innerHTML += arrayOfCountries[i];
  inputDropDownWrap.appendChild(countryLink);
}

inputDropDownWrap.addEventListener('click', e => {
  if (e.target.classList.contains('dropdown__link')) {
    list.innerHTML = '';
    country = e.target.textContent;
    console.log(BASE_URL);
    setTimeout(() => {
      findEvent(searchQuery, page, itemsPerPage, country).then(e => {
        pagination(e);
        eventRender(e._embedded.events);
      });
    }, 500);
    inputDropDown.value = e.target.textContent;
  } else {
    console.log('not a country');
  }
});


// Functions

function pagination(elem) {
  const pagination2 = new Pagination(document.getElementById('pagination2'), {
    totalItems: elem.page.totalElements,
    itemsPerPage: itemsPerPage,
    visiblePages: 5,
    centerAlign: true,
  });
  console.log(elem.page.totalPages);

  pagination2.on('afterMove', event => {
    if (event.page === 49) {
      console.log(elem);
    }
    setTimeout(() => {
      list.innerHTML = '';
      findEvent(searchQuery, event.page, itemsPerPage, country).then(e => {
        eventRender(e._embedded.events);
        console.log(e);
        console.log(event.page);
      });
    }, 500);
  });
}

async function findEvent(searchName, page, itemsPerPage, country) {
  try {
    const response = await fetch(
      `${BASE_URL}?keyword=${searchName}&size=${itemsPerPage}&page=${page}&countryCode=${country}&apikey=YEbYV4w0hwtYNZA6svLk6r6y6BhDdnA6`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

// С

function eventRender(arc) {
  console.log(arc);
  arc.forEach((elem, index) => {
    // Створюємо унікальний ID для модального вікна кожної картки
    const modalId = `modal-${index}`;
    const item = `
      <li class="events__item">
        <div class="events__item--wrap" ></div>
        <div class="events__item" data-modal="${modalId}">
          <img src="${elem.images[0].url}" class="events__item--image" alt="">
          <h2 class="events__item--title">${elem.name}</h2>
          <p class="events__item--date">${elem.dates.start.localDate}</p>
          <p class="events__item--location">${elem._embedded.venues[0].name}</p>
        </div>
        <div id="${modalId}" class="modal__back hide">
        <div class="event__modal">
        <button class="close">X</button>
            <img src="${elem.images[0].url
      }" alt="" width="120" class="modal__img">
            <h3 class="modal__title">INFO</h3>
            <p class="modal__info">${elem._embedded.venues[0].name}</p>
            <h3 class="modal__title">WHEN</h3>
            <p class="modal__info">${elem.dates.start.localDate}</p>
            <p class="modal__info">${elem.dates.start.localTime} (${elem.dates.timezone
      })</p>
            <h3 class="modal__title">WHERE</h3>
            <p class="modal__info">${elem._embedded.venues[0].country.name}</p>
            <p class="modal__info">${elem._embedded.venues[0].address.line1}</p>
            <h3 class="modal__title">WHO</h3>
            <p class="modal__info">${elem._embedded.attractions[0].name}</p>
            <p class="${elem._embedded.attractions &&
        elem._embedded.attractions.length > 1
        ? 'modal__info'
        : ''
      }">
  ${elem._embedded.attractions && elem._embedded.attractions.length > 1
        ? elem._embedded.attractions[1].name
        : ''
      }
</p>
          </div>
        </div>
      </li>
    `;
    list.insertAdjacentHTML('beforeend', item);
  });

  // Обробник подій для відкриття модального вікна при кліку на картку
  document.querySelectorAll('.events__item').forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      document.getElementById(modalId).classList.remove('hide');
    });
  });

  document.querySelectorAll('.modal__back .close').forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();
      e.target.closest('.modal__back').classList.add('hide');
    });
  });
}