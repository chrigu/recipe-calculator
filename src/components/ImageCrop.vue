<template>
    <div class="container">
      <h1>crop image</h1>
      <div class="image-area">
        <img class="image-area__image" :src="imageSource" ref="imageBackground">
        <canvas class="image-area__drawing-area" ref="cropArea" @mousemove="handleDrag"
                               @mousedown="startDrag"
                               @mouseup="endDrag"
                               @mouseleave="endDrag"></canvas>
       <button :disabled="!done" @click="crop">Crop & Process</button>
      </div>
  </div>
</template>

<script>
  import { STATUS_SUCCESS, STATUS_FAILED } from '../constants'
  // import { cropAndResizeImage } from '../services/resize.service'

  const getRelativeX = function (element, event) {
    return event.pageX - element.getBoundingClientRect().x
  }

  const getRelativeY = function (element, event) {
    return event.pageY - element.getBoundingClientRect().y
  }

  const initCanvas = function (canvas, imageBackground) {
    // https://www.html5rocks.com/en/tutorials/canvas/hidpi/
    let ctx = canvas.getContext('2d')
    let devicePixelRatio = window.devicePixelRatio || 1
    let backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1

    let ratio = devicePixelRatio / backingStoreRatio

    canvas.width = imageBackground.width
    canvas.height = imageBackground.height

    // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {
      let oldWidth = canvas.width
      let oldHeight = canvas.height

      canvas.width = oldWidth * ratio
      canvas.height = oldHeight * ratio

      canvas.style.width = imageBackground.width + 'px'
      canvas.style.height = imageBackground.height + 'px'

      // now scale the context to counter
      // the fact that we've manually scaled
      // our canvas element
      ctx.scale(ratio, ratio)
    }
    return ratio
  }

  const translateCoords = function (xOrigin, yOrigin, widthOrigin, heightOrigin, widthTarget, heightTarget) {
    let newX = xOrigin * (widthTarget / widthOrigin)
    let newY = yOrigin * (heightTarget / heightOrigin)

    return {x: newX, y: newY}
  }

  const canvas2ImageCoords = function (x, y, image, canvas) {
    return translateCoords(x, y, canvas.width, canvas.height, image.width, image.height)
  }

  export default {
    name: 'ImageCrop',
    data () {
      return {
        dragging: false,
        boxOrigin: {
          x: 0,
          y: 0
        },
        imageSource: '',
        ratio: 1,
        done: false
      }
    },
    props: ['image', 'imageReady'],
    computed: {
      isSuccess () {
        return this.uploadState === STATUS_SUCCESS
      },
      isFailed () {
        return this.uploadState === STATUS_FAILED
      }
    },
    methods: {
      handleDrag (event) {
        if (this.dragging) {
          let ctx = this.$refs.cropArea.getContext('2d')
          // ctx.scale(this.ratio, this.ratio)
          ctx.clearRect(0, 0, this.$refs.cropArea.width, this.$refs.cropArea.height)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
          ctx.fillRect(0, 0, this.$refs.cropArea.width, this.$refs.cropArea.height)
          ctx.clearRect(this.boxOrigin.x, this.boxOrigin.y,
            getRelativeX(this.$refs.cropArea, event) - this.boxOrigin.x,
            getRelativeY(this.$refs.cropArea, event) - this.boxOrigin.y)
        }
      },
      startDrag (event) {
        this.done = false
        this.boxOrigin = {
          x: getRelativeX(this.$refs.cropArea, event),
          y: getRelativeY(this.$refs.cropArea, event)
        }
        let ctx = this.$refs.cropArea.getContext('2d')
        ctx.fillRect(this.boxOrigin.x * this.ratio, this.boxOrigin.y * this.ratio, 1, 1)
        this.dragging = true
      },
      endDrag () {
        this.dragging = false
        this.done = true
      },
      crop () {
        console.log('crop', this.image.height, this.image.width)
        console.log(canvas2ImageCoords(this.boxOrigin.x, this.boxOrigin.y, this.image, this.$refs.cropArea))
        // cropAndResizeImage(this.image, 0, 0, 0, 0)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.ratio = initCanvas(this.$refs.cropArea, this.$refs.imageBackground)
      })
      this.imageSource = this.image.src
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.image-area {
  max-width: 90%;
  position: relative;
}

.image-area__image {
  width: 100%;
}

.image-area__drawing-area {
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  width: 100%;
  cursor: crosshair;
}

</style>
