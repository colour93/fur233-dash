//控制器

const db = require('./db')
const oss = require('./oss')


//获取封面图片
//传参日期 默认今天
async function getCover(date) {
  return new Promise ((resolve, reject)=>{
    if (!date) {date=oss.getTS().substring(0,8)};
    if (date.length!=8) {resolve({
      status: -1,
      msg: 'date参数错误'
    })};
    db.DailyImage.findOne({date:date})
      .then((result)=>{
        if (!result) {resolve({
          status: 404,
          msg: '没有找到对应日期的封面'
        })};
        resolve({
          status: 0,
          msg: 'success',
          data: result
        });
      });
  });
}

//设置封面图片
//传参日期 默认今天
async function setCover(sid, type, date, confirm) {
  return new Promise ((resolve, reject)=>{
    oid = db.toObjId(sid);
    if (oid==0||!sid) {resolve({
      status: -3,
      msg: 'sid传参错误'
    })};
    if (!type) {type=0}
    if (!date) {date=oss.getTS().substring(0,8)};
    if (date.length!=8) {resolve({
      status: -1,
      msg: 'date参数错误'
    })};
    db.DailyImage.findOne({date:date})
      .then((result)=>{
        if (result&&!confirm) {resolve({
          status: -2,
          msg: '对应日期图片已存在'
        })};
        return db.DailyImage.updateOne({date:date},{
          sid: oid,
          type: type,
          date: date,
          timestamp: new Date()
          },{upsert:true})
      }).then((result)=>{
        resolve({
          status: 0,
          msg: 'success',
          data: result
        })
      })
  })
}

//获取指定图片（id）
async function getImageById(id) {
  return new Promise ((resolve, reject)=>{
    oid = db.toObjId(id)
    if (oid==0||!id) {resolve({
      status: -1,
      msg: 'id格式不正确'
    })};
    db.StorageImage.findById(id)
      .then((result)=>{
        if (!result) {resolve({
          status: 404,
          msg: '没有找到对应图片'
        })};
        resolve({
          status: 0,
          msg: 'success',
          data: result
        })
      })
  })
}

//上传到oss的图片
async function uploadImage (file, include, description, photographer, maker) {
  return new Promise ( async (resolve, reject) => {
    //判断后缀
    if (file.mimetype=='image/jpeg') {
      suffix = '.jpg';
    } else if (file.mimetype=='image/png') {
      suffix = '.png';
    } else {
        reject({
          status: -1,
          msg: '图片格式不正确'
        });
    };
    //生成文件名
    fn = oss.getTS() + oss.rN() + suffix;
    //上传到oss
    oss.put(file.path, fn)
      .then( (result) => {
      url = result.url;
      path = result.name; 
    db.StorageImage.create({
      url: url,
      path: path,
      include: include,
      photographer: photographer,
      maker: maker,
      description: description,
      timestamp: new Date()
    }).then( (result) => {
      console.log(result)
      resolve({
        status: 0,
        msg: 'success',
        data: {
          url: result.url
        }
      })
    })
    })
  })
}

//获取图片列表
async function getImageList (sort, pn) {
  if (!sort) {sort=1};
  return new Promise ( async (resolve, reject) => {
    let latest = null;
    a = await db.StorageImage.find({}).sort({_id:sort}).limit(10);
    resolve({
      status: 0,
      msg: 'success',
      data: {
        list: a
      }
    });
  })
}

//获取图片数量
async function getImageCount () {
  return new Promise ( (resolve, reject) => {
    db.StorageImage.countDocuments()
      .then( (count) => {
        resolve(count)
      })
  })
}

//删除图片
async function deleteImage(id) {
  return new Promise ( (resolve, reject) => {
    db.StorageImage.findByIdAndRemove(id)
      .then(async(result) => {
        if (!result) {
          resolve({
            status: 404,
            msg: '未在数据库中找到该图片'
          })
        };
        result = await oss.drop(result.path);
        resolve(result);
      }).catch((err)=>{
        console.log(err);
        reject(err);
      })
  })
}

module.exports = {
  getImageById,
  getCover,
  setCover,
  uploadImage,
  deleteImage,
  getImageCount,
  getImageList
}
