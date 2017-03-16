import 'babel-polyfill';
import './main.scss';
import * as h from './helpers';

const dif = h.getUrlParameter('difficulty') ? parseInt(h.getUrlParameter('difficulty'), 10) : 1;
document.querySelector(`.difficulty__link[data-difficulty="${dif}"]`).classList.add('is-active');

const textarea = document.querySelector('.textarea');
window.onload = () => { textarea.focus() };

const nbsp = '\xa0';
const typeSpeed = 50;
const words = {
  1: [
    'bob',
    'car',
    'I',
    'today',
  ],
  2: [
    'story',
    'sandwich',
    'hospital',
    'television',
  ],
  3: [
    'running',
    'zimbabwe',
    'salmon',
    'functional programming',
  ],
  4: [
    'elephant',
    'coroner',
    'presidential campaign',
    'yodeling',
  ],
  5: [
    'aliens',
    'potatoes',
    'gentrification',
    'music',
    'Jay-Z',
    'notarikon',
    'cliffhanger',
  ],
};

const numberOfButtons = words[dif].length;
const aside = document.querySelector('.aside');
const btns = aside.querySelector('.aside__btns');
let flag = false;

textarea.onkeypress = (e) => {
  if (flag) e.preventDefault();
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
        h.newSpace(textarea).then(() => resolve());
      }
    }, typeSpeed);
  })
}

for (let i = 0; i < words[dif].length; i++) {
  h.newBtn(words[dif][i], btns);
}

document.querySelectorAll('.btn').forEach(btn => btn.onclick = async () => {
  if (flag) return;
  const letters = btn.textContent.split('');
  const inner = textarea.innerHTML;

  let l = letters;
  if (!inner.endsWith('<span>&nbsp;</span>') && !inner.endsWith('&nbsp;')) {
    l = [nbsp, ...letters];
  }

  newWord(l).then(() => {
    h.placeCaretAtEnd(textarea);
    if (textarea.innerHTML.includes(`${btn.textContent}</strong>`)) {
      btn.classList.add('has-been-used');
    }
  });
});
