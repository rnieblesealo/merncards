require('express');
require('mongodb');

exports.setApp = function(app, client) {
  var cardList =
    [
      'Roy Campanella',
      'Paul Molitor',
      'Tony Gwynn',
      'Dennis Eckersley',
      'Reggie Jackson',
      'Gaylord Perry',
      'Buck Leonard',
      'Rollie Fingers',
      'Charlie Gehringer',
      'Wade Boggs',
      'Carl Hubbell',
      'Dave Winfield',
      'Jackie Robinson',
      'Ken Griffey, Jr.',
      'Al Simmons',
      'Chuck Klein',
      'Mel Ott',
      'Mark McGwire',
      'Nolan Ryan',
      'Ralph Kiner',
      'Yogi Berra',
      'Goose Goslin',
      'Greg Maddux',
      'Frankie Frisch',
      'Ernie Banks',
      'Ozzie Smith',
      'Hank Greenberg',
      'Kirby Puckett',
      'Bob Feller',
      'Dizzy Dean',
      'Joe Jackson',
      'Sam Crawford',
      'Barry Bonds',
      'Duke Snider',
      'George Sisler',
      'Ed Walsh',
      'Tom Seaver',
      'Willie Stargell',
      'Bob Gibson',
      'Brooks Robinson',
      'Steve Carlton',
      'Joe Medwick',
      'Nap Lajoie',
      'Cal Ripken, Jr.',
      'Mike Schmidt',
      'Eddie Murray',
      'Tris Speaker',
      'Al Kaline',
      'Sandy Koufax',
      'Willie Keeler',
      'Pete Rose',
      'Robin Roberts',
      'Eddie Collins',
      'Lefty Gomez',
      'Lefty Grove',
      'Carl Yastrzemski',
      'Frank Robinson',
      'Juan Marichal',
      'Warren Spahn',
      'Pie Traynor',
      'Roberto Clemente',
      'Harmon Killebrew',
      'Satchel Paige',
      'Eddie Plank',
      'Josh Gibson',
      'Oscar Charleston',
      'Mickey Mantle',
      'Cool Papa Bell',
      'Johnny Bench',
      'Mickey Cochrane',
      'Jimmie Foxx',
      'Jim Palmer',
      'Cy Young',
      'Eddie Mathews',
      'Honus Wagner',
      'Paul Waner',
      'Grover Alexander',
      'Rod Carew',
      'Joe DiMaggio',
      'Joe Morgan',
      'Stan Musial',
      'Bill Terry',
      'Rogers Hornsby',
      'Lou Brock',
      'Ted Williams',
      'Bill Dickey',
      'Christy Mathewson',
      'Willie McCovey',
      'Lou Gehrig',
      'George Brett',
      'Hank Aaron',
      'Harry Heilmann',
      'Walter Johnson',
      'Roger Clemens',
      'Ty Cobb',
      'Whitey Ford',
      'Willie Mays',
      'Rickey Henderson',
      'Babe Ruth'
    ];

  app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error

    const { userId, card, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: 'The JWT is no longer valid', jwtToken: '' };
        res.status(200).json(r);
        return;
      }
    }
    catch (e) {
      console.log(e.message);
    }

    const newCard = { Card: card, UserId: userId };
    var error = '';

    try {
      const db = client.db();
      const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
      error = e.toString();
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
      console.log(e.message);
    }

    var ret = { error: error, jwtToken: refreshedToken };

    res.status(200).json(ret);
  });

  app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { login, password } = req.body;

    const db = client.db('COP4331Cards');
    const results = await db.collection('Users').find({ Login: login, Password: password }).toArray();

    var id = -1;
    var fn = '';
    var ln = '';

    var ret;

    if (results.length > 0) {
      id = results[0].UserId;
      fn = results[0].FirstName;
      ln = results[0].LastName;

      console.log("HERE!!!!")

      try {
        const token = require("./create-jwt.js");
        ret = token.createToken(fn, ln, id);
      }
      catch (e) {
        ret = { error: e.message };
      }
    }
    else {
      ret = { error: "Login/Password incorrect" };
    }

    res.status(200).json(ret);
  });

  app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const { userId, search, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: 'The JWT is no longer valid', jwtToken: '' };
        res.status(200).json(r);
        return;
      }
    }
    catch (e) {
      console.log(e.message);
    }

    var _search = search.trim();

    const db = client.db();
    const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'i' } }).toArray();

    var _ret = [];
    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i].Card);
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
      console.log(e.message);
    }

    var ret = { results: _ret, error: error, jwtToken: refreshedToken };

    res.status(200).json(ret);
  });
}
