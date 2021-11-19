var express = require('express');
var fs = require('fs');
var multer = require('multer');
var oss = require('../oss');
var ctrl = require('../controllers');
const { Router } = require('express');
var router = express.Router();

const $ = require('../fn');
const cfg = require('../config');

const upload = multer({
  dest: 'tmp'//上传文件存放路径
});

// 鉴权中间件
const auth = (req, res, next) => {
  if (req.cookies.key != cfg.key && req.query.key != cfg.key) {
    $.unauthorized(res);
    return;
  };
  next();
}

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.cookie('key', cfg.key ,{
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  res.render('index', {
    title: '仪表板 - 有福瑞'
  });
});

router.get('/upload', auth, async(req, res, next) => {
  res.render('upload', {
    title: '上传背景图 - 有福瑞'
  })
})

const singleMidle = upload.single('singleFile');//一次处理一张

// post '/upload'
router.post('/upload', auth, singleMidle, async(req, res, next) => {
  ctrl.uploadImage(req.file)
    .then( (result) => {
      res.send(result);
    }).catch( (err) => {
      res.send(err);
    })
})

//图片管理 GET '/mange/image'
router.get('/manage/image', auth, async(req, res, next) => {
  res.render('imageManage', {
    title: '图片管理 - 有福瑞'
  })
})


//获取指定图片（通过id）
router.get('/api/image/get', async(req, res, next) => {
  result = await ctrl.getImageById(req.query.id);
  res.send(result);
})

// 获取随机图片
router.get('/api/image/random', async(req, res, next) => {
  ctrl.getRandomImage()
    .then((result)=>{
      res.send(result);
    })
})

//获取封面图（背景）
router.get('/api/cover/get', async (req, res, next) => {
  result = await ctrl.getCover(req.query.date);
  res.send(result);
})

//设置封面图（背景）
router.post('/api/cover/set', auth, async (req, res, next) => {
  let itype
  let iconfirm
  const {sid, type, date, confirm} = req.body
  if (confirm==1) {iconfirm=true};
  if (type) {itype=parseInt(type)}
  result = await ctrl.setCover(sid, itype, date, iconfirm);
  res.send(result);
})

// 获取总计图片数目（数据库中的）
router.get('/api/image/count', auth, async (req, res, next) => {
  count = await ctrl.getImageCount();
  res.send({
    status: 0,
    message: 'success',
    data: {
      count: count
    }
  });
});

//获取图片列表 GET '/api/image/list'
router.get('/api/image/list' ,async(req ,res ,next) => {
  res.send(await ctrl.getImageList(req.query.sort));
});

//删除图片 DELETE '/api/image/delete'
router.delete('/api/image/delete', async(req ,res ,next ) => {
  result = await ctrl.deleteImage(req.query.id);
  if (result.res.status==204) {
    res.send({
      status: 0,
      msg: 'success'
    })
  } else {
    res.send({
      status: result.res.status,
      msg: '错误，信息详见控制台',
      data: result
    })
  }
});

//创建用户
router.post('/api/user/add', async(req, res, next) => {
  const {name, bili_uid, yfid, role} = req.body;
  ctrl.addUser(name, bili_uid, yfid, role)
    .then((result)=>{
      res.send(result);
    })
})

// 模糊查询用户
router.get('/api/user/search', async(req, res, next) => {
  const {value, type} = req.query;
  ctrl.searchUser(value, type)
    .then((result)=>{
      res.send(result);
    })
})

module.exports = router;
