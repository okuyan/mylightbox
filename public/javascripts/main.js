(function() {
  
  function startEventHandler(e) {
    e.preventDefault();
    buildDom();
    
    var nextLink = document.getElementById('lb-next');
    nextLink.addEventListener('click', nextEventHandler, false);
    
    var prevLink = document.getElementById('lb-prev');
    prevLink.addEventListener('click', prevEventHandler, false);
    
    var closeLink = document.getElementById('lb-close');
    closeLink.addEventListener('click', closeEventHandler, false);
    
    document.addEventListener('keyup', keyupEventHandler, false);

    var photos = window.MyLB.photos;
    var currentIndex = window.MyLB.currentIndex = 0;
    
    // construct DOM for slide
    var imgElement = document.getElementById('lb-image');
    imgElement.src = photos[0].primary_url;
    
    var titleElement = document.getElementById('lb-caption');
    titleElement.textContent = photos[0].title;

    // toggle prev & next icon
    toggleIcon(0);
    
    // show overlay
    var overlay = document.getElementById('overlay');
    fadeIn(overlay, 0.8);
    
    // show lightbox
    var lightbox =  document.getElementById('lightbox');    
    fadeIn(lightbox);

    
    // mark current index as class name
    var className = 'photos_0';
    if (lightbox.classList) {
      lightbox.classList.add(className);
    } else {
      lightbox.className += ' ' + className;
    }
    
  }
  
  function keyupEventHandler(e) {
    var KEYCODE_ESC        = 27;
    var KEYCODE_LEFTARROW  = 37;
    var KEYCODE_RIGHTARROW = 39;
    var keyCode = e.keyCode;
    
    if (keyCode === KEYCODE_ESC) {
      end();
      
    } else if (keyCode === KEYCODE_LEFTARROW) {
      var photos = window.MyLB.photos;
      var index = window.MyLB.currentIndex;
      
      if (index > 0) {
        index--;
        changeImage(index);
        toggleIcon(index);
      }
      
    } else if (keyCode === KEYCODE_RIGHTARROW) {
      var photos = window.MyLB.photos;
      var index = window.MyLB.currentIndex;
      if (index < (photos.length - 1)) {
        index++;
        changeImage(index);
        toggleIcon(index);      
      }
    }
    return false;
  }
  
  function nextEventHandler(e) {
    e.preventDefault();
    var photos = window.MyLB.photos;
    var index = window.MyLB.currentIndex;
    if (index < (photos.length - 1)) {
      index++;
      changeImage(index);
      toggleIcon(index);      
    }
    return false;
  }
  
  
  function prevEventHandler(e) {
    e.preventDefault();
    var photos = window.MyLB.photos;
    var index = window.MyLB.currentIndex;
    
    if (index > 0) {
      index--;
      changeImage(index);
      toggleIcon(index);
    }
    return false;
  }
  
  function toggleIcon(currentIndex) {
    var nextLink = document.getElementById('lb-next');
    var prevLink = document.getElementById('lb-prev');

    nextLink.style.display = (currentIndex > -1 && currentIndex < window.MyLB.photos.length -1) ? 'block' : 'none';
    prevLink.style.display = (currentIndex <= 0) ? 'none' : 'block';
  }
  
  function buildDom() {
    var overlay = document.createElement('div');
    overlay.setAttribute('id', 'overlay');
    document.body.appendChild(overlay);
    
    var lightbox = document.createElement('div');
    lightbox.setAttribute('id', 'lightbox');
    lightbox.innerHTML = '<div id="lb-outer-container"><div class="lb-container"><img id="lb-image" src="" style="display: block;"><div id="lb-nav" style="display: block;"><a id="lb-prev" href="" style="display: block;"><i class="fa fa-chevron-left"></i></a><a id="lb-next" href="" style="display: block;"><i class="fa fa-chevron-right"></i></a></div><div id="lb-loader" style="display: none; opacity: 0;"><a id="lb-cancel"></a></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span id="lb-caption" style="display: inline;">Click the right half of the image to move forward.</span></div><div class="lb-closeContainer"><a id="lb-close"><i class="fa fa-times"></i></a></div></div></div></div>';
    document.body.appendChild(lightbox);
    
  }
  
  function removeDom() {
    var overlay = document.getElementById('overlay');
    var lightbox = document.getElementById('lightbox');
    document.body.removeChild(overlay);
    document.body.removeChild(lightbox);
  }
  
  function changeImage(index) {
    var photos = window.MyLB.photos;
    var lightbox = document.getElementById('lightbox');
    
    var imgElement = document.getElementById('lb-image');
    imgElement.style.backgroundColor = '#fff';
    imgElement.src = '';
    
    // set image_url
    imgElement.src = photos[index].primary_url;
    fadeIn(imgElement);
    
    var titleElement = document.getElementById('lb-caption');
    titleElement.textContent = photos[index].title;
    fadeIn(titleElement);

    window.MyLB.currentIndex = index;
  }
  
  function closeEventHandler(e) {
    e.preventDefault();
    end();
  }
  
  function end() {
    var overlay = document.getElementById('overlay');    
    var lightbox =  document.getElementById('lightbox');
    
    // hide overlay and lightbox
    fadeOut(overlay);
    fadeOut(lightbox);

    removeDom();
    
    document.removeEventListener('keyup', keyupEventHandler, false);
    
    //remove event listeners
    var nextLink = document.getElementById('lb-next');
    nextLink.removeEventListener('click', nextEventHandler, false);
    
    var prevLink = document.getElementById('lb-prev');
    prevLink.removeEventListener('click', prevEventHandler, false);
    
    var closeLink = document.getElementById('lb-close');
    closeLink.removeEventListener('click', closeEventHandler, false);    
  }
  
  function fadeIn(el, maxOpacity) {
    maxOpacity = (typeof maxOpacity !== 'undefined') ? maxOpacity : 1;
    el.style.opacity = 0;
    el.style.display = 'block';

    var tick = function() {
      el.style.opacity =+ el.style.opacity + .01;
      if (el.style.opacity < maxOpacity) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 15)
      }
    };

    tick();
  }
  
  function fadeOut(el) {
    
    var tick = function() {
      el.style.opacity = el.style.opacity - .05;
      if (el.style.opacity > 0) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
      } else {
        el.style.display = 'none';
      }
    };

    tick();
    
  }

  // starting up
  // register callback for flickr jsonp api
  window.jsonFlickrApi = function(rsp) {

    // holder for image data    
    var photos = [];
    var content = '';
    
    for (var i = 0; i < rsp.photoset.photo.length; i++) {
      photo = rsp.photoset.photo[i];
      
      photo.thumbnail_url = "http://farm" + photo.farm + ".static.flickr.com/" + 
        photo.server + "/" + photo.id + "_" + photo.secret + "_" + "t.jpg";
      
      photo.primary_url = "http://farm" + photo.farm + ".static.flickr.com/" + 
        photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";

      photos.push(photo);
      
      content += '<img src="' + photo.thumbnail_url + '" class="thumbnail">';
    }
    
    var linkElement = document.createElement('a');
    linkElement.setAttribute('id', 'start');
    linkElement.innerHTML = content;
    document.body.appendChild(linkElement);

    // set up start event handler
    var startLink = document.getElementById('start');
    startLink.addEventListener('click', startEventHandler, false);

    // namespace for app
    window.MyLB = {};
    window.MyLB.photos = photos;
  }
  
  // flickrAPI
  var flickrApiElement = document.createElement('script');
  flickrApiElement.setAttribute('src', 'https://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&api_key=a2910e0eb64be84cd240a4a75283f388&photoset_id=72157626579923453');
  document.body.appendChild(flickrApiElement);
  

})();