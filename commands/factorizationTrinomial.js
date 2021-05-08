exports.name = ['trinomial']
exports.permission = 'none'
exports.slash = {
    name: 'trinomial',
    description: 'Gives a factorisation trinomial question and answer',
    options: [{
        name: 'difficulty',
        type: 'STRING',
        description: 'easy/medium/hard',
        required: true
    }]
}
exports.handler = function(message) {
	let a,b,c,r11,r12,r21,r22; 
	let r1,r2;
	var diff = message.content.replace('!trinomial ', '');
	if (diff == 'easy' || diff == 'medium' || diff == 'hard') {
		setDifficulty(diff);
	} else {
		return;
	}

	/*
	 * Method to set the difficulty of the Factorization Trinomial(ax^2 +bx+c) object.
	 * Setting the different difficulties does the following:  
	 * </p>easy-sets the roots to be integers between in the range  [-10,10], and the a coefficient to 1<p>
	 * </p>medium-sets the roots to be integers between in the range  [-25,25], and the a coefficient to 1<p>
	 * </p>hard-sets the roots to be rational numbers between in the range  [-15,15]<p>
	 * @param difficulty the difficulty of which the problem is set to, which can be easy, medium or hard 
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
			r21 = (Math.ceil(Math.random()*50) -25);;
			r22 = 1;
			while (r11 == 0 || r21 == 0 || r11 == (-1*r21)) {
				r11 = (Math.ceil(Math.random()*60) -30);
				r12 = 1;
				r21 = (Math.ceil(Math.random()*60) -30);;
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

	function FixCoeff(x) {
		resultCof = '';
		if(Math.abs(x) == 1) {
			if(x < 0) resultCof = '-';
		} else {
			resultCof = x.toString();
		}
		return resultCof;
	}

	function FixMinus(x) {
		return x < 0 ? `+ ${Math.abs(x).toString()}` : `- ${Math.abs(x).toString()}`;
	}

	function FixCoeffMinus(x) {
		resultCof = '+ ';
		if(Math.abs(x) == 1) {
			if(x < 0) resultCof = '- ';
		} else{
			resultCof = `${x > 0 ? '+ ' : '- '}${Math.abs(x).toString()}`;
		}
		return resultCof
	}

	/*Generates the factorisation question as string using generated values for a,b,c
	 * Returns the factorisation question in the form ax^2 + bx + c
	 */
	function QToString() {
		return `${FixCoeff(a)}x^2 ${FixCoeffMinus(b)}x ${FixCoeffMinus(c)}`;
	}
	
	/*Generates the factorisation answer as string using generated values for a,b,c dependent on the difficulty
	 *@return Returns the factorisation answer in the form (mx-r1)(nx-r2) dependent on the difficulty
	 */
	function AnsToString(diff)  {
		ans = "Default Trinomial Answer";
		if(diff == 'easy') {
			ans = `(x ${FixMinus(r1)})(x ${FixMinus(r2)})`;
		} else if (diff == 'medium') {
			ans = `(x ${FixMinus(r1)})(x ${FixMinus(r2)})`;
		} else if(diff == 'hard') { 
			ans = `(${FixCoeff(r12)}x ${FixMinus(r11)})(${FixCoeff(r22)}x ${FixMinus(r21)})`;
		}
		return ans;	
	}

    var content = `Question: ${QToString()}\nAnswer: ||${AnsToString(diff)}||`;
    if (message.interaction) {
        message.interaction.editReply(content);
    } else {
        message.channel.send(content);
    }
}
