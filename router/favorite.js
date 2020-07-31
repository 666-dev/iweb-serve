/** 
 * 收藏夹模块，包含如下功能点：
 *	5.1 添加收藏功能点
 *	5.2 收藏列表功能点
 */
const express = require('express')
const pool = require('../pool.js')
// 创建路由器
let router =express.Router()
// 导出路由器
module.exports=router

/**
 * 5.1 添加收藏功能点
 * 请求方法：
 * 	POST
 * 请求URL：
 * 	/favorite/add
 * 请求参数：
 * 	uid		必需，从当前会话中读取的用户编号 req.session.userInfo.uid
 * 	cid		必需，课程编号
 * 返回消息：
 * 	{
 *		code: 200,
 *		msg: 'favorite add succ',
 *		fid: 8
 *	}
 *  提示：如果客户端未提交必需的数据，则提示错误；如果指定用户已经收藏过该课程，则更新收藏时间为最新时间；否则添加一条新的收藏记录
 */

router.post('/add',(req,res,next)=>{

// 	if(!req.session  ||  !req.session.userInfo){
// 		let output={
// 			code:'490',
// 			msg:'login required'
// 		}
// 		res.send(output)
// 		return
// 	}
 	// 1.读取客户端请求数据
	let uid=req.session.userInfo.uid   //用户编号
	let cid=req.body.cid               //课程编号
	if(!cid){
		let output={
			code:400,
			msg:'cid required'
		}
		res.send(output)
		return
	}
	let ftime=Date.now()     //当前系统时间
	// 2.执行查询判断是否收藏过
	let sql='SELECT fid FROM favorite WHERE userId=? AND courseId=?'
	pool.query(sql,[uid,cid],(err,result)=>{
		if(err){
			next(err)
			return
		}
		if(result.length>0){  //查询到收藏记录
			let sql='UPDATE favorite SET ftime=? WHERE fid=?'
			pool.query(sql,[ftime,result[0].fid],(err,result=>{
				if(err){
					next(err)
					return
				}
				let output={
					code:201,
					msg:'favorite time update'
				}
				res.send(output)
				return
			}))
		}else{         //没查到插入收藏记录
			let sql='INSERT INTO favorite VALUES(NULL,?,?,?)'
			pool.query(sql,[uid,cid,ftime],(err,result)=>{
				if(err){
					next(err)
					return
				}
				let output={
					code:200,
					msg:'favorite succ',
					fid:result.insertId    //刚刚执行的INSERT崽数据库中生成的自增编号
				}
				res.send(output)
			})
		}
	})
})

/*
 * 	GET
 * 请求URL：
 * 	/favorite/list
 * 请求参数：
 * 	uid		必需，从当前会话中读取的用户编号 req.session.userInfo.uid
 * 返回消息：
 * 	 [
 *       {
 *           "title": "07HTML零基础入门",
 *           "pic": "img-course\/06.png",
 *           "price": 399,
 *           "courseId": 7,
 *           "fid": 2,
 *           "fTime": 1578015036
 *       },
 *      ....
 *	]
 */

router.get('/list',(req,res,next)=>{
	//1.读取请求数据
	  // 此处应该执行用户是否登录的检查------放到前置中间件loginCheckMiddleware
		let uid=req.session.userInfo.uid
		
		// 2.
		let sql='SELECT fid,ftime,courseId,title,price,pic FROM favorite,course WHERE course.cid=favorite.courseId AND userId=? ORDER BY ftime DESC'
		pool.query(sql,uid,(err,result)=>{
			if(err){
				next(err)
				return
			}
			// 3.
			res.send(result)
		})
})