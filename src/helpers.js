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
