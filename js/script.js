import {updateDate} from './modules/date.js';
import SearcherDefault from './modules/searcher.js';
import * as FetcherObj from './modules/fetcher.js';
class App {
  static init() {
    this.searcher = new SearcherDefault();
    this.searcher.APP = this;
    this.fetcher = new FetcherObj.Fetcher();
    setInterval(() => {
      updateDate();
    }, 1000);
  }
}

App.init();
updateDate();

window.addEventListener('load', () => {
  if(localStorage.getItem('city')) {
    App.fetcher.fetchNameData(localStorage.getItem('city'));
  }
})

document.querySelector('.menu').addEventListener('click', openMenu);

function openMenu() {
  document.querySelector('.content--2').classList.toggle('open-menu');
  document.querySelector('.menu').classList.toggle('open-hamburger');
}