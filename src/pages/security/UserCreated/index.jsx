import SuccessMessage from "../../../components/SuccessMessage";

function UserCreated() {
  return (
    <SuccessMessage
      title="Usuario creado"
      message="Para que funcione normalmente, recomendamos volver a iniciar sesión."
      redirectingMessage="Redirigiendo a Cartelera..."
      duration="5000"
      breadcrumbsLocation="Usuario creado"
      navigateTo="/"
    />
  );
}

export default UserCreated;
