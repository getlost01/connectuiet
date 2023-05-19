const cursorRounded = document.querySelector('.rounded');
const nowCol = document.querySelector('.nowCol');

function updateDet(){
    const homeImage = document.querySelectorAll('.homeImage');
    homeImage.forEach(homeEle => {
        homeEle.addEventListener('mousemove',(e)=>{
            cursorRounded.style.display = "block";
            var value = homeEle.getAttribute('alt').split(" ");
            nowCol.innerHTML = `
                <div class="bold"> ${value[0]} </div>
                <div class="light"> ${value[1]} ${value[2]} </div>
            `;
            const mouseY = e.clientY + 10;
            const mouseX = e.clientX + 10;
            cursorRounded.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        })
        homeEle.addEventListener('mouseout',(e)=>{
        cursorRounded.style.display = "none";
        })
        // homeEle.addEventListener('click',(e)=>{
        //   navigator.clipboard.writeText(value);
        //   show_toast("Color Picked");
        // })
    });
}
async function fetchApi(){
    try {
        const response = await fetch('/api/user30');
		const data = await response.json();
        var temp = ``;
        for(var i = 0; i<10;++i){temp += `<a href="/user/${data[i].username}" target="_blank"> <img src="${(data[i].image)?data[i].image:"./images/user.png"}" alt="${data[i].name.split(" ")[0]} ${data[i].designation}" class="homeImage"></a>`;}
        document.querySelector('#gallery1').innerHTML = temp;
        temp = ``;
        for(var i = 5; i<15;++i){temp += `<a href="/user/${data[i].username}" target="_blank"><img src="${(data[i].image)?data[i].image:"./images/user.png"}" alt="${data[i].name.split(" ")[0]} ${data[i].designation}" class="homeImage"></a>`;}
        document.querySelector('#gallery2').innerHTML = temp;
        temp = ``;
        for(var i = 10; i<20;++i){temp += `<a href="/user/${data[i].username}" target="_blank"><img src="${(data[i].image)?data[i].image:"./images/user.png"}" alt="${data[i].name.split(" ")[0]} ${data[i].designation}" class="homeImage"></a>`;}
        document.querySelector('#gallery3').innerHTML = temp;
        updateDet();
		// console.log(data);
    } catch (error) {
        console.log(error);
        
    }
}
fetchApi();
