              /*---- Porting ----*/
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import {
    getAuth,
    signOut,
    updateProfile,
    applyActionCode,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    confirmPasswordReset,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithCredential,
    sendEmailVerification,
    EmailAuthProvider, 
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    updatePassword,
    deleteUser,
    signInWithPhoneNumber,
    RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
  import {
    getFirestore,
    doc, addDoc, setDoc, getDoc, getDocs,
    query, where,
    collection } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

export function showNotification(message, timestamp) {
  const panel = document.getElementById('my_sidebar');
  const defaultMsg = document.getElementById('default-notify-msg');

  if (!message) return;

  const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const existingNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
  existingNotifications.push({ id: uniqueId, message, timestamp, seen: false });
  localStorage.setItem('notifications', JSON.stringify(existingNotifications));

  if (!panel) return;

  const notification = document.createElement('div');
  notification.className = 'notification-message unseen';
  notification.innerHTML = `
    <p>${message}</p>
    <small class="timestamp">${timestamp}</small>
    `;
  
  const deleteIcon = document.createElement('span');
  deleteIcon.className = 'fa fa-trash-o delete-icon';
  deleteIcon.onclick = () => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
      removeNotificationFromStorage(uniqueId);
      toggleDefaultMessage();
    }, 500);
  };

  notification.appendChild(deleteIcon);
  panel.insertBefore(notification, panel.firstChild);

  defaultMsg.classList.add('invisible');

  toggleBellDot();
}

const correctPath = window.location.pathname === "/" || window.location.pathname.includes("/index");

if (correctPath) {

document.addEventListener('DOMContentLoaded', () => {

              /*---- initial content loading ----*/
   const animeBg = document.getElementById('initial-anime-bg')
   const animeLogo = document.getElementById('anime-logo-box');
   const navbar = document.getElementById('my_navbar');  
   const noAnime = sessionStorage.getItem('no-anime');
   
   const swiper = new Swiper('.swiper', {
       loop: true,
       loopedSlides: 4,

       slidesPerView: 'auto',
       spaceBetween: 25,
       centeredSlides: true,
       grabCursor: true,

       effect: 'coverflow',
       coverflowEffect: {
         rotate: 30,
         depth: 120,
         modifier: 1,
         slideShadows: false
       },
    
       speed: 4000,

       autoplay: {
         delay: 2000,
         disableOnInteraction: false
       },

       allowTouchMove: true    
   });
   
   swiper.autoplay.stop();
   
   if (noAnime) {
       animeBg.style.display = 'none';
       navbar.classList.add('show');
       swiper.autoplay.start();
       sessionStorage.removeItem('no-anime');
   }
   
   animeLogo.addEventListener('animationend', function () {
     setTimeout(() => { 
       this.classList.add('hide');
       animeBg.classList.add('hide');
       swiper.autoplay.start();
     }, 1000);
   });
   
   setTimeout(() => {
     navbar.classList.add('show');
   }, 4200);

              /*---- notification-system ----*/
  const sidebar = document.getElementById("my_sidebar");
  const bellBtn = document.getElementById("bell-icon");
  const closeBtn = document.getElementById("close-icon");

  bellBtn.addEventListener('click', function() {
    this.style.display = 'none';
    sidebar.classList.add('open-msg');
    closeBtn.style.display = 'block';
    document.body.style.overflowY = 'hidden';
 
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const updatedNotifications = notifications.map((notif) => ({ ...notif, seen: true }));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    toggleBellDot();
  });
       
  
  closeBtn.addEventListener('click', function() {
    this.style.display = 'none';
    sidebar.classList.remove('open-msg');
    bellBtn.style.display = 'block';
    document.body.style.overflowY = 'scroll';
    
    markAllNotificationsAsSeen();
  });
  
  loadNotifications();


function toggleDefaultMessage() {
  const panel = document.getElementById('my_sidebar');
  const defaultMsg = document.getElementById('default-notify-msg');
  const remainingNotifications = panel.querySelectorAll('.notification-message').length;

  remainingNotifications === 0 ? defaultMsg.classList.remove('invisible') : defaultMsg.classList.add('invisible');
}

function removeNotificationFromStorage(notificationId) {
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  const updatedNotifications = notifications.filter((notif) => notif.id !== notificationId);
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
}

function loadNotifications() {
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  const panel = document.getElementById('my_sidebar');

  notifications.forEach(({ id, message, timestamp, seen }) => {
    const notification = document.createElement('div');
    notification.className = `notification-message ${!seen ? 'unseen' : ''}`; // Add unseen class for unseen notifications
    notification.innerHTML = `
      <p>${message}</p>
      <small class="timestamp">${timestamp}</small>
      `;

    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'fa fa-trash-o delete-icon';
    deleteIcon.onclick = () => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
        removeNotificationFromStorage(id);
        toggleDefaultMessage();
      }, 500);
    };

    notification.appendChild(deleteIcon);
    panel.insertBefore(notification, panel.firstChild);
  });

  toggleDefaultMessage();
  toggleBellDot();
}

