//1. 创建服务器
const express =require('express')
let port=5050
let app=express()
app.listen(port,()=>{
	console.log('Serve Listening on Port:',port);
})
//托管静态资源文件夹
app.use(express.static('./public'))
// 2.创建前置中间件----在里有之前执行的中间件（预处理请求以及相应）
   // 解析请求消息主体，将application/json类型的请求数据保存入req.body
	 //express中默认情况下req没有body属性
	 let bodParser=require('body-parser')
	 app.use(bodParser.json())
   //使用session处理中间件， 
	 // ①为当前客户端分配session存储空间，并告知客户端sid。   
	 // ②当客户端在次请求时从头部读取sid，进而找到该客户端对应的session空间，保存为req.session对象
	 let session=require('express-session')
	 app.use(session({
		 secret:'tedu1323'   ,//自定义生成sid随机数的种子
		 saveUninitialized:true,   //是否保存未经初始化过的session数据
		 resave:true,           //是否自动保存session数据--即使没有修改过
	 }))
//跨域
let cors=require('cors')
app.use(cors({}))
// 3.申明路由器
const schoolRouter=require('./router/school.js')
app.use('/school',schoolRouter)


const teacherRouter=require('./router/teacher.js')
app.use('/teacher',teacherRouter)

const courseRouter=require('./router/course.js')
app.use('/course',courseRouter)


const typeRouter=require('./router/type.js')
app.use('/type',typeRouter)

const loginCheckMiddleware=require('./middleware/loginCheck')
app.use('/favorite',loginCheckMiddleware)  //操作收藏之前必须检验是否登录
const favoriteRouter=require('./router/favorite.js')
app.use('/favorite',favoriteRouter)

app.use('/cart',loginCheckMiddleware)
const cartRouter=require('./router/cart.js')
app.use('/cart',cartRouter)

const userRouter=require('./router/user.js')
app.use('/user',userRouter)

const captchaRouter=require('./router/captcha.js')
app.use('/captcha',captchaRouter)

const systemRouter=require('./router/system.js')
app.use('/',systemRouter)

app.use((err,req,res,next)=>{
	// res.status(500)
	console.log(err)
	res.send({
		code:500,
		msg:"Soory!Sever tmp error!Please retry later!",
		err:err
	})
})