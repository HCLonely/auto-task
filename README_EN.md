[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Chrome >= 58](https://img.shields.io/badge/Chrome-%3E%3D%2058-blue)
[![GitHub](https://img.shields.io/github/license/HCLonely/auto-task)](https://github.com/HCLonely/auto-task/blob/master/LICENSE)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/HCLonely/auto-task)](https://github.com/HCLonely/auto-task/releases)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/HCLonely/auto-task/Test)

# Warning

**The preview version may need to enable [Experimental JavaScript](chrome://flags/#enable-javascript-harmony).**

# Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Install [auto-task.user.js](https://userjs.hclonely.com/auto-task.user.js)
3. It is recommended to [set it](https://userjs.hclonely.com/setting_en.html) for the first time
4. If the `A userscript wants to access a cross-origin resource` page pops up, please click `Always allow all domains`

**If there is a bug in the script, please check if the script is the latest version, if not, please update to the latest version.**

**If a bug occurs after updating the script, you can go to `https://cdn.jsdelivr.net/gh/HCLonely/auto-task@version/auto-task.user.js` (*change `version` to the previous version Version number, for example: `https://cdn.jsdelivr.net/gh/HCLonely/auto-task@2.2.6/auto-task.user.js`*) to install the previous version (only supports versions after 2.2.5 ). And then feedback BUG, waiting for repair.**

# Function of each button

- The function of the `Fuck`, `Join`, `Verify`, `Remove` buttons can be found on the [settings page](https://userjs.hclonely.com/setting_en.html)
- The function of the `Showlogs`, `Hidelogs` buttons: show/hide logs in bottom right corner
- `Clear cache` function in the bottom right corner: Each time the script finishes the task, it saves the task information to use the `Remove` function. If you are prompted that `all tasks have been completed` but have not done any tasks, you can try `Clear cache`, and then refresh and do the tasks again. `Clear cache` will cause tasks previously done to fail to` Remove`.

# Solutions to common problems

1. `giveaway.su` website `0000-0000-0000`

    Solution: Close the script manager and the ad blocking plugin after completing the task with the script, and then refresh the page to verify the task yourself.

2. `givekey.su` website CAPTCHA

    Solution: Every time you click the `Fuck` button, you must complete the CAPTCHA yourself.

3. `givekey.su` website wss connection error

    Solution: Reference [#8](https://github.com/HCLonely/auto-task/issues/8)

# Applicable website

* [giveaway.su](https://giveaway.su/)
* [marvelousga](https://marvelousga.com/)
* [dupedornot](https://dupedornot.com/)
* [grabfreegame](https://www.grabfreegame.com/)
* [bananagiveaway](https://www.bananagiveaway.com/)
* ~~[gamecode.win](https://gamecode.win/)~~
* [gamehag](https://gamehag.com/giveaway)
* [prys](https://prys.revadike.com/)
* [indiedb](https://www.indiedb.com/giveaways)
* [givekey](https://givekey.ru/)(Need to set the language to "Русский")
* [takekey](https://takekey.ru/)
* [freegamelottery](https://freegamelottery.com/)
* [gleam.io](http://gleam.io/)
* [spoune](https://www.spoune.com/index.php)

# Features

* Automate Steam tasks：
  * Join group
  * Add to wishlist
  * Follow game
  * Follow curator
  * Follow publisher(Only [giveaway.su](https://giveaway.su/))
  * Follow developer(Only [giveaway.su](https://giveaway.su/))
  * Like announcement(Only [giveaway.su](https://giveaway.su/))

* Auto exit Steam task：
  * Leave group
  * Remove from wishlist
  * Unfollow game
  * Unfollow curator
  * Unfollow publisher(Only [giveaway.su](https://giveaway.su/))
  * Unfollow developer(Only [giveaway.su](https://giveaway.su/))

* Auto visit page
* Verify task
* Check if you are logged in (if needed)
* Check if key is left
* Unfinished tasks or tasks that cannot be completed by the script automatically open the task page for you to complete yourself
* Check for updates automatically
* Export and import settings

**<span style="color: #ff0000;">The above features are not all enabled by default. For detailed settings, please go to [setting page](https://userjs.hclonely.com/setting_en.html). Don't forget to save after setting!!!</span>**

**<span style="color: #ff0000;">If you use 2.0+ version for the first time, it is recommended to set it first!</span>**

# Feedback

* [Issue](https://github.com/HCLonely/auto-task/issues/new/choose)

# Update announcement

[https://userjs.hclonely.com/announcement.html](https://userjs.hclonely.com/announcement.html)

<span style="color: #ff0000;">**The new version has a short test time, and there may be bugs. Welcome to come back. The previous version([Click here to install](https://greasyfork.org/zh-CN/scripts/395098)) has been saved. Never update!**</span>