function toggleBellDot() {
  const bellDot = document.getElementById('bell-dot');
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
  const hasUnseenNotifications = notifications.some((notif) => notif.seen === false);

  bellDot.style.display = hasUnseenNotifications ? 'block' : 'none';
}

function markAllNotificationsAsSeen() {
  const panel = document.getElementById('my_sidebar');
  const notifications = JSON.parse(localStorage.getItem('notifications')) || [];

  const notificationElements = panel.querySelectorAll('.notification-message.unseen');
  notificationElements.forEach((notification) => {
    setTimeout(() => {
      notification.classList.remove('unseen');
    }, 500);
  });

  const updatedNotifications = notifications.map((notif) => ({ ...notif, seen: true }));
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

  toggleBellDot();
}

              /*---- menuBar ----*/
  const menubar = document.getElementById("my_menubar");
  const menuBtn = document.getElementById("menu-btn");
  const menuIcon = document.getElementById("menu-icon");
  const pcDp = document.getElementById('pc-dp-box');
  const openPf = document.getElementById('open-profile');
  const account = document.getElementById('acc-box-bg'); 

  menuBtn.addEventListener('click', function() {
    const active = this.classList.contains('active');
    const closePf = this.classList.contains('close-pf');
    
    if (!active && !closePf) {
      menubar.classList.add('open-menu');
      this.classList.add('active');
    } else if (closePf) {
        account.classList.remove('show');
        if (window.matchMedia("(min-width: 768px)").matches) {      
          menuBtn.classList.replace('close-pf', 'hide');     
          pcDp.style.display = 'grid';
        } else {
            menuBtn.classList.replace('close-pf', 'active');  
        }
    } else {
        menubar.classList.remove('open-menu');
        this.classList.remove('active');
    }
  });
  
  openPf.addEventListener('click', () => {
    account.classList.add('show');
    menuBtn.classList.replace('active', 'close-pf');
  });
  
  pcDp.addEventListener('click', () => {
    account.classList.add('show');
   // pcDp.classList.add('hide');
    pcDp.style.display = 'none';
    menuBtn.classList.replace('hide', 'close-pf');
  }); 
            
            /*---- page-navigation ----*/
  const home = document.getElementById('home');
  const fs = document.getElementById('fee-submission');
  const fb = document.getElementById('feedback');
  const cu = document.getElementById('contact-us');

  home.addEventListener('click', () => {
    location.reload();
  });
  fs.addEventListener('click', () => {
    window.location.href = 'fs.html';
  });
  fb.addEventListener('click', () => {
    window.location.href = 'fb.html';
  });
  cu.addEventListener('click', () => {
    window.location.href = 'cu.html';
  });

                /*---- Sign In/Up ----*/
  const login = document.getElementById('login');
  const logIcon = document.getElementById('login-icon');
  const logText = logIcon.nextElementSibling;
  const logTextContent = logText.textContent;
  
  login.addEventListener('click', () => {
    const logState = logIcon.classList.contains('fa-user-large');
    const closeState = logIcon.classList.contains('fa-chevron-right');
    
    if (logState) {
        account.classList.add('show');
        logIcon.classList.replace('fa-user-large', 'fa-chevron-right');
        logText.textContent = 'Close';
    } else {
        account.classList.remove('show');
        logIcon.classList.replace('fa-chevron-right', 'fa-user-large');
        logText.textContent = logTextContent;
    }
  });
  
             /*---- slide-2 scripts ----*/ 
  function updateSession() {
    const today = new Date();
    const year = today.getFullYear();
    const twoDigYear = year.toString().slice(-2);
    const startOfYear = new Date(year, 3, 1);
    const session = document.getElementById('slide-session');
    let sessionText;

    if (today < startOfYear) {
        sessionText = (year - 1) + " - " + twoDigYear;
    } else {
        sessionText = year + " - " + (Number(twoDigYear) + 1);
    }

    session.textContent = sessionText;
  }
  
  updateSession();

  const regSlide = document.getElementById('slider-box-2');
  regSlide.addEventListener('click', () => {
    if (isUser) {
        window.location.href = 'reg.html';
    } else {
        account.classList.add('show');
        logIcon.classList.replace('fa-user-large', 'fa-chevron-right');
        logText.textContent = 'Close';
    }
  });
    
  
            /*---- account-manager ----*/
  const accBox = document.getElementById('acc-box');
  const pfBox = document.getElementById('profile-box');
  const frontBox = document.getElementById('front-box');
  const toggleBtn = document.getElementById('toggle-form');
  const signBox = document.getElementById('signup-box');
  const signStatus = document.getElementById('sign-status');
  const logBox = document.getElementById('login-box');
  const pcMenu = document.getElementById('pc_menubar');
  const bellBox = document.getElementById('bell-box');
  const qlinks = document.querySelectorAll(".quick-link");
  const plusEls = document.querySelectorAll(".plus");
  const logBtn = document.getElementById('login-btn');
  const logEmail = document.getElementById('inp_log_email');
  const logPw = document.getElementById('inp_log_pw');
  const forgot = document.getElementById('forgot');
  const logStatus = document.getElementById('log-status');
  const fgBox = document.getElementById('forgot-box');
  const fgEmail = document.getElementById('inp_forgot_email');
  const fgStatus = document.getElementById('forgot-status');
  const resetPwBtn = document.getElementById('resetPw-btn');
  const signBtn = document.getElementById("signup-btn");
  const signName = document.getElementById('inp_sign_name');
  const signEmail = document.getElementById("inp_sign_email");
  const signPw = document.getElementById("inp_sign_pw");
  const name = document.getElementById('pro-name');
  const email = document.getElementById('pro-email');
  const image = document.querySelectorAll('#dp, #pc-dp, #pf-pic');
  const pfName = document.getElementById('inp_pf_name');
  const pfEmail = document.getElementById('inp_pf_email');
  const pfPhone = document.getElementById('inp_pf_phone');

  let isUser = false;
  
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
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider()  

  // testing ↓

