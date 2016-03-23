// exports.login_page = function (req, res) {
// 	res.render('login_page', { 
// 		title: 'Login'
// 	});
// }

// exports.signup_page = function (req, res) {
// 	res.render('signup_page', { 
// 		title: 'signup'
// 	});
// }


// exports.chatting_page = function (req, res) {
// 	res.render('chatting_page', { 
// 		title: 'chatting'
// 	});
// }


// exports.user = function(req, res) {
// 	if (req.session.passport.user === undefined) {
// 		res.redirect('/signup');
// 		console.log('heeeeeeeeeeeell no!');
// 	} else {
// 		res.render('chatting_page', {title: 'chatting',
// 			user: req.user
// 		})
// 	}
// };