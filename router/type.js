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

//类别列表  url  /type  返回  [{tpid:2,tpname:'.....'},..]

router.get('/',(req,res,nex)=>{
	let sql='SELECT tpid,tpname FROM type ORDER BY tpid'
	pool.query(sql,(err,result)=>{
		if(err){
		next(err)
		return
	}
	res.send(result)
	})
	
})