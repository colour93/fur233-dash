//控制器

const db = require('./db')
const oss = require('./oss')

//===================图片管理相关====================

//获取封面图片
//传参日期 默认今天
async function getCover(date) {
  return new Promise ((resolve, reject)=>{
    if (!date) {date=oss.getTS().substring(0,8)};
    if (date.length!=8) {
      resolve({
        status: -1,
        msg: 'date参数错误'
      })
      return;
    };
    db.DailyImage.findOne({date:date})
      .then((result)=>{
        if (!result) {
          resolve({
            status: 404,
            msg: '没有找到对应日期的封面'
          });
          return;
        };
        resolve({
          status: 0,
          msg: 'success',
          data: result
        });
        return;
      });
  });
}

//设置封面图片
//传参日期 默认今天
async function setCover(sid, type, date, confirm) {
  return new Promise ((resolve, reject)=>{
    oid = db.toObjId(sid);
    if (oid==0||!sid) {
      resolve({
        status: -3,
        msg: 'sid传参错误'
      });
      return;
    };
    if (!type) {type=0}
    if (!date) {date=oss.getTS().substring(0,8)};
    if (date.length!=8) {
      resolve({
        status: -1,
        msg: 'date参数错误'
      });
      return;
    };
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
        });
        return;
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
        });
        return;
      })
  })
}

//获取随机图片
async function getRandomImage(uid) {
  return new Promise (async(resolve, reject)=>{
    result = await db.StorageImage.aggregate( [ { $sample: { size: 1 } } ] )
    resolve({
      status: 0,
      msg: 'success',
      data: result[0]
    });
    return;
  });
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
        return;
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

//===================用户管理相关====================

//创建用户
async function addUser (name, bili_uid_str, yfid_str, role) {
  return new Promise (async(resolve, rejecet)=>{
    // 判断参数
    if (!name||!bili_uid_str||!role) {
      resolve({
        status: -4,
        msg: '参数不全'
      });
      return;
    };

    // 判断角色填写是否正确
    // 常规格式
    roleExample = [
      'fursuiter',
      'photographer',
      'maker'
    ];
    // 判断是否在其中
    if (!roleExample.includes(role)) {
      resolve({
        status: -4,
        msg: '角色填写错误'
      });
      return;
    };

    // 转格式
    bili_uid = parseInt(bili_uid_str);
    if (bili_uid==NaN) {
      resolve({
        status: -4,
        msg: 'uid格式错误或未填写'
      });
      return;
    }
    // 分流
    result = await db.User.findOne({bili_uid: bili_uid});
    // 若存在
    if (result) {
      roleArr = result.role;
      // 如果角色也相同，就返回
      if (roleArr.includes(role)) {
        resolve({
          status: -3,
          msg: '用户已存在',
          data: result
        });
        return;
      }
      // 如果角色不同，就添加角色
      result = await db.User.updateOne(
        { bili_uid: bili_uid },
        { $push: { role: role } }
      );
      resolve({
        status: 1,
        msg: '添加角色成功',
        data: result
      });
      return;
    };
    // 若不存在
    result = await db.User.create({
      name: name,
      role: [role],
      bili_uid: bili_uid,
      // yfid: yfid,
      timestamp: new Date()
    });
    resolve({
      status: 0,
      msg: 'success',
      data: result
    });
    return;
  })
}

// 模糊查询用户
async function searchUser (value, type) {
  return new Promise (async(resolve, reject)=>{
    // 判断入参
    if (!value) {
      resolve({
        status: -4,
        msg: '参数不完整'
      });
      return;
    };
    // 如果没有输入type，默认为name
    if (!type) {type = 'name'};
    // 判断
    switch (type) {
      // uid查询
      case 'uid':
        // 转格式
        uid = parseInt(value);
        // 判断格式
        if (uid==NaN) {
          resolve({
            status: -4,
            msg: 'uid格式错误或未输入'
          });
          return;
        };
        result = await db.User.findOne({bili_uid: uid});
        resolve({
          status: 0,
          msg: 'success',
          data: result
        })
        break;
      // name查询
      case 'name':
        // 模糊查询
        reg = new RegExp(value, 'i')
        result = await db.User.find({name: { $regex: reg } })
        resolve({
          status: 0,
          msg: 'success',
          data: result
        });
        return;
        break;
      default:
        
        break;
    };
  });
}

module.exports = {
  getImageById,
  getRandomImage,
  getCover,
  setCover,
  uploadImage,
  deleteImage,
  getImageCount,
  getImageList,
  addUser,
  searchUser
}
