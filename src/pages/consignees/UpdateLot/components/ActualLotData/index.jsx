function ActualLotData({ lot }) {
  return (
    <div className="existing-data">
      <h3 className="mb-3">Datos actuales:</h3>
      <p>
        <b>Título:</b> {lot.title} <br />
        <b>Categoría:</b> {lot.category} <br />
        <b>Descripción:</b> {lot.description} <br />
        <b>Cantidad:</b> {lot.animals} <br />
        <b>Peso:</b> {lot.weight} <br />
        <b>Edad:</b> {lot.age} <br />
        <b>Clase:</b> {lot.class} <br />
        <b>Estado:</b> {lot.state} <br />
        <b>Observaciones:</b> {lot.observations} <br />
        <b>Raza:</b> {lot.race} <br />
        <b>Certificado:</b> {lot.certificate} <br />
        <b>Tipo:</b> {lot.type} <br />
        <b>Moneda:</b> {lot.currency} <br />
      </p>
    </div>
  );
}

export default ActualLotData;
