import Layout from "../layout.jsx";
<<<<<<< Updated upstream
import MapCanvas from "../components/MapCanvas.jsx";
=======
import {useRef,useEffect} from 'react';
>>>>>>> Stashed changes

export default function Map() {
   const canvasRef = useRef()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

  useEffect(() => {
 
    canvas.width= window.innerHeight;
    canvas.height= window.innerWidth;
    
    const mapImage= new Image();
    mapImage.src=ClayCountyMap;
    
    Image.onload= function(){
        ctx.drawImage(Image, window.innerWidth, window.innerHeight);
    }
    

  }, []);

  return (
    <Layout>
      <MapCanvas />
    </Layout>
  );
}
