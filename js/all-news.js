const newscont=document.querySelector('.newscont');
const techcont=document.querySelector('.techcont');
const sportscont=document.querySelector('.sportscont');
const fetchData=async()=>{
    const business_response=await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=ed17676d8dd94d9ba55a51209da6bfde");
    const business_data=await business_response.json()
    console.log( business_data['articles']);

     business_data['articles'].slice(6,16).forEach((elem)=>{
            displayBusinessNews(elem);
    });


    const tech_response=await fetch("https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=ed17676d8dd94d9ba55a51209da6bfde");
    const tech_data=await tech_response.json();
    console.log(tech_data['articles']);
    console.log(tech_data)

    tech_data['articles'].slice(0,10).forEach((elem)=>{
          displayTechNews(elem);
    })

    
    const sports_response=await fetch("https://newsapi.org/v2/everything?q=india&apiKey=ed17676d8dd94d9ba55a51209da6bfde");
    const sports_data=await sports_response.json();
    console.log(sports_data['articles']);
    console.log(sports_data)

    sports_data['articles'].slice(6,16).forEach((elem)=>{
          displaysportsNews(elem);
    })
}
fetchData();

const  displayBusinessNews=( business_data)=>{
   const newscard=document.createElement('div')
   newscard.setAttribute('class','cardCont');
   
   newscard.innerHTML=`<div class='imagecont' style="background-image: url('${ business_data.urlToImage}');"></div>
   <div class="content"><p>Title: ${ business_data.title}</p>
                      <p>Description: ${ business_data.description}</p>
                      </div>
                      `;
    
    newscont.append(newscard);

    newscard.addEventListener('click', () => {
    showPopup(business_data.title, business_data.description, business_data.urlToImage);
});

  
    
}

const displayTechNews=(tech_data)=>{
    const newtechcard=document.createElement('div')
    newtechcard.setAttribute('class','cardCont');

    newtechcard.innerHTML=`<div class='imagecont' style="background-image: url('${ tech_data.urlToImage}');"></div>
   <div class="content"><p>Title: ${ tech_data.title}</p>
                      <p>Description: ${ tech_data.description.length>130 ? tech_data.description.slice(0,150)+"..." : tech_data.description}</p>
                      </div>
                      `;

    techcont.append(newtechcard);

    newtechcard.addEventListener('click', () => {
    showPopup(tech_data.title, tech_data.description, tech_data.urlToImage);
});

}


const displaysportsNews=(sports_data)=>{
    const newsportscard=document.createElement('div')
    newsportscard.setAttribute('class','cardCont');

    newsportscard.innerHTML=`<div class='imagecont' style="background-image: url('${ sports_data.urlToImage}');"></div>
   <div class="content"><p>Title: ${ sports_data.title}</p>
                      <p>Description: ${ sports_data.description.length>120 ? sports_data.description.slice(0,155)+"..." : sports_data.description}</p>
                      </div>
                      `;

    sportscont.append(newsportscard);

     newsportscard.addEventListener('click', () => {
    showPopup(sports_data.title, sports_data.description, sports_data.urlToImage);
});

}



const popup = document.getElementById("popup");
const popupImage = document.getElementById("popupImage");
const popupTitle = document.getElementById("popupTitle");
const popupDesc = document.getElementById("popupDesc");
const closePopup = document.getElementById("closePopup");

closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});

const showPopup = (title, description, imageUrl) => {
    popupTitle.textContent = title;
    popupDesc.textContent = description;
    popupImage.src = imageUrl;
    popup.style.display = "flex";
};
