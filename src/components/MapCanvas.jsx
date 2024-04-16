import { useRef, useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import map1 from '../assets/map1.jpg';
import './MapCanvas.css';
import { regions as regionArr } from './regions.js';

// takes a canvas reference, and a region object that contains a name of the city, starting point and an array of points to form the path of the region. Returns a Path2D object that represents the region.
function drawRegion(canvas, region) {
  const path = new Path2D();
  path.moveTo((region.start.x / 100) * canvas.offsetWidth, (region.start.y / 100) * canvas.offsetHeight)
  region.points.forEach((point) => {
    path.lineTo((point.x / 100) * canvas.offsetWidth, (point.y / 100) * canvas.offsetHeight)
  }
  )
  path.closePath()
  return path
}

// takes the canvas reference, context, region object, map image reference, and a state setter function. The drawRegion is called to create a named Path object. The canvas will listen to a mousemove event and check that the pointer is within the path. If so, it will draw the map green and prompt an info box to populate with the city info.
function createRegion(canvas, ctx, region, img, state) {
  const path = drawRegion(canvas, region)
  canvas.addEventListener("mousemove", (e) => {
    if (ctx.isPointInPath(path, e.offsetX, e.offsetY)) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "rgba(0,100,0,0.3)"
      ctx.fill(path)
      state(region.name)
    }
  })
}


export default function MapCanvas() {
  const canvasRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState(null);


  // create the canvas and draw the map image. Then, iterate through the region array and call the createRegion function to create the regions on the map. The canvas will listen to a click event and log the points to the console.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = map1;
    img.onload = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      // The following detects the max size the image can be to fit the canvas, then adjusts the canvas size to fit the image.
      // Calculate the scale.
      const scaleX = canvasWidth / imgWidth;
      const scaleY = canvasHeight / imgHeight;

      // Choose the smaller scale to fit the image in the canvas
      const scale = Math.min(scaleX, scaleY);

      // Calculate the new dimensions
      const newWidth = imgWidth * scale;
      const newHeight = imgHeight * scale;
      canvas.width = newWidth;


      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      regionArr.forEach((region) => {
        createRegion(canvas, ctx, region, img, setSelectedCity)
      })

    };

    // temporary code to get the points for each region
    const points = []
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentageX = (x / canvas.offsetWidth) * 100;
      const percentageY = (y / canvas.offsetHeight) * 100;

      points.push({ x: percentageX, y: percentageY })
      console.log(JSON.stringify(points))
    })


  }, []);


  return (
    <>
      <div className="flex">
        <canvas ref={canvasRef} width={1000} height={1000} />
        <InfoBox city={selectedCity} />
      </div>
    </>
  );

}