/*
async function findUser() {
  const q = query(
    collection(db, "users"),
    where("age", "==", 18)
  );

  const snap = await getDocs(q);

  snap.forEach(doc => {
    console.log(doc.id, JSON.stringify(doc.data(), null, 2));
  });
}

findUser();
*/

async function complexQuery() {
  const q = query(
    collection(db, "users"),
    where("age", ">", 18),
   // where("age", "==", 19),
    where("emailLower", "==", "aman@gmail.com")
  );

  const snap = await getDocs(q);

  snap.forEach(doc => {
    console.log(doc.id, JSON.stringify(doc.data(), null, 2));
   // console.log(doc.data());
  });
}

complexQuery();




  // database management ↓
      
  async function fetchAllUsers(userId) {
    const key = 'abc123'
 
    if ('abc123' === key) {
      const items = await getDocs(collection(db, "users"));
      items.forEach((item) => {
        console.log(item.id, " => ", JSON.stringify(item.data(), null, 2));
      });
    } else {
        const item = await getDoc(doc(db, "users", userId));
        console.log(item.id, " => ", JSON.stringify(item.data(), null, 2));
    }
  }


   
  auth.useDeviceLanguage();
  provider.setCustomParameters({ hl: "en" });
  
  
  toggleBtn.addEventListener('click', () => {  
    const fgBoxOpen = fgBox.classList.contains('show');
    if (fgBoxOpen) {
        fgBox.classList.remove('show');
        logBox.classList.remove('hide');
        toggleBtn.textContent = 'Sign Up';
    } else {
        if (window.matchMedia("(max-width: 768px)").matches) {
            if (!logBox.classList.contains('hide')) {
              logBox.classList.add('hide');
              toggleBtn.classList.add('disable');
              logBox.addEventListener('transitionend', function () {
                signBox.style.display = 'grid';
                setTimeout(() => {
                  this.style.display = 'none';
                  signBox.classList.add('show');
                  toggleBtn.classList.remove('disable');
                }, 100);
              }, { once: true });
            } else {
              signBox.classList.remove('show');
              toggleBtn.classList.add('disable');
              signBox.addEventListener('transitionend', function () {
                logBox.style.display = 'grid';
                setTimeout(() => {
                  this.style.display = 'none';
                  logBox.classList.remove('hide');
                  toggleBtn.classList.remove('disable');
                }, 100);
              }, { once: true });
            }           
        } else {         
            frontBox.classList.toggle('move');
            logBox.classList.toggle('hide');
            signBox.classList.toggle('show');
        }
        
        toggleBtn.textContent = toggleBtn.textContent === 'Sign Up' ? 'Login' : 'Sign Up';
    }
  });
  
  // Calling api to verify user email ↓
  
  function sendEmail(mail, task) {
    return fetch("https://sxsedu.vercel.app/api/sendEmail", {
      method: "POST",
      body: JSON.stringify({ email: mail, action: task }),
    })
    .then(res =>
      res.json().then(data => {   
        if (!res.ok) {
            throw new Error(data.error);
        }
      console.log(JSON.stringify(data));
    }))
    .catch((error) => {
        throw error;             
    });
  }
 
  // Getting params from url ↓
  
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const refPage = urlParams.get('ref');
  const oobCode = urlParams.get('oobCode');

  if (oobCode) {
    if (mode === 'verifyEmail') {
      confirmEmailVerification(oobCode);
    } else if (mode === 'resetPassword') {
        const newPassword = prompt("Enter new password");
        resetUserPassword(oobCode, newPassword);
    }
  }
  
  function confirmEmailVerification(oobCode) {
    applyActionCode(auth, oobCode)
    .then(() => {
        alert("Email Verified Successfully! ✅");
        window.location.replace('index.html?mode=login');
    })
    .catch((error) => {
        alert("Verification Failed: " + error.message);
    });
  }

  if (mode && mode === 'login') {
      account.classList.add('show');
  }
       
  onAuthStateChanged(auth, (user) => {
     if (user) {
        isUser = true;
        console.log(JSON.stringify(user));
      //  fetchAllUsers(user.uid);
        accBox.style.display = 'none';
        pfBox.style.display = 'grid';
        login.style.display = 'none';
        name.textContent = user.displayName;                                                
        email.textContent = user.email;
        pfName.value = user.displayName;                                                            
        pfEmail.value = user.email;
        pfPhone.value = user.phoneNumber || '';
        image.forEach((img) => {
          img.src = user.photoURL
          img.onerror = function() {
              this.src = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
          };
        });
        bellBox.style.display = 'inline-block';
        menuBtn.style.display = 'block';
        menubar.style.display = 'block';
        qlinks.forEach((link) => link.classList.remove('quick-link'));
      //  alert(user.photoURL);
     //   window.location.href = user.photoURL;
        
        if (window.matchMedia("(min-width: 768px)").matches) {
            pcMenu.style.display = 'flex';
            pcDp.style.display = 'grid';
            menubar.style.display = 'none';
            menuBtn.classList.add('hide');
        } else {
            menubar.style.display = 'block';
            pcMenu.style.display = 'none';
            pcDp.style.display = 'none';
        }        
     } else {
         isUser = false;
         console.log('No user logged in!!');
         pfBox.style.display = 'none';
         accBox.style.display = 'flex';
         plusEls.forEach((el) => el.style.display = 'none');             
         if (mode !== "login") {
           initGoogleSign();
           login.style.display = 'flex';
         }
     }
  });


  function initGoogleSign() {
    setTimeout(() => {
      google.accounts.id.initialize({
        client_id: "688203518667-utbl049mcr3rapqfsdnid8qml7cpm77t.apps.googleusercontent.com",  // Same as Firebase Google sign-in
        callback: handleCredentialResponse,
        auto_select: true, // or true for instant selection
        cancel_on_tap_outside: true,
      });
      
      google.accounts.id.prompt(); // Shows the One Tap prompt
    }, 3000);
  }

  function handleCredentialResponse(response) {
    const credential = GoogleAuthProvider.credential(response.credential);
    signInWithCredential(auth, credential)
    .then((result) => {
      console.log(result);
      location.reload();
    })
    .catch((error) => {
      console.log("Sign in failed:", error);
      google.accounts.id.prompt();
    });   
  }
      
  // Forgot & Reset Password ↓
  
  forgot.addEventListener('click', () => {
      fgEmail.value = logEmail.value.trim();
      logBox.classList.add('hide');
      fgBox.classList.add('show');
      toggleBtn.textContent = 'Back to login';
  });
   
  resetPwBtn.addEventListener('click', () => {
    sendEmail(fgEmail.value, 'reset')
    .then(() => {
      fgStatus.textContent = 'If an account with that email exists, we’ve sent a password reset link.';
      setTimeout(() => {
          window.location.replace('index.html?mode=login');
      }, 2000);
    })
    .catch((error) => {
        fgStatus.textContent = handleAuthError(error);
        console.error(error);
    });
  });
  
  function resetUserPassword(oobCode, newPassword) {
    confirmPasswordReset(auth, oobCode, newPassword)
    .then(() => {
      alert("Password Reset Successful! ✅");
      window.location.replace('index.html?mode=login');
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
  }
  
  
  
  
/*
  document.getElementById("uploadFile").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("key", "d8e4ccd142ddf84767dac0474af959ea"); // Replace with your Imgbb API Key
    formData.append("image", file);

    try {
        const response = await fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.data.url) {
            const imageUrl = data.data.url;
            console.log("Uploaded Image URL:", imageUrl);
            updateFirebaseProfile(imageUrl); // Send URL to Firebase
        } else {
            console.error("Upload Failed:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
  });



*/
 
  document.getElementById("google-btn").addEventListener("click", (e) => {
    signInWithPopup(auth, provider)
      .then((result) => {
   
        const user = result.user;
        console.log(result);
        name.textContent = user.displayName;                                                            
        email.textContent = user.email;
        image.src = user.photoURL;
        
     //   const photoUrl = user.photoURL;
      //  console.log(photoUrl);
        if (refPage) {
            const drp = atob(decodeURIComponent(refPage));
            window.location.replace(drp);
        } else {
            window.location.replace('index.html');
        }
     //   if (photoUrl && photoUrl.includes("i.ibb.co")) {
   //         console.log('already stored in imgbb');
    //        location.reload();
   //     } else {
          //  updateUserProfileWithNewImage(user, user.photoURL);
    //    }
      })
      .catch((error) => {
        console.error(error);
        logStatus.textContent = 'Some error occurred, please try again!';
      });
  });
       

function handleAuthError(error) {
    const errorMessage = error.message.toLowerCase(); // Convert to lowercase for case-insensitive matching

    if (errorMessage.includes("network-request-failed")) {
        return "Network error! Please check your internet connection.";
    }
    if (errorMessage.includes("wrong-password")) {
        return "Incorrect password. Please try again.";
    }
    if (errorMessage.includes("auth/password-does-not-meet-requirements")) {
        return "Password should be alphanumeric and 6-12 characters!";
    }
    if (errorMessage.includes("user-not-found")) {
        return "No account found with this email. Please sign up first.";
    }
    if (errorMessage.includes("email-already-in-use")) {
        return "This email is already registered. Try logging in instead.";
    }
    if (errorMessage.includes("invalid-email") || errorMessage.includes("email address is improperly formatted")) {
        return "Invalid email format. Please enter a valid email.";
    }
    if (errorMessage.includes("invalid-credential")) {
        return "Invalid Credentials!";
    }
    if (errorMessage.includes("weak-password")) {
        return "Weak password! Please use at least 6 characters with numbers and letters.";
    }
    if (errorMessage.includes("too-many-requests")) {
        return "Too many failed attempts. Please try again later.";
    }
    if (errorMessage.includes("operation-not-allowed")) {
        return "This sign-in method is not enabled. Contact support.";
    }
    if (errorMessage.includes("missing-password")) {
        return "Please enter a password.";
    }
    if (errorMessage.includes("missing-email")) {
        return "Please enter an email.";
    }
    if (errorMessage.includes("requires-recent-login")) {
        return "For security reasons, please log in again.";
    }
    if (errorMessage.includes("popup-closed-by-user")) {
        return "Popup closed before completing sign-in.";
    }
    if (errorMessage.includes("credential-already-in-use")) {
        return "This account is already linked to another sign-in method.";
    }
    if (errorMessage.includes("user-disabled")) {
        return "This account is blocked! Contact support.";
    }

    // If error is something else (very rare)
    return "Something went wrong! Please try again later.";
}


     
       
  function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
            logStatus.textContent = 'Email not verified! Please check your inbox and verify.';
            signOut(auth);
        } else {
            //alert(userCredential.user);
            console.log("Login successful");
            logStatus.style.display = 'none';
        }
        
        window.location.replace('index.html');
      })
      .catch((error) => {
        logStatus.textContent = handleAuthError(error);
      });
  }
  
  
  
  
    logBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const email = logEmail.value;
      const password = logPw.value;
      loginUser(email, password);
    });
  
  async function signUpUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const name = signName.value.trim();
        await updateProfile(user, { displayName: name });      
        await sendEmail(email, 'verify');
        signStatus.textContent = "Verification link sent! Please check your email and verify your account before logging in."; 
        signOut(auth);
        setTimeout(() => {
          window.location.replace('index.html?mode=login');
        }, 2000);
    } catch (error) {
        signStatus.textContent = handleAuthError(error);
    }
  }

    signBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const email = signEmail.value;
      const password = signPw.value;
      signUpUser(email, password)      
    });
    
    const logOutBtn = document.getElementById('logout-btn');    
    logOutBtn.addEventListener("click", () => {
      signOut(auth)
      .then(() => {
          location.reload();
      })
      .catch((error) => {
          console.log(error);
      });
    });

            /*---- profile management ----*/
  const pfBtn = document.getElementById('pf-btn');
  const pfBtnSlider = document.getElementById('pf-btn-slider');
  const pfPicBox = document.getElementById('pf-pic-box');
  const pfPic = document.getElementById('pf-pic'); 
  const picClose = document.getElementById('close-pic');
  const pfDefPic = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg';
  const picBtnBox = document.getElementById('pic-btns');
  const photoUploadBtn = document.getElementById('upload-btn');
  const picDelBtn = document.getElementById('pic-del-btn');
  const fileInput = document.getElementById('inp_pf_photo');
  const pfInputs = document.querySelectorAll('#profile-box input');
  const updatePw = document.getElementById('update-pw');
  const deleteAcc = document.getElementById('delete-acc');
  
  let canEdit = false;
 
