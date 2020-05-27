var db = require('../models')
var computerVision = require('../CompVision.js')
var path = require('path')
var axios = require('axios')
var geoip = require('geoip-lite')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/userImages')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.replace(/image\//gi, '.')
    cb(null, Date.now() + ext)
  }
})

var upload = multer({ storage: storage })

module.exports = function (app) {
  app.post('/api/travelligence', upload.array('interests-images'), (req, res) => {
    console.log(req.socket.remoteAddress)

    const protocol = req.protocol
    const host = req.get('host')
    const name = req.body.name
    const images = req.files
    const lang = !!req.body['lang-pref']
    const culture = !!req.body['culture-pref']
    const ip = req.headers['x-forwarded-for'] || req.ip
    const langSetting = req.headers['accept-language']

    const result = {
      name: name,
      images: images,
      lang: lang,
      culture: culture,
      ip: ip,
      langSetting: langSetting,
      // geo: geoip.lookup(this.ip)
      geo: geoip.lookup('97.97.185.240')
    }

    axios.get(`https://api.agify.io?name=${result.name}&country_id=${result.geo.country}`).then(function (data) {
      // console.log(data)
      result.age = data.data.age
      // console.log(result)
    })

    result.images.forEach(async function (image) {
      // console.log(image)
      var imgPath = protocol + '://' + host + '/userImages/' + image.filename
      // console.log(imgPath)
      // console.log(host + '/userImages/' + image.filename)

      await computerVision(imgPath)
    })

    res.redirect('/')
  })
}
