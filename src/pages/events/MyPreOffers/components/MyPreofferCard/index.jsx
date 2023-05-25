
function MyPreofferCard({preoffer}) {
  return (
    <div className="col-lg-4">
        <h3>{preoffer.amount}</h3>
        <p>{preoffer.date}</p>
        <p>{preoffer.accepted ? 'Aceptada' : 'No aceptada'}</p>
    </div>
  )
}

export default MyPreofferCard