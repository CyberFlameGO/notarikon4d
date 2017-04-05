const text = document.querySelector('.text');
const response = document.querySelector('.response');

text.onkeyup = e => {
  const { value } = e.target;
  if (value !== '') {
    const words = value.split(' ');
    const letters = words.map(word => word.substr(0, 1));

    fetch(`https://cors-anywhere.herokuapp.com/http://www.anagramica.com/all/${letters.join('')}`)
    .then(res => res.json())
    .then(json => {
      response.classList.remove('empty');
      console.log(json.all);
      response.textContent = json.all[0];
    });
  } else {
    response.classList.add('empty');
    response.textContent = 'Your new word will be here!';
  }
}