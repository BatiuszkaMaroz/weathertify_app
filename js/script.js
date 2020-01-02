class Searcher {
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
    }
    else if (this.input.value === '') {
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
    App.fetcher.fetchNameData.call(App.fetcher, this.input.value);
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

class Fetcher {
  constructor() {
    this.setListener();
    this.setMap();
  }

  setMap() {
    const map = new Map();
    map.set('hcity', document.querySelector('.hinfo__city'));
    map.set('htime', document.querySelector('.hinfo__time'));
    map.set('tweather', document.querySelector('.today__now--weather'));
    map.set('ttemp', document.querySelector('.today__now--temperature'));
    map.set('thigh', document.querySelector('.today__day--highest'));
    map.set('tlow', document.querySelector('.today__day--lowest'));
    map.set('ticon', document.querySelector('.today__now--icon'));
    this.DOMmap = map;
  }

  updateDOM(curdata, longdata, DOM) {
    document.querySelector('.scroller').classList.add('open-scroller');
    document.querySelector('main').style.display = 'block';
    DOM.get('hcity').value = `${curdata.name}`;
    DOM.get('tweather').textContent = `${curdata.weather[0].main}`;
    DOM.get('ttemp').textContent = `${curdata.main.temp.toFixed(0)}°`;
    DOM.get('thigh').textContent = `${curdata.main.temp_max.toFixed(0)}°`;
    DOM.get('tlow').textContent = `${curdata.main.temp_min.toFixed(0)}°`;
    DOM.get('ticon').setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${curdata.weather[0].icon}@2x.png`,
    );

    const date = new Date();
    const today = date.getDate();
    const tab = longdata.list;
    const filteredTab = tab.filter(elm => {
      if (elm.dt_txt.slice(8, 10) == today) return false;
      if (elm.dt_txt.slice(11, 13) == '12' || elm.dt_txt.slice(11, 13) == '00')
        return true;
    });

    const folDays = document.querySelectorAll('.following__day');
    for (let i = 0; i < 8; i += 2) {
      folDays[i / 2].querySelector(
        '.following__temperature',
      ).textContent = `${filteredTab[i].main.temp.toFixed(0)}° / ${filteredTab[
        i + 1
      ].main.temp.toFixed(0)}°`;
      folDays[i / 2]
        .querySelector('.following__icon')
        .setAttribute(
          'src',
          `https://openweathermap.org/img/wn/${
            filteredTab[i + 1].weather[0].icon
          }@2x.png`,
        );

      const day = getDay((date.getDay() + 1 + i / 2) % 7);

      const todays = new Date();
      const tomorrow = new Date(todays);
      tomorrow.setDate(tomorrow.getDate() + 1 + i / 2);

      folDays[i / 2].querySelector(
        '.following__date',
      ).textContent = `${day}, ${tomorrow.getDate()}.${tomorrow.getMonth() + 1}`;
    }

    const existing = document.querySelectorAll('.future__day');
    for (const elm of existing) {
      elm.remove();
    }

    for (let i = 0; i < 9; i++) {
      const element = document.importNode(
        document.querySelector('.future--node').content,
        true,
      );
      element.querySelector(
        '.future__day--temperature',
      ).textContent = `${longdata.list[i].dt_txt.slice(11, 16)}`;
      element.querySelector(
        '.future__day--hour',
      ).textContent = `${longdata.list[i].main.temp.toFixed(0)}°`;
      element
        .querySelector('.future__day--icon')
        .setAttribute(
          'src',
          `https://openweathermap.org/img/wn/${longdata.list[i].weather[0].icon}@2x.png`,
        );
      document.querySelector('.future').append(element);
    }

    const addData = document.querySelectorAll('.side__data');
    const sunrise = new Date(curdata.sys.sunrise * 1000);
    const sunset = new Date(curdata.sys.sunset * 1000);
    addData[0].textContent = sunrise.toUTCString().slice(17, 22)
    addData[1].textContent = sunset.toUTCString().slice(17, 22)
    addData[2].textContent = `${curdata.main.pressure} hPa`;
    addData[3].textContent = `${curdata.main.humidity} %`;
    addData[4].textContent = `${curdata.wind.speed} m/s`;
    addData[5].textContent = `${curdata.clouds.all} %`;

    //Fog different names Handler
    let videoName = curdata.weather[0].main;
    const altTab = ['Mist', 'Smoke', 'Haze', 'Dust', 'Sand', 'Dust', 'Ash', 'Squall', 'Tornado'];
    if(altTab.includes(videoName)) videoName = 'Fog';

    const videoElement = document.createElement('video');
    videoElement.className = 'background__video';
    videoElement.setAttribute('autoplay', 'true');
    videoElement.setAttribute('muted', 'true');
    videoElement.setAttribute('loop', 'true');
    videoElement.innerHTML = `<source type="video/mp4" class="video__hook">`;
    videoElement.querySelector('source').setAttribute('src', `videos/${videoName}.mp4`);
    document.querySelector('.background').prepend(videoElement);
    this.videoElement = videoElement;
  }

  //Fetches Current Geolocalization
  getGeo() {
    const promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        result => {
          resolve(result);
        },
        error => {
          alert('Error!');
          console.dir(error);
        },
      );
    });
    return promise;
  }

  callServer(lati, long, name = '') {
    let fetchString = '';
    if(name != '') {
      fetchString = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&APPID=7fa3cf512c6e4d72224e3dccc9e8cb2b`;
    }
    else {
      fetchString = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&APPID=7fa3cf512c6e4d72224e3dccc9e8cb2b`;
    }

    const promise = new Promise((resolve, reject) => {
      fetch(
        fetchString,
      )
        .then(data => data.json())
        .then(data => resolve(data));
    });
    return promise;
  }

  callServer2(lati, long, name = '') {
    let fetchString = '';
    if(name != '') {
      fetchString = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&APPID=7fa3cf512c6e4d72224e3dccc9e8cb2b`;
    }
    else {
      fetchString = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=metric&APPID=7fa3cf512c6e4d72224e3dccc9e8cb2b`;
    }

    const promise = new Promise((resolve, reject) => {
      fetch(
        fetchString,
      )
        .then(data => data.json())
        .then(data => resolve(data));
    });
    return promise;
  }

  fetchData() {
    if(this.videoElement) this.videoElement.remove();
    document.querySelector('main').style.display = '';
    document.querySelector('.loader').style.display = 'block';
    document.querySelector('.globe').style.pointerEvents = 'none';
    const geolocation = this.getGeo.call(this);
    geolocation
      .then(data => {
        this.lati = data.coords.latitude;
        this.long = data.coords.longitude;
        return this.callServer.call(this, this.lati, this.long);
      })
      .then(data => {
        this.longdata = data;
        return this.callServer2.call(this, this.lati, this.long);
      })
      .then(data => {
        document.querySelector('.loader').style.display = '';
        this.updateDOM(data, this.longdata, this.DOMmap);
      })
      .catch(error => {
        document.querySelector('main').style.display = 'none';
        document.querySelector('.hinfo__city').value = '';
        document.querySelector('.hinfo__city').setAttribute('placeholder', 'Geo Error');
        console.log(error);
        alert('Geolocation Error');
      });
    document.querySelector('.globe').style.pointerEvents = '';
  }

  fetchNameData(name) {
    // console.log(this.videoElement.querySelector('source').getAttribute('src').split('.')[0].split('/')[1] === ); //Performance protorype /no new video load/
    if(this.videoElement) this.videoElement.remove();
    document.querySelector('main').style.display = '';
    document.querySelector('.loader').style.display = 'block';
    this.callServer(undefined,undefined,name)
    .then(data => {
      this.longdata = data;
      return this.callServer2.call(this, undefined,undefined,name);
    })
    .then(data => {
      document.querySelector('.loader').style.display = '';
      this.updateDOM(data, this.longdata, this.DOMmap);
    })
    .catch(error => {
      document.querySelector('main').style.display = 'none';
      document.querySelector('.hinfo__city').value = '';
      document.querySelector('.hinfo__city').setAttribute('placeholder', 'Wrong Name');
    });
  }

  setListener() {
    document
      .querySelector('.globe')
      .addEventListener('click', this.fetchData.bind(this));
  }
}

