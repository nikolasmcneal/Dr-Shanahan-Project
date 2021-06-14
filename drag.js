function startDrag(e) {

    if (!e) {
        var e = window.event;
    }
    if(e.preventDefault) e.preventDefault();


    targ = e.target ? e.target : e.srcElement;

    if (targ.className != 'dragme') {return};
        offsetX = e.clientX;
        offsetY = e.clientY;


    if(!targ.style.left) { targ.style.left='0px'};
    if (!targ.style.top) { targ.style.top='0px'};

    coordX = parseInt(targ.style.left);
    coordY = parseInt(targ.style.top);
    drag = true;

        document.onmousemove=dragDiv;
    return false;
    
}
function dragDiv(e) {
    if (!drag) {return};
    if (!e) { var e= window.event};
    targ.style.left=coordX+e.clientX-offsetX+'px';
    targ.style.top=coordY+e.clientY-offsetY+'px';
    return false;
}
function stopDrag() {
    drag=false;
}
window.onload = function() {
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;
}