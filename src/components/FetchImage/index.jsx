import { useEffect, useState } from "react";

import { apiUrl } from "../../utils/api-url";

function FetchImage({ name }) {
  const [img, setImg] = useState();

  const fetchImage = async () => {
    const res = await fetch(apiUrl(`/image-files/${name}`));
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return <img src={img} alt="Afiche del remate" width="100%" />;
}

export default FetchImage;
