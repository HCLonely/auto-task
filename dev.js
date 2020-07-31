var fs = require('fs');

function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

const files = [
  'announcement.html',
  'announcement.json',
  'auto-task.css',
  'auto-task.user.js',
  'favicon.ico',
  'index.html',
  'new.json',
  'setting.html',
  'setting_en.html',
  'version'
]

if (!fs.existsSync('public')) {
  fs.mkdirSync('public')
}

for(const file of files){
  copyFile(file, 'public/' + file)
}
