var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


const PORT = 1515;

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

// var corsOptions = {
//     origin: 'http://localhost:3000'
// };

var corsOptions = {
    origin: '*',
    methods: 'GET,POST'
}
app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/ForumApp', {useNewUrlParser: true, useUnifiedTopology: true})
        .catch(error => {console.log(error)});

var commentSchema = mongoose.Schema({
    user: String,
    comment: String
});

var Comment = mongoose.model("Comment", commentSchema);

var userSchema = new mongoose.Schema({
    name: String,
    alias: String,
    password: String
});

var User = mongoose.model('User', userSchema);

app.get('/', function(req, res) {
    res.send("express server")
});

app.get('/viewcomments', function(req,res){
    Comment.find(function(err,response){
        if(err){
            console.log(err);
            res.send("Error on server");
        }else{
            res.send(response);
        }
    })
});

app.post('/addcomment', function(req,res){
    
    var newComment = new Comment(req.body);

    if(!newComment.user || !newComment.comment){
        res.send({message: "need valid input"});
    }else{
        newComment.save()
        .then( () => {
            res.send("comment saved to database");
        }).catch( () => {
            res.send("unable to save to database");
        });
    }
});

app.post('/login',function(req,res){
    var requestedUser = req.body;
    console.log(requestedUser);
    // User.find({name: requestedUser.name, password: requestedUser.password}, 
    //     (err, response) => {
    //         if(err){
    //             console.log(err);
    //             res.send('error on server');
    //         }else{
    //             console.log(response);
    //             res.send({name: response.name, alias: response.alias});
    //         }
    //     });
    User.find({'name': requestedUser.name, 'password': requestedUser.password}).select('name alias').exec((err ,response) => {
        try{
            console.log(response);
            res.send(response);
        }catch(err){
            res.send('error occured');
        }
    });
    
   
});

app.listen(PORT, () => {
    console.log('app listening on port ', PORT);
});