import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const inputName = event.target.value.trim();

  if (inputName === '') {
    cleanReport();
    return;
  }
  fetchCountries(inputName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        cleanReport();
        return;
      }
      if (data.length === 1) {
        cleanReport();
        infoEl.innerHTML = reportSearchCountry(data);
      } else {
        listEl.innerHTML = shortListCounrties(data);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function reportSearchCountry(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<h1><img src="${flags.png}" alt="${
          name.official
        }" width="80" height="50">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages).join(', ')}</p>
      `
    )
    .join('');
}

function shortListCounrties(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class = "item"><img src="${flags.svg}" alt="${name.official}" width="60" height="40"><p>${name.official}</p></li>`
    )
    .join('');
}

function cleanReport() {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
}
