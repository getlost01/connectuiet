const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

// modeSwitch.addEventListener("click", () => {
//   body.classList.toggle("dark");

//   if (body.classList.contains("dark")) {
//     modeText.innerText = "Light mode";
//   } else {
//     modeText.innerText = "Dark mode";
//   }
// });


// var editor = new FroalaEditor('#froala');
// const valFol = document.querySelector('#froala');
// document.querySelector('#okSubmit').addEventListener('click',()=>{
//   console.log(document.querySelector(".fr-wrapper .fr-view").innerHTML);
// });

var sectionArr = ["feed","profile","search","new","setting"];

sectionArr.forEach((ele,i) => {
    var sidebarEle = `dash${i}`;
    document.querySelector(`#${sidebarEle}`).addEventListener('click',()=>{
       sectionArr.forEach(id=>{
            document.querySelector(`#${id}`).classList.add('hidden');
            sidebar.classList.add("close");
       })
       document.querySelector(`#${ele}`).classList.remove('hidden');
    })
});

const postContainer = document.querySelector('.postContainer');

async function fetchPost(){
  try {
      const response = await fetch('/api/getPost');
      const data = await response.json();
      var temp = ``;
      data.forEach(post => {
          temp += `<div class="postDiv col-lg-8 col-12">
          <div class="userPhoto">
              <img src="${(post.image)?post.image:(post.image)}" alt="">
              <div class="userDet">
                <h4> <a href="/user/${post.userId}" target="_blank">${post.createdBy}</a></h4>
                <h6> ${post.designation}</h6>
                <p>${timeSince(new Date(post.createdAt))}</p>
              </div>
          </div>
          <div class="title">
            <h4> <a href="/post/${post._id}" target="_blank">${post.title}</a></h4>
            <h6>${post.short_description}</h6>
            <div class="content">${post.post}</div>
            <h4>Category : <span> ${post.category}</span></h4>
          </div>
        </div>`;
      });
      postContainer.innerHTML = temp;
  } catch (error) {
      console.log(error);
      
  }
}
fetchPost();


function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " yr";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " mon";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " day";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hrs";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " min";
  }
  return Math.floor(seconds) + " sec";
}