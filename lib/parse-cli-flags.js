function parseCLIFlags () {
  const args = process.argv.slice(2)
  const flags = {}
  args.forEach(flag => {
    const key = flag.split('=')[0]
    const value = flag.split('=')[1]
    flags[key] = value
  })
  return flags
}

module.exports = parseCLIFlags()
