import "./InfoBoxDesign.css/";
export default function InfoBox({ city }) {

  return (
    <div className="InfoBoxDesign text-white bg-red-900 rounded-md p-4 m-4 min-w-60 text-align: center">
      {city}
    </div>
    
  )
}