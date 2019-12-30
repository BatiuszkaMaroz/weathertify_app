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
    document.querySelector('main').style.display = 'block';
    DOM.get('hcity').textContent = `${curdata.name}`;
    DOM.get('tweather').textContent = `${curdata.weather[0].main}`;
    DOM.get('ttemp').textContent = `${(curdata.main.temp).toFixed(0)}°`;
    DOM.get('thigh').textContent = `${(curdata.main.temp_max).toFixed(0)}°`;
    DOM.get('tlow').textContent = `${(curdata.main.temp_min).toFixed(0)}°`;
    DOM.get('ticon').setAttribute('src', `http://openweathermap.org/img/wn/${curdata.weather[0].icon}@2x.png`);

    for(let i = 0; i < 9; i++) {
      const element = document.importNode(document.querySelector('.future--node').content, true);
      element.querySelector('.future__day--temperature').textContent = `${(longdata.list[i].dt_txt).slice(11, 16)}`;
      element.querySelector('.future__day--hour').textContent = `${(longdata.list[i].main.temp).toFixed(0)}°`;
      element.querySelector('.future__day--icon').setAttribute('src', `http://openweathermap.org/img/wn/${longdata.list[i].weather[0].icon}@2x.png`);
      document.querySelector('.future').append(element);
    }
  }

  //Fetches Current Geolocalization
  getGeo = () => {
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
  };

  callServer = (lati, long) => {
    const promise = new Promise((resolve, reject) => {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&APPID=7fa3cf512c6e4d72224e3dccc9e8cb2b`)
      .then(data => data.json())
      .then(data => resolve(data));
    })
    return promise;
  };

  callServer2 = (lati, long) => {
    const promise = new Promise((resolve, reject) => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=metric&APPID=7fa3cf512c6e4d72224e3dccc9e8cb2b`)
      .then(data => data.json())
      .then(data => resolve(data));
    })
    return promise;
  };

  fetchData = () => {
    document.querySelector('.loader').style.display = 'block';
    document.querySelector('.search').style.pointerEvents = 'none';
    const geolocation = this.getGeo();
    geolocation
    .then(data => {
      this.lati = data.coords.latitude;
      this.long = data.coords.longitude;
      return this.callServer(this.lati, this.long);
    })
    .then(data => {
      this.longdata = data;
      return this.callServer2(this.lati, this.long);
    })
    .then(data => {
      document.querySelector('.loader').style.display = '';
      this.updateDOM(data, this.longdata, this.DOMmap);
    });
    document.querySelector('.search').style.pointerEvents = '';
  };



  //api.openweathermap.org/data/2.5/weather?lat=35&lon=139


  setListener() {
    document.querySelector('.search').addEventListener('click', this.fetchData);
  }
}

class App {
  static init() {
    const fetcher = new Fetcher();
    setInterval(()=> {
      updateDate();
    }, 30000);
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

  if(minutes < 10) {
    minutes = '0' + minutes;
  }
  if(hours > 12) {
    hours -= 12;
    pronoun = 'pm';
  }
  else {
    pronoun = 'am';
  }
  switch(day) {
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

  const string = `${day}, ${hours}.${minutes} ${pronoun}`;
  document.querySelector('.hinfo__time').textContent = string;
}
