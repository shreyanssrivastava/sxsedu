              /*---- Porting ----*/
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
     
     
            /*---- initial content loading ----*/
document.addEventListener('DOMContentLoaded', () => {
 
  const pageC = document.getElementById('page-content');
  const pageSk = document.getElementById('page-sk');
  const minT = 1000;
  const maxT = 5000;
  const pageLoadT = Math.random() * (maxT - minT) + minT;

    setTimeout(() => {
      pageC.style.opacity = '1';
      pageSk.style.display = 'none';
    }, pageLoadT);

              /*---- Home navigation & account checkup ----*/
    const ref = document.referrer ? new URL(document.referrer) : null;
    const homePath = ref ? ref.pathname === '/index' || ref.pathname === '/' : false;
    const home = document.getElementById('home');   
    home.addEventListener('click', () => {
      if (homePath) {
          history.back(); // Go back if possible (acts like pressing the Back button)
      } else {
          location.replace('/'); // Fallback in case history is not available
      }
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
    
  const emailInput = document.getElementById('inp_email');
  let currentUser = null;

  onAuthStateChanged(auth, (user) => {
      if (!user) {
          window.location.replace('/index.html?mode=login');
      } else {
          document.body.style.display = 'flex';
          emailInput.value = user.email;
          currentUser = user;
      }
  });
    
             /*---- Step marking ----*/
  const stepBox = document.getElementById('step-box');
  const arrowBtn = document.getElementById('arrow-btn');
  const arrow = document.getElementById('arrow');
  const steps = document.querySelectorAll(".step"); // Select all steps
  let currentStep = 0; // Track the current step index
  
  arrowBtn.addEventListener('click', () => {
    const open = stepBox.classList.contains('show');
    if (!open) {
      stepBox.classList.add('show');
      arrow.classList.add('close');
    } else {
      stepBox.classList.remove('show');
      arrow.classList.remove('close');
    }
  });
  
  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.remove("active", "complete");
      if (index < currentStep) {
        step.classList.add("complete"); // Mark previous steps as completed
      } else if (index === currentStep) {
        step.classList.add("active"); // Set the current step as active
      }
    });
  }

  window.nextStep = function () {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateSteps();
    }
  }

  window.prevStep = function () {
    if (currentStep > 0) {
      currentStep--;
      updateSteps();
    }
  }
  
  updateSteps();

         /*-- instruction check button --*/
  const instructionCheckBtn = document.getElementById('instruction_check_btn');
  const startDisabledBtn = document.getElementById('start-disabled-btn');
  const checkboxError = document.querySelector('.checkbox-error');
  const startBtn = document.querySelector('.form-start-btn');

  instructionCheckBtn.addEventListener('click', (event) => {
      event.preventDefault();
    
    const checked = instructionCheckBtn.classList.toggle('btn-checked');

    if (checked) {
      startDisabledBtn.style.display = 'none';
      checkboxError.style.display = 'none';
      startBtn.style.display = 'inline-block';
      instructionCheckBtn.style.marginBottom = '2.2rem';
      instructionCheckBtn.classList.remove('invalid');
      instructionCheckBtn.classList.add('valid');
    } else {
      startDisabledBtn.style.display = 'inline-block';
      startBtn.style.display = 'none';
      instructionCheckBtn.classList.remove('valid');
      instructionCheckBtn.classList.add('invalid');
    }
  });

       /*-- container's buttons function --*/
    const giContainer = document.getElementById('g_i_container');
    const loading = document.getElementById('loading-bg');
    const formParentContainer = document.querySelector('.container');
    const scrollBox = document.getElementById('scroll-box');
    const formStartBtn = document.querySelector('.form-start-btn');
    const giBtn = document.querySelector('.gi-btn');
    const captchaInput = document.getElementById('inp_captcha');
    const msg = document.getElementById('captcha_msg');

    startDisabledBtn.addEventListener('click', () => {
      checkboxError.style.display = 'block';
      checkboxError.classList.add('shake');
      setTimeout(() => {
        checkboxError.classList.remove('shake');
      }, 500);
      instructionCheckBtn.classList.add('invalid');
      instructionCheckBtn.style.marginBottom = '.3rem';
      scrollBox.scrollTop = scrollBox.scrollHeight;
    });
    
    formStartBtn.addEventListener('click', () => {
        setTimeout(() => {
            nextStep();
            document.body.style.overflowY = 'hidden';
            loading.style.display = 'grid';
            formParentContainer.style.display = 'grid';
            formParentContainer.classList.remove('left');
            formParentContainer.classList.remove('right');
            giContainer.classList.add('up');
            msg.innerText = '';
            captchaInput.classList.remove('valid');
            captchaInput.classList.remove('invalid');
            captchaInput.value = "";
            generateCaptcha();
        }, 200);

        giContainer.addEventListener('transitionend', function () {
            this.style.display = 'none';
            setTimeout(() => {
                formParentContainer.classList.add('left');
                document.body.style.overflowY = 'scroll';
                loading.style.display = 'none';
                applyOSA();
            }, 50);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, { once: true });
    });

    giBtn.addEventListener('click', () => {
        setTimeout(() => {
            document.body.style.overflowY = 'hidden';
            loading.style.display = 'grid';
            giContainer.classList.remove('up');
            giContainer.classList.add('down');
            formParentContainer.classList.add('right');
        }, 200);

        formParentContainer.addEventListener('transitionend', function () {
            prevStep();
            this.style.display = 'none';
            giContainer.style.display = 'block';
            giContainer.style.marginTop = '6rem';
            setTimeout(() => {
                giContainer.classList.remove('down');
                document.body.style.overflowY = 'scroll';
                loading.style.display = 'none';
            }, 1000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, { once: true });
    });

         /*---- Object's initial animation ----*/
  function objectShowingAnimation() {
    const objects = document.querySelectorAll('.input-fields, .select-fields, .osa-element');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    objects.forEach(object => {
        observer.observe(object);
    });
  }
  
  function runOSA() {
    objectShowingAnimation();
  }
  
  function applyOSA() {
    const objects = document.querySelectorAll('.input-fields, .select-fields, .osa-element');
      objects.forEach(object => {
          object.classList.remove('animate');
      });
     
      setTimeout(() => {
        runOSA();
      }, 250);
  }

            /*---- Academic session ----*/
    function updateSession() {
        const today = new Date();
        const year = today.getFullYear();
        const startOfYear = new Date(year, 3, 1);
        const session = document.getElementById('academic-session');

        let sessionText;
        if (today < startOfYear) {
            sessionText = (year - 1) + " - " + year;
        } else {
            sessionText = year + " - " + (year + 1);
        }

      session.innerText = sessionText;
    }

    updateSession();

          /*---- Input-floatation ----*/
  const inputs = document.querySelectorAll('input');
    
  inputs.forEach((input) => {
    const label = input.nextElementSibling;

    input.addEventListener('focus', () => {
      label.classList.add('float');
    });

    input.addEventListener('blur', () => {
      if (input.value === '') {
        label.classList.remove('float');
      }
    });
  });

         /*---- Make inputs sensible ----*/
  document.querySelectorAll('input').forEach(input => {
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocomplete', 'off');
  });
  
  document.querySelectorAll('input[type="text"]:not(.no-cap)').forEach(input => {
    input.addEventListener('input', function () {
      const value = this.value;
      const words = value.split(' ');
      const capitalizedWords = words.map(word => {
        return word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';
      });

      this.value = capitalizedWords.join(' ');
    });
  });
  
  document.querySelectorAll('.sna').forEach(input => {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/\s+/g, '');
    });
  });

     /*---- Onclick enter btn in form ----*/
