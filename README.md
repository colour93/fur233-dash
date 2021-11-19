## 简介

这是**有福瑞起始页**后台（附带SSR的一个前后分的不清楚的）项目，基于[node](https://github.com/nodejs/node) [express](https://github.com/expressjs/express)的后端以及朴实无华的纯原生前端。

**有福瑞起始页（Fur233）**为**福瑞之家快捷导航（FurryHome）**子项目，旨在为广大Furry爱好者提供更为优雅简洁、方便易用的浏览器起始页。目前仍在制作并测试阶段，希望大家能够积极提出宝贵的意见建议。

> **注意：该项目懒逼作者正在重构**

## 已知API（待整理）

### API地址

https://api.fur233.com:26364

### 获取随机背景

GET /api/image/random

返回体

[根对象](#通用返回根对象)

data对象

| 字段      | 类型                        | 内容                        | 备注                                          |
| --------- | --------------------------- | --------------------------- | --------------------------------------------- |
| _id       | string (mongo中的object id) | 图片id (亦为数据库中唯一id) |                                               |
| url       | string                      | 图片所在oss的地址           |                                               |
| path      | string                      | 图片所在oss的pathname       |                                               |
| include   | array                       | 待定 (后续功能更新)         | 大概率是图片信息，比如摄影师，装史，fursuiter |
| timestamp | string (date)               | 图片上传时间戳              |                                               |
| __v       | num                         | mongo 中的索引              | 懒逼懒得去了                                  |

返回示例

```JSON
{
    "status": 0,
    "msg": "success",
    "data": {
        "_id": "612afa375503dc50857a784f",
        "url": "http://fur233.oss-cn-hangzhou.aliyuncs.com/temp/202108291108370451.jpg",
        "path": "temp/202108291108370451.jpg",
        "include": [],
        "timestamp": "2021-08-29T03:08:39.724Z",
        "__v": 0
    }
}
```

### 获取指定图片

GET /api/image/get

查询字符串

| 字段 | 内容                        | 备注 |
| ---- | --------------------------- | ---- |
| id   | 图片id (亦为数据库中唯一id) |      |

返回体

[根对象](#通用返回根对象)

data对象

| 字段      | 类型                        | 内容                        | 备注         |
| --------- | --------------------------- | --------------------------- | ------------ |
| _id       | string (mongo中的object id) | 图片id (亦为数据库中唯一id) |              |
| url       | string                      | 图片所在oss的地址           |              |
| path      | string                      | 图片所在oss的pathname       |              |
| timestamp | string (date)               | 图片上传时间戳              |              |
| __v       | num                         | mongo 中的索引              | 懒逼懒得去了 |

返回示例

```JSON
{
    "status": 0,
    "msg": "success",
    "data": {
        "_id": "612afa375503dc50857a784f",
        "url": "http://fur233.oss-cn-hangzhou.aliyuncs.com/temp/202108291108370451.jpg",
        "path": "temp/202108291108370451.jpg",
        "include": [],
        "timestamp": "2021-08-29T03:08:39.724Z",
        "__v": 0
    }
}
```

### 获取背景

GET /api/cover/get

查询字符串

| 字段 | 内容                        | 备注 |
| ---- | --------------------------- | ---- |
| id   | 图片id (亦为数据库中唯一id) |      |

返回体

[根对象](#通用返回根对象)

data对象

| 字段      | 类型                        | 内容                        | 备注                                          |
| --------- | --------------------------- | --------------------------- | --------------------------------------------- |
| sid       | string (mongo中的object id) | 图片id (亦为数据库中唯一id) |                                               |
| date      | string                      | 日期                        |                                               |
| path      | string                      | 图片所在oss的pathname       |                                               |
| include   | array                       | 待定 (后续功能更新)         | 大概率是图片信息，比如摄影师，装史，fursuiter |
| timestamp | string                      | 设置为背景的操作时间戳      |                                               |
| __v       | num                         | mongo 中的索引              | 懒逼懒得去了                                  |

返回示例

```JSON
{
    "status": 0,
    "msg": "success",
    "data": {
        "date": "20211119",
        "__v": 0,
        "sid": "612afa2e5503dc50857a784d",
        "timestamp": "2021-11-19T01:42:52.527Z",
        "type": 0
    }
}
```



### 通用返回根对象

| 字段   | 类型   | 内容                           | 备注            |
| ------ | ------ | ------------------------------ | --------------- |
| status | num    | 状态码（懒逼还没写状态码文档） | 0反正是正常了   |
| msg    | string | 错误信息                       | 若正常，success |
| data   | obj    | 返回主体                       |                 |

## 交流群

🌟福瑞之家交流群，欢迎Furry小伙伴来玩哦～

![](http://fur233.oss-cn-hangzhou.aliyuncs.com/markdown/IMG_1859.JPG)
