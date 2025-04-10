// Imports

import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

// Variables

let page = 0;
let itemsPerPage = 0;
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
} else {
  itemsPerPage = 21;
}

// Search system

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
    visiblePages: 3,
    centerAlign: true,
  });
  console.log(elem.page.totalPages);

  pagination2.on('afterMove', event => {
    if (event.page === 49) {
      console.log(elem)
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

function eventRender(arc) {
  console.log(arc);
  arc.forEach(e => {
    const item = `
          <li>
              <a href="${e.name}" target="_blank" rel="noopener noreferrer">
              <article>
                  <img src="${e.images[0].url}" alt="" width="480">
                  <h2>${e.name}</h2>
              </article>
              </a>
          </li>
          `;
    list.insertAdjacentHTML('beforeend', item);
  });
}

// function pagination() {

// }
