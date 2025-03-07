import {spawn} from 'node:child_process'
import {renameSync, rmSync} from 'node:fs'

export function trim(filePath: string, startTime?: string, endTime?: string): Promise<string | void> {
  console.info(`trimming ${filePath} from ${startTime} to ${endTime}`)
  const startTimeInSeconds = timeToSeconds(startTime || "")
  const args: string[] = []
  if (startTime) {
    args.push(`-ss`)
    args.push(startTimeInSeconds.toString())
  }
  args.push('-i')
  args.push(filePath)

  if (endTime) {
    args.push("-to")
    if (startTime) {
      const duration = timeToSeconds(endTime) - startTimeInSeconds
      args.push(duration.toString())
    } else {
      args.push(endTime.toString())
    }
  }

  args.push('-c')
  args.push('copy')
  args.push('-an')

  const outputFile = filePath.replace('.mp4', '-trimmed.mp4')
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
    const errorChunks: Buffer[] = []
    process.stdout.on('data', (data) => console.log(`stdout:  ${data}`))
    process.stderr.on('data', (data) => errorChunks.push(data))
    process.on('close', (code) => {
      if (code === 0) {
        rmSync(filePath)
        renameSync(outputFile, filePath)
        resolve()
      } else {
        reject(errorChunks)
      }
    })
  })
}

export function getDuration(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.info('getting duration')
    const process = spawn('ffprobe', ['-i', fileName, '-show_entries', 'format=duration', '-v', 'error',  '-of', 'json'], {timeout: 10000})
    const chunks: Buffer[] = []
    const errorChunks: Buffer[] = []
    process.stdout.on('data', (data) => {
      chunks.push(data)
    })
    process.stderr.on('data', (data) => {
      errorChunks.push(data)
    })
    process.on('error', (e) => {
      console.error(e)
      reject(e)
    })
    process.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(chunks.join('').toString()).format.duration)
      } else {
        reject(errorChunks.toString())
      }
    })
  })
}

function timeToSeconds(time: string): number {
  if (time.includes(':')) {
    const [minutes, seconds] = time.split(':')
    return parseInt(minutes) * 60 + parseInt(seconds)
  }

  return parseInt(time)
}
