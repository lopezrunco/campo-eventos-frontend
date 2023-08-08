import SuccessMessage from "../../../components/SuccessMessage";

function UserCreated() {
  return (
    <SuccessMessage
      title="Usuario creado"
      message="Para activarlo, deberá ingresar sus datos nuevamente."
      redirectingMessage="Redirigiendo a Inicio de sesión..."
      duration="5000"
      breadcrumbsLocation="Usuario creado"
      navigateTo="/login"
    />
  );
}

export default UserCreated;
