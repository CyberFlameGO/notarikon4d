/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react';

export default class Modal extends Component {
  static propTypes = {
    setDifficulty: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    difficulty: PropTypes.number.isRequired,
    isMostDifficult: PropTypes.bool.isRequired,
    fireworks: PropTypes.bool.isRequired,
  };

  render() {
    const { difficulty: dif, setDifficulty, isMostDifficult, fireworks, close } = this.props;
    return (
      <div className="modal-wrapper">
        <div className="modal">
          <h2>Congratulations, you did it!</h2>
          {!isMostDifficult && !fireworks && <div>
            Now try a harder one.
            <button className="modal__btn" onClick={() => setDifficulty(dif + 1)}>Bring it on.</button>
          </div>}

          {fireworks && <div className="modal__doneall">
            You&apos;ve completed every level! You&apos;re the best!
          </div>}

          <button className="modal__close" onClick={close}>Close</button>
        </div>
        <div onClick={close} className="modal__overlay" />
      </div>
    );
  }
}
