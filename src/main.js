import 'babel-polyfill';
import './main.scss';

const nbsp = '\xa0';
const typeSpeed = 50;
const numberOfButtons = 4;

const words = [
  'glass',
  'car',
  'cat',
  'xeroradiography',
];

const textarea = document.querySelector('.textarea');
const aside = document.querySelector('.aside');
const btns = aside.querySelector('.aside__btns');
let flag = false;

textarea.onkeypress = (e) => {
  if (flag) e.preventDefault();
}

function rando(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function newBtn() {
  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.innerHTML = rando(words);

  btns.appendChild(btn);
}

function newSpace() {
  return new Promise((resolve) => {
    const space = document.createElement('span');
    space.textContent = nbsp;
    textarea.appendChild(space);
    resolve();
  });
}

function newWord(letters) {
  flag = true;
  return new Promise((resolve) => {
    const word = document.createElement('strong');
    word.classList.add('word');
    textarea.appendChild(word);

    let i = 0;
    const letterTimer = setInterval(() => {
      word.textContent += letters[i];
      i = i + 1;

      if (i === letters.length) {
        clearInterval(letterTimer);
        flag = false;
        newSpace().then(() => resolve());
      }
    }, typeSpeed);
  })
}

for (let i = 0; i < numberOfButtons; i++) {
  newBtn();
}

function placeCaretAtEnd(el, start = false) {
  let range;
  let selection;
  if(document.createRange) {
    range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(start);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if(document.selection) { 
    range = document.body.createTextRange();
    range.moveToElementText(el);
    range.collapse(start);
    range.select();
  }
}

document.querySelectorAll('.btn').forEach(btn => btn.onclick = async () => {
  const letters = btn.textContent.split('');
  newWord(letters).then(() => placeCaretAtEnd(textarea));
});
