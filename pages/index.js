import React, {useEffect, useRef, useState} from "react"

import Head from "next/head"
import Image from "next/image"
import {MdCheckCircle} from "@react-icons/all-files/md/MdCheckCircle"
import {MdReport} from "@react-icons/all-files/md/MdReport"
import axios from "axios"
import {useDropzone} from "react-dropzone"

const Home = () => {
  const {acceptedFiles, getRootProps} = useDropzone()

  const [error, setError] = useState(undefined)
  const [image, setImage] = useState(undefined)
  const [imgLink, setImgLink] = useState(undefined)
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)

  const activateHiddenFileInput = () => {
    inputRef.current.click()
  }

  const hiddenInputHandler = (params) => {
    setImage(params.target.files[0])
  }

  const copyImgLink = () => {
    navigator.clipboard.writeText(imgLink).then()
  }

  const reset = () => {
    setImage()
    setImgLink()
    setError()
    setUploading(false)
  }

  useEffect(() => {
    if (acceptedFiles.length === 1) {
      setImage(acceptedFiles[0])
    }
  }, [acceptedFiles])

  useEffect(() => {
    if (image) {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", image)
      formData.append("upload_preset", "qbhopo36")
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
      axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        formData,
      ).then(r => {
        setImgLink(r.data.url)
      }).catch(e => {
        if (e.response) setError(e.response.data)
        else if (e.message) setError(e.message)
        else setError(JSON.stringify(e, undefined, 2))
      }).finally(() => {
        setUploading(false)
      })
    }
  }, [image])

  return (
    <>
      <Head>
        <title>Image Uploader</title>
      </Head>
      <div className="screen-wrapper">

        {!image && !imgLink && !uploading && (
          <div className="card uploader" data-cy="uploaderCard">
            <input accept="image/*" className="invisible" data-cy="hiddenInput" onChange={hiddenInputHandler} ref={inputRef} type='file' />

            <span className="card-title">Upload your image</span>
            <span className="uploader-subtitle">File should be Jpeg, Png, ...</span>
            <div className="drag-area" {...getRootProps()} data-cy="dragArea">
              <Image alt="uploader image" height={100} src="/images/image.svg" width={150} />
              <span className="drag-instructions">Drag & Drop your image here</span>
            </div>
            <span className="drag-instructions">Or</span>
            <button className="mt" data-cy="uploadButton" onClick={activateHiddenFileInput}>Choose a file</button>
          </div>
        )}

        {uploading && (
          <div className="card uploading" data-cy="uploadingCard">
            <span className="card-title">Uploading</span>

            <div className="loader-bar" data-cy="loaderBar">
              <span className="loader-item" data-cy="loaderItem" />
            </div>
          </div>
        )}

        {image && imgLink && (
          <div className="card uploaded" data-cy="uploadedCard">

            <MdCheckCircle
              color="#219653"
              size={35}
              style={{
                marginBottom: 16
              }}
            />

            <span className="card-title">Uploaded Successfully!</span>

            <div className="uploaded-image">
              <Image alt="uploaded image" data-cy="uploadedImage" layout="fill" objectFit="cover" src={URL.createObjectURL(image)} />
            </div>

            <div className="file-link-wrapper">
              <span data-cy="uploadedImageLink" data-value={imgLink}>{imgLink.substring(0, 55)}...</span>
              <button data-cy="copyButton" onClick={copyImgLink}>Copy</button>
            </div>

            <div style={{marginTop: 32}}>
              <button data-cy="resetButton" onClick={reset}>Upload new Image</button>
            </div>
          </div>
        )}

        {!uploading && !image && !imgLink && error && (
          <div className="card error" data-cy="errorCard">

            <MdReport
              color="#f56c6c"
              size={35}
              style={{
                marginBottom: 16
              }}
            />

            <span className="error" data-cy="error">{error}</span>

          </div>
        )}

        <div className="footer">
          created by &nbsp;<span className="footer-bold">apothuaud</span>&nbsp;- devChallenges.io
        </div>
      </div>
    </>
  )
}

export default Home
