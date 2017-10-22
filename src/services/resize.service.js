import Promise from 'bluebird'

function dataURLToBlob (dataURL) {
  let BASE64_MARKER = ';base64,'
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    let parts = dataURL.split(',')
    let contentType = parts[0].split(':')[1]
    let raw = parts[1]

    return new Blob([raw], {type: contentType})
  }

  let parts = dataURL.split(BASE64_MARKER)
  let contentType = parts[0].split(':')[1]
  let raw = window.atob(parts[1])
  let rawLength = raw.length

  let uInt8Array = new Uint8Array(rawLength)

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  return new Blob([uInt8Array], {type: contentType})
}

function resizeImage (file) {
  // Resize the image (https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload)
  // Ensure it's an image
  if (file.type.match(/image.*/)) {
    console.log('An image has been loaded')

    return new Promise(function (resolve, reject) {
      // Load the image
      let reader = new FileReader()
      reader.onload = function (readerEvent) {
        let image = new Image()

        image.onload = function (imageEvent) {
          // Resize the image
          let canvas = document.createElement('canvas')
          let maxSize = 544// TODO : pull max size from a site config
          let width = image.width
          let height = image.height
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(image, 0, 0, width, height)
          let dataUrl = canvas.toDataURL('image/jpeg')
          let data = dataURLToBlob(dataUrl)
          resolve(data)
        }
        image.src = readerEvent.target.result
      }
      reader.readAsDataURL(file)
    })
  }
}

export { resizeImage }
