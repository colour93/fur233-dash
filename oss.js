//阿里云oss
var OSS = require('ali-oss');

const config = require('./config');

//创建客户端对象
let client = new OSS({
  region: config.oss.region,
  accessKeyId: config.oss.id,
  accessKeySecret: config.oss.secret,
  bucket: config.oss.bucket
});

//上传文件
async function put (origin, filename) {
  return new Promise (async(resolve, reject)=>{
  try {
    let result = await client.put('temp/' + filename, origin);
     resolve(result);
   } catch (err) {
     console.log (err);
   }
   })
}

//删除文件
async function drop (path) {
  return new Promise (async(resolve, reject)=>{
    try {
      let result = await client.delete(path);
      resolve(result);
    } catch (err) {
      console.log(err);
      reject(err);
    };
  })
}

//生成日期+时间字符串
function getTS() {
  d = new Date();
  YYYY = d.getFullYear().toString();
  if (d.getMonth() < 9) {
    MM = '0' + (d.getMonth() + 1).toString();
  } else {
    MM = (d.getMonth() + 1).toString();
  }
  if (d.getDate() < 10) {
    DD = '0' + d.getDate().toString();
  } else {
    DD = d.getDate().toString();
  }
  if (d.getHours() < 10) {
    hh = '0' + d.getHours().toString;
  } else {
    hh = d.getHours().toString();
  }
  if (d.getMinutes() < 10) {
    mm = '0' + d.getMinutes().toString();
  } else {
    mm = d.getMinutes().toString();
  }
  if (d.getSeconds() < 10) {
    ss = '0' + d.getSeconds().toString();
  } else {
    ss = d.getSeconds().toString();
  }
  return (YYYY + MM + DD + hh + mm + ss);
}

//生成随机三位字符串
function rN() {
  r = randomNum(0, 999);
  if (r < 10) {
    p = '00';
  } else if (10 <= r < 100) {
    p = '0';
  } else {
    p = '';
  }
  s = p + r.toString()
  return s
}

//生成随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

module.exports = {
  getTS,
  rN,
  put,
  drop
}
