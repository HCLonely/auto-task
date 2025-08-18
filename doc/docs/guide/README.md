---
title: 指南
lang: zh-CN
---

## 安装

1. 安装[Tampermonkey](https://www.tampermonkey.net/)扩展
2. 安装`auto-task`脚本

- 普通版：[Github安装](https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.user.js) [jsDelivr安装](https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/dist/auto-task.user.js) [GreasyFork安装](https://greasyfork.org/zh-CN/scripts/437922-auto-task) [备用安装](https://auto-task.hclonely.com/dist/auto-task.user.js)
- 兼容版：[Github安装](https://github.com/HCLonely/auto-task/raw/main/dist/auto-task.compatibility.user.js) [jsDelivr安装](https://cdn.jsdelivr.net/gh/HCLonely/auto-task@main/dist/auto-task.compatibility.user.js) [备用安装](https://auto-task.hclonely.com/dist/auto-task.compatibility.user.js)

## 用前必读

1. 此脚本支持[Tampermonkey](https://www.tampermonkey.net/) >= 5.2.0 扩展，不会专门去兼容其他扩展；
2. reddit功能需要使用reddit的beta版网站才能使用，如果脚本自动切换失败，请自行切换；
3. 验证 Twitter 和 Youtube 凭证时会自动关注官方账号，如果不想关注官方账号，可在[设置页面](https://auto-task.hclonely.com/setting.html)->`全局设置`->`其他`中更换；
4. `点赞社区公告`和`点赞创意工坊物品`功能不支持撤销，`Opquests`网站不支持撤销任务；
5. 社交账号更新凭证时如果没登录会提示更新失败，需要登陆后重新更新；
6. Ins任务不建议撤销，可能会增加封禁几率；
7. `Giveawaysu`获取Key时请关闭此脚本，否则会得到`0000-0000-0000`Key;
8. 做`Discord`相关任务后可能会被强制登出并触发人机验证，需完成验证后才可正常使用`Discord`;
9. 关于Gleam.io网站的支持性：仅支持`?`任务，不支持`+数字`任务：
  ![支持](/gleam-zh.png)
  ![不支持](/not-gleam-zh.png)
10. Gleam.io网站支持调用[TimerHooker](https://timer.palerock.cn/)脚本快速验证任务。

## 使用

### 其乐论坛

1. 在其乐论坛福利放送版块的帖子中的社交平台链接会添加相关功能；
2. 左键单击可以多选任务；
3. 然后点击"做任务"按钮即可完成。

![Example](/keylol.gif)

### 非其乐论坛

1. 打开[支持的网站](#支持的网站及任务)的赠 Key 页面；
2. 页面加载完成后右上角（可自定义位置）显示功能按钮；
3. 点击`做任务`一键完成[支持的任务](#支持的网站及任务)，点击`撤销任务`撤销之前的任务。

> ps. 各按钮的具体功能及说明可在[设置页面](https://auto-task.hclonely.com/setting.html)自定义配置

## 支持的网站及任务

**下述功能默认全部开启，详情请查看[设置页面](https://auto-task.hclonely.com/setting.html)**

### Freeanywhere

- 登录检测（没登录则自动跳转登录页面）
- 做任务 & 撤销任务
  - Steam
    - 加组 & 退组
    - 关注 & 取关鉴赏家
    - 添加 & 移除愿望单
    - 关注 & 取关游戏
    - 游戏时长挂机（支持ASF）
  - 加入 & 退出 Vk 群组
  - 转发 & 撤销转发 Vk 动态
  - 访问链接
- 验证任务
- 获取 key

### Giveawaysu & GiveeClub

- 登录检测（没登录则自动跳转到登录页面）
- 剩余 Key 检测，如果赠 Key 结束则弹窗提醒
- 做任务 & 撤销任务
  - Steam
    - 加组 & 退组
    - 关注 & 取关鉴赏家/开发商/发行商
    - 添加 & 移除愿望单
    - 关注 & 取关游戏
    - 订阅 & 取消订阅论坛
    - 点赞社区公告（不支持撤销）
    - 点赞创意工坊物品（不支持撤销）
    - 游戏时长挂机（支持ASF）
  - 加入 & 离开 Discord 服务器
  - ~~关注 & 取关 Instagram 用户~~
  - 关注 & 取关 Twitch 频道
  - 加入 & 退出 Reddit 社区
  - 加入 & 退出 Vk 群组
  - 订阅 & 取消订阅 Youtube 频道
  - 点赞 & 取消点赞 Youtube 视频

### Givekey

- 登录检测（没登录则自动跳转到登录页面）
- 剩余 Key 检测，如果赠 Key 结束则弹窗提醒
- 做任务 & 撤销任务
  - Steam
    - 加组 & 退组
    - 关注 & 取关鉴赏家/开发商/发行商
    - 添加 & 移除愿望单
    - 关注 & 取关游戏
  - 加入 & 退出 Vk 群组
  - 转发 & 撤销转发 Vk 动态
  - 加入 & 离开 Discord 服务器
  - 访问链接
- 验证任务

### Gleam

> 配合[TimerHooker](https://timer.palerock.cn/)脚本使用更佳！

- 剩余 Key 检测，如果赠 Key 结束则弹窗提醒
- 做任务 & 撤销任务
  - Steam
    - 加组 & 退组
    - 关注 & 取关鉴赏家/开发商/发行商
    - 添加 & 移除愿望单
    - 关注 & 取关游戏
    - 游戏时长挂机（支持ASF）
  - 关注 & 取关 Twitter 用户
  - 转推 & 取消转推 Twitter 动态
  - 加入 & 离开 Discord 服务器
  - 关注 & 取关 Twitch 频道
  - 订阅 & 取消订阅 Youtube 频道
  - 访问链接
  - 自动填写表单（需在[网站设置](#网站设置)中设置好相应的内容）
- 验证任务

### Indiedb

- 登录检测（没登录则自动跳转到登录页面）
- 剩余 Key 检测，如果赠 Key 结束则弹窗提醒
- 做任务
  - 自动加入赠 key
  - 自动完成相关任务（付费订阅任务除外）

### keyhub

- 登录检测（没登录则自动跳转到登录页面）
- 剩余 Key 检测，如果赠 Key 结束则弹窗提醒
- 做任务 & 撤销任务
  - Steam
    - 加组 & 退组
    - 关注 & 取关鉴赏家
    - 添加 & 移除愿望单
  - 加入 & 离开 Discord 服务器
  - 访问链接
- 验证任务

### OpiumPulses

- 登录检测（没登录则自动跳转到登录页面）
- 自动加入免费赠 key
- 自动加入点数赠 key（可在[网站设置](#网站设置)中设置每个赠Key的最大点数）

### Opquests

- 登录检测（没登录则自动跳转到登录页面）
- 做任务
  - Steam
    - 加组 & 退组
    - 关注 & 取关鉴赏家/开发商/发行商
    - 添加 & 移除愿望单
    - 关注 & 取关游戏
    - 游戏时长挂机（支持ASF）

### Prys

- 登录检测
- 剩余 Key 检测，如果赠 Key 结束则弹窗提醒
- Steam
  - 加组 & 退组
  - 关注 & 取关鉴赏家

### SweepWidget

- 登录检测（没登录则自动点击Twitter登录）
- 做任务
  - 自动填写表单（需在[网站设置](#网站设置)中设置好相应的内容）
  - 验证任务

## 网站设置

1. 点击`Tampermonkey`图标；
2. 找到`auto-task`脚本；
3. 点击下拉菜单中的`网站设置`(仅支持部分网站)。

## 白名单

> 在撤销时不撤销白名单中的内容。

### 使用方法

- (建议)在[设置页面](https://auto-task.hclonely.com/setting.html)拉到最下面可以看到白名单，点击`编辑`按钮即可编辑，每行一个
- 使用打开[网站设置](#网站设置)的方法也可以打开白名单设置

## 任务历史

- 在[设置页面](https://auto-task.hclonely.com/setting.html)右上角有任务历史按钮
- 使用打开[网站设置](#网站设置)的方法也可以打开任务历史

## 数据同步

> 数据同步功能使用Github Gist存储数据，如果你无法访问[Github Gist](https://gist.github.com/)则无法使用此功能！
> 此功能不支持自动同步，每次同步需要手动点击！

1. 生成一个[Github Token](https://github.com/settings/tokens)，需勾选`gist`;
2. [创建一个gist](https://gist.github.com/), 文件名为`XXX.json`, `XXX`可替换为任意英文字母，文件内容为`{}`;

  ![Gist](/gist.png)

3. 点击`Create secret gist`;
4. 记住这一串`Gist ID`;

  ![Gist ID](/gistid.png)

5. 在`数据同步`的`Gist 设置`中填入相应的内容，点击`保存配置并测试`；
6. 提示`测试成功！`即可。
