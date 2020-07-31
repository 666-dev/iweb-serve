const express = require('express')
const pool = require('../pool.js')
// 创建路由器
let router =express.Router()
// 导出路由器
module.exports=router

router.get('/list',(req,res)=>{
	console.log('1');
	res.send('1')
})