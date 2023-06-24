import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React, { useState } from "react";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import AppendImage from "./components/AppendImage";
import { Title } from "../../../components/Title";

const UploadLiveEventCover = () => {
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [appendImageToEvent, setAppendImageToEvent] = useState(false);
  const { id } = useParams();

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "campoeventos");
    data.append("cloud_name", "dvkq2sewj");

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/image/upload`, {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUrl(data.url);
        setAppendImageToEvent(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Subir imagen"} />
      </motion.div>
      <section className="upload-file-page">
        <article className="container">
          <Title
            title="Subir nueva imagen"
            subtitle="El archivo no puede pesar más de 10 megabytes"
          />
          <div className="row">
            <div className="col-12">
              <div className="select-file">
                <label>
                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                  ></input>
                </label>
                <a className="button button-dark" onClick={uploadImage}>
                  <i className="fas fa-upload"></i>
                  Subir
                </a>
              </div>
              <div className="file-preview">
                <img src={url} />
                {appendImageToEvent && (
                  <AppendImage liveEventId={id} imageName={url} />
                )}
                <a className="button button-dark" href="/admin/remates-vivo/">
                  <i className="fas fa-times"></i> Cancelar
                </a>
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};

export default UploadLiveEventCover;
