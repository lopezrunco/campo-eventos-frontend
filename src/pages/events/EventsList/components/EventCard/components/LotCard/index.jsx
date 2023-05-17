function LotCard({lot}) {
  return (
    <div className="col-12 border mb-3 p-4 lot-card">
      <div className="container">
        <h3>{lot.title}</h3>
        <p><b>Categoria:</b> {lot.category}</p>
        <p>{lot.description}</p>
        <p><b>Animales:</b> {lot.animals} | <b>Peso:</b> {lot.weight} | <b>Edad:</b> {lot.age}<b>Clase:</b> {lot.class} | <b>Estado:</b> {lot.state} | <b>Raza:</b> {lot.race} | <b>Certificado:</b> {lot.certificate} | <b>Tipo:</b> {lot.type} | <b>Moneda:</b> {lot.currency} | <b>Abierto:</b> {lot.open ? 'Si' : 'No'} | <b>Vendido:</b> {lot.sold ? 'Si' : 'No'} | <b>Completado:</b> {lot.completed ? 'Si' : 'No'} | </p>
        <p><b>Observaciones:</b> {lot.observations} | </p>
      </div>
    </div>
  );
}

export default LotCard;
