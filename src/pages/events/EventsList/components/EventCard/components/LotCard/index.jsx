import React from "react";

function LotCard({lot}) {
  return (
    <div className="col-12">
      <h2>Titulo: {lot.title}</h2>
      <p>category: {lot.category}</p>
      <p>description: {lot.description}</p>
      <p>animals: {lot.animals}</p>
      <p>weight: {lot.weight}</p>
      <p>age: {lot.age}</p>
      <p>class: {lot.class}</p>
      <p>state: {lot.state}</p>
      <p>observations: {lot.observations}</p>
      <p>race: {lot.race}</p>
      <p>certificate: {lot.certificate}</p>
      <p>type: {lot.type}</p>
      <p>currency: {lot.currency}</p>
      <p>open: {lot.open}</p>
      <p>preoffers: {lot.preoffers}</p>
      <p>sold: {lot.sold}</p>
      <p>completed: {lot.completed}</p>
    </div>
  );
}

export default LotCard;
