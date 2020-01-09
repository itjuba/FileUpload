const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');

const port = process.env.PORT || 8002;
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const DIR = './public/uploads';
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

app.get('/',(req,res)=>{
    res.render('html.ejs');
})

app.post('/upload-profile-pic', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');

    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            console.log(global.erreur);
            console.log(req.fileValidationError);
            return res.send(req.fileValidationError);
               }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            console.log(err);
            return res.send(err);


        }
        else if (err) {
            console.log(err);
            return res.send(err);

        }
        var file = `uploads/${req.file.filename}` ;
        console.log(file);
        console.log(DIR);

        // console.log(err);
        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="${req.file.filename()}" width="500"><hr /><a href="./">Upload another image</a>`);
        res.render('image.ejs',{
            file: file

        })

    });


});

app.listen(port , () => console.log('App listening on port ' + port));











