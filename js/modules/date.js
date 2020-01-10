export function updateDate() {
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

export function getDay(day) {
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