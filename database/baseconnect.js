const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cms', {useNewUrlParser: true , useUnifiedTopology : true ,useFindAndModify : false});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to cms database ')
});