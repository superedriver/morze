import React, { Component } from 'react';
import Kefir from 'kefir';
import './App.css';
import morse from '../morze.png'
import {
  CODE_TO_LETTER,
  DOT,
  DASH,
  ERROR,
  DOT_DURATION,
  BUTTON_CODE,
} from '../constants';

// additional code
const getSymbol = symbolDuration => symbolDuration <= DOT_DURATION ? DOT : DASH;
const isPauseShort = pause => pause < DOT_DURATION;
const INITIAL_STATE = {
  symbol: '',
  letterCode: '',
  word: '',
  startKeyDown: null,
  startKeyUp: null,
};

class App extends Component {

  constructor() {
    super();

    this.state = INITIAL_STATE;

    this.handleSpaceDown = this.handleSpaceDown.bind(this);
    this.handleSpaceUp = this.handleSpaceUp.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.updateLetter = this.updateLetter.bind(this);
    this.updateWord = this.updateWord.bind(this);
  }

  componentWillMount() {
    Kefir.fromEvents(document.body, 'keydown')
      .filter(event => event.keyCode === BUTTON_CODE)
      .onValue(this.handleSpaceDown);
    Kefir.fromEvents(document.body, 'keyup')
      .filter(event => event.keyCode === BUTTON_CODE)
      .onValue(this.handleSpaceUp);
  }

  updateLetter(e) {
    const { symbol, letterCode } = this.state;

    this.setState({
      ...this.state,
      startKeyDown: e.timeStamp,
      startKeyUp: null,
      symbol: '',
      letterCode: letterCode + symbol,
    });
  }

  updateWord(e) {
    const { symbol, word, letterCode } = this.state;
    const letter = CODE_TO_LETTER[letterCode + symbol] || ERROR;

    this.setState({
      ...this.state,
      startKeyDown: e.timeStamp,
      startKeyUp: null,
      symbol: '',
      letterCode: '',
      word: word + letter,
    });
  }

  handleSpaceDown(e) {
    const { startKeyUp, startKeyDown } = this.state;

    if (!startKeyDown && startKeyUp) {
      const pauseDuration = e.timeStamp - startKeyUp;

      if(isPauseShort(pauseDuration)) {
        this.updateLetter(e);
      } else {
        this.updateWord(e);
      }
    } else if (!startKeyDown && !startKeyUp) {
      this.setState({
        ...this.state,
        startKeyDown: e.timeStamp,
      });
    }
  }

  handleSpaceUp(event) {
    const startKeyUp = event.timeStamp;
    const { startKeyDown } = this.state;
    const symbol = getSymbol(startKeyUp - startKeyDown);

    this.setState({
      startKeyDown: null,
      startKeyUp,
      symbol,
    });
  }

  handleClearClick() {
    this.setState(INITIAL_STATE);
  }

  render() {
    const { word, startKeyDown } = this.state;
    const rectClassName = startKeyDown
      ? '-red'
      : '-green';

    return (
      <div className="App">
        <h1>Use SPACE button for Morzing</h1>
        <img
          src={morse}
          alt="morse code"
          width="300"
        />
        <br/>
        <div className={`rectangle ${rectClassName}`} />
        <br/>
        <button onClick={this.handleClearClick}>
          Clear
        </button>
        <h2>{ word }</h2>
      </div>
    );
  }
}

export default App;
