//图片管理 GET '/manage/image'

//数据初始化
window.onload = () => {
  //获取图片列表
  getImageList(-1);
  //初始化各种菜单
  //排序菜单
  var inst = new mdui.Menu('#toolbar-sort', '#toolbar-sort-menu');
//  document.getElementById('toolbar-sort').addEventListener('click', ()=> {
//    inst.open();
//  });
}

function showSortMenu() {

  //排序菜单
  var inst = new mdui.Menu('#toolbar-sort', '#toolbar-sort-menu');
}

//加载图片
async function getImageList(sort) {
  var list
  imgList = document.getElementById('imgList')
  axios
    .get('/api/image/list', {
      params: {
        sort: sort
      }
    })
    .then((res)=>{
      if (res.data.status==0) {
        let tbody = ''
        list = res.data.data.list;
        list.forEach((item, index)=>{
          pre = "<div class='mdui-col'><div class='mdui-grid-tile'>";
          oc = "onclick='showDialog(&apos;" + item._id + "&apos;)'";
          content = "<img src='" + item.url + "' id='" + item._id + "' " + oc + " />";
          suf = "</div></div>";
          tbody += pre + content + suf;
        });
        imgList.innerHTML += tbody;
      }
    })
}

//打开图片对话框
function showDialog(id) {
  let dialogImg = document.getElementById('dialog-img');
  let dialogDropBtn = document.getElementById('dialog-drop-btn');
  url = document.getElementById(id).getAttribute('src');
  dialogImg.setAttribute('src', url);
  dialogDropBtn.setAttribute('onclick', "dropImg('"+id+"')");
  
  var dialogObj = new mdui.Dialog('#dialog'); 
  dialogObj.open();
}

//删除图片
async function dropImg(id) {
  axios
    .delete('/api/image/delete', {
      params: {
        id: id
      }
    }).then((res)=>{
      data = res.data;
      if (data.status==0) {
        mdui.snackbar({
          message: '删除成功～',
          position: 'right-bottom',
          onClosed: () => {
            location.reload(); 
          }
        })
      } else {
        mdui.snackbar({
          message: data.msg,
          position: 'right-bottom'
        });
      }
    })
}
