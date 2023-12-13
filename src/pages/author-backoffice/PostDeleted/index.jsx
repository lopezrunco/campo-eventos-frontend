import SuccessMessage from "../../../components/SuccessMessage";

function PostDeleted() {
  return (
    <SuccessMessage
      title="Artículo borrado"
      message="El artículo ha sido borrado con éxito."
      redirectingMessage="Redirigiendo al listado de artículos..."
      duration="2000"
      breadcrumbsLocation="Artículo borrado"
      navigateTo="/autor/articulos/mis-articulos"
    />
  );
}

export default PostDeleted;