document.addEventListener('keydown', function(event) {
 
  if (event.key === 'Enter') {
    event.preventDefault();

      const focusableElements = Array.from(document.querySelectorAll('input:not(#inp_city):not(#inp_state), select'))
         .filter(el => el.type !== 'hidden' && el.type !== 'image');
    
      const currentIndex = focusableElements.indexOf(document.activeElement);

        if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
        }
  }
});

          /*---- alert-functions ----*/
  let typingTimer;
  let alertTimer;

  function typeMsg(element, text) {
    let index = 0;
    if (typingTimer) {
      clearTimeout(typingTimer);
    }
    element.textContent = "";

    function typeLetter() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        typingTimer = setTimeout(typeLetter, 25);
      } else {
        console.log('Typing complete.');
      }
    }
    
    typeLetter();
  }

  function showAlert(alertBox, msg, alertType) {
    if (alertTimer) {
      clearTimeout(alertTimer);
    }

    if (alertBox) {
      alertBox.classList.remove("warning", "review");
      alertBox.classList.add(alertType);
      typeMsg(alertBox, msg);
      alertTimer = setTimeout(() => {
        alertBox.classList.remove(alertType);
        alertBox.textContent = "";
        alertTimer = null;
      }, 6000);
    }
  }

           /*---- Dob functions ----*/
  const inp = document.getElementById('inp_student_dob');
  const fl = document.querySelector('.dob-fl');
  const ol = document.querySelector('.dob-ol'); 
  const alertBox = document.getElementById('alert-box');
  
  const today = new Date().toISOString().split('T')[0];
  
  inp.setAttribute('max', today);

  function toggleLabels() {
    if (inp.value === '') {
      fl.style.display = 'none';
      ol.style.display = 'block';
    } else {
      fl.style.display = 'block';
      ol.style.display = 'none';
    }
  }

  toggleLabels();

  inp.addEventListener('change', toggleLabels);

  ol.addEventListener('click', () => {
    const alertMsg = "To select date of birth, please click in blank area or on arrow.";
    showAlert(alertBox, alertMsg, "warning");
  });

    /*---- Onclick span over select field ----*/
  const selectFields = document.querySelectorAll('.select-fields');

  selectFields.forEach(field => {
    const label = field.querySelector('label');
    const select = field.querySelector('select');
    const span = field.querySelector('span');
  
    span.addEventListener('click', () => {
      select.focus();
      const alertMsg = "To select an option, please click in blank area or on arrow.";
      showAlert(alertBox, alertMsg, "warning");
    });
  });

      /*---- Select element functions ----*/
  selectFields.forEach(field => {
    const label = field.querySelector('label');
    const select = field.querySelector('select');
    const span = field.querySelector('span');
    
    if (select.value === '') {
      label.style.display = 'none';
      span.style.display = 'block';
    } else {
      label.style.display = 'block';
      span.style.display = 'none';
    }

    select.addEventListener('change', () => {
      if (select.value === '') {
        label.style.display = 'none';
        span.style.display = 'block';
      } else {
        label.style.display = 'block';
        span.style.display = 'none';
      }
    });
  });

          /*---- Fetch City & State ----*/
        
  let pincodeIsValid = false;
  const pincodeField = document.getElementById('inp_pincode');
  const cityField = document.getElementById('inp_city');
  const stateField = document.getElementById('inp_state');
  const errorIcon = document.getElementById('error-icon');
  const errorMsg = document.getElementById('error');

  function getCityState() {
    const pincode = pincodeField.value;
    cityField.value = '';
    stateField.value = '';
    errorIcon.style.display = 'none';
    errorMsg.style.display = 'none';

    if (pincode.length === 6) {
      fetch(`https://sxsedu.vercel.app/api/pincode?code=${pincode}`)
      .then(res =>
          res.json().then(data => {
          if (res.ok) {
              cityField.value = data.city;
              stateField.value = data.state;
              pincodeField.classList.remove('invalid');
              pincodeField.classList.add('valid');
              cityField.classList.remove('invalid');
              cityField.classList.add('valid');
              stateField.classList.remove('invalid');
              stateField.classList.add('valid');
              pincodeIsValid = true;
          } else {
              console.error(data.error);
              errorIcon.style.display = 'block';
              errorMsg.style.display = 'block';
              errorMsg.textContent = "Invalid Pincode!";
              pincodeField.classList.remove('valid');
              pincodeField.classList.add('invalid');
              cityField.value = '';
              stateField.value = '';
              cityField.classList.remove('valid');
              stateField.classList.remove('valid');
              pincodeIsValid = false;
          }
      }))
      .catch(error => {
          console.error(error.message);
          errorIcon.style.display = 'block';
          errorMsg.style.display = 'block';
          errorMsg.textContent = "Something Went Wrong, try after sometimes!";
          pincodeField.classList.remove('valid');
          pincodeField.classList.add('invalid');
          cityField.value = '';
          stateField.value = '';
          cityField.classList.remove('valid');
          stateField.classList.remove('valid');
          pincodeIsValid = false;
      });
    } else {
        errorIcon.style.display = 'block';
        errorMsg.style.display = 'block';
   }
}


  pincodeField.addEventListener('input', function() {
      if (this.value.length === 6) {
           getCityState();
      } else {
          cityField.value = '';
          stateField.value = '';
          cityField.classList.remove('valid');
          stateField.classList.remove('valid');
      }
  });

        /*---- Onclick city-state input ----*/
  const boxes = document.querySelectorAll('.cs-box');
  
  boxes.forEach(box => {
    box.addEventListener('click', () => {
      const input = box.querySelector('input');
      if (!input.value.trim()) {
        const alertMsg = "Please enter your Pincode to automatically fetch the City & State.";
        showAlert(alertBox, alertMsg, "warning");
      }
    });
  });

    /*-- uploadBtn border onclick submit btn --*/
  const fileInput = document.getElementById('inp_photo');
  const uploadPhotoBtn = document.getElementById('upload_photo_btn');
  const error = document.getElementById('upload-error');
  const photoError = document.getElementById('photo-error');
  const submitDisabledBtn = document.getElementById('submit-disabled-btn');
  const submitBtn = document.getElementById('submit-btn');
  const result = document.getElementById('result');
  
    submitDisabledBtn.addEventListener('click', () => {
       
      if (!fileInput.files || fileInput.files.length === 0) {
        uploadPhotoBtn.classList.remove('valid');
        uploadPhotoBtn.classList.add('invalid');
        error.style.display = 'block';
        error.classList.add('shake');
        setTimeout(() => {
          error.classList.remove('shake');
        }, 500);
        photoError.style.display = 'none';
      } else {
        error.style.display = 'none';
      }
    });
   
    submitBtn.addEventListener('click', () => {
       
      if (!fileInput.files || fileInput.files.length === 0) {
        uploadPhotoBtn.classList.remove('valid');
        uploadPhotoBtn.classList.add('invalid');
        error.style.display = 'block';
        photoError.style.display = 'none';
      } else {
        error.style.display = 'none';
      }
    });

         /*-- Preview student's photo --*/
  const photoBox = document.getElementById('photo_box');
  const deletePhotoBtn = document.getElementById('delete_photo_btn');
  const uploadError = document.getElementById('upload-error');
  const preview = document.getElementById('default_image_photo');
  const defaultPhotoImageSrc = 'https://uploads.onecompiler.io/42fkuwhzd/42rfnf4fh/1000038208.png';
  const maxSize = 2 * 1024 * 1024;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  uploadPhotoBtn.addEventListener('click', (event) => {
    event.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    
    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        photoBox.classList.remove('invalid');
        deletePhotoBtn.style.display = 'inline-block';
        uploadPhotoBtn.style.display = 'none';
        uploadError.style.display = 'none';
        photoError.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      photoError.textContent = file && !allowedTypes.includes(file.type) 
        ? 'Invalid file type! '
        : 'File size exceeds the limit.';
      photoError.style.display = 'block';
      fileInput.value = '';
      preview.src = defaultPhotoImageSrc;
      photoBox.classList.add('invalid');
      deletePhotoBtn.style.display = 'none';
      uploadPhotoBtn.style.display = 'inline-block';
      uploadError.style.display = 'none';
    }
  });
  
  deletePhotoBtn.addEventListener('click', (event) => {
    event.preventDefault();
    preview.src = defaultPhotoImageSrc;
    deletePhotoBtn.style.display = 'none';
    uploadPhotoBtn.style.display = 'inline-block';
    uploadPhotoBtn.classList.add('invalid');
    fileInput.value = '';
    photoError.style.display = 'none';
  });

       /*-- Declaration check button --*/
  const declarationCheckBtn = document.getElementById('declaration_check_btn');
  const declarationCheckboxError = document.querySelector('.declaration-checkbox-error');
  
  declarationCheckBtn.addEventListener('click', (event) => {
    event.preventDefault();
    
    const checked = declarationCheckBtn.classList.toggle('btn-checked');

    if (checked) {
      declarationCheckboxError.style.display = 'none';
      declarationCheckBtn.style.marginBottom = '2.5rem';
      declarationCheckBtn.classList.remove('invalid');
      declarationCheckBtn.classList.add('valid');
    } else {
      declarationCheckBtn.classList.remove('valid');
      declarationCheckBtn.classList.add('invalid');
    }
  });
    

             /*---- CAPTCHA ----*/
