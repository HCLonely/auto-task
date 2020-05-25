[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Chrome >= 58](https://img.shields.io/badge/Chrome-%3E%3D%2058-blue)
[![GitHub](https://img.shields.io/github/license/HCLonely/auto-task)](https://github.com/HCLonely/auto-task/blob/master/LICENSE)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/HCLonely/auto-task)](https://github.com/HCLonely/auto-task/releases)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/HCLonely/auto-task/Test)

[English Document](https://github.com/HCLonely/auto-task/blob/master/README_EN.md)

# 警告

**预览版可能需要启用`实验性JS功能`**

# 测试环境

- Chrome 83.0.4100.3（正式版本）dev （64 位）
- 启用 `Experimental JavaScript` 功能
- Tampermonkey Beta v4.10.6112

# 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)
2. 安装 [auto-task](https://userjs.hclonely.com/auto-task.user.js) 脚本
3. 首次使用建议先 [设置](https://userjs.hclonely.com/setting.html)
4. 如果弹出 `一个用户脚本试图访问跨源资源`, 请点击 `总是允许全部域名`

**如果脚本出现BUG, 请先检查脚本是否为最新版, 如果不是请更新到最新版。**

**如果更新脚本后出现BUG, 可以先前往 `https://cdn.jsdelivr.net/gh/HCLonely/auto-task@version/auto-task.user.js`(*把`version`改为上一个版本的版本号, 例: `https://cdn.jsdelivr.net/gh/HCLonely/auto-task@2.2.6/auto-task.user.js`*) 安装之前的版本(仅支持2.2.5之后的版本), 然后反馈BUG, 等待修复。**

# 每个按钮功能

- `Fuck`, `Join`, `Verify`, `Remove` 按钮功能请前往[设置页面](https://userjs.hclonely.com/setting.html)查看
- `Showlogs`, `Hidelogs` 按钮: 显示/隐藏右下角日志
- 右下角的`清理缓存`功能: 脚本每次做完任务后会保存任务信息以便使用`Remove`功能, 如果提示`所有任务已完成`但没有做任何任务可以尝试`清理缓存`, 然后刷新一下再做任务, `清理缓存`后会导致之前做过的任务无法`Remove`

# 常见问题解决办法

1. `giveaway.su`网站`0000-0000-0000`问题

    解决办法：用脚本做完任务后关闭脚本管理器和广告屏蔽插件，然后刷新网页手动验证任务

2. `givekey.su`网站人机验证问题

    解决办法：每次点击`Fuck`按钮前都要手动完成人机验证

3. `givekey.su`网站wss连接出错

    解决办法：参考[#8](https://github.com/HCLonely/auto-task/issues/8)

4. 设置页面打不开

    解决办法：CODING 服务器抽风了，挂代理或等一段时间

# 适用网站

* [giveaway.su](https://giveaway.su/)
* [marvelousga](https://marvelousga.com/)
* [dupedornot](https://dupedornot.com/)
* [grabfreegame](https://www.grabfreegame.com/)
* [bananagiveaway](https://www.bananagiveaway.com/)
* ~~[gamecode.win](https://gamecode.win/)~~
* [gamehag](https://gamehag.com/giveaway)
* [prys](https://prys.revadike.com/)
* [indiedb](https://www.indiedb.com/giveaways)
* [givekey](https://givekey.ru/)(需要将语言设置为"English"或"Русский")
* [takekey](https://takekey.ru/)
* [freegamelottery](https://freegamelottery.com/)
* [gleam.io](http://gleam.io/)
* [spoune](https://www.spoune.com/index.php)

# 功能

* 自动完成Steam任务：
  * 加组
  * 加愿望单
  * 关注游戏
  * 关注鉴赏家
  * 关注发行商（仅限[giveaway.su](https://giveaway.su/)）
  * 关注开发商（仅限[giveaway.su](https://giveaway.su/)）
  * 点赞社区公告（仅限[giveaway.su](https://giveaway.su/)）

* 自动退出Steam任务：
  * 退组
  * 移除愿望单
  * 取关游戏
  * 取关鉴赏家
  * 取关发行商（仅限[giveaway.su](https://giveaway.su/)）
  * 取关开发商（仅限[giveaway.su](https://giveaway.su/)）

* 自动访问链接
* 验证任务
* 检测是否登录（如果需要登录）
* 检测是否剩余key
* 没完成的任务或脚本无法完成的任务自动打开任务页面以便手动完成
* 自动检测更新
* 导出导入设置

**<span style="color: #ff0000;">以上功能默认情况下并不是全部开启的，详细设置请前往[设置页面](https://userjs.hclonely.com/setting.html)，设置完别忘了保存！！！</span>**

**<span style="color: #ff0000;">首次使用2.0+版本建议先设置！</span>**

# 反馈方式

* 在[GitHub](https://github.com/HCLonely/auto-task/issues/new/choose)提交
* 前往[其乐（原蒸汽动力）论坛](https://keylol.com/t455167-1-1)提交

# 更新公告

[https://userjs.hclonely.com/announcement.html](https://userjs.hclonely.com/announcement.html)

<span style="color: #ff0000;">**新版本测试时间较短，可能会有BUG，欢迎前来反馈，之前的版本已留档（[点此安装](https://greasyfork.org/zh-CN/scripts/395098)），不会再更新！**</span>
