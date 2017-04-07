import React, { Component } from 'react';
import { OrderedSet } from 'immutable';
import classnames from 'classnames';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import c from './constants';
import h from './helpers';
import Modal from './Modal';
import Firework from './Firework';

function pushToEditor(editorState, text, styles) {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const ncs = Modifier.insertText(contentState, selection, text, styles);
  return EditorState.push(editorState, ncs, 'insert-fragment');
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      difficulty: 1,
      words: [],
      typing: false,
      hasWon: [false, false, false, false, false],
      modal: false,
    };

    this.onChange = this.onChange.bind(this);
    this.addSpace = this.addSpace.bind(this);
    this.insertText = this.insertText.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.setDifficulty = this.setDifficulty.bind(this);
    this.done = this.done.bind(this);
  }

  componentDidMount() {
    this.editor.focus();
  }

  onChange(editorState) {
    const { difficulty: dif, typing } = this.state;
    if (typing) return;

    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();

    const newWords = c.words[dif].filter(((w) => {
      const re = new RegExp(`\\b${w}\\b`, 'gi');
      return text.search(re) > -1;
    }));

    this.setState({ editorState, words: newWords });
  }

  setDifficulty(difficulty) {
    const dif = parseInt(difficulty, 10);
    this.setState({
      difficulty: dif,
      editorState: EditorState.createEmpty(),
      words: [],
      modal: false,
    }, () => {
      this.editor.focus();
    });
  }

  addSpace() {
    const { editorState } = this.state;
    const es = pushToEditor(editorState, ' ');

    this.setState({ editorState: es, typing: false }, () => {
      this.editor.focus();
    });
  }

  insertText(word) {
    const { words, editorState: e, typing } = this.state;
    if (typing) return;

    this.setState({ words: [...words, word], typing: true });

    const cs = e.getCurrentContent();
    const text = cs.getPlainText();
    const letters = text.endsWith(' ') ? word.split('') : [' ', ...word.split('')];

    let i = 0;
    const letterTimer = setInterval(() => {
      const { editorState } = this.state;
      const es = pushToEditor(editorState, letters[i], OrderedSet.of('BOLD'));

      this.setState({ editorState: es }, () => {
        i = i + 1; // eslint-disable-line operator-assignment
        if (i === letters.length) {
          clearInterval(letterTimer);
          this.addSpace();
        }
      });
    }, c.typeSpeed);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  done() {
    const { hasWon, difficulty, words } = this.state;
    if (c.words[difficulty].length === words.length) {
      this.setState({ hasWon: [
        ...hasWon.slice(0, difficulty - 1),
        true,
        ...hasWon.slice(difficulty),
      ],
        modal: true,
      });
    }
  }

  render() {
    const { difficulty: dif, words, hasWon, modal } = this.state;
    const hasWord = w => words.indexOf(w) > -1;
    const canComplete = c.words[dif].length === words.length;
    const difs = Object.keys(c.words);

    return (
      <main className="main">
        {modal &&
          <Modal
            isMostDifficult={dif === difs.length}
            setDifficulty={this.setDifficulty}
            fireworks={hasWon.every(v => v)}
            difficulty={dif}
            close={() => this.setState({ modal: false })}
          />}
        <aside className="aside">
          <h1>Notarikon</h1>
          <div className="aside__btns">
            {c.words[dif].map(w => <button className="btn" disabled={hasWord(w)} onClick={() => this.insertText(w)} key={w}>{w}</button>)}
          </div>
          <div className="difficulty-wrapper">
            <span>Difficulty:</span>
            {difs.map((d, i) => {
              const classes = classnames(
                'difficulty__btn',
                { 'is-active': dif === parseInt(d, 10) },
                { 'has-won': hasWon[i] },
              );
              return (
                <button
                  key={d}
                  className={classes}
                  onClick={() => this.setDifficulty(d)}
                  title={i + 1}
                />
              );
            })}
          </div>
        </aside>
        <section>
          <Editor
            ref={(r) => { this.editor = r; }}
            customStyleMap={{ BOLD: { fontWeight: 700, color: 'white' } }}
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
          />
          <button className="btn" disabled={!canComplete} onClick={() => this.done()}>Done</button>
        </section>

        {hasWon.every(v => v) && <div className="fireworks">
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
          <Firework fill={h.getRandomColor()} />
        </div>}
      </main>
    );
  }
}
