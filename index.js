var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


const port = 1515;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var whitelist = ['http://localhost:3000'];

// var corsOptions = {
//     origin: function (origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true)
//       } else {
//         callback(new Error('Not allowed by CORS'))
//       }
//     }
// }

// app.use(cors(corsOptions));


mongoose.connect('mongodb://localhost:27017/ForumApp', {useNewUrlParser: true})
        .catch(error => {console.log(error)});

var commentSchema = new mongoose.Schema({
    user: String,
    comment: String
});

var Comment = mongoose.model("comments", commentSchema);

var userSchema = new mongoose.Schema({
    name: String,
    alias: String,
    password: String
});

var User = mongoose.model('users', userSchema);


app.get('/viewcomments', function(req,res){
    Comment.find(function(err,response){
        res.json(response);
    })
});

app.post('/addcomment', function(req,res){
    
    var newComment = new Comment(req.body);

    if(!newComment.user || !newComment.comment){
        res.render("show_message", {message: "not valid info", type:"error"} )
    }else{
        newComment.save()
        .then( () => {
            res.send("comment saved to database");
        }).catch( () => {
            res.status(400).send("unable to save to database");
        });
    }
});

app.post('/login',function(req,res){
    console.log(User);

    var requestedUser = new User(req.body);

    if(!requestedUser.name || !requestedUser.password){
        res.status(404).send("no valid input");
    }
    else{
        User.find({name: requestedUser.name, password: requestedUser.password},
            (err, response) => {
                try{
                    if(response.length<1){
                        res.send('user not in db')
                    }else{
                        res.send(response);
                    }
                }catch(err){
                    console.log('Error occured: \n'+err);
                }
                
            });
    }
});

app.get('/', function(req, res) {
    res.send("express server")
});

app.listen(port, () => {
    console.log('app listening on port ',port);
});