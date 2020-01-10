export default class Searcher {
  constructor() {
    this.lastInput = '';
    this.input = document.querySelector('.hinfo__city');
    this.setListener();
  }

  changeIcon() {
    document.querySelector('.icon__wrap').classList.toggle('icon__change');
    this.input.setAttribute('placeholder', this.input.value);
    this.lastInput = this.input.value;
    this.input.value = '';
  }

  changeIcon2() {
    document.querySelector('.icon__wrap').classList.toggle('icon__change');
    if (this.input.value === '' && this.lastInput === '') {
      this.input.setAttribute('placeholder', 'Your City');
    } else if (this.input.value === '') {
      this.input.value = this.lastInput;
    }
    this.lastInput = '';
  }

  searchCheck(event) {
    if (event.key !== 'Enter') return;
    this.input.blur();
    this.search();
  }

  search() {
    if (this.input.value === '') return;
    this.APP.fetcher.fetchNameData.call(this.APP.fetcher, this.input.value);
  }

  setListener() {
    this.input.addEventListener('focus', this.changeIcon.bind(this));
    this.input.addEventListener('blur', this.changeIcon2.bind(this));
    this.input.addEventListener('keydown', this.searchCheck.bind(this));
    document
      .querySelector('.search')
      .addEventListener('click', this.search.bind(this));
  }
}