async function uploadToImgbb(imageUrl) {

    if (!imageUrl) {
        console.error('image url not found in imgbb function');
    }

    const urlRes = await fetch(imageUrl);
    const apiKey = "d8e4ccd142ddf84767dac0474af959ea";  // Replace with your Imgbb API key
    const blob = await urlRes.blob();
   // alert(blob);    
    const formData = new FormData();
    formData.append("image", blob);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData
    });
  //  alert('after append image');
    const data = await response.json();
    if (data.success) {
    //    alert('success to get perma url');
        return data.data.url;  // Permanent image URL
    } else {
        console.error("Image upload failed:", data.error);
        return null;
    }
}
   
async function updateUserProfileWithNewImage(user, photoUrl) {
  try {
    if (user && photoUrl) {
   // alert(photoUrl);
        const permanentUrl = await uploadToImgbb(photoUrl);
        if (permanentUrl) {
            await updateProfile(user, { photoURL: permanentUrl });
       //     alert("Profile updated successfully!");
        }
    } else {
    //    alert('photourl not found');
    }
    
   // location.reload();
  } catch (error) {
      alert(error);
  }
}
 
  async function getPhotoUrl(file) {
    const formData = new FormData();
    formData.append("key", "d8e4ccd142ddf84767dac0474af959ea"); // Replace with your Imgbb API Key
    formData.append("image", file);

    try {
        const response = await fetch("https://api.imgbb.com/1/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.data.url) {
            const imageUrl = data.data.url;
            console.log("Uploaded Image URL:", imageUrl);
            return imageUrl;
        //    updateFirebaseProfile(imageUrl); Send URL to Firebase
        } else {
            console.error("Upload Failed:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
  }
  
  // Update user password & delete account ↓
  
  async function reAuth(task, msg, next) {   
    try {    
      const user = auth.currentUser;
      const providerId = user.providerData[0].providerId;
      console.log(providerId);
   
      if (providerId === "password") {   
        const oldPw = prompt("Enter old password");
        const credential = EmailAuthProvider.credential(
          user.email,
          oldPw
        );

        await reauthenticateWithCredential(user, credential);
        console.log("✅ Password verified...");
          
      } else if (providerId === "google.com") {
          await reauthenticateWithPopup(user, provider);
          console.log("✅ Google user verified...");
      }
      
      if (task === 'update-pw') {
        const newPw = prompt("Enter new password");
        await updatePassword(user, newPw);
      } else if (task === 'delete-acc') {
          await deleteUser(user);
      }
      
      alert(msg);
      await signOut(auth);
      window.location.replace(next);
      
    } catch (error) {
        alert("❌ " + error.message);
    }
  }
  
  updatePw.addEventListener('click', () => {
    const action = 'update-pw';
    const alert = "✅ Password updated successfully!";
    const redirect = 'index.html?mode=login';
    reAuth(action, alert, redirect);
  });
  
  deleteAcc.addEventListener('click', () => {
    const action = 'delete-acc';
    const alert = "😞 Account deleted successfully!";
    const redirect = 'index.html';
    
    if (confirm("Do you really want to delete account?")) {
      reAuth(action, alert, redirect);
    }
  });
  
  // Edit user profile ↓
  
  pfBtn.addEventListener('click', async () => {
    pfBtnSlider.classList.toggle('slide');
    const editable = pfBtnSlider.classList.contains('slide');
  
    if (editable) {
        pfInputs.forEach((inp) => {
            inp.disabled = false;
        });
        canEdit = true;
    } else {
        pfInputs.forEach((inp) => {
            inp.disabled = true;
        });
        
        const photo = fileInput.files[0];        
        const profileData = {
            displayName: pfName.value.trim(),
            photoURL: await getPhotoUrl(photo)
        };
        
        updateUserPf(profileData);
        canEdit = false;
        
    //    location.reload();
    }
 
  }); 
  
  pfPicBox.addEventListener('click', () => {
    if (canEdit) {
      picBtnBox.classList.toggle('show');
      picClose.classList.toggle('visible');
    }
  });
  


  photoUploadBtn.addEventListener('click', () => {
      fileInput.click();
  });
  
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]; 
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        pfPic.src = e.target.result;
        //localStorage.setItem('profilePicture', reader.result);
        //document.getElementById('default-profile-pic').src = reader.result;
      };
      reader.readAsDataURL(file); 
    } 
  });
  
  picDelBtn.addEventListener('click', () => {
    fileInput.value = '';
    pfPic.src = pfDefPic;
  });


  function updateUserPf(data) { 
    if (auth.currentUser) {
        updateProfile(auth.currentUser, data)
        .then(() => {
            console.log("Profile updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating profile: ", error);
        });
    } else {
        console.log("User not signed in.");
    }
  }











  updateStatusBar();


         /*---- chatbase.co ----*/
  window.embeddedChatbotConfig = {
    chatbotId: "9YRSDWYGQFngIG3W6Ahqp",
    domain: "www.chatbase.co"
  }
    
 const userName = "Shreyans";
 setTimeout(() => {
   if (userName && window.chatbase && window.chatbase.setInitialMessages) {
     window.chatbase.setInitialMessages([
       `Hello ${userName}, how can I help!`
     ]);
   } else {
       console.error('something wrong');
   }
 }, 2000);


        /*---- © current year ----*/
  const year = document.getElementById('current-year');
  const currentYear = new Date().getFullYear();
  year.textContent = currentYear;
  
  
}); // Dom content loaded listener ends here.

               /*---- page-refreshment ----*/
