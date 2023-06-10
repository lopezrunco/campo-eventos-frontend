import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React, { useState } from "react";

import http from "../../../utils/http-common";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import AppendImage from "./components/AppendImage";

import "./styles.scss";

const FileUpload = (file) => {
  let formData = new FormData();
  formData.append("file", file);

  return http.post("/image-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const UploadImageToLiveEvent = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [message, setMessage] = useState("");
  const [appendImageToEvent, setAppendImageToEvent] = useState(false);
  const { id } = useParams();

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const upload = () => {
    let currentFile = selectedFiles[0];
    setCurrentFile(currentFile);

    FileUpload(currentFile, () => {
      setMessage("Uploading file");
    })
      .then((response) => {
        setMessage(response.data.message);
        setAppendImageToEvent(true);
      })
      .catch(() => {
        setMessage("Could not upload the file");
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Afiche del evento"} />
      </motion.div>
      <section className="upload-file-page">
        <article className="container">
          <div className="row">
            <div className="col-12">
              <div className="card p-5">
                <h3>Subir imagen</h3>
                <div className="separator"></div>
                <p>
                  Seleccione una imagen desde su dispositivo para usar como
                  afiche del evento a transmitir.
                </p>
                <label className="btn btn-default">
                  <input type="file" onChange={selectFile} />
                </label>
                <button
                  className="btn btn-success"
                  disabled={!selectedFiles}
                  onClick={upload}
                >
                  <i className="fas fa-upload"></i> Subir archivo
                </button>

                <div className="p-3">{message}</div>

                {appendImageToEvent && (
                  <AppendImage liveEventId={id} imageName={currentFile.name} />
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};

export default UploadImageToLiveEvent;
