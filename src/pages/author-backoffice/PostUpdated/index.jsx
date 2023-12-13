import SuccessMessage from "../../../components/SuccessMessage";

function PostUpdated() {
  return (
    <SuccessMessage
      title="Artículo editado"
      message="El artículo ha sido editado con éxito."
      redirectingMessage="Redirigiendo al listado de artículos..."
      duration="2000"
      breadcrumbsLocation="Artículo editado"
      navigateTo="/autor/articulos/mis-articulos"
    />
  );
}

export default PostUpdated;
