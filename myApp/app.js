var express = require('express');
var path = require('path');
var fs = require('fs');
const { fstat } = require('fs');

//if it doesn't work, type into the cmd: npm install express-session
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'nosecretshere',
    resave: true,
    name: "chocolate",
    saveUninitialized: true,
    cookie: {
        secure: false,
    }
}))

app.get('/', function(req, res) {
    res.render('login', { errorMssg: "" })
});

app.get('/registration', function(req, res) {
    res.render('registration', { errorMssg: "" })
});

app.get('/home', function(req, res) {
    res.render('home')
});

app.get('/novel', function(req, res) {
    res.render('novel', );
});


app.get('/flies', function(req, res) {
    res.render('flies', { errorMssg: "" });
});

app.get('/grapes', function(req, res) {
    res.render('grapes', { errorMssg: "" });

});

app.get('/poetry', function(req, res) {
    res.render('poetry', );
});

app.get('/leaves', function(req, res) {
    res.render('leaves', { errorMssg: "" });
});

app.get('/sun', function(req, res) {
    res.render('sun', { errorMssg: "" });

});

app.get('/fiction', function(req, res) {
    res.render('fiction', );
});

app.get('/dune', function(req, res) {
    res.render('dune', { errorMssg: "" });

});

app.get('/mockingbird', function(req, res) {
    res.render('mockingbird', { errorMssg: "" });

});


// if no user is logged in, the readlist link goes back to the login page
app.get('/readlist', function(req, res) {
    if (req.session.user == null) {
        res.redirect('/')
    } else {
        var toRead = new Array();
        var tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
        for (var i in tempRead) {
            if (tempRead[i].User == req.session.user) {
                books = tempRead[i].Books
                codes = tempRead[i].Codes
            }
        }
        res.render('readlist', { books: books, codes: codes });
    }
});

app.get('/searchresults', function(req, res) {
    res.render('searchresults', { books: [], codes: [] });
});

app.get('/search', function(req, res) {
    res.render('searchresults', { books: [], codes: [] });
});

//----------------------------

app.post('/register', function(req, res) {
    var userbtn = req.body.username;
    var passbtn = req.body.password;
    if (userbtn.length == 0) {
        res.render('registration', { errorMssg: "Please Enter The Username" });
        return;
    }
    if (passbtn.length == 0) {
        res.render('registration', { errorMssg: "Please Enter The Password" });
        return;
    }
    var tempUser = JSON.parse(fs.readFileSync("users.json"));
    for (var i in tempUser) {

        if (tempUser[i].Username == userbtn) {
            res.render('registration', { errorMssg: "Username is Used; Please Enter Another One" });
            return;
        }
    }

    tempUser.push({
        Username: userbtn,
        Password: passbtn
    });
    fs.writeFileSync("users.json", JSON.stringify(tempUser));

    var tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    tempRead.push({
        User: userbtn,
        Books: [],
        Codes: []
    })

    fs.writeFileSync("usersRead.json", JSON.stringify(tempRead));
    res.redirect('/')
});


app.post('/', function(req, res) {
    var userlogin = req.body.username;
    var passlogin = req.body.password;

    if (userlogin.length == 0) {
        res.render('login', { errorMssg: "Please Enter The Username" });
        return;
    }
    if (passlogin.length == 0) {
        res.render('login', { errorMssg: "Please Enter The Password" });
        return;
    }
    var tempUser = JSON.parse(fs.readFileSync("users.json"));
    for (var i in tempUser) {
        if (tempUser[i].Username == userlogin && tempUser[i].Password == passlogin) {
            req.session.user = userlogin;
            res.redirect('home')
            return;
        }
    }
    res.render('login', { errorMssg: "Invalid Username or Password" });
    return;
});

//Search button (functionality in searchresults.ejs)
app.post('/search', function(req, res) {
    var searched = (req.body.Search).trim().toLowerCase();
    var books = new Array();
    var codes = new Array();
    var allBooks = JSON.parse(fs.readFileSync("content.json"))
    if (searched.length != 0) {
        for (var i in allBooks) {
            if (allBooks[i].name.toLowerCase().includes(searched)) {
                books.push(allBooks[i].name)
                codes.push(allBooks[i].code)
            }
        }
    }
    res.render('searchresults', { books: books, codes: codes });
});

