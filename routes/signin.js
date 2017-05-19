var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// 登录页面
router.get('/', checkNotLogin, function(req, res, next) {
	res.render('signin');
});

router.post('/', checkNotLogin, function(req, res, next) {
	var name = req.fields.name;
	var password = req.fields.password;

	UserModel.getUserByName(name)
		.then(function (user) {
			if (!user) {
				req.flash('error', '用户不存在');
				return res.redirect('back');
			}
			// 检查密码是否匹配
			if (sha1(password) !== user.password ) {
				req.flash('error', '用户名或密码错误');
				return res.redirect('back');
			}
			req.flash('success', '登录成功');
			// 写入session
			delete user.password;
			req.session.user =  user;
			// 跳转首页
			res.redirect('/posts');
		})
		.catch (next);
});

module.exports = router;