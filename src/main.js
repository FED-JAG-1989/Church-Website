import { closeMenuOnLink, toggleMenu } from './navigation.js';
import { initialiseGallery } from './gallery.js';
import './gallery.css';

initialiseGallery();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

if (!(menuButton instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) {
  throw new Error('The primary navigation is missing required elements.');
}

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(toggleMenu(menuButton.getAttribute('aria-expanded')));
});

navigation.addEventListener('click', (event) => {
  if (event.target instanceof Element && closeMenuOnLink(event.target.closest('a'))) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

const desktopQuery = window.matchMedia('(min-width: 901px)');
desktopQuery.addEventListener('change', () => setMenu(false));

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());
