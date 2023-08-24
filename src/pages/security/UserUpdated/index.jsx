import SuccessMessage from "../../../components/SuccessMessage";

function UserUpdated() {
  return (
    <SuccessMessage
      title="Datos actualizados"
      message="Ahora podrá hacer preofertas en la plataforma."
      redirectingMessage="Redirigiendo a Cartelera..."
      duration="5000"
      breadcrumbsLocation="Datos actualizados"
      navigateTo="/"
    />
  );
}

export default UserUpdated;
