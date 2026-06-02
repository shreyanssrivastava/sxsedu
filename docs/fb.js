              /*---- Porting ----*/
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
     
                /*---- Home navigation & account checkup ----*/
document.addEventListener('DOMContentLoaded', () => {
  const homeBtns = document.querySelectorAll('#home, #success-home');
  homeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (document.referrer.includes('index.html')) {
          history.back(); // Go back if possible (acts like pressing the Back button)
      } else {
        location.replace('index.html'); // Fallback in case history is not available
      }
    });
  });
  
    const firebaseConfig = {
    apiKey: "AIzaSyDjcYwQSstXZPf3ratDeYHJvgYiLdpc4JU",
    authDomain: "sxs-education.firebaseapp.com",
    projectId: "sxs-education",
    storageBucket: "sxs-education.firebasestorage.app",
    messagingSenderId: "688203518667",
    appId: "1:688203518667:web:b19d0f7bed2a569f02814e",
    measurementId: "G-71ZY8YPJSW"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'index.html?mode=login';
        } else {
            document.body.style.display = 'flex';
        }
    });
});

            /*---- Rating system ----*/
document.addEventListener('DOMContentLoaded', () => {
  const ratingBox = document.getElementById('rating-container');
  const stars = document.querySelectorAll('.star');
  const faces = document.querySelectorAll('.face');
  const ratingLabel = document.getElementById('rating-label');

  const ratingOptions = [
    { label: 'Terrible', color: '#e74c3c' }, // Red
    { label: 'Poor', color: '#e67e22' },     // Orange
    { label: 'Average', color: '#f1c40f' }, // Yellow
    { label: 'Good', color: '#2ecc71' },    // Green
    { label: 'Excellent', color: '#3498db' } // #3498db Blue
  ];

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
     
      stars.forEach(s => s.classList.remove('hide'));
      star.classList.add('hide');
  
      faces.forEach(face => face.classList.remove('show'));
      const face = star.nextElementSibling;
    
      if (index === 4) {
        face.classList.add('full-star');
      } else {
        face.style.color = ratingOptions[index].color;
      }
      face.classList.add('show');
      stars.forEach((s, i) => {
        s.classList.toggle('selected', i <= index);
        if (index === 4) {
          s.classList.add('full-star');
        } else {
          s.classList.remove('full-star');
          s.style.color = i <= index ? ratingOptions[index].color : '#555'; // Change color
        }
      });
      
      if (index === 4) {
        ratingBox.style.borderColor = '#0fcefa';
        ratingLabel.style.borderColor = '#da23d6';
      } else {
        ratingBox.style.borderColor = ratingOptions[index].color;
        ratingLabel.style.borderColor = ratingOptions[index].color;
      }
      
      ratingLabel.classList.remove('rate');
      ratingLabel.textContent = ratingOptions[index].label;
    });
  });
});

              /*---- feedback submission ----*/
