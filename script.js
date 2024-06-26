const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load_more");
const searchInput = document.querySelector(".search_box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "3hSYNYKKvbzKltoFanjZ26CnKJN3UIB2PYNpgwy7KbHdga5gfho8ZOIN";
const perPage = 15;
let currPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    // converting received img into blob, creating its download link, & downloading it
    fetch(imgURL).then(res => res.blob()).then((file) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        // a.download = new Date().getTime();
        a.download = 'download';
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

const showLightBox = (name, img) => {
    lightBox.querySelector("img").src = img;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.querySelector("span").innerText = name;
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

const hideLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    //Making li of all fetched images and adding them to existing image wrapper
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="cards" onClick="showLightBox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();" >
                    <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
}


const getImages = (apiURL) => {
    // fetching images by API call with Authorization header
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";
        loadMoreBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load more images!")) // showing an alert if API fails with any reason.
    
}

const loadMoreImages = () => {
    currPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currPage}&per_page=${perPage}`
    // If searchTerm has some value then call API with search term else call default API
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // If the search input is empty, set the search term to null and return from here
    if(e.target.value === "") {
        return searchTerm = null;
    }
    // If pressed key is enter, update the current page, search term & call the getImages
    if(e.key === "Enter") {
        currPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currPage}&per_page=${perPage}`)
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));