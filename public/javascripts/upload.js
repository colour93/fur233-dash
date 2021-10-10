//上传文件 'GET /upload'

function upload() {
    //获取元素
    let uploadImgBtn = document.getElementById('uploadImgBtn');
    let uploadSpinner = document.getElementById('uploadSpinner');
    let uploadImgImg = document.getElementById('uploadImgImg');

    //初始化加载圆圈
    uploadSpinner.className = 'mdui-spinner';
    mdui.mutation();
    //上传按钮禁用
    uploadImgBtn.setAttribute('disabled','');
    //上传文件
    let file = document.getElementById('uploadImgInput').files[0];
    let formData = new FormData();
    formData.append('singleFile', file, file.name);
    const config = {
        headers: { "Content-Type": "multipart/form-data;boundary"+new Date().getTime() }
    };
    //axios请求
    axios
        .post('/upload', formData, config)
        .then((res)=>{
            uploadSpinner.innerHTML = '';
            uploadSpinner.className = '';
            mdui.updateSpinners();
            uploadImgBtn.removeAttribute('disabled');
            if (res.data.status==0) {
                url = res.data.data.url;
                uploadImgImg.src = url;
                //跳个右下角的提示
                mdui.snackbar({
                    message: '上传成功~',
                    position: 'right-bottom',
                })
            } else {
                mdui.snackbar({
                    message: res.data.msg,
                    position: 'right-bottom'
                })
            }
        })
        .catch((err)=>{
            console.log(err)
        })
}
