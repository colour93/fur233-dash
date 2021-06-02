var express = require('express');
var fs = require('fs');
var multer = require('multer');
var oss = require('../oss');
var ctrl = require('../controllers');
var router = express.Router();

const upload = multer({
  dest: 'tmp'//上传文件存放路径
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: '仪表板 - 有福瑞'
  });
});

router.get('/upload', async(req, res, next) => {
  res.render('upload', {
    title: '上传背景图 - 有福瑞'
  })
})

const singleMidle = upload.single('singleFile');//一次处理一张

// post '/upload'
router.post('/upload',singleMidle ,async(req, res, next) => {
  ctrl.uploadImage(req.file)
    .then( (result) => {
       res.send(result);
    }).catch( (err) => {
      res.send(err)
    })
})

//图片管理 GET '/mange/image'
router.get('/manage/image', async(req, res, next) => {
  res.render('imageManage', {
    title: '图片管理 - 有福瑞'
  })
})

// 获取总计图片数目（数据库中的）
router.get('/api/image/count', async (req, res, next) => {
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

module.exports = router;
