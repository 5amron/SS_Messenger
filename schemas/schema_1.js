var mongoose =require('mongoose');


module.exports = mongoose.model('ss_messenger_collection' , {
	full_name:String,
    username:String,
    email:String,
    pass_1:String,
    pass_2:String
});


