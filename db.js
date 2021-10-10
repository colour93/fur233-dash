//数据库相关

var mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const config = require('./config')

const connectDb = new Promise((resolve,reject)=>{
    mongoose.connect(config.dbAddress,{useNewUrlParser:true})
    
    mongoose.connection.once('open',(err)=>{ 
        if(!err){
            console.log('数据库连接成功')
            resolve()
        }else{
            reject('数据库连接失败'+ err)   
        }
    })
})

//图片库
const StorageImageSchema = new Schema ({
	url: String,
        path: String,
	include: [{
		_id: ObjectId,
		name: String
	}],
	photographer: {
		_id: ObjectId,
		name: String
	},
	maker: {
		_id: ObjectId,
		name: String
	},
	description: String,
	timestamp: Date
})
const StorageImage = mongoose.model('StorageImage', StorageImageSchema)

//日推图
const DailyImageSchema = new Schema ({
	sid: ObjectId,
	type: Number,
	date: String,
	timestamp: Date
})
const DailyImage = mongoose.model('DailyImage', DailyImageSchema)

//用户Schema
const UserSchema = new Schema ({
	name: String,
	role: Array,
	bili_uid: Number,
	yfid: Number,
	timestamp: Date
})
const User = mongoose.model('User', UserSchema)

//格式
const ObjId = mongoose.Types.ObjectId
function toObjId(str) {
	try {
		oid = ObjId(str)
		return oid
	} catch(err) {
		return 0
	}
}

//导出
module.exports = {
	ObjId,
	toObjId,
	connectDb,
	StorageImage,
	DailyImage,
	User
}
