import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React, { useState } from "react";

import http from "../../../utils/http-common";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import AppendVideo from "./components/AppendVideo";
import YouTubeVideo from "./components/YouTubeVideo";

import "./styles.scss";

const FileUpload = (file) => {
  let formData = new FormData();
  formData.append("file", file);

  return http.post("/video-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const UploadVideo = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [message, setMessage] = useState("");
  const [appendVideoToEvent, setAppendVideoToEvent] = useState(false);
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
        setAppendVideoToEvent(true);
      })
      .catch((error) => {
        // TO DO: Manejar mejor este error para reconocer si es de conexión o de video repetido
        setMessage(error.code === "ERR_NETWORK" ? "Error al subir el video. Compruebe su conexión. Si el error persiste, intente cambiar el nombre del video y súbalo de nuevo. " : "Error al subir el video, intente nuevamente más tarde.");
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
        <Breadcrumbs location={"Video del lote"} />
      </motion.div>
      <section className="upload-video-page">
        <article className="container">
          <div className="row">
            <YouTubeVideo lotId={id} />
            <div className="col-12">
              <div className="card p-5">
                <h3>Subir desde su dispositivo</h3>
                <div className="separator"></div>
                <p>
                  Seleccione el video desde su dispositivo (No puede pesar más
                  de 70 MB).
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
                {appendVideoToEvent && (
                  <AppendVideo lotId={id} videoName={currentFile.name} />
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};

export default UploadVideo;
