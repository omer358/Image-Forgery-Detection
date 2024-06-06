import React, { useCallback, useEffect, useState } from "react";
import "./fileUploader.css";
import { useDropzone } from "react-dropzone";
// const axios = require("axios").default;
import axios from "../axios";
import { upload } from "@testing-library/user-event/dist/upload";
import UploadImg from "../assets/UploadImg.png";
import logo from "../assets/logo.png";

function FileUploader() {
  const [image, setImage] = useState();
  const [Isloading, setIsloading] = useState(false);
  const [fileSelected, setfileSelected] = useState(false);
  const [predictedresult, setPredictedResult] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    setImage(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )[0]
    );
    setfileSelected(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
    multiple: false,
  });

  // =========Send Image to server
  const sendFile = async () => {
    if (fileSelected) {
      let formData = new FormData();
      formData.append("file", image);
      const res = await axios.post("/predict", formData, {
        responseType: "arraybuffer",
      });
      console.log("res __ : " + res.data);
      if (res.status === 200) {
        // let base64ImageString = Buffer.from(res.data, "binary").toString(
        //   "base64"
        // );
        let base64ImageString = window.btoa(
          String.fromCharCode(...new Uint8Array(res.data))
        );
        let maskSrc = "data:image/png;base64," + base64ImageString;
        setPredictedResult(maskSrc);
      }
      setIsloading(false);
    }
  };

  return (
    <main className="main-container">
      <div className="glass"></div>
      <div className="meshGradient">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
      <heder className="header">
        <div className="logo">
          <div className="logo__img">
            <img src={logo} alt="logo" />
          </div>
          <h3>IFD</h3>
        </div>
        <div className="nav">
          <ul>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </heder>

      <div className="Hero_container">
        <section className="hero_Section">
          <div className="hero-text">
            <h1>
              Copy-<span>move</span> <br /> Image forgery regions detector
            </h1>
            <p>Upload Your fogred Image and detect the forged regions</p>
          </div>
          <div className="hero-imageUploader">
            <div className="uploadImge-card">
              <h4 className="cardTitle">upload Image</h4>
              <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the Image here ...</p>
                ) : (
                  <div>
                    <div className="upload-icon">
                      <img src={UploadImg} />
                    </div>
                    <p>
                      Drag n drop your image here, or click to{" "}
                      <span>browse</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="detector-container">
        <div className="glass"></div>
        <div className="meshGradient mesh-left">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="detection-section">
          <div className="image-preview">
            <div className="thumbInner preview">
              <h4 className="cardTitle">Forged Image</h4>
              <div className="imgCont">
                {fileSelected ? (
                  <img
                    src={image.preview}
                    className="img"
                    alt="image"
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                      URL.revokeObjectURL(image.preview);
                    }}
                  />
                ) : (
                  <img src="https://picsum.photos/500" alt="logo" />
                )}
              </div>
            </div>
          </div>
          <div className="uploadBtn">
            <button className="UploadBtn" onClick={sendFile}>
              upload and predict 👉
            </button>
          </div>
          <div className="result">
            <div className="thumbInner">
              <h4 className="cardTitle">Predicted mask</h4>

              <div className="imgCont">
                {predictedresult ? (
                  <img src={predictedresult} className="img" alt="image" />
                ) : (
                  <img
                    // src={predictedresult}
                    src="https://www.jotform.com/blog/wp-content/uploads/2015/10/pexels-photo.jpg"
                    className="img"
                    alt="image"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default FileUploader;
