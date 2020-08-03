/**
 * 课程模块，包含如下功能点：
 *	3.1课程列表功能点(分页查询)
 *	3.2课程详情功能点
 */
const express = require('express')
const pool = require('../pool.js')
// 创建路由器
let router = express.Router()
// 导出路由器
module.exports = router


/**
 * 3.1课程列表功能点(分页查询)
 * 请求方法：
 * 	GET
 * 请求URL：
 * 	/course/list
 * 请求参数：
 * 	typdId	 可选(默认值为0)		要查询的课程所属类别，0代表所有类别
 *	pageNum	 可选(默认值为1)		要查询哪一页
 * 返回消息：
 * 	{
 *		totalCount: 27,			//符合条件的总记录数——需要到数据库中查询
 * 		pageSize: 6,			//每页最多记录数/页面大小——是一个常量
 * 		pageCount: 5,			//总页数——总记录数/页面大小再上取整
 * 		pageNum: 1,				//当前页号——来自于客户端请求
 * 		courseList: [
 *	 		{cid:8,pic:'..',title:'..',tid:'',tname:'..',cLength:'',startTime:'',price:''},
 * 			....
 *		]
 *	}
 */
router.get('/list', (req, res, next) => {
	// 1.读取请求数据
	let typeId = req.query.typeId //查询的课程所属类别
	if (!typeId) {
		typeId = 0
	} else {
		typeId = parseInt(typeId)
	}
	let pageNum = req.query.pageNumber //要显示那一页
	if (!pageNum) {
		pageNum = 1
	} else {
		pageNum = parseInt(pageNum)
	}
	// 2.执行数据库查询
	let output = {
		totalCount: 0, //符合条件的总记录数
		pageSize: 6, //页面大小--常量
		pageNum: pageNum, //要查询的页号
		courseList: [], //要查询的数量
	}
	//查询符合条件的总记录数
	// let sql='SELEC COUNT(*) AS c FROM course WHERE 1 AND typeId=1'
	// let sql='SELEC COUNT(*) AS c FROM course WHERE 1 AND typeId=1 AND x=? AND y=? AND z=?'
	let placeholder = [] //SQL占位符对应的值
	let sql = 'SELECT COUNT(*) AS c FROM course WHERE 1 ';
	if (typeId > 0) {
		sql += ' AND typeId=? '
		placeholder.push(typeId)
	}
	pool.query(sql, placeholder, (err, result) => {
		if (err) {
			next(err)
			return
		}
		output.totalCount = result[0].c //查询到了满足条件的总记录数
		output.pageCount = Math.ceil(output.totalCount / output.pageSize) //总页数
		// 继续查询指定页上面的课程数据
		let sql =
			'SELECT cid,pic,title,cLength,startTime,price,tid,tname FROM course,teacher WHERE course.teacherId=teacher.tid '
		let placeholder = [] //当前第二条SQL中？占位符对应的值
		if (typeId > 0) {
			sql += ' AND typeId=? '
			placeholder.push(typeId)
		}
		sql += ' ORDER BY Cid DESC LIMIT ?,? '
		placeholder.push((output.pageNum - 1) * output.pageSize) //从第一行开始读取数据
		placeholder.push(output.pageSize) //最多获取几条
		pool.query(sql, placeholder, (err, result) => {
			if (err) {
				next(err)
				return
			}
			// 3.发送响应信息
			res.send(result)
		})
	})
})

