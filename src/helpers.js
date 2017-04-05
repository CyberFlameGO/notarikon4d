const nbsp = '\xa0';

export function getUrlParameter(name, str = location.search) {
  const filteredName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${filteredName}=([^&#]*)`);
  const results = regex.exec(str);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function rando(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function newBtn(word, btns) {
  const btn = document.createElement('button');
  btn.classList.add('btn');
  btn.innerHTML = word;

  btns.appendChild(btn);
}

export function newSpace(textarea) {
  return new Promise((resolve) => {
    const space = document.createElement('span');
    space.textContent = nbsp;
    textarea.appendChild(space);
    resolve();
  });
}

export function placeCaretAtEnd(el, start = false) {
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
