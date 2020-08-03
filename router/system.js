//系统模块
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

//系统信息  get  /system/info  返回{logoUrl,siteName,adminMail,adminPhone,copyright,icp}

router.get('/system/info',(req,res,next)=>{
	let sql='SELECT logoUrl,siteName,adminMail,adminPhone,copyright,companyName,icp FROM basicInfo'
	pool.query(sql,(err,result)=>{
		if(err){
			next(err)
			return
		}
		let output=result[0]
		res.send(output)
	})
})


//轮播广告  get  /carousel  返回[{cid,picUrl,href,title}]

router.get('/carousel',(req,res,next)=>{
	let sql='SELECT cid,picUrl,href,title FROM carousel ORDER BY cid '
	pool.query(sql,(err,result)=>{
		if(err){
			next(err)
			return
		}
		let output=result
		res.send(output)
	})
})

