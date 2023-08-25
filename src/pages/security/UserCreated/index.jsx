import SuccessMessage from "../../../components/SuccessMessage";

function UserCreated() {
  return (
    <SuccessMessage
      title="Usuario creado"
      message="Inicie sesión para activar su usuario."
      redirectingMessage="Redirigiendo a Inicio de sesión..."
      duration="5000"
      breadcrumbsLocation="Usuario creado"
      navigateTo="/login"
    />
  );
}

export default UserCreated;