document.addEventListener('DOMContentLoaded', () => {
  const pk = "X0R4eF9ReGNCNFBmZ0ZHU0I";
  const form = document.getElementById('form');
  const inputFields = form.querySelectorAll('input, select, textarea');
  const nameInput = document.getElementById('inp_name');
  const emailInput = document.getElementById('inp_email');
  const ratingBox = document.getElementById('rating-container');
  const stars = document.querySelectorAll('.star');
  const faces = document.querySelectorAll('.face');
  const ratingLabel = document.getElementById('rating-label');
  const rlText = ratingLabel.textContent;
  const titleInput = document.getElementById('inp_title');
  const categoryOption = document.getElementById('opt_category');
  const fbChar = document.getElementById('fb-char');
  const fbCharText = fbChar.textContent;
  const fbText = document.getElementById('text_fb');
  const submitBtn = document.getElementById('submit-btn');
  const loading = document.getElementById('loading-bg');
  const loadingContent = document.getElementById('loading');
  const loadingError = document.getElementById('loading-error');
  const formError = document.getElementById('form-error');
  const successBox = document.getElementById('success-box-bg');
  const closeSb = document.getElementById('close-success');
  let ratingValue = null;
  
  function validateOnInput() {
    inputFields.forEach(input => {
      const error = input.nextElementSibling;
      const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventType, () => {
        if (input.checkValidity()) {
          error.classList.remove('report');
          input.classList.remove('invalid');
          input.classList.add('valid');
        } else {
          input.classList.remove('valid');
          input.classList.add('invalid');
        }
      });
      
        if (input.value.trim()) {
          if (input.checkValidity()) {
            input.classList.add('valid');
          } else {
            input.classList.add('invalid');
          }
        }
    });
  }
  
  validateOnInput();
  
  nameInput.addEventListener('input', function () {
      const value = this.value;
      const words = value.split(' ');
      const capitalizedWords = words.map(word => {
        return word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';
      });

      this.value = capitalizedWords.join(' ');
  });
  
  fbText.addEventListener('input', function () {
    let fbLength = this.value.length;
    fbChar.textContent = `${fbLength} / 250`;
   
    if (this.value.startsWith(" ")) {
      this.value = this.value.trimStart();
    }
   
    if (fbLength >= 250) {
      fbChar.classList.add('warn');
      setTimeout(() => {
        fbChar.classList.remove('warn');
      }, 5000);
    } else {
      fbChar.classList.remove('warn');
    }
  });

  function validateAndStyleInputs() {
    let formIsValid = true;

    for (let input of inputFields) {
      const error = input.nextElementSibling;
      
        if (input.checkValidity()) {
          error.classList.remove('report');
          input.classList.remove('invalid');
          input.classList.add('valid');
        } else {
          input.focus();
          error.classList.add('report');
          input.classList.remove('valid');
          input.classList.add('invalid');
          formIsValid = false;
          break;
        }
    }

    return formIsValid;
  }
  
  const generateRatingBox = (rating) => {
    const filledStars = "⭐️".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    ratingValue = `${filledStars}${emptyStars}`;
  };

  const handleRatingSelection = (e) => {
    const selectedRating = parseInt(e.target.getAttribute('data-value'));
    generateRatingBox(selectedRating);
  };

  stars.forEach(star => {
    star.addEventListener('click', handleRatingSelection);
  });
 
  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const formIsValid = validateAndStyleInputs();
    if (formIsValid && ratingValue) {
        formError.style.display = 'none';
        loading.style.display = 'grid';
        sendFeedback();
    } else if (!ratingValue) {
      ratingLabel.textContent = 'Please rate!';
      ratingLabel.classList.add('rate');
      ratingLabel.classList.add('shake');
      setTimeout(() => {
        ratingLabel.classList.remove('shake');
      }, 500);
    } else {
      console.log('Please fix all the error before submitting the feedback!');
    }
  });
  
  emailjs.init(atob(pk));
  
  function sendFeedback() {
    const fullName = nameInput.value.trim();
    const name = fullName.split(' ')[0] || 'User';
    const email = emailInput.value.trim() || 'N/A';
    const title = titleInput.value.trim();
    const category = categoryOption.value.trim();
    const fb = fbText.value.trim();
    
    const templateParams = {
      name: name,
      email: email,
      star: ratingValue,
      rating: ratingLabel.textContent,
      title: title,
      category: category,
      feedback: fb
    };

    emailjs.send('sxs_gmail_service', 'sxs_gmail_t1', templateParams)
      .then((response) => {
        console.log('Success:', response);
        successBox.style.display = 'grid';
        form.reset();
        fbChar.textContent = fbCharText;
        setTimeout(() => {
          inputFields.forEach((field) => {
            field.classList.remove('valid', 'invalid');
          });
          stars.forEach((star) => {
            star.classList.remove('selected', 'hide', 'full-star');
            star.style.color = '';
          });
          faces.forEach((face) => {
            face.classList.remove('show', 'full-star');
            face.style.color = '';
          });
          ratingValue = null;
          ratingBox.style.borderColor = '';
          ratingLabel.style.borderColor = '';
          ratingLabel.textContent = rlText;
        }, 2500);
        setTimeout(() => {
          loading.style.display = 'none';
          successBox.classList.add('visible');
        }, 5000);
      })
      .catch((error) => {
        console.log('Error:', error);
        setTimeout(() => {
          loadingContent.style.display = 'none';
          loadingError.style.display = 'block';
          formError.style.display = 'block';
        }, 3000); 
        setTimeout(() => {
          loading.style.display = 'none';
        }, 5000);
        setTimeout(()=> {
          loadingContent.style.display = 'block';
          loadingError.style.display = 'none';
        }, 5200);
      });
  }
  
  closeSb.addEventListener('click', () => {
    setTimeout(() => {
      successBox.classList.remove('visible');
    }, 250);
  });
});


          /*-- Online/Offline status --*/
function updateStatusBar() {
  const statusBar = document.getElementById('status-bar');
  const statusBarIcons = document.getElementById('status-bar-icons');
  const internet = document.getElementById('internet-img');
  const noInternet = document.getElementById('no-internet-icon')
  const msg = document.getElementById('internet-msg');
  const logo = document.getElementById('logo');

  if (navigator.onLine) {
    setTimeout(() => {
      statusBar.style.display = 'none';
      document.body.style.overflowY = 'scroll';
    }, 1900);
    setTimeout(() => {
      statusBar.style.opacity = '0';
    }, 1000);
    statusBarIcons.style.borderColor = '#0ef';
    internet.style.opacity = '1';
    noInternet.style.opacity = '0';
    msg.style.color = '#00cc00';
    msg.textContent = 'Back Online'
    logo.style.margin = '0';
  } else {
    setTimeout(() => {
      statusBar.style.opacity = '1';
      document.body.style.overflowY = 'hidden';
    }, 50);
    statusBar.style.display = 'grid';
    statusBarIcons.style.borderColor = '#007bff';
    internet.style.opacity = '0';
    noInternet.style.opacity = '1';
    msg.style.color = 'red';
    msg.textContent = 'No Internet Connection!'
    setTimeout(() => {
      logo.style.margin = 'auto';
    }, 500);
  }
}

window.addEventListener('online', updateStatusBar);
window.addEventListener('offline', updateStatusBar);

document.addEventListener('DOMContentLoaded', updateStatusBar);

        /*---- © current year ----*/
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('current-year');
  const currentYear = new Date().getFullYear();
  year.textContent = currentYear;
});