function generateCaptcha() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById('captcha').innerText = captcha;
}

function validateCaptcha() {
  const captcha = document.getElementById('captcha').innerText;
  const captchaInputValue = document.getElementById('inp_captcha').value;
  const captchaInput = document.getElementById('inp_captcha');
  const msg = document.getElementById('captcha_msg');
  let captchaIsValid = false;
  
    if (captchaInputValue === '') {
      msg.innerText = 'Please Fill CAPTCHA!';
      msg.style.color = 'red';
      captchaInput.classList.remove('valid');
      captchaInput.classList.add('invalid');
      captchaIsValid = false;
    } else if (captchaInputValue === captcha) {
      msg.innerText = 'CAPTCHA Validated.';
      msg.style.color = '#00cc00';
      captchaInput.classList.remove('invalid');
      captchaInput.classList.add('valid');
      captchaIsValid = true;
    } else {
      msg.innerText = 'Invalid CAPTCHA!';
      msg.style.color = 'red';
      captchaInput.classList.remove('valid');
      captchaInput.classList.add('invalid');
      captchaInput.value = "";
      generateCaptcha();
      captchaIsValid = false;
    }
    
  return captchaIsValid;
}

  generateCaptcha();


          /*-- Student's registration process --*/
  const form = document.getElementById('form');
  const pErrorMsg = document.getElementById('error');
  const firstNameInput = document.getElementById('inp_student_first_name');
  const midNameInput = document.getElementById('inp_student_middle_name');
  const lastNameInput = document.getElementById('inp_student_last_name')
  const inpRegId = document.getElementById('inp_reg_id');
  const inpSubTime = document.getElementById('inp_sub_time');
  const afterReview = document.getElementById('after-review');
  const loadingContent = document.getElementById('loading');
  const loadingError = document.getElementById('loading-error');
  const formError = document.getElementById('form-error');
  const backNote = document.getElementById('back-note');
  const waitNote = document.getElementById('wait-note');
  
  function validateOnInput() {
    const inputFields = form.querySelectorAll('input:not(.inp_captcha), select');
    inputFields.forEach(input => {
      const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
      input.addEventListener(eventType, () => {
        if (input.checkValidity()) {
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

  function validateAndStyleInputs() {
    const inputFields = form.querySelectorAll('input, select');
    let formIsValid = true;

    inputFields.forEach(input => {
      if (input.type === 'file' || input.offsetParent !== null) {
        if (input.checkValidity()) {
          input.classList.remove('invalid');
          input.classList.add('valid');
        } else {
          input.classList.remove('valid');
          input.classList.add('invalid');
          formIsValid = false;
        }
      }
    });

    return formIsValid;
  }

  function isDeclarationChecked() {
    return declarationCheckBtn.classList.contains('btn-checked');
  }
 
  submitDisabledBtn.addEventListener('click', (event) => {
      event.preventDefault();
      form.reportValidity();
      const formIsValid = validateAndStyleInputs();
      
      if (formIsValid && pincodeIsValid) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        nextStep();
        const alertMsg = "Please review all the details once again before final submission.";
        showAlert(alertBox, alertMsg, "review");
        setTimeout(() => {
          afterReview.style.display = 'block';
          submitDisabledBtn.style.display = 'none';
          submitBtn.style.display = 'inline-block';
        }, 1000);
        console.log('Form is valid. Once review again...');
      }
      else {
        console.warn('Form is invalid! Please correct the errors and try again.');
    
        if (!pincodeIsValid) {
          if(pincodeField.value.length === 6) {
            pincodeField.focus();
            pincodeField.classList.remove('valid');
            pincodeField.classList.add('invalid');
            pErrorMsg.textContent = "Please enter a valid pincode!";
            pErrorMsg.classList.add('error-shake');
            setTimeout(() => {
              pErrorMsg.classList.remove('error-shake');
            }, 500);
          }
        }
      }
  });

  submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      
      const finalName = firstNameInput.value.trim();
      const submitError = document.getElementById('submit-error');
      const subjectField = document.getElementById('subject');
      subjectField.value = `${finalName}'s Form Submitted Successfully.`;
      
      const optSubject = document.getElementById('opt_subjects');
      const inpSubject = document.getElementById('inp_subjects');
      const selectedOptions = Array.from(optSubject.selectedOptions).map(option => option.value);
      inpSubject.value = selectedOptions.join(', ');
   
      const validEmail = emailInput.value === currentUser.email;
      const formIsValid = validateAndStyleInputs();
      const captchaIsValid = validateCaptcha();

      if (validEmail && formIsValid && pincodeIsValid && captchaIsValid && isDeclarationChecked()) {
        submitError.style.display = 'none';
        formError.style.display = 'none';
        loading.style.display = 'grid';
        backNote.style.display = 'block';
        nextStep();
        submitForm();
        console.log('Form is valid. Proceeding to the next page...');
      }
      else {
        submitError.style.display = 'block';
        submitError.classList.add('shake');
        setTimeout(() => {
          submitError.classList.remove('shake');
        }, 500);
        console.warn('Form is invalid. Please correct the errors and try again.');
 
        if (!pincodeIsValid) {
          pincodeField.classList.remove('valid');
          pincodeField.classList.add('invalid');
          pErrorMsg.textContent = "Please enter a valid pincode!";
        }
        
        if (!isDeclarationChecked()) {
          declarationCheckboxError.style.display = 'block';
          declarationCheckBtn.classList.remove('valid');
          declarationCheckBtn.classList.add('invalid');
          declarationCheckBtn.style.marginBottom = '.3rem';
        }
      }
  });

  let regId;
  let confirmTime;

  function storeNotifData() {
    const firstName = firstNameInput.value.trim();
    const midName = midNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const fullName = midName ? `${firstName} ${midName} ${lastName}` : `${firstName} ${lastName}`;   
    const random = Math.floor(100000 + Math.random() * 900000);     
    regId = `SE${random}R`;
    confirmTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString('en-GB');

    inpRegId.value = regId;
    inpSubTime.value = confirmTime;

    const data = `${regId}-${fullName}-${confirmTime}`;
    const eData = btoa(data);
    localStorage.setItem('c3RvcmVkX2RhdGE=', eData);
  }

  async function submitForm() {
      await storeNotifData();
      await printForm();
      nextStep();
      form.submit();
      
      setTimeout(() => {
        form.reset();
      }, 12000);
      
      setTimeout(() => {
        waitNote.style.display = 'block';
      }, 52000);
  }


          /*---- convert photo to base64 ----*/
  let photoBase64 = null;
  const photoInput = document.getElementById('inp_photo');
  photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      photoBase64 = reader.result; // Save base64 string of the image
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

           /*---- Form printing ----*/
function printForm() {
  const form = document.getElementById('form');
  const firstNameInput = document.getElementById('inp_student_first_name');
  const midNameInput = document.getElementById('inp_student_middle_name');
  const lastNameInput = document.getElementById('inp_student_last_name')
  const gradeInput = document.getElementById('opt_class');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logoURL = 'https://i.ibb.co/mv8T96b/sxs-logo.png';

    // page measurement
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const paddingTop = 20;
    const paddingBottom = 20;
    
    // Add Logo
    const logoWidth = 75;
    const logoHeight = 17;
    const centerX = (pageWidth - logoWidth) / 2;
    const logoY = paddingTop;
    doc.addImage(logoURL, 'PNG', centerX, logoY, logoWidth, logoHeight);
    
    // tagline
    const taglineY = logoY + logoHeight + 5;
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('"Excess Your Success With SXS"', pageWidth / 2, taglineY, null, null, 'center');
    
    // Green Box for Fee Payment Receipt
    const greenBoxX = 20;
    const greenBoxY = taglineY + 12;
    const greenBoxWidth = doc.internal.pageSize.getWidth() - 40;
    const greenBoxHeight = 12;

    doc.setFillColor(0, 128, 0);
    doc.rect(greenBoxX, greenBoxY, greenBoxWidth, greenBoxHeight, 'F');

    const greenText = "STUDENT REGISTRATION FORM";
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const greenTextX = greenBoxX + (greenBoxWidth - doc.getTextWidth(greenText)) / 2;
    const greenTextY = greenBoxY + (greenBoxHeight + 14 * 0.352777778) / 2;
    doc.text(greenText, greenTextX, greenTextY);

    // photo
    const imgX = doc.internal.pageSize.getWidth() - 60; // Adjust this for exact placement
    const imgY = greenBoxY + greenBoxHeight + 5; // Top margin
    const imgWidth = 35; // Image width
    const imgHeight = 35; // Image height

    if (photoBase64) {
      doc.setFillColor(200, 200, 200);
      doc.rect(imgX, imgY, imgWidth, imgHeight, 'F');
      doc.addImage(photoBase64, 'JPEG', imgX, imgY, imgWidth, imgHeight);
      doc.setDrawColor(0); // Black border
      doc.setLineWidth(0.3); // Border thickness
      doc.rect(imgX, imgY, imgWidth, imgHeight, 'S');
    }
    // text in left of photoBase64
    const firstName = firstNameInput.value.trim();
    const midName = midNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const grade = gradeInput.value.trim();
    const topTextX = 30; // Left padding
    const topTextY = imgY + 10;
  
    doc.setFontSize(11);
    doc.setTextColor(40, 60, 90);
    doc.text(`Registration ID: ${regId}`, topTextX, topTextY);
    doc.text(`Date & Time: ${confirmTime}`, topTextX, topTextY + 6);
    if (midName) {
        doc.text(`Name: ${firstName} ${midName} ${lastName}`, topTextX, topTextY + 12);
    } else {
      doc.text(`Name: ${firstName} ${lastName}`, topTextX, topTextY + 12);
    }
    doc.text(`Grade: ${grade}`, topTextX, topTextY + 18)
    
    // Add Table
    const formData = [];
    const elements = form.querySelectorAll('input:not(.no-table):not([type="file"]), select:not(.no-table)');

      elements.forEach((el) => {
        if (el.type === 'hidden') {
          if (el.dataset.include === 'true') {
            const label = el.name || el.id || 'Field';
            const value = el.value.trim() || 'N/A';
            formData.push([label, value]);
          }
        } else {
          const label = el.name || el.id || 'Field';
          const value = el.value.trim() || 'N/A';
          formData.push([label, value]);
        }
      });
    
    const tableStartY = imgY + imgHeight + 5;
    doc.autoTable({
      startY: tableStartY,
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      theme: 'grid',
      head: [],
      body: formData,
    });

    // White Box for Note
    const noteBoxX = 20;
    const noteBoxY = doc.lastAutoTable.finalY + 15;
    const noteBoxWidth = doc.internal.pageSize.getWidth() - 40;
    const noteBoxHeight = 50;

    doc.setFillColor(255, 255, 255); // White color for the box
    doc.setLineWidth(0.3); // Thicker border
    doc.setDrawColor(0, 0, 0); // Black border
    doc.roundedRect(noteBoxX, noteBoxY, noteBoxWidth, noteBoxHeight, 5, 5, 'DF');

    // Add Note Heading
    const noteHeading = "NOTE";
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    const noteHeadingX = noteBoxX + (noteBoxWidth - doc.getTextWidth(noteHeading)) / 2;
    const noteHeadingY = noteBoxY + 10;
    doc.text(noteHeading, noteHeadingX, noteHeadingY);

    // Add Note Points
    const bulletPoints = [
      "This printout is a summary of the details you provided in the student registration form.",
      "We trust our users and value your honesty in providing accurate information.",
      "Details are subject to verification; we’ll contact you for any discrepancies.",
      "Once the verification process is complete, you will receive a confirmation email.",
      "If you face any issues or have queries, feel free to contact us for assistance.",
    ];

    let bulletY = noteHeadingY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    bulletPoints.forEach((point) => {
      doc.text(`\u2022 ${point}`, noteBoxX + 5, bulletY);
      bulletY += 6;
    });
    
    const qrElements = form.querySelectorAll('input:not(.no-qr):not([type="file"]), select:not(.no-qr)');
    let formattedData = '';
    qrElements.forEach((el) => {
      if (el.type === 'hidden') {
        if (el.dataset.include === 'true') {
          const label = el.name || el.id || 'Field';
          const value = el.value.trim() || 'N/A';
          formattedData += `${label}: ${value}\n`;
        }
      } else {
        const label = el.name || el.id || 'Field';
        const value = el.value.trim() || 'N/A';
        formattedData += `${label}: ${value}\n`;
      }
    });
    
    const qrWidth = 40;
    const qrHeight = 40;
    const qrX = (pageWidth - qrWidth) / 2;
    const qrY = noteBoxY + noteBoxHeight + 15;
    const qrDataStart = `S² Education\nStudent Registration Form\nRegistration ID: ${regId}\nDate & Time: ${confirmTime}\n`;
    const qrDataEnd = 'Thanks for Trusting Us!';
    const qrData = `${qrDataStart}${formattedData}${qrDataEnd}`;

    // Footer
    const footerY = qrY + qrHeight + 20;
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(40, 60, 90);
    doc.text("Thanks For Trusting Us!", pageWidth / 2, footerY, null, null, 'center');

    const linkText = "S² Education";
    const textWidth = doc.getTextWidth(linkText);
    const linkX = (pageWidth - textWidth) / 2;
    const linkY = footerY + 10;
    doc.textWithLink(linkText, linkX, linkY, { url: 'https://sxsedu.vercel.app/' });
    doc.setLineWidth(0.2);
    doc.setDrawColor(40, 60, 90);
    doc.line(linkX, linkY + 1, linkX + textWidth, linkY + 1);
     
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Electronically Generated, does not require Signature.", pageWidth / 2, footerY + 20, null, null, 'center');

    // Save pdf with QR Code
    const qrContainer = document.createElement('div');
    const qr = new qrcode(0, 'L');
    qr.addData(qrData);
    qr.make();
    qrContainer.innerHTML = qr.createImgTag(4);
    const qrImg = qrContainer.querySelector('img');
    
    if (qrImg) {
      qrImg.onload = () => {
        doc.addImage(qrImg.src, 'PNG', qrX, qrY, qrWidth, qrHeight);
        doc.save("student_registration_form.pdf");
        console.log('Pdf Downloaded Successfully...');
      };
      qrImg.onerror = () => {
        doc.save("student_registration_form.pdf");
        console.error('some error occurred, may be QR will not available in pdf.');
      };
    } else {
      doc.save("student_registration_form.pdf");
      console.log('pdf downloaded, but QR will not available.');
    }
}

         /*-- Online/Offline status --*/
function updateStatusBar() {
  const statusBar = document.getElementById('status-bar');
  const statusBarIcons = document.getElementById('status-bar-icons');
  const internet = document.getElementById('internet-img');
  const noInternet = document.getElementById('no-internet-icon')
  const msg = document.getElementById('internet-msg');
  const navbar = document.getElementById('my_navbar');
  const adblockContainer = document.getElementById('adblockContainer');

  if (navigator.onLine) {
    setTimeout(() => {
      statusBar.style.display = 'none';
      document.body.style.overflowY = 'scroll';
      adblockContainer.style.opacity = '1';
    }, 1900);
    setTimeout(() => {
      statusBar.style.opacity = '0';
    }, 1000);
    statusBarIcons.style.borderColor = '#0ef';
    internet.style.opacity = '1';
    noInternet.style.opacity = '0';
    msg.style.color = '#00cc00';
    msg.textContent = 'Back Online'
    navbar.classList.remove('center');
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
    adblockContainer.style.opacity = '0';
    setTimeout(() => {
      navbar.classList.add('center');
    }, 500);
  }
}

window.addEventListener('online', updateStatusBar);
window.addEventListener('offline', updateStatusBar);

updateStatusBar();

      /*-- Function to detect ad blockers --*/
let adblockDetected = false;

function detectAdBlock() {
    const adblockContainer = document.getElementById('adblockContainer');

    const testScript = document.createElement('script');
    testScript.type = 'text/javascript';
    testScript.async = true;
    testScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?nocache=${Date.now()}-${Math.random()}`;

    testScript.onerror = function () {
        if (!adblockDetected) {
            adblockDetected = true;
            adblockContainer.style.display = 'grid';
        }
    };

    testScript.onload = function () {
        if (adblockDetected) {
            adblockDetected = false;
            adblockContainer.style.display = 'none';
        }
    };

    document.head.appendChild(testScript);
    
    setTimeout(() => {
      if (testScript.parentNode) {
        testScript.parentNode.removeChild(testScript);
      }
    }, 2000);
}

   
  formStartBtn.addEventListener('click', function () {
    setTimeout(detectAdBlock, 1000);
    setInterval(detectAdBlock, 5000);
  });

         /*---- chatbase.co ----*/
window.embeddedChatbotConfig = {
  chatbotId: "9YRSDWYGQFngIG3W6Ahqp",
  domain: "www.chatbase.co"
}

        /*---- © current year ----*/
  const year = document.getElementById('current-year');
  const currentYear = new Date().getFullYear();
  year.textContent = currentYear;

  
}); // Dom load listener ends here.
