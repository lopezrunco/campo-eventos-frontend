import "./styles.scss";

function ActualLotData({ lot }) {
  return (
    <div className="lot-data-container">
      <p>
        Título:
        <i> {lot.title}</i>
      </p>
      <p>
        Categoría:
        <i> {lot.category}</i>
      </p>
      <p>
        Descripción:
        <i> {lot.description}</i>
      </p>
      <p>
        Cantidad de animales:
        <i> {lot.animals}</i>
      </p>
      <p>
        Peso:
        <i> {lot.weight}</i>
      </p>
      <p>
        Edad:
        <i> {lot.age}</i>
      </p>
      <p>
        Clase:
        <i> {lot.class}</i>
      </p>
      <p>
        Estado:
        <i> {lot.state}</i>
      </p>
      <p>
        Observaciones:
        <i> {lot.observations}</i>
      </p>
      <p>
        Raza:
        <i> {lot.race}</i>
      </p>
      <p>
        Certificado:
        <i> {lot.certificate}</i>
      </p>
      <p>
        Tipo:
        <i> {lot.type}</i>
      </p>
      <p>
        Moneda:
        <i> {lot.currency}</i>
      </p>
    </div>
  );
}

export default ActualLotData;
