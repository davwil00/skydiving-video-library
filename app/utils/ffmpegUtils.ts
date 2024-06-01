import {spawn} from 'node:child_process'
import {renameSync, rmSync} from 'node:fs'

export function trim(filePath: string, startTime?: number, endTime?: number): Promise<string | void> {
  const file = `./public${filePath}`
  const args: string[] = []
  if (startTime) {
    args.push(`-ss`)
    args.push(startTime.toString())
  }
  args.push('-i')
  args.push(file)

  if (endTime) {
    args.push("-to")
    if (startTime) {
      const duration = startTime - endTime
      args.push(duration.toString())
    } else {
      args.push(endTime.toString())
    }
  }

  args.push('-c')
  args.push('copy')
  args.push('-an')

  const outputFile = file.replace('.mp4', '-trimmed.mp4')
  args.push(outputFile)

  console.log("Calling ffmpeg with args ", args)

  return new Promise((resolve, reject) => {
    const process = spawn('ffmpeg', args, {
      timeout: 10000
    })
    process.on('error', (e) => {
      console.error(e)
      reject(e)
    })
    process.stdout.on('data', (data) => console.log(`stdout:  ${data}`))
    process.stderr.on('data', (data) => console.error(`stderr: ${data}`))
    process.on('close', (code) => {
      if (code === 0) {
        rmSync(file)
        renameSync(outputFile, file)
        resolve()
      }
    })
  })
}
