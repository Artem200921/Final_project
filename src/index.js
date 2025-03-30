// import * as crud from "modules/crud";

const BASE_URL_FOR_COUNTRIES = 'https://restcountries.com/v3.1/all';
let BASE_URL_FOR_EVENTS =
  'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=YEbYV4w0hwtYNZA6svLk6r6y6BhDdnA6 ';

async function render(url) {
  try {
    const response = await fetch(`${url}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

const inputDropDown = document.querySelector('#header__country');
const inputDropDownSvg = document.querySelector('#up');
const inputDropDownContent = document.querySelector('.dropdown-content');
const inputDropDownWrap = document.querySelector('.dropdown__wrap');
const eventsList = document.querySelector('#events__list');

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

render(BASE_URL_FOR_COUNTRIES).then(data => {
  // const events = data._embedded.events;
  data.forEach(element => {
    const countryLink = document.createElement('h3');
    countryLink.classList.add('dropdown__link');
    countryLink.textContent = element.name.common;
    inputDropDownWrap.appendChild(countryLink);
    countryLink.addEventListener('click', e => {
      BASE_URL_FOR_EVENTS = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=${element.altSpellings[0]}&apikey=YEbYV4w0hwtYNZA6svLk6r6y6BhDdnA6`;
      inputDropDown.value = e.target.textContent;
      renderTimeout();
    });
  });
});

renderTimeout();

function renderTimeout() {
  window.setTimeout(() => {
    render(BASE_URL_FOR_EVENTS)
      .then(data => {
        const events = data._embedded.events;
        events.forEach(element => {
          console.log(element);
          console.log(element.dates.start.localDate);
          const eventItem = document.createElement('li');
          eventItem.classList.add('events__item');
          eventItem.innerHTML = `<div class="events__item--wrap">
            <img src="${element.images[0].url}" alt="Event Image" class="events__image"/>
              <h3 class="events__item--title">${element.name}</h3>
              <p class="events__item--date">${element.dates.start.localDate}</p>
              <p class="events__item--location">Location: City, Country</p>
              <p class="events__item--description">Description of the event goes here.</p>
            </div>`;
          eventsList.appendChild(eventItem);
        });
      })
      .catch(error => {
        alert('У цій країні немає подій', error);
      });
  }, 500);
}
