import { useState } from "react";
import http from "../../../utils/http-common";
import { useNavigate, useParams } from "react-router-dom";

const FileUpload = (file) => {
  let formData = new FormData();
  formData.append("file", file);

  return http.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const UploadFile = () => {
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
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
        setTimeout(() => {
          // TO DO: Call edit event endpoint and set the image route in "imageUrl"
          navigate(`/consignatarios/mis-eventos/${id}`);
        }, 2000);
      })
      .catch(() => {
        setMessage("Could not upload the file");
        setCurrentFile(undefined);
      });

    setSelectedFiles(undefined);
    console.log(currentFile.name);
  };

  return (
    <div>
      <label className="btn btn-default">
        <input type="file" onChange={selectFile} />
      </label>

      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Subir
      </button>

      <div className="alert alert-light" role="alert">
        {message}
      </div>
    </div>
  );
};

export default UploadFile;
