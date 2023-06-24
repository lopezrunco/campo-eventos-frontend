import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AppendVideo from "../AppendVideo";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;

function VideoFromDevice() {
  const [video, setVideo] = useState("");
  const [url, setUrl] = useState("");
  const [appendVideoToLot, setAppendVideoToLot] = useState(false);
  const { id } = useParams();

  // TO DO: Show a list of existing files and allow the user to select
  // TO DO: Limit the file size
  // TO DO: Delete unused code of upload videos in frontend and backend (FetchVideo component for example)
  // TO DO: Check if the user is not uploading anything and show message
  // TO DO: Filter to allow the user to only upload this kind of file

  const upload = () => {
    const data = new FormData();
    data.append("file", video);
    data.append("upload_preset", "campoeventos");
    data.append("cloud_name", "dvkq2sewj");

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/upload`, {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUrl(data.url);
        setAppendVideoToLot(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className="col-12 upload-file-page">
        <div className="select-file">
          <h3>Subir video</h3>
          <label>
            <input
              type="file"
              onChange={(e) => setVideo(e.target.files[0])}
            ></input>
          </label>
          <a className="button button-dark" onClick={upload}>
            <i className="fas fa-upload"></i>
            Subir
          </a>
        </div>
        <div className="file-preview">
          {appendVideoToLot && (
            <React.Fragment>
              <AppendVideo lotId={id} videoName={url} />
            </React.Fragment>
          )}
          <a
            className="button button-dark-outline"
            href={`/consignatarios/mis-remates`}
          >
            <i className="fas fa-times"></i> Cancelar
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}

export default VideoFromDevice;
