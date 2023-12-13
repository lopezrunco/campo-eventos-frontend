import SuccessMessage from "../../../components/SuccessMessage";

function PostCreated() {
  return (
    <SuccessMessage
      title="Artículo creado"
      message="El artículo ha sido creado con éxito."
      redirectingMessage="Redirigiendo a listado de artículos..."
      duration="2000"
      breadcrumbsLocation="Artículo creado"
      navigateTo="/autor/articulos/mis-articulos"
    />
  );
}

export default PostCreated;
