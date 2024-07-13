var currentImgIndex = 0;
console.log("Initial Image Index:", currentImgIndex);
var imgs;
var dots;
var interval = 3000;
var timer;
var playButton = document.getElementById('play');
var stopButton = document.getElementById('stop');

playButton.disabled = true;


playButton.addEventListener('click', function() {
  // If the timer is not already running, start it
  if (!timer) {
    timer = setInterval(nextSlide, interval);
    playButton.disabled = true; // Disable the play button to prevent multiple starts
    stopButton.disabled = false; // Enable the stop button
    console.log("Play Button Clicked")
  }
});

stopButton.addEventListener('click', function() {
  // If the timer is running, stop it
  if (timer) {
    clearInterval(timer);
    timer = null;
    playButton.disabled = false; // Enable the play button
    stopButton.disabled = true; // Disable the stop button
    console.log("Stop Button Clicked")

  }
});

document.addEventListener('DOMContentLoaded', function () {
  imgs = document.querySelectorAll('.slider img');
  dots = document.querySelectorAll('.dot');
  arrows = document.querySelectorAll('.arrow');
  timer = setInterval(nextSlide, interval);
  imgs[0].style.opacity = 1;
  /*var imgIds = [];
    imgs.forEach(function(img) {
      imgIds.push(img.id);
    });
    console.log("Array of Image IDs:", imgIds);*/



    // Add click event listeners to dots
    // dots.forEach(function(dot, index) {
    //   dot.addEventListener('click', function() {
    //     clearInterval(timer); // Stop the automatic slideshow when dot is clicked
    //     changeSlide(index);
    //     /*var timeoutInSeconds = 4; // Timeout duration in seconds
    //     var countdown = timeoutInSeconds; // Initialize countdown timer

    //     // Log countdown every second until it reaches zero
    //     var countdownInterval = setInterval(function() {
    //       console.log("Timeout in:", countdown, "seconds");
    //       countdown--;

    //       if (countdown < 0) {
    //         clearInterval(countdownInterval); // Stop countdown when it reaches zero
    //         timer = setInterval(nextSlide, interval); // Restart automatic slideshow after 5 seconds
    //       }
    //     }, 1000); // Log countdown every second (1000 milliseconds)*/
    //   });
    // });

    // Add click event listeners to arrows
    arrows.forEach(function(arrow, index) {
      arrow.addEventListener('click', function() {
        if (index === 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      });
    });

});

function changeSlide(index) {
  currentImgIndex = index;
  // console.log("Current Image Index:", currentImgIndex, "of", imgs.length); // Log current index when slide changes
  updateSlide();
}

function prevSlide() {
  currentImgIndex = (currentImgIndex - 1 + imgs.length) % imgs.length;
  // console.log("Current Image Index:", currentImgIndex, "of", imgs.length); // Log current index when going to previous slide
  updateSlide();
}

function nextSlide() {
  currentImgIndex = (currentImgIndex + 1) % imgs.length;
  // console.log("Current Image Index:", currentImgIndex, "of", imgs.length); // Log current index when going to next slide
  updateSlide();
  // console.log(interval);
}


function updateSlide() {
  imgs.forEach(function(img, index) {
    img.style.opacity = (index === currentImgIndex) ? 1 : 0;
    // dots[index].classList.toggle('active', index === currentImgIndex);
  });
}
