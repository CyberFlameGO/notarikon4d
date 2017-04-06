import React, { Component } from 'react';
import { OrderedSet } from 'immutable';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import c from './constants';

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
      hasWon: false,
    };

    this.onChange = this.onChange.bind(this);
    this.addSpace = this.addSpace.bind(this);
    this.insertText = this.insertText.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.setDifficulty = this.setDifficulty.bind(this);
  }

  componentDidMount() {
    this.editor.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    const { words, difficulty, hasWon } = this.state;
    if (!hasWon && !prevState.hasWon && words.length === c.words[difficulty].length) {
      this.setState({ hasWon: true }); // eslint-disable-line react/no-did-update-set-state
    }
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
    this.setState({ difficulty, editorState: EditorState.createEmpty(), words: [] });
  }

  addSpace() {
    const { editorState } = this.state;
    const es = pushToEditor(editorState, ' ');

    this.setState({ editorState: es, typing: false }, () => {
      this.editor.focus();
    });
  }

  insertText(word) {
    const { words, editorState: e } = this.state;
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

  render() {
    const { difficulty: dif, words, hasWon } = this.state;
    const hasWord = w => words.indexOf(w) > -1;
    const difs = [1, 2, 3, 4, 5];

    return (
      <main className="main">
        {hasWon && <h1>You win!</h1>}
        <aside className="aside">
          <h1>Notarikon</h1>
          <div className="aside__btns">
            {c.words[dif].map(w => <button className="btn" disabled={hasWord(w)} onClick={() => this.insertText(w)} key={w}>{w}</button>)}
          </div>
          <div className="difficulty-wrapper">
            <span>Difficulty:</span>
            {difs.map((d, i) =>
              <button key={d} className={`difficulty__btn ${dif === d && 'is-active'}`} onClick={() => this.setDifficulty(d)} title={i + 1} />)}
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
        </section>
      </main>
    );
  }
}