window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        sessionStorage.setItem('no-anime', 'true');
        location.reload(); // Reload page if loaded from bfcache
    }
});

               /*---- sliders-alignment ----*/
window.addEventListener("load", () => {
    const sliders = document.querySelectorAll(".slider");
    const boxes = document.querySelector(".boxes");
    
    sliders.forEach((slider) => {
    // Check if the total width of boxes is smaller than the slider width
      if (slider.scrollWidth <= slider.clientWidth) {
          slider.style.justifyContent = "center";  // Center when not overflowing
      }
    });  // else {
   //     boxes.style.justifyContent = "flex-start"; // Normal scrolling
  //  }
});

              /*-- Online/Offline status --*/
function updateStatusBar() {
  const statusBar = document.getElementById('status-bar');
  const statusBarIcons = document.getElementById('status-bar-icons');
  const internet = document.getElementById('internet-img');
  const noInternet = document.getElementById('no-internet-icon')
  const msg = document.getElementById('internet-msg');
  const navbar = document.getElementById('my_navbar');
  const menubar = document.getElementById("my_menubar");
  const bellBox = document.getElementById('bell-box');
  const menuBtn = document.getElementById("menu-btn");

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
    msg.textContent = 'Back Online';
    menubar.classList.remove('hide');
    bellBox.classList.remove('hide');
    menuBtn.classList.remove('hide');
  } else {
    setTimeout(() => {
      statusBar.style.opacity = '0.5';
      document.body.style.overflowY = 'hidden';
    }, 50);
    statusBar.style.display = 'grid';
    statusBarIcons.style.borderColor = '#007bff';
    internet.style.opacity = '0';
    noInternet.style.opacity = '1';
    msg.style.color = 'red';
    msg.textContent = 'No Internet Connection!';
    menubar.classList.add('hide');
    bellBox.classList.add('hide');
    menuBtn.classList.add('hide');
  }
}
                
window.addEventListener('online', updateStatusBar);
window.addEventListener('offline', updateStatusBar);

} // For if (correctPath);