//ReadList:

app.post('/duneRead', function(req, res) {
    tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    for (var i in tempRead) {
        if (tempRead[i].User == req.session.user && !(tempRead[i].Books.includes("Dune"))) {
            tempRead[i].Books.push("Dune")
            tempRead[i].Codes.push("dune")
            fs.writeFileSync("usersRead.json", JSON.stringify(tempRead))
        } else if (tempRead[i].User == req.session.user && tempRead[i].Books.includes("Dune")) {
            res.render('dune', { errorMssg: "This book is already in your want to read list" })
            return;
        }
    }
    res.redirect('/readlist')
});

app.post('/fliesRead', function(req, res) {
    tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    for (var i in tempRead) {
        if (tempRead[i].User == req.session.user && !(tempRead[i].Books.includes("Lord of the Flies"))) {
            tempRead[i].Books.push("Lord of the Flies")
            tempRead[i].Codes.push("flies")
            fs.writeFileSync("usersRead.json", JSON.stringify(tempRead))
        } else if (tempRead[i].User == req.session.user && tempRead[i].Books.includes("Lord of the Flies")) {
            res.render('flies', { errorMssg: "This book is already in your want to read list" })
            return;
        }
    }
    res.redirect('/readlist')
});

app.post('/grapesRead', function(req, res) {
    tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    for (var i in tempRead) {
        if (tempRead[i].User == req.session.user && !(tempRead[i].Books.includes("The Grape of Wrath"))) {
            tempRead[i].Books.push("The Grape of Wrath")
            tempRead[i].Codes.push("grapes")
            fs.writeFileSync("usersRead.json", JSON.stringify(tempRead))
        } else if (tempRead[i].User == req.session.user && tempRead[i].Books.includes("The Grape of Wrath")) {
            res.render('grapes', { errorMssg: "This book is already in your want to read list" })
            return;
        }
    }
    res.redirect('/readlist')
});

app.post('/leavesRead', function(req, res) {
    tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    for (var i in tempRead) {
        if (tempRead[i].User == req.session.user && !(tempRead[i].Books.includes("Leaves of Grass"))) {
            tempRead[i].Books.push("Leaves of Grass")
            tempRead[i].Codes.push("leaves")
            fs.writeFileSync("usersRead.json", JSON.stringify(tempRead))
        } else if (tempRead[i].User == req.session.user && tempRead[i].Books.includes("Leaves of Grass")) {
            res.render('leaves', { errorMssg: "This book is already in your want to read list" })
            return;
        }
    }
    res.redirect('/readlist')
});

app.post('/mockingbirdRead', function(req, res) {
    tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    for (var i in tempRead) {
        if (tempRead[i].User == req.session.user && !(tempRead[i].Books.includes("To Kill a Mockingbird"))) {
            tempRead[i].Books.push("To Kill a Mockingbird")
            tempRead[i].Codes.push("mockingbird")
            fs.writeFileSync("usersRead.json", JSON.stringify(tempRead))
        } else if (tempRead[i].User == req.session.user && tempRead[i].Books.includes("To Kill a Mockingbird")) {
            res.render('mockingbird', { errorMssg: "This book is already in your want to read list" })
            return;
        }
    }
    res.redirect('/readlist')
});

app.post('/sunRead', function(req, res) {
    tempRead = JSON.parse(fs.readFileSync("usersRead.json"))
    for (var i in tempRead) {
        if (tempRead[i].User == req.session.user && !(tempRead[i].Books.includes("The Sun and Her Flowers"))) {
            tempRead[i].Books.push("The Sun and Her Flowers")
            tempRead[i].Codes.push("sun")
            fs.writeFileSync("usersRead.json", JSON.stringify(tempRead))
        } else if (tempRead[i].User == req.session.user && tempRead[i].Books.includes("The Sun and Her Flowers")) {
            res.render('sun', { errorMssg: "This book is already in your want to read list" })
            return;
        }
    }
    res.redirect('/readlist')
});


if (process.env.PORT) {
    app.listen(process.env.PORT, function() { console.log('Server started') });
} else {
    app.listen(3000, function() { console.log('Server started on port 3000') });
}