/**
 * 3.2课程详情功能点
 * 请求方法：
 * 	GET
 * 请求URL：
 * 	/course/detail
 * 请求参数：
 * 	cid	 必须		要查询的课程编号
 * 返回消息：
 * 	{
 *		"cid":1,
 * 		"typeId":1,
 * 		"title" :"01HTML零基础入门",
 * 		"teacherId":"1",
 * 		"clength":"1天",
 * 		"startTime":"每周一开课",
 * 		"address":"前端各校区",
 * 		"pic":"img-course/01.png",
 * 		"price":"399",
 * 		"details":"<p>本课程详细讲解了HTML5的各个方面，课程从环境搭建开始，依次讲述了HTML5新元素、Canvas、SVG、Audio、GPS定位、拖拽效果、WEB存储、App Cache、HTML5 多线程和HTML5消息推送等内容。本课程详细讲解了HTML5的各个方面，课程从环境搭建开始，依次讲述了HTML5新元素、Canvas、SVG、Audio、GPS定位、拖拽效果、WEB存储、App Cache、HTML5 多线程和HTML5消息推送等内容。</p><p>本课程详细讲解了HTML5的各个方面，课程从环境搭建开始，依次讲述了HTML5新元素、Canvas、SVG、Audio、GPS定位、拖拽效果、WEB存储、App Cache、HTML5 多线程和HTML5消息推送等内容。本课程详细讲解了HTML5的各个方面，课程从环境搭建开始，依次讲述了HTML5新元素、Canvas、SVG、Audio、GPS定位、拖拽效果、WEB存储、App Cache、HTML5 多线程和HTML5消息推送等内容。</p><p>本课程详细讲解了HTML5的各个方面，课程从环境搭建开始，依次讲述了HTML5新元素、Canvas、SVG、Audio、GPS定位、拖拽效果、WEB存储、App Cache、HTML5 多线程和HTML5消息推送等内容。</p>",
 * 		"tid":"1",
 * 		"tname":"成亮",
 * 		"tpic":"img_teacher\/zx.jpg",
 * 		"schoolList":[
	           {sid:2,sname:'北京万寿路校区'},
			   ...........
          ]
 *	}
 */
router.get("/detail",(req,res,next)=>{
	let cid=req.query.cid
	if(!cid){
		let output={
			code:400,
			msg:"cid required"
		}
		res.send(output)
		return
	}
	let sql='SELECT cid,typeId,title,cLength,startTime,pic,price,details,tid,tname,tpic FROM course,teacher WHERE course.teacherId=teacher.tid AND cid=?'
	pool.query(sql,cid,(err,result)=>{
		if(err){
			next(err)
			return
		}
		if(result.length===0){
			res.send({})
			return
		}
		let output=result[0]
		let sql='SELECT sid,sname FROM school WHERE sid  IN (SELECT schoolId FROM schoolCourse WHERE courseId=?)'
		pool.query(sql,cid,(err,result)=>{
			if(err){
				next(err)
				return
			}
			console.log(result);
			output.schoolList=result
			res.send(output)
		})
		
	})
	
})

/*3.3最新课程
请求方式  get  请求url  /course/newest
请求参数  count  可选 需要返回最新课程的数量  默认值为4
返回消息:
[
	{
		"cid":12,
		"title":"12HTML零基础入门",
		"pic":"img-course/01.png",
		"price":399,
		"tname":"纪盈鑫",
		"":,
		"":,
		"":,
	},
	....
]
 */
router.get('/newest',(req,res,next)=>{
	let count=parseInt(req.query.count)
	if(!count){
		count=4
	}
	let sql='SELECT cid,title,pic,price,tname FROM course,teacher WHERE course.teacherId=teacher.tid ORDER BY cid DESC LIMIT ? '
	pool.query(sql,count,(err,result)=>{
		if(err){
			next(err)
			return
		}
		res.send(result)
	})
})

/*3.4最热门课程
请求方式  get  请求url  /course/hottest
请求参数  count  可选 需要返回最新课程的数量  默认值为4
返回消息:
[
	{
		"cid":12,
		"title":"12HTML零基础入门",
		"pic":"img-course/01.png",
		"price":399,
		"tname":"纪盈鑫",
		"":,
		"":,
		"":,
	},
	....
]
 */
router.get('/hottest',(req,res,next)=>{
	let count=parseInt(req.query.count)
	if(!count){
		count=4
	}
	let sql='SELECT cid,title,pic,price,tname FROM course,teacher WHERE course.teacherId=teacher.tid ORDER BY buyCount DESC LIMIT ? '
	pool.query(sql,count,(err,result)=>{
		if(err){
			next(err)
			return
		}
		res.send(result)
	})
})