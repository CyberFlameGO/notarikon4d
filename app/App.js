import React, { Component } from 'react';
import { OrderedSet } from 'immutable';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';
import c from './constants';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty(), difficulty: 1, words: [] };
    this.onChange = this.onChange.bind(this);
    this.insertText = this.insertText.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.setDifficulty = this.setDifficulty.bind(this);
  }

  componentDidMount() {
    this.editor.focus();
  }

  onChange(editorState) {
    const { difficulty: dif } = this.state;
    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();

    const newWords = c.words[dif].map(((w) => {
      const re = new RegExp(`\\b${w}\\b`, 'g');
      if (text.search(re) > -1) return w;
      return undefined;
    }));

    this.setState({ editorState, words: newWords });
  }

  setDifficulty(difficulty) {
    this.setState({ difficulty, editorState: EditorState.createEmpty() });
  }

  insertText(word) {
    const { words } = this.state;
    this.setState({ words: [...words, word] });

    const letters = [...word.split(''), ' '];

    let i = 0;
    const letterTimer = setInterval(() => {
      const { editorState } = this.state;
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const ncs = Modifier.insertText(contentState, selection, letters[i], OrderedSet.of('BOLD'));
      const es = EditorState.push(editorState, ncs, 'insert-fragment');
      this.setState({ editorState: es }, () => {
        i = i + 1;
        if (i === letters.length) {
          clearInterval(letterTimer);
          this.editor.focus();
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
    const { difficulty: dif, words } = this.state;
    const hasWord = w => words.indexOf(w) > -1;
    const difs = [1, 2, 3, 4, 5];
    return (
      <main className="main">
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
