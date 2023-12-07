import SuccessMessage from "../../../components/SuccessMessage";

function PostCreated() {
  return (
    <SuccessMessage
      title="Artículo creado"
      message="El artículo ha sido creado con éxito."
      redirectingMessage="Redirigiendo a sección de novedades..."
      duration="2000"
      breadcrumbsLocation="Artículo creado"
      navigateTo="/"
    />
  );
}

export default PostCreated;
