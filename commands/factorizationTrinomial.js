exports.commands = {'trinomial': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'trinomial',
  description: 'Gives a factorisation trinomial question and answer',
  options: [{
    name: 'difficulty',
    type: 'STRING',
    description: 'Difficulty of the trinomial question',
    required: true,
    choices: [{
      name: 'Easy',
      value: 'easy',
    }, {
      name: 'Medium',
      value: 'medium',
    }, {
      name: 'Hard',
      value: 'hard',
    }],
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.defer();

  let a; let b; let c; let r11; let r12; let r21; let r22;
  let r1; let r2;
  const diff = interaction.options.get('difficulty').value;
  if (diff == 'easy' || diff == 'medium' || diff == 'hard') {
    setDifficulty(diff);
  } else {
    return;
  }

  /**
   * Method to set the difficulty of the Factorization Trinomial(ax^2 +bx+c) object.
   * Setting the different difficulties does the following:
   *  </p>easy-sets the roots to be integers between in the range  [-10,10], and the a coefficient to 1<p>
   *  </p>medium-sets the roots to be integers between in the range  [-25,25], and the a coefficient to 1<p>
   *  </p>hard-sets the roots to be rational numbers between in the range  [-15,15]<p>
   * @param {number} difficulty of which the problem is set to, which can be easy, medium or hard
   */
  function setDifficulty(difficulty) {
    if (difficulty == 'easy') {
      r11 = Math.ceil(Math.random()*20) -10;
      r12 = 1;
      r21 = Math.ceil(Math.random()*20) -10;
      r22 = 1;
      while (r11 == 0 || r21 == 0 || r11 == (-1*r21)) {
        r11 = Math.ceil(Math.random()*20) -10;
        r12 = 1;
        r21 = Math.ceil(Math.random()*20) -10;
        r22 = 1;
      }
      r1 = r11/r12;
      r2 = r21/r22;
      a = r12*r22;
      b = -1*((r12*r21)+(r11*r22));
      c = r11*r21;
    } else if (difficulty == 'medium') {
      r11 = (Math.ceil(Math.random()*50) -25);
      r12 = 1;
      r21 = (Math.ceil(Math.random()*50) -25); ;
      r22 = 1;
      while (r11 == 0 || r21 == 0 || r11 == (-1*r21)) {
        r11 = (Math.ceil(Math.random()*60) -30);
        r12 = 1;
        r21 = (Math.ceil(Math.random()*60) -30); ;
        r22 = 1;
      }
      r1 = r11/r12;
      r2 = r21/r22;
      a = r12*r22;
      b = -1*((r12*r21)+(r11*r22));
      c = r11*r21;
    } else if (difficulty == 'hard') {
      r11 = (Math.ceil(Math.random()*40) -20);
      r12 = (Math.ceil(Math.random()*40) -20);
      r21 = (Math.ceil(Math.random()*40) -20);
      r22 = (Math.ceil(Math.random()*40) -20);
      while (r11 == 0 || r21 == 0 || r12 == 0 || r22 == 0 || (r11/r12) == (-1*(r21/r22))) {
        r11 = (Math.ceil(Math.random()*40) -20);
        r12 =(Math.ceil(Math.random()*40) -20);
        r21 = (Math.ceil(Math.random()*40) -20);
        r22 = (Math.ceil(Math.random()*40) -20);
      }
      r1 = r11/r12;
      r2 = r21/r22;
      a = r12*r22;
      b = -1*((r12*r21)+(r11*r22));
      c = r11*r21;
    }
  }

  /**
   * @param {number} x
   * @return {string}
   */
  function fixCoeff(x) {
    resultCof = '';
    if (Math.abs(x) == 1) {
      if (x < 0) resultCof = '-';
    } else {
      resultCof = x.toString();
    }
    return resultCof;
  }

  /**
   * @param {number} x
   * @return {string}
   */
  function fixMinus(x) {
    return x < 0 ? `+ ${Math.abs(x).toString()}` : `- ${Math.abs(x).toString()}`;
  }

  /**
   * @param {number} x
   * @return {string}
   */
  function fixCoeffMinus(x) {
    resultCof = '+ ';
    if (Math.abs(x) == 1) {
      if (x < 0) resultCof = '- ';
    } else {
      resultCof = `${x > 0 ? '+ ' : '- '}${Math.abs(x).toString()}`;
    }
    return resultCof;
  }

  /**
   * Generates the factorisation question as string using generated values for a,b,c
   * @return {string} factorisation question in the form ax^2 + bx + c
   */
  function qToString() {
    return `${fixCoeff(a)}x^2 ${fixCoeffMinus(b)}x ${fixCoeffMinus(c)}`;
  }

  /**
   * Generates the factorisation answer as string using generated values for a,b,c dependent on the difficulty.
   * @param {number} diff
   * @return {ans} factorisation answer in the form (mx-r1)(nx-r2) dependent on the difficulty
   */
  function ansToString(diff) {
    ans = 'Default Trinomial Answer';
    if (diff == 'easy') {
      ans = `(x ${fixMinus(r1)})(x ${fixMinus(r2)})`;
    } else if (diff == 'medium') {
      ans = `(x ${fixMinus(r1)})(x ${fixMinus(r2)})`;
    } else if (diff == 'hard') {
      ans = `(${fixCoeff(r12)}x ${fixMinus(r11)})(${fixCoeff(r22)}x ${fixMinus(r21)})`;
    }
    return ans;
  }

  interaction.editReply({content: `Question: ${qToString()}\nAnswer: ||${ansToString(diff)}||`});
};
