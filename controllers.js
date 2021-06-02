//控制器

const db = require('./db')
const oss = require('./oss')

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
  uploadImage,
  deleteImage,
  getImageCount,
  getImageList
}
