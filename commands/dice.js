exports.commands = {'roll': 'none'};
exports.buttons = {};
exports.slashes =  [];
exports.commandHandler = function(message) {
  // var diceMatch = /!(?:r )?(?:roll )?(\d+)(d)(\d+)/g.exec(message.content.toLowerCase());
  // if (diceMatch) {
  //  var args = message.content.toLowerCase().replace(diceMatch[0], '');
  //  var plus = /\+(\d+)/g.exec(args);
  //  var minus = /\-(\d+)/g.exec(args);
  //  var remov = /d(\d+)/g.exec(args);
  //  var rolled = [];
  //  var sum = 0;

  //  if (!plus) plus = [undefined, undefined];
  //  if (!minus) minus = [undefined, undefined];
  //  if (!remov) remov = [undefined, undefined];

  //  if (plus[1]) sum = sum + parseInt(plus[1]);
  //  if (minus[1]) sum = sum - parseInt(minus[1]);
  //  if (parseInt(diceMatch[1]) <= 100 && parseInt(diceMatch[1]) >= 1) {
  //    if (parseInt(diceMatch[3]) <= 1000 && parseInt(diceMatch[3]) >= 1) {
  //      for (var i = 0; i < parseInt(diceMatch[1]); i++) {
  //        var roll = Math.round(Math.random() * (parseInt(diceMatch[3])-1))+1;
  //        rolled.push(roll);
  //        sum += roll;
  //      }
  //      if (remov[1]) {
  //        if (parseInt(remov[1]) <= rolled.length) {
  //          var sorted = rolled.sort((a, b)=>a-b);
  //          var removed = sorted.slice(0, parseInt(remov[1]));
  //          var newRolled = sorted.slice(parseInt(remov[1]));
  //          for (var i = 0; i < removed.length; i++) sum = sum-removed[i];
  //          message.channel.send(`**Rolling ${diceMatch[1]} dice of ${diceMatch[3]} sides${(plus[1]) ? ' then adding '+plus[1] : ''}${(minus[1]) ? ' then subtracting '+minus[1] : ''}${(remov[1]) ? ' then removing the '+((parseInt(remov[1]) > 1) ? parseInt(remov[1])+' ' : '')+'lowest dice' : ''}**\nDice: ${shuffle(newRolled).join(', ')}\nRemoved dice: ${shuffle(removed).join(', ')}\nResult: **${sum}**`);
  //        } else {
  //          message.channel.send('Can\'t remove more than rolled');
  //        }
  //      } else {
  //        message.channel.send(`**Rolling ${diceMatch[1]} dice of ${diceMatch[3]} sides${(plus[1]) ? ' then adding '+plus[1] : ''}${(minus[1]) ? ' then subtracting '+minus[1] : ''}**\nDice: ${rolled.join(', ')}\nResult: **${sum}**`);
  //      }
  //    } else {
  //      message.channel.send('Maximum of 1000 sides, Minimum of 1 sides');
  //    }
  //  } else {
  //    message.channel.send('Maximum of 100 dice, Minimum of 1 dice');
  //  }
  // }
};
