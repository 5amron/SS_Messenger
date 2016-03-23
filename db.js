var mongoose =require('mongoose');


mongoose.connect('mongodb://.........:............@ds015909.mlab.com:15909/ss_messenger_databare');//enter user and pass


module.exports = mongoose.connection;