//首页 GET '/'
//大部分为初始化数据函数

//初始化页面数据
window.onload = function () {
  dashCountImg = document.getElementById('dash-countImg');
  coverImg = document.getElementById('cover-img');
  //获取张数
  axios
    .get('/api/image/count')
    .then((res)=>{
      dashCountImg.innerHTML = res.data.data.count.toString() + ' 张'
    })
  //获取封面数据
  axios
    .get('/api/cover/get')
    .then((res)=>{
      data = res.data;
      if (data.status==404) {return}
      return data.data.sid;
    }).then((rid)=>{
      console.log(rid)
      if (!rid) {return}
      axios
        .get('/api/image/get', {
          params: {
            id: rid
          }
        })
        .then((res)=>{
          data = res.data;
          if (data.status==404||data.status==-1) {return}
          coverImg.src=data.data.url;
        })
    })
}