class App {
  static init() {
    this.searcher = new Searcher();
    this.fetcher = new Fetcher();
    setInterval(() => {
      updateDate();
    }, 5000);
  }
}

App.init();
updateDate();

function updateDate() {
  const data = new Date();

  let pronoun = '';
  let day = data.getDay();
  let hours = data.getHours();
  let minutes = data.getMinutes();

  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (hours > 12) {
    hours -= 12;
    pronoun = 'pm';
  } else {
    pronoun = 'am';
  }
  day %= 7;
  day = getDay(day);

  const string = `${day}, ${hours}.${minutes} ${pronoun}`;
  document.querySelector('.hinfo__time').textContent = string;
}

function getDay(day) {
  switch (day) {
    case 0:
      day = 'Sun';
      break;
    case 1:
      day = 'Mon';
      break;
    case 2:
      day = 'Tue';
      break;
    case 3:
      day = 'Wen';
      break;
    case 4:
      day = 'Thu';
      break;
    case 5:
      day = 'Fri';
      break;
    case 6:
      day = 'Sat';
      break;
  }
  return day;
}

document.querySelector('.menu').addEventListener('click', openMenu);

function openMenu() {
  document.querySelector('.content--2').classList.toggle('open-menu');
  document.querySelector('.menu').classList.toggle('open-hamburger');
}
