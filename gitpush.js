const { exec } = require('child_process')
const fs = require('fs')

function shell (e, next = null) {
  const command = exec(e, (error, options, stdout, stderr) => {
    if (error) {
      console.log(error)
    }
  })
  command.stdout.on('data', data => { console.log(data) })
  command.stderr.on('data', data => { console.log(data) })
  command.on('exit', () => {
    if (next) next()
    else console.log('-----End-----')
  })
}

shell('git add .', () => {
  const announcement = JSON.parse(fs.readFileSync('announcement_raw.json')).join('\n')
  shell(`git commit -m '${announcement}'`, () => {
    shell('git push')
  })
})
