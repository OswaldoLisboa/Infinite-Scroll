import {apiKey} from './apiKey.js';

const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let count = 5;
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    count = 30;
  }
}

// Helper function to set attributes of DOM elements
function setAttributes(element, attributes) {
  for(const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for links and photos, add to document
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    })
    // Create <img> for photos
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    })
    // Event listener, check when each photo is finished Loading
    img.addEventListener('load', imageLoaded);
    // Put the image inside <a> element and put both inside imageContainer element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });

}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json() ;
    displayPhotos();
  } catch (error) {}
}

// Check to see if scolling near bottom of page, Load more photos
window.addEventListener('scroll', () => {
   if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
     ready = false;
     getPhotos();
   }
})

// On Load
getPhotos();
