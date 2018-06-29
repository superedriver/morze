import React, { Component } from 'react';
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
  startPauseTime: null,
  startPressingTime: null,
  symbol: null,
  letterCode: '',
  word: '',
};

class App extends Component {
  constructor() {
    super();

    this.state = INITIAL_STATE;

    this.handleSpaceDown = this.handleSpaceDown.bind(this);
    this.handleSpaceUp = this.handleSpaceUp.bind(this);
    this.analizeLetterCode = this.analizeLetterCode.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleSpaceDown);
    document.addEventListener('keyup', this.handleSpaceUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleSpaceDown);
    document.removeEventListener('keyup', this.handleSpaceUp);
  }

  analizeLetterCode(letterCode) {
    const letter = CODE_TO_LETTER[letterCode] || ERROR;

    this.setState({
      ...this.state,
      word: this.state.word + letter,
    });
  }

  handleSpaceDown(e) {
    const { startPressingTime, startPauseTime, symbol } = this.state;

    if (!startPressingTime && e.keyCode === BUTTON_CODE) {
      const letterCode = this.state.letterCode + symbol;
      const pauseDuration = Date.now() - startPauseTime;

      if (isPauseShort(pauseDuration)) {
        this.setState({
          ...this.state,
          startPressingTime: Date.now(),
          startPauseTime: null,
          letterCode,
          symbol: null,
        });
      } else {
        this.setState({
          ...this.state,
          startPressingTime: Date.now(),
          startPauseTime: null,
          letterCode: '',
        });

        if (symbol) this.analizeLetterCode(letterCode);
      }
    }
  }

  handleSpaceUp(e) {
    const { startPressingTime } = this.state;
    const symbol = getSymbol(Date.now() - startPressingTime);

    if (startPressingTime && e.keyCode === BUTTON_CODE) {
      this.setState({
        startPressingTime: null,
        startPauseTime: Date.now(),
        symbol,
      });
    }
  }

  handleClearClick() {
    this.setState(INITIAL_STATE);
  }

  render() {
    const { word } = this.state;

    return (
      <div className="App">
        <h1>Use SPACE button for Morzing</h1>
        <img
          src={morse}
          alt="morse code"
          width="300"
        />
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
