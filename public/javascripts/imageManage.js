//图片管理 GET '/manage/image'

let dialogObj;
let scDialogObj;

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
  let dialog = document.getElementById('dialog');
  let dialogImg = document.getElementById('dialog-img');
  let dialogDropBtn = document.getElementById('dialog-drop-btn');
  let dialogSetCoverBtn = document.getElementById('dialog-setCover-btn');
  url = document.getElementById(id).getAttribute('src');
  dialogImg.setAttribute('src', url);
  dialogDropBtn.setAttribute('onclick', "dropImg('"+id+"')");
  dialogSetCoverBtn.setAttribute('onclick', "showSetCoverDialog('"+id+"')");
  dialogObj = new mdui.Dialog('#dialog'); 
  dialogObj.open();
}

//显示设置封面（背景）对话框
async function showSetCoverDialog(id) {
  let scDialog = document.getElementById('scDialog');
  let scDialogSetCoverBtn = document.getElementById('scDialog-setCover-btn');
  let scDialogCancelBtn = document.getElementById('scDialog-cancel-btn');
  scDialogObj = new mdui.Dialog('#scDialog');
  scDialogSetCoverBtn.setAttribute('onclick', "setCover('" + id + "')");
  dialogObj.close();
  scDialogObj.open(); 
}

//关闭某对话框（我是屑 监听器一个都不管用）
async function closeDialog() {
  scDialogObj.close();
}

//设置背景
async function setCover(id, type, date) {
  setCoverReq(id, type, date);
}

//设置背景的请求
async function setCoverReq(id ,type, date, confirm) {
  axios
    .post('/api/cover/set', {
        sid: id,
        type: type,
        date: date,
        confirm: confirm
      })
    .then((res)=>{
      data = res.data;
      if (data.status==0) {
        mdui.snackbar({
          message: '设置成功～'
        });
        scDialogObj.close();
      } else if (data.status==-2) {
        scDialogObj.close();
        mdui.dialog({
          content: '该日期已设置背景，是否覆盖？',
          buttons: [
            {
              text: '取消'
            },
            {
              text: '确定',
              onClick: (scDialogObj)=>{
                setCoverReq(id, date, type, 1);
              }
            }
          ]
        });
      } else {
        
      }
    })
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
