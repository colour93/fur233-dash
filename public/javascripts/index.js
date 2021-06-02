//首页 GET '/'
//大部分为初始化数据函数

//初始化页面数据
window.onload = function () {
  console.log('onload')
  axios
    .get('/api/image/count')
    .then((res)=>{
      console.log(res)
      document.getElementById('dash-countImg').innerHTML = res.data.data.count.toString() + ' 张'
    })
}