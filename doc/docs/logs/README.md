---
title: 更新日志
lang: zh-CN
---

## V5.0

### V5.0.4

[Release](https://github.com/HCLonely/auto-task/releases/tag/v5.0.4)

- 修复：Twitter任务报错

### V5.0.3

[Release](https://github.com/HCLonely/auto-task/releases/tag/v5.0.3)

- 优化：Gleam人机验证完成后重新验证所有未完成的任务

### V5.0.2

[Release](https://github.com/HCLonely/auto-task/releases/tag/v5.0.2)

- 优化：Discord人机验证提示

### V5.0.1

[Release](https://github.com/HCLonely/auto-task/releases/tag/v5.0.1)

- 修复：部分v4链接更换

### V5.0.0

[Release](https://github.com/HCLonely/auto-task/releases/tag/v5.0.0)

- 新增：支持Steam ASF与Web API同时使用，可在设置中配置优先性
- 新增：Gleam 挂游戏时长任务识别
- 新增：Opquests 挂游戏时长任务识别
- 新增：Freeanywhere赠key状态检测
- 新增：支持Freeanywhere挂游戏时长任务
- 新增：支持Freeanywhere Youtube任务
- 新增：支持Freeanywhere扩展功能（可不安装扩展，扩展更新后可能会失效）
- 新增：资源加载失败提示
- 新增：调用ASF挂游戏时长时判断游戏是否运行（需配置Steam Web API 密钥）
- 修复：Twitter用户ID识别
- 修复：Prys网站支持
- 修复：GiveeClub部分任务多次重定向链接识别
- 优化：ASF挂时长识别Demo APP([#51](https://github.com/HCLonely/auto-task/issues/51))
- 优化：Steam鉴赏家关注上限提示([#46](https://github.com/HCLonely/auto-task/issues/46))
- 优化：Steam社区凭证更新方式，避免通过新弹窗更新
- 优化：Twitter任务同步执行，避免并发
- 优化：Twitter添加forwarded-for请求头(#45, #53)
- 优化：Gleam相关任务逻辑
- 优化：Gleam更多任务类型识别
- 优化：Discord任务提示([#37](https://github.com/HCLonely/auto-task/issues/37))
- 优化：Discord相关任务认证内容，减少被ban风险（未大量测试）([#8](https://github.com/HCLonely/auto-task/issues/8))
- 优化：Keylol折叠任务识别([#54](https://github.com/HCLonely/auto-task/issues/54))
- 优化：Opquests验证方式([#38](https://github.com/HCLonely/auto-task/issues/38))
- 优化：日志区域样式
- 优化：Debug日志
- 优化：按钮样式优化
- 优化：移除多余的依赖
- 移除：GiveawaySu特供版（不便维护）
- 移除：Instagram支持

## V4.7

### V4.7.10

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.10)

- 修复: Steam挂时长时间识别错误

### V4.7.9

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.9)

- 修复: Twitter获取csrf token失败(45)
- 新增: 通过ASF挂游戏时长

### V4.7.8

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.8)

- 修复: Twitter转推失败
- 优化: 部分说明文本

### V4.7.7

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.7)

- 修复: 部分非标准Steam群组链接处理错误

### V4.7.6

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.6)

- 修复: GiveeClue首次识别Steam任务重定向至登录链接([#50](https://github.com/HCLonely/auto-task-v4/issues/50))

### V4.7.5

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.5)

- 修复: X/Twitter返回404([#45](https://github.com/HCLonely/auto-task-v4/issues/45))

### V4.7.4

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.4)

- 修复: 重新支持X/Twitter([#44](https://github.com/HCLonely/auto-task-v4/issues/44))
- 优化: 部分日志文本

### V4.7.3

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.3)

- 修复: ASF配置项识别错误([#49](https://github.com/HCLonely/auto-task-v4/issues/49))

### V4.7.2

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.2)

- 优化: Freeanywhere新增tg任务识别

### V4.7.1

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.1)

- 优化: Freeanywhere新增vk任务识别

### V4.7.0

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.7.0)

- 修复: 兼容Freeanywhere新版页面([#48](https://github.com/HCLonely/auto-task-v4/issues/48))

## V4.6

### V4.6.5

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.6.5)

- 优化: Opquests页面加载完成后再验证([#38](https://github.com/HCLonely/auto-task-v4/issues/38))

### V4.6.4

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.6.4)

- 优化: Gleam任务识别

### V4.6.3

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.6.3)

- 优化: opquests无法自动连续验证([#38](https://github.com/HCLonely/auto-task-v4/issues/38))

### V4.6.2

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.6.2)

- 修复: Steam相关任务不执行([#45](https://github.com/HCLonely/auto-task-v4/issues/45))

### V4.6.1

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.6.1)

- 优化: Twitter验证凭证时返回353代码的应对方式([#45](https://github.com/HCLonely/auto-task-v4/issues/45))
- 优化: 初始化失败时跳过相应任务([#45](https://github.com/HCLonely/auto-task-v4/issues/45))

### V4.6.0

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.6.0)

- 新增: GiveawayHopper网站支持

## V4.5

### V4.5.13

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.13)

- 修复: GiveeClub的Twitter任务识别

### V4.5.12

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.12)

- 优化: 兼容Keylol存在目录时的分页识别([#44](https://github.com/HCLonely/auto-task-v4/issues/44))

### V4.5.11

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.11)

- 测试: 尝试修复Indiedb入赠Key时返回403([#43](https://github.com/HCLonely/auto-task-v4/issues/43))

### V4.5.10

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.10)

- 测试: 尝试修复Indiedb入赠Key时返回403([#43](https://github.com/HCLonely/auto-task-v4/issues/43))

### V4.5.9

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.9)

- 修复: Opquests识别不到按钮导致验证停止([#42](https://github.com/HCLonely/auto-task-v4/issues/42))

### V4.5.8

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.8)

- 修复: Opquests识别不到按钮导致验证停止([#42](https://github.com/HCLonely/auto-task-v4/issues/42))

### V4.5.7

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.7)

- 修复: Steam任务完成后的换区逻辑([#41](https://github.com/HCLonely/auto-task-v4/issues/41))

### V4.5.6

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.6)

- 修复: Keylol存在多个ASF激活代码时识别错误([#40](https://github.com/HCLonely/auto-task-v4/issues/40))
- 优化: Steam任务完成后的换区逻辑([#41](https://github.com/HCLonely/auto-task-v4/issues/41))
- 优化: 使用ASF完成愿望单/关注游戏的逻辑

### V4.5.5

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.5)

- 优化: opquests任务无法完成时跳过([#38](https://github.com/HCLonely/auto-task-v4/issues/38))

### V4.5.4

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.4)

- 优化: 未安装TimerHooker脚本时不再弹出空白页面([#36](https://github.com/HCLonely/auto-task-v4/issues/36))

### V4.5.3

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.3)

- 修复: Opquests验证任务报错([#35](https://github.com/HCLonely/auto-task-v4/issues/35))

### V4.5.2

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.2)

- 修复: 弹窗关闭后无法返回原标签页
- 修复: 关注/取关Steam限区游戏时动作错误
- 优化: Steam社区凭证更新逻辑

### V4.5.1

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.1)

- 修复: Steam社区凭证无法更新(#34,#24)

### V4.5.0

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.5.0)

- 修复: 浏览器弹窗拦截导致登录凭证无法更新([#34](https://github.com/HCLonely/auto-task-v4/issues/34))
- 优化: 开发文档

## V4.4

### V4.4.18

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.18)

- 修复:更新Steam社区凭证时重定向到profiles页面后无法正常运行([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.17

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.17)

- 修复:Steam用户名为中文时无法更新社区凭证([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.16

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.16)

- 修复:Steam用户名为中文时无法更新社区凭证([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.15

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.15)

- 修复:更新Steam社区凭证问题([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.14

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.14)

- 修复:Keylol appid获取失败([#33](https://github.com/HCLonely/auto-task-v4/issues/33))
- 修复:License入库失败([#33](https://github.com/HCLonely/auto-task-v4/issues/33))

### V4.4.13

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.13)

- 修复:部分文本错误([#31](https://github.com/HCLonely/auto-task-v4/issues/31))
- 修复:Gleam无法完成弹窗计时任务([#32](https://github.com/HCLonely/auto-task-v4/issues/32))

### V4.4.12

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.12)

- 修复:Steam社区凭证更新错误([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.11

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.11)

- 修复:Steam社区凭证更新错误([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.10

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.10)

- 修复:Gleam没有输入框时报错([#29](https://github.com/HCLonely/auto-task-v4/issues/29))

### V4.4.9

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.9)

- 新增:自动完成Gleam输入框任务
- 优化:增加Gleam可识别任务

### V4.4.8

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.8)

- 修复:更新Steam社区凭证报错([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.7

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.7)

- 优化:Freeanywhere获取没有剩余Key时的提示([#27](https://github.com/HCLonely/auto-task-v4/issues/27))

### V4.4.6

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.6)

- 修复:giveawaysu特供版更新SteamAuth报错([#26](https://github.com/HCLonely/auto-task-v4/issues/26))

### V4.4.5

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.5)

- 修复:Steam凭证更新失败(#16,#24)
- 修复:旧Twitter链接无法识别
- 优化:按钮样式

### V4.4.4

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.4)

- 修复:opquests任务无法验证([#17](https://github.com/HCLonely/auto-task-v4/issues/17))

### V4.4.3

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.3)

- 修复:opquests任务无法验证([#17](https://github.com/HCLonely/auto-task-v4/issues/17))

### V4.4.2

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.2)

- 修复:Steam凭证刷新失败([#16](https://github.com/HCLonely/auto-task-v4/issues/16))

### V4.4.1

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.1)

- 重要:4.4.0以后版本*需TamperMonkey >= 5.2.0或TamperMonkey >= 5.2.6196)
- 重要:暂时取消对Violentmonkey的支持

### V4.4.0

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.4.0)

- 修复:Twitter/X域名更改导致部分功能不可用([#18](https://github.com/HCLonely/auto-task-v4/issues/18))
- 优化:Twitter/X凭证获取方式(需TamperMonkey >= 5.2.0或TamperMonkey >= 5.2.6196)

## V4.3

### V4.3.3

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.3.3)

- 移除:Opquests验证任务功能([#17](https://github.com/HCLonely/auto-task-v4/issues/17))

### V4.3.2

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.3.2)

- 优化:Gleam.io站出现人机验证是停止验证任务

### V4.3.1

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.3.1)

- 优化:Gleam.io站出现人机验证是停止验证任务

### V4.3.0

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.3.0)

- 新增:Steam任务ASF(ASFEnhance)支持

## V4.2

### V4.2.36

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.36)

- 修复:Steam换区失败

### V4.2.35

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.35)

- 修复:Steam换区失败

### V4.2.34

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.34)

- 修复:Youtube获取Token失败

### V4.2.33

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.33)

- 修复:Opquests验证任务报错

### V4.2.32

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.32)

- 优化:Opquests验证任务流程

### V4.2.31

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.31)

- 优化:twitch完整性检查

### V4.2.30

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.30)

- 优化:当 Discord 服务器任务全部设置为'false'时不再弹出相关提醒

### V4.2.29

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.29)

- 优化:Gleam任务识别优化

### V4.2.28

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.28)

- 修复:兼容版BUG

### V4.2.27

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.27)

- 优化:Gleam任务识别优化

### V4.2.26

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.26)

- 优化:Steam凭证更新方式
- 修复:Steam通知相关问题

### V4.2.25

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.25)

- 新增:OPQuests验证任务及获取Key
- 优化:OPQuests鉴赏家任务识别

### V4.2.24

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.24)

- GiveeClub新增Twitter任务识别

### V4.2.23

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.23)

- key-hub.eu反屏蔽ADB

### V4.2.22

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.22)

- Freeanywhere新增剩余Key检测功能

### V4.2.21

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.21)

- 修复Steam凭证验证失败的BUG

### V4.2.20

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.20)

- 修复Steam凭证验证失败的BUG

### V4.2.19

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.19)

- Keyhub可识别任务增加['Follow *** Instagram', 'Watch ...']

### V4.2.18

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.18)

- Gleam任务识别优化

### V4.2.17

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.17)

- 修复Givee无法识别Steam加组任务的BUG

### V4.2.16

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.16)

- Givee任务识别优化
- Givee可识别任务增加(关注Steam游戏)

### V4.2.15

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.15)

- Gleam可识别任务增加(Follow *** on TikTok!)

### V4.2.14

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.14)

- Keyhub可识别任务增加(Check out our other giveaways)
- Keyhub可识别任务增加(Claim this free game on Steam)

### V4.2.13

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.13)

- Keyhub可识别任务增加(itch)
- 移除Keyhub验证任务功能

### V4.2.12

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.12)

- Keyhub可识别任务增加
- GiveeClub添加验证任务功能

### V4.2.11

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.11)

- 修复获取Twitter用户Id失败的BUG

### V4.2.10

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.10)

- 添加全资源版本

### V4.2.9

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.9)

- 修复跳过Discors任务时不做其他任务的BUG([#9](https://github.com/HCLonely/auto-task-v4/issues/9))

### V4.2.8

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.8)

- 修复VK任务获取参数失败的BUG

### V4.2.7

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.7)

- [重要]目前使用Discord相关功能可能会强制退出帐号，请谨慎使用！

### V4.2.6

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.6)

- 优化Steam凭证获取逻辑

### V4.2.5

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.5)

- Gleam任务识别优化
- 一处文本优化

### V4.2.4

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.4)

- Sub入库功能优化
- 更新相关功能优化

### V4.2.3

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.3)

- Keyhub任务识别优化
- Steam换区功能优化
- 其他功能优化

### V4.2.2

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.2)

- Keylol相关功能优化
- 控制台输出优化
- 调试功能优化
- 其他功能优化

### V4.2.1

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.1)

- 修复已知BUG
- 一些优化

### V4.2.0

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.2.0)

- Keyhub任务识别优化
- 添加Steam官方组功能支持
- 白名单功能优化

## V4.1

### V4.1.22-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.22-beta)

- 优化获取Discord凭证功能([#6](https://github.com/HCLonely/auto-task-v4/issues/6))

### V4.1.21-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.21-beta)

- Sub入库功能优化

### V4.1.20-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.20-beta)

- Givekey任务识别优化
- 修复Discord退组失败的BUG
- 数据同步功能优化

### V4.1.19-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.19-beta)

- 更新反馈模板

### V4.1.18-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.18-beta)

- 修复BUG([#3](https://github.com/HCLonely/auto-task-v4/issues/3))

### V4.1.17-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.17-beta)

- 修复获取Discord凭证失败的BUG([#2](https://github.com/HCLonely/auto-task-v4/issues/2))

### V4.1.16-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.16-beta)

- 添加steam请求访问权限功能

### V4.1.15-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.15-beta)

- 优化steam免费游戏入库机制

### V4.1.14-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.14-beta)

- 初始化逻辑优化
- Discord获取凭证逻辑优化

### V4.1.13-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.13-beta)

- 部分功能优化

### V4.1.12-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.12-beta)

- Keyhub任务识别优化
- Keylol新增入库免费游戏功能
- Steam凭证更新功能优化
- 修复已知BUG

### V4.1.11-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.11-beta)

- 修复一处英文文本错误

### V4.1.10-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.10-beta)

- 点赞社区通知增加换区功能

### V4.1.9-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.9-beta)

- 剩余Key检测优化
- GiveeClub愿望单任务识别优化

### V4.1.8-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.8-beta)

- 油管、推特验证机制优化
- 白名单、任务历史、数据同步功能移动到设置页面
- 其他优化

### V4.1.7-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.7-beta)

- Gleam任务识别优化，自动填写表单优化

### V4.1.6-beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.6-beta)

- 避免GiveawaySu得到0000Key, 自动隐藏"Grab key"按钮
- 更新检测优化

### V4.1.5-Beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.5-Beta)

- 反馈功能优化
- 样式优化
- 修复已知BUG

### V4.1.4-Beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.4-Beta)

- 更新检测优化
- Keylol任务识别优化
- Gleam剩余Key检测优化

### V4.1.3-Beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.3-Beta)

- 添加备用更新源
- 添加更新日志
- 优化

### V4.1.2-Beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.2-Beta)

- GiveawaySu特供版添加验证任务功能
- 优化

### V4.1.1-Beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.1-Beta)

- 安全性优化
- 更新反馈链接

### V4.1.0-Beta

[Release](https://github.com/HCLonely/auto-task-v4/releases/tag/v4.1.0-Beta)

- 添加设置同步功能
- 添加任务历史功能
- 添加按钮区域及日志区域自定义位置
- UI美化
- style 兼容性优化
- 添加bug反馈功能
- steam更换地区优化
- Gleam网站功能优化
- 添加GiveeClub网站支持
- 添加Opquests网站支持
- 添加SweepWidget网站支持
- 取消banana网站支持
- 取消freegamelottery网站支持
- 取消marvelousga网站支持
- 取消takekey网站支持

## V3.6

### V3.6.11

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.11)

- 修复twitter凭证更新失败的bug

### V3.6.10

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.10)

- 取消giveaway.su的repage功能，还是老老实实的关闭插件领key吧

### V3.6.9

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.9)

- 取消资源完整性检查

### V3.6.7

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.7)

- 修复giveaway.su识别不出steam加组任务的bug

### V3.6.4

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.4)

- 修复"获取ins用户id"失败的bug
- 修复延迟提醒页面加载失败的bug

### V3.6.3

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.3)

- 实现 giveaway.su 的无刷新验证功能([#44](https://github.com/HCLonely/auto-task/issues/44), [#45](https://github.com/HCLonely/auto-task/issues/45))

### V3.6.1

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.1)

- 修复 '"getYtbToken" failed' bug

### V3.6.0

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.6.0)

- 取消对 gamehag 网站的支持
- 修复 bug

## V3.5

### V3.5.8

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.8)

- 修复 bug

### V3.5.7

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.7)

- 日志输出优化
- 修复 bug

### V3.5.6

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.6)

- 样式修复

### V3.5.5

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.5)

- 修复已知 bug

### V3.5.4

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.4)

- 添加创意工坊相关功能（收藏，点赞等）
- 延迟提醒页面优化，添加不再提醒及只提醒一次功能
- 有限区游戏时自动切换地区（待完善）
- 修复已知 bug

### V3.5.3

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.3)

- 修复 discord 凭证更新失败的 bug ([#41](https://github.com/HCLonely/auto-task/issues/41))

### V3.5.2

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.2)

- 修复 freeanywhere 登录检测失败的 bug

### V3.5.1

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.1)

- 修复 freeanywhere 验证任务 401 的 bug

### V3.5.0

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.5.0)

- givekey 新增 steam 鉴赏家相关功能
- givekey 新增 discord 相关功能
- discord 相关功能优化
- 样式优化

## V3.4

### V3.4.9-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.9)

- 修复 bug

### V3.4.8

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.8)

- 修复 key-hub 登录检测功能
- 修复 Firefox + Violentmonkey 环境下 indieDB 加入赠 key 失败的 bug ([#39](https://github.com/HCLonely/auto-task/issues/39))
- 修复 bug

### V3.4.7-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.7)

- 修复 bug

### V3.4.6-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.6)

- 修复 bug

### V3.4.5-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.5)

- 修复 bug

### V3.4.4-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.4)

- 修复 bug

### V3.4.3-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.3)

- 修复获取不到 discord 凭证的 bug
- 添加移除任务延迟提醒功能(仅支持 giveaway.su)

### V3.4.2

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.2)

- 修复 takekey 验证任务失败的 bug
- 修复转发 vk 动态任务报错的 bug

### V3.4.1

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.1)

- keyhub 增加 discord 任务支持
- keyhub 加入 steam 组任务修复

### V3.4.0

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.4.0)

- 添加 freeanywhere 网站支持

## V3.3

### V3.3.11

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.11)

- 修复获取 youtube apiKey 失败的 bug

### V3.3.10

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.10)

- 修复获取 twitter 用户 id 失败的 bug

### V3.3.9

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.9)

- 修复 gleam.io 处理 twitch 任务失败的 bug

### V3.3.8

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.8)

- 安全性更新

### V3.3.7

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.7)

- 修复 gleam 加入 discord 服务器失败的 bug

### V3.3.6

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.6)

- 修复 bug ([#36](https://github.com/HCLonely/auto-task/issues/36))

### V3.3.5

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.5)

- 修复 givekey 不做愿望单任务的 bug

### V3.3.4-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.4)

- 修复设置页面报错的 bug

### V3.3.3-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.3)

- 注册右键菜单
- 新增 http 请求重试

### V3.3.2

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.2)

- 修复 giveaway.su 加入 discord 服务器报错的 bug

### V3.3.1-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.1)

- 修改问题模板
- 修复 更换语言报错的 bug

### V3.3.0-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.3.0)

- 添加“移除”白名单功能
- 修复 获取 discord 凭证失败的 bug
- 修复 退出 discord 服务器失败的 bug
- 修复 其乐加入 steam 组失败的 bug
- 优化 discord 凭证获取
- 修改主页重定向链接

## V3.2

### V3.2.5-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.2.5)

- 修复 keyhub 识别 steam 加组任务失败的 bug
- 修复 keyhub 无法验证任务的 bug

### V3.2.4-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.2.4)

- gleam 添加 discord 任务支持
- 修复 gleam 访问链接出错的 bug

### V3.2.3-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.2.3)

- i18n 优化
- 代码优化

### V3.2.2-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.2.2)

- 添加 key-hub.eu 网站支持 ([#17](https://github.com/HCLonely/auto-task/issues/17))
- 代码优化
- 修复某些设置项不生效的 bug

### V3.2.1-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.2.1)

- 移除公告按钮
- 优化 ins 请求失败的提示
- 代码优化
- 修复某些提示错误的 bug

### V3.2.0-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.2.0)

- 添加 takekey 网站支持([#30](https://github.com/HCLonely/auto-task/issues/30))
- 源码逻辑优化
- 修复 bug

## V3.1

### V3.1.6-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.6)

- 修复 givekey 剩余 key 检测错误的 bug

### V3.1.5-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.5)

- 添加 givekey 网站支持([#28](https://github.com/HCLonely/auto-task/issues/28))

### V3.1.4-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.4)

- 凭证获取优化

### V3.1.3-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.3)

- 添加 youtube 相关功能
- 修复 bug

### V3.1.2

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.2)

- 修复 bug

### V3.1.1

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.1)

- 修复 twitter 参数获取失败的的问题

### V3.1.0

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.1.0)

- 发布正式版！

## V3.0

### V3.0.32-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.32)

- 添加请求延迟
- 修复部分拼写错误

### V3.0.31-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.31)

- 添加关注 reddit 用户功能

### V3.0.30-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.30)

- 整合依赖文件
- 修复 bug

### V3.0.29-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.29)

- 优化更新链接

### V3.0.28-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.28)

- 异常捕获优化

### V3.0.27-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.27)

- 修复 bug

### V3.0.26-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.26)

- 其乐论坛添加多选功能

### V3.0.25-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.25)

- 修复 bug

### V3.0.24-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.24)

- 添加 CodeQL

### V3.0.23-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.23)

- giveaway.su 屏蔽获取 key 按钮

### V3.0.22-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.22)

- 添加 steam 订阅论坛功能
- 修复 bug

### V3.0.21-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.21)

- 修复 bug

### V3.0.20-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.20)

- 修复 bug

### V3.0.19-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.19)

- 新增网站: keylol
- 新增网站: gamehag
- 移除网站: takekey

### V3.0.18-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.18)

- 修复 bug

### V3.0.17-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.17)

- 修复 bug

### V3.0.16-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.16)

- 修复 bug

### V3.0.15-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.15)

- 优化目录结构

### V3.0.14-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.14)

- 修复 bug

### V3.0.13-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.13)

- 修复 bug
- 代码优化

### V3.0.12-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.12)

- 修复 bug

### V3.0.11-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.11)

- 修复 bug

### V3.0.10-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.10)

- 设置项优化

### V3.0.9-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.9)

- 添加 vk 相关功能
- 代码优化

### V3.0.8-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.8)

- 添加 twitch 相关功能
- 添加 reddit 相关功能

### V3.0.7-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.7)

- 修复错误的更新链接([#26](https://github.com/HCLonely/auto-task/issues/26))

### V3.0.6-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.6)

- 添加 ins 相关功能

### V3.0.4-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.4)

- 添加 discord 相关功能

### V3.0.3-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.3)

- 添加设置页面 CNAME

### V3.0.2-Pre

[Release](https://github.com/HCLonely/auto-task/releases/tag/3.0.2)

- 目录结构优化
