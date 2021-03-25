  
exports.name = ['trinomial']
exports.permission = 'none'
exports.handler = function(message) {
    let a,b,c,r11,r12,r21,r22; 
    let r1,r2;
    var diff = message.content.replace('!trinomial ', '');
	if (diff != '') {
		setDifficulty(diff)
    }
    
    /*
	 * Method to set the difficulty of the Factorization Trinomial(ax^2 +bx+c) object.
	 * Setting the different difficulties does the following:  
	 * </p>easy-sets the roots to be integers between in the range  [-10,10], and the a coefficient to 1<p>
	 * </p>medium-sets the roots to be integers between in the range  [-25,25], and the a coefficient to 1<p>
	 *  </p>hard-sets the roots to be rational numbers between in the range  [-15,15]<p>
	 * @param difficulty the difficulty of which the problem is set to, which can be easy, medium or hard 
	 */
    function setDifficulty(difficulty) 
	{
		if(difficulty === "easy") 
		{
			r11= (Math.ceil(Math.random()*20) -10);
			r12=1;
			r21=(Math.ceil(Math.random()*20) -10);;
			r22= 1;
			while((r11==0)||(r21==0)||(r11==(-1*r21)))
			{
				r11=(Math.ceil(Math.random()*20) -10);
				r12=1;
				r21= (Math.ceil(Math.random()*20) -10);;
				r22= 1;
			}
			r1 = r11/r12;
			r2 = r21/r22;
			a = r12*r22;
			b = -1*((r12*r21)+(r11*r22));
			c = r11*r21;
		}
		else 
		{
			if(difficulty === "medium") 
			{
				r11= (Math.ceil(Math.random()*50) -25);
				r12=1;
				r21=  (Math.ceil(Math.random()*50) -25);;
				r22= 1;
				while((r11==0)||(r21==0)||(r11==(-1*r21)))
				{
					r11= (Math.ceil(Math.random()*60) -30);
					r12=1;
					r21=  (Math.ceil(Math.random()*60) -30);;
					r22= 1;
				}
				r1 = r11/r12;
				r2 = r21/r22;
				a = r12*r22;
				b = -1*((r12*r21)+(r11*r22));
				c = r11*r21;
			}
			else
			{
				if(difficulty === "hard") 
				{
					r11= (Math.ceil(Math.random()*40) -20);
					r12= (Math.ceil(Math.random()*40) -20);
					r21= (Math.ceil(Math.random()*40) -20);
					r22= (Math.ceil(Math.random()*40) -20);
					while((r11==0)||(r21==0)||(r12==0)||(r22==0)||((r11/r12)==(-1*(r21/r22))))
					{
						r11= (Math.ceil(Math.random()*40) -20);
						r12=(Math.ceil(Math.random()*40) -20);
						r21= (Math.ceil(Math.random()*40) -20);
						r22= (Math.ceil(Math.random()*40) -20);
					}
					r1 = r11/r12;
					r2 = r21/r22;
					a = r12*r22;
					b = -1*((r12*r21)+(r11*r22));
					c = r11*r21;
				}
			}
        }
	}

    /*Generates the factorisation question as string using generated values for a,b,c
	 * Returns the factorisation question in the form ax^2 + bx + c
	 */
	function QToString() 
	{
	return (a.toString()+"x^2 + " +b.toString() +"x + "+ c.toString());
    }
    
    /*Generates the factorisation answer as string using generated values for a,b,c dependent on the difficulty
	 *@return Returns the factorisation answer in the form (mx-r1)(nx-r2) dependent on the difficulty
	 */
	function AnsToString(diff) 
	{
	ans = "Default Trinomial Answer";
	if(diff == "easy") 
	{
		ans =("(x - "+r1.toString()+")( x - "+r2.toString()+")");
	}
	else 
	{
		if(diff == "medium") 
		{
			ans =("(x - "+r1.toString()+")(x - "+r2.toString()+")");
		}
		else
		{
			if(diff == "hard") 
			{
				ans =("("+ r12.toString() + "x - "+r11.toString()+")("+ r22.toString() +"x - "+r21.toString()+")");
			}
		}
	}
	return ans;	
	}

    message.channel.send(`Question: ${QToString()} \n Answer: ${AnsToString(diff)} `)


}
