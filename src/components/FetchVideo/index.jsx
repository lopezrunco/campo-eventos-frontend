import { useEffect, useState } from "react";

import { apiUrl } from "../../utils/api-url";

function FetchVideo({ name }) {
  const [video, setVideo] = useState();

  const fetchVideo = async () => {
    const res = await fetch(apiUrl(`/video-files/${name}`));
    const imageBlob = await res.blob();
    const videoObjectURL = URL.createObjectURL(imageBlob);
    setVideo(videoObjectURL);
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return <video src={video} alt="Video del lote" width="100%" controls type="video/mp4" />;
}

export default FetchVideo;
