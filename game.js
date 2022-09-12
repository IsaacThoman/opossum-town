const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let screen = {res:10, width:0,height:0};
let frameCount = 0;
function doFrame(){
    let ratio = window.innerWidth/window.innerHeight;
    screen.width = screen.res*ratio;
    screen.height = screen.res;

    ctx.canvas.width = screen.width;
    ctx.canvas.height = screen.height;


    canvas.style.width = window.innerWidth+"px";
    canvas.style.height = window.innerHeight+"px";


    ctx.fillStyle = "#6a5f5f";
    ctx.beginPath();
    ctx.fillRect(0,0,10000,10000);
    ctx.closePath();

    frameCount++;

        for(let i = 0; i<screen.width; i++)
            for(let j = 0; j<screen.width; j++)
            {
                ctx.fillStyle = "#6a5f5f";
                if((i+j)%2==0)
                    ctx.fillStyle = "#c5a3a3";
                ctx.beginPath();
                ctx.fillRect(i,j,1,1);
                ctx.closePath();
            }

    requestAnimationFrame(doFrame);
}

requestAnimationFrame(doFrame);