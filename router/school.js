const express = require('express')
const pool = require('../pool.js')
// 创建路由器
let router =express.Router()
// 导出路由器
module.exports=router

/**
 * 1.1校区列表功能点
 * 请求方法：
 * 	GET
 * 请求URL：
 * 	/school/list
 * 请求参数：
 * 	无
 * 返回消息：
 * 	[
 *		{sid: 2, address: 'xxx', phone: 'yyy', postcode:'...'},
 * 		...
 *	]
 */
router.get('/list',(req,res,next)=>{
	let sql='SELECT sid,sname,address,phone,postcode FROM school'
	pool.query(sql,(err,result)=>{
		// if(err) throw err           //抛出异步错误会导致node.js崩溃
		if(err) {
			next(err)
			return
		}
		res.send(result)
	})
})

/**
 * 1.2校区开课功能点
 * 请求方法：
 * 	GET
 * 请求URL：
 * 	/school/course
 * 请求参数：
 * 	sid - 要查询的学校编号
 * 返回消息：
 * 	{
 *		shool: {sid: 2, sname:'北京万寿路中心', address:'北京是海淀区'},
 *		courseList: [
 *	 		{cid: 28, pic:'images/..jpg', cLength: '1天', startTime: '每周一',price:450},
 * 			......
 *		]
 * 	}
 */
router.get('/course',(req,res,next)=>{
	// 1.读取请求数据
	let sid=req.query.sid
	if(!sid){
		let output={
			code:400,
			msg:'sid required'
		}
		res.send(output)
		return
	}
	// 2.执行数据库查询
	let output={
		school:{},
		courselist:[]
	}
	let sql='SELECT sid,sname,address FROM school WHERE sid=?'
	pool.query(sql,[sid],(err,result)=>{
		if(err){
			next(err)
			return
		}
		if(result.length==0){
			res.send(output)
			return
		}
		output.school=result[0]
		// res.send(output)
		// 继续查询该校区开设的课程
		let sql='SELECT cid,pic,cLength,startTime,price FROM course WHERE cid IN(SELECT courseId FROM schoolCourse WHERE schoolId=?)'
		pool.query(sql,sid,(err,result)=>{
			if(err){
				next(err)
				return
			}
			output.courselist=result 
			res.send(output)
		})
	})
})