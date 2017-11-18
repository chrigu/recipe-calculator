<template>
    <div class="container">
      <!--UPLOAD-->
      <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
        <div class="dropbox">
          <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file">
            <p v-if="isInitial">
              Drag your file(s) here to begin<br> or click to browse
            </p>
            <p v-if="isSaving">
              Uploading {{ fileCount }} files...
            </p>
        </div>
      </form>
      <div class="crop-container" v-if="imageReady" >
        <!--image-crop :image="image" :imageReady="imageReady" @cropDone="upload"></image-crop-->
        <vue-cropper
            ref='cropper'
            :guides="false"
            :view-mode="2"
            drag-mode="crop"
            :auto-crop-area="0.5"
            :min-container-width="250"
            :min-container-height="180"
            :background="true"
            :rotatable="true"
            :src="image.src"
            alt="Source Image"
            :img-style="{width: '400px', height: '300px'}"
            :crop="crop">
        </vue-cropper>
        <button @click="cropAndUpload">Crop & Process</button>
      </div>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropperjs'
  import { imageFromFile, resizeImage } from '../services/resize.service'
  import ImageCrop from './ImageCrop.vue'
  import { upload } from '../services/file-upload.service'
  import { STATUS_INITIAL, STATUS_SAVING, STATUS_SUCCESS, STATUS_FAILED } from '../constants'
  const FIELD_NAME = 'recipe'

  export default {
    name: 'UploadComponent',
    components: {ImageCrop, VueCropper},
    data () {
      return {
        uploadedFiles: [],
        uploadError: null,
        ingredients: [],
        currentStatus: null,
        uploadFieldName: FIELD_NAME,
        image: null,
        formImage: null
      }
    },
    computed: {
      isInitial () {
        return this.currentStatus === STATUS_INITIAL
      },
      isSaving () {
        return this.currentStatus === STATUS_SAVING
      },
      isSuccess () {
        return this.currentStatus === STATUS_SUCCESS
      },
      isFailed () {
        return this.currentStatus === STATUS_FAILED
      },
      imageReady () {
        return this.image !== null
      }
    },
    methods: {
      reset () {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL
        this.uploadedFiles = []
        this.uploadError = null
      },
      upload (canvas) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING
        // this.formData.set(FIELD_NAME, imageBlob)

        // let formData = new FormData()
        // formData.append(FIELD_NAME, imageBlob)

        // upload(formData)
        let resizedBlog = resizeImage(canvas, 1000)
        console.log('newData', resizedBlog)
        let formData = new FormData()
        formData.append(FIELD_NAME, resizedBlog)
        console.log(formData)
        // formData.set(FIELD_NAME, data)
        // console.log(image)
        // add canvas dynamically
        // have crop component
        // select crop
        // resizeIma
        // upload
        // return imageFromFile(formData.get(FIELD_NAME))
        upload(formData)
          // .then(image => this.updateBackground(image))
          .then(ingredients => {
            this.currentStatus = STATUS_SUCCESS
            this.$emit('uploadDone', STATUS_SUCCESS, ingredients)
          })
          .catch(err => {
            console.log('upload failed', err)
            this.uploadError = err.response
            this.currentStatus = STATUS_FAILED
            this.$emit('uploadDone', STATUS_FAILED, null)
          })

        // upload(formData)
        //   .then(x => {
        //     // for num ingredients
        //     //   make element
        //     //   bind input to slider
        //     this.ingredients = x
        //     this.currentStatus = STATUS_SUCCESS
        //     this.$emit('uploadDone', STATUS_SUCCESS)
        //   })
        //   .catch(err => {
        //     this.uploadError = err.response
        //     this.currentStatus = STATUS_FAILED
        //     this.$emit('uploadDone', STATUS_FAILED)
        //   })
      },
      filesChange (fieldName, fileList) {
        // handle file changes
        // if FormData .set & .get are supported (not Safari)
        // this.formData = new FormData()

        if (fieldName !== FIELD_NAME && !fileList.length) return

        this.formImage = fileList[0]
        // append the files to FormData
        // Array
        //   .from(Array(fileList.length).keys())
        //   .map(x => {
        //     this.formData.append(fieldName, fileList[x], fileList[x].name)
        //   })
        // console.log(this.formData.get)
        // imageFromFile(this.formData.get(FIELD_NAME))
        imageFromFile(this.formImage)
        // imageFromFile(formData[FIELD_NAME])
          .then(image => {
            this.image = image
          })
        // this.image = formData.get(FIELD_NAME)
        // save it
        // this.save(formData)
      },
      crop (e) {
        let data = e.detail
        // let previewAspectRatio = data.width / data.height
        console.log(data, this.$refs.cropper.getCroppedCanvas())
      },
      cropAndUpload (e) {
        console.log(this.$refs.cropper.getCroppedCanvas())
        this.upload(this.$refs.cropper.getCroppedCanvas())
      }
    },
    mounted () {
      this.reset()
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

.factor {
  width: 75%;
  height: 20px;
}
</style>
