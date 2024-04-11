import { useRef, useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import map1 from '../assets/map1.jpg';
import './MapCanvas.css';
import { regions as regionArr } from './regions.js';

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

      // Calculate the scale
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
    // ctx.fillStyle = 'rgba(255,  0, 0, 0.3)';
    // ctx.fillRect(10, 10, 100, 100);

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