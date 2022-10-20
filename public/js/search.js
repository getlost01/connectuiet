const searchDet = document.querySelector('#searchDet');

searchDet.addEventListener('click',()=>{
    fetchApi(document.querySelector('#name').value,document.querySelector('#batch').value,document.querySelector('#branch').value);
})
async function fetchApi(a,b,c){
    try {
        const response = await fetch(`/api/search?name=${a}&batch=${b}&branch=${c}`);
		const data = await response.json();
        var temp = ``;
        data.forEach((ele,ind )=> {
            temp += ` 
            <div class="resultDiv col-md-10 col-lg-8 col-12">
            <img src="${ele.image}" alt="">
            <div class="details">
                <h5>${ele.name}</h5>
                <h6>${ele.designation}</h6>
                <p><span class="bold">Batch: </span>${ele.batch}</p>
                <input class="viewMore custBTN" type="submit" value="View More" data-bs-toggle="modal" data-bs-target="#exampleModal" id="detail${ind}">
            </div>
           </div>`;
        });
        document.querySelector('.result').innerHTML = temp;
        data.forEach((ele,ind ) => {
            document.querySelector(`#detail${ind}`).addEventListener('click',()=>{
                document.querySelector(`.modal-body`).innerHTML = `
                <div class="modalContent">
                <img src="${ele.image}" alt="">
                <div class="details">
                    <h5>${ele.name}</h5>
                    <h6>${ele.designation}</h6>
                    <p><span class="bold">Batch: </span>${ele.batch}</p>
                    <p><span class="bold">Home city: </span>${ele.city}</p>
                    <p><span class="bold">Degree: </span>${ele.degree}</p>
                    <p><span class="bold">Branch: </span>${ele.branch}</p>
                    <h6>Connect me </h6>
                    <a href="${ele.email}" target="_blank"><i class="fa-solid fa-envelope"></i></a>
                    <a href="${ele.linkedin}" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
                </div>
           </div>
                `;
            })
        });
		console.log(data);
    } catch (error) {
        console.log(error);
        
    }
}
fetchApi("","","");