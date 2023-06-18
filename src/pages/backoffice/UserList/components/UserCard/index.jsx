function UserCard({ user }) {
  return (
    <div className="col-lg-4">
        <div className="card p-4 mb-4">
            <h4>{user.nickname}</h4>
            <span><b>ID: </b>{user.id}</span>
            <span><b>Email: </b>{user.email}</span>
            <span><b>Rol: </b>{user.role}</span>
            <span><b>MFA habilitado: </b>{user.mfaEnabled ? 'Sí' : 'No'}</span>
        </div>
    </div>
  );
}

export default UserCard;
