/** 
 * 验证码模块，包含如下功能点：
 *	8.1 生成注册用的验证码功能点
 */
const express = require('express')
const pool = require('../pool.js')
// 创建路由器
let router =express.Router()
// 导出路由器
module.exports=router

/**
 * 8.1 生成注册用的验证码功能点
 * 请求方法：
 * 	GET
 * 请求URL：
 * 	/captcha/register
 * 请求参数：
 * 	无
 * 返回消息：
 * 	<svg>...</svg>
 */
const svgCaptcha=require('svg-captcha')
const random=require('../util/random')
router.get('/register',(req,res)=>{
	 //生成验证码
	 // let captcha=svgCaptcha.create()  //{text:'',data:'<svg>...</svg>'}
	 let options={
		 width:100,
		 height:30,
		//  fontSize:60,
		 charPreset:'asdfghjbsdv146465161SDGERGWRVERV',
		 size:5,     //默认为4，字的个数
		 noise:4,    //干扰线条数量 默认为1
		 color:true,  //字符颜色
		 background:random.randColor(180,240)  //随机背景颜色
	 }
	 let captcha=svgCaptcha.create(options) 
	 // 2.把验证码的内容保存在当前用户的会话中
	 req.session.captchaRegister=captcha.text.toLowerCase()   //存储为小写格式
	 // 3.把验证码图片发送给客户端
	res.type('svg')       //修改相应消息头部 
	res.send(captcha.data)
})