var canvas = document.querySelector('canvas')

canvas.width= window.innerHeight;
canvas.height= window.innerWidth;

const ctx= canvas.getContext('2d')

const mapImage= new Image();
mapImage= src="src\assets\ClayCountyMap.jpg";

mapImage.onload=function(){
    ctx.drawImage(mapImage, window.innerWidth, window.innerHeight);
}
