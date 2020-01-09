const express = require('express');
const multer = require('multer');
const app = express();
const ejs = require('ejs');
const path = require('path');
var session = require('express-session')
app.locals.errors ;
app.locals.message ;

app.use(session({
    secret: 'keyboard cat',
    resave:true ,
    cookie: { maxAge: 60000  , secure : true },
    saveUninitialized: true
}));

app.use(express.static('./public'));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

const { check, validationResult  , body} = require('express-validator');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init app


// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) =>{
    var title = "";
    var description = "";
    res.render('index',{
        title: title,
        description: description

    });
});

checks = [check('title','title should not be empty ').notEmpty,
         check('description','description should not be empty ').notEmpty ]

app.post('/upload' ,(req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            });
            console.log(err);
        } else {
            if(req.file == undefined){

                res.render('index', {
                    msg: 'Error: No File Selected!',
                    title :title ,
                    description : description ,

                });
                console.log(req.file);
                var result = validationResult(req);
                var erreur = result.errors;
                var title = req.body.title;
                var description = req.body.description;
                if(!result.isEmpty()){
                    res.render('index', {
                        errors : erreur,
                        title :title ,
                        description : description ,
                        flash : req.flash('danger')
                    });


                }
                console.log(erreur.msg);
            } else {
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`,
                    title :title ,
                    description : description ,
                });
            }
        }
    });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));