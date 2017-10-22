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
  </div>
</template>

<script>
  import { resizeImage } from '../services/resize.service'
  import { upload } from '../services/file-upload.service'
  import { STATUS_INITIAL, STATUS_SAVING, STATUS_SUCCESS, STATUS_FAILED } from '../constants'
  const FIELD_NAME = 'recipe'

  export default {
    name: 'UploadComponent',
    data () {
      return {
        uploadedFiles: [],
        uploadError: null,
        ingredients: [],
        currentStatus: null,
        uploadFieldName: FIELD_NAME
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
      }
    },
    methods: {
      reset () {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL
        this.uploadedFiles = []
        this.uploadError = null
      },
      save (formData) {
        // upload data to the server
        this.currentStatus = STATUS_SAVING
        let image = formData.get(FIELD_NAME)

        resizeImage(image)
          .then(data => {
            formData.set(FIELD_NAME, data)
            return upload(formData)
          }).then(ingredients => {
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
        const formData = new FormData()

        if (!fileList.length) return

        // append the files to FormData
        Array
          .from(Array(fileList.length).keys())
          .map(x => {
            formData.append(fieldName, fileList[x], fileList[x].name)
          })

        // save it
        this.save(formData)
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
