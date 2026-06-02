              /*---- Porting ----*/
  import { showNotification } from "./script.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

              /*---- Home navigation & account checkup ----*/
document.addEventListener('DOMContentLoaded', () => {
 // const home = document.getElementById('home');
    home.addEventListener('click', () => {
      if (document.referrer.includes('index.html')) {
          history.back(); // Go back if possible (acts like pressing the Back button)
      } else {
        location.replace('index.html'); // Fallback in case history is not available
      }
    });
  
   //  if (!item) {
   //     window.location.href = 'index.html?mode=login';
   //}
   
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

         /*---- Make inputs sensible ----*/
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input').forEach(input => {
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocomplete', 'off');
  });
});

            /*---- inputs function ----*/
document.addEventListener('DOMContentLoaded', () => {
  const inputSlide = document.getElementById('input-slide');
 
  const nameInputBox = document.getElementById('name-box');
  const nameInput = document.getElementById('inp_name');
  const nameCheckIcon = document.getElementById('name-check-icon');
  const nameErrorIcon = document.getElementById('name-error-icon');
  const nameErrorMsg = document.getElementById('name-error-msg');

  const amInputBox = document.getElementById('am-box');
  const amInput = document.getElementById('inp_am');
  const amCheckIcon = document.getElementById('am-check-icon');
  const amErrorIcon = document.getElementById('am-error-icon');
  const amErrorMsg = document.getElementById('am-error-msg');

  const paymentSlide = document.getElementById('payment-slide');
  const qrBtn = document.getElementById('qr-btn');
  const finalName = document.getElementById('final-name');
  const finalAm = document.getElementById('final-am');
  const img = document.getElementById('qr-img');
  const loading = document.getElementById('loading-bg');

  const checkBox = document.getElementById('payment_check_btn');
  const checkboxError = document.getElementById('checkbox-error');
  const confirmBtn = document.getElementById('confirm-btn');
  const successSlide = document.getElementById('success-slide')
  const paymentId = document.getElementById('payment-id');
  const ref = document.getElementById('ref');
  const expireSlide = document.getElementById('expire-slide')
  
  nameInput.addEventListener('input', function () {
    const value = this.value;
    const words = value.split(' ');
    const capitalizedWords = words.map(word => {
      return word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '';
    });

    this.value = capitalizedWords.join(' ');

    validateName();
  });

  amInput.addEventListener('input', function () {
    if(this.value.length > 6) {
      this.value = this.value.slice(0, 6);
    }
   
    validateAm();
  });

  function validateName() {
    const name = nameInput.value.trim();
    const pattern = /^[A-Za-z]+(?: [A-Za-z]+)*\s*$/;
    let isNameValid = false;

    if (pattern.test(name) && name.length >= 3) {
      nameInputBox.style.marginBottom = '1.5rem';
      nameInput.classList.remove('invalid');
      nameInput.classList.add('valid');
      nameCheckIcon.style.display = 'block';
      nameErrorIcon.style.display = 'none';
      nameErrorMsg.style.display = 'none';

      isNameValid = true;
    } else {
      nameInputBox.style.marginBottom = '0';
      nameInput.classList.remove('valid');
      nameInput.classList.add('invalid');
      nameCheckIcon.style.display = 'none';
      nameErrorIcon.style.display = 'block';
      nameErrorMsg.style.display = 'block';
      nameErrorMsg.classList.add('shake');
      setTimeout(() => {
        nameErrorMsg.classList.remove('shake');
      }, 500);

      if (name === '') {
        nameErrorMsg.textContent = "Name cannot be empty!";
      } else if (!pattern.test(name)) {
        nameErrorMsg.textContent = "Please enter a valid name!";
      } else if(name.length < 3) {
        nameErrorMsg.textContent = "Name must be at least 3 character!";
      } else {
        nameErrorMsg.textContent = "Invalid name entered!";
      }

      isNameValid = false;
    }
  
    return isNameValid;
  }

  function validateAm() {
    const am = amInput.value.trim();
    let isAmValid = false;

    if (am && amInput.checkValidity() && am >= 1 && am <= 100000) {
      amInputBox.style.marginBottom = '1.5rem';
      amInput.classList.remove('invalid');
      amInput.classList.add('valid');
      amCheckIcon.style.display = 'block';
      amErrorIcon.style.display = 'none';
      amErrorMsg.style.display = 'none';

      isAmValid = true;
    } else {
      amInputBox.style.marginBottom = '0';
      amInput.classList.remove('valid');
      amInput.classList.add('invalid');
      amCheckIcon.style.display = 'none';
      amErrorIcon.style.display = 'block';
      amErrorMsg.style.display = 'block';
      amErrorMsg.classList.add('shake');
      setTimeout(() => {
        amErrorMsg.classList.remove('shake');
      }, 500);

      if (am === '') {
        amErrorMsg.textContent = "Amount cannot be empty!";
      } else if (am < 1) {
        amErrorMsg.textContent = "Amount should be at least 1!";
      } else if (am > 100000) {
        amErrorMsg.innerHTML = "Amount cannot exceed 1 lakh,<br>as per UPI limits!";
      } else {
        amErrorMsg.textContent = "Please enter a valid amount!";
      }

      isAmValid = false;
    }
  
    return isAmValid;
  }

  qrBtn.addEventListener('click', (event) => {
    event.preventDefault;
    
    const isNameValid = validateName();
    const isAmValid = validateAm();
  
    function shortName(name) {
      const shortedName = name.length > 20 ? `${name.substring(0, 20)}...` : name;
      return shortedName;
    }
  
    if (isNameValid && isAmValid) {
      const name = nameInput.value.trim();
      const am = amInput.value.trim();
      const eSrc = "aHR0cHM6Ly9xdWlja2NoYXJ0LmlvL3FyP3NpemU9MjAwJnRleHQ9dXBpJTNBJTJGJTJGcGF5JTNGcGElM0RzYXVyYWJoc3JpdmFzdGF2YWJpbm5pJTQwb2tpY2ljaSUyNnBuJTNEU1hTJTIwRURVQ0FUSU9OJTI2dG4lM0RUaGFua3MlMjBmb3IlMjB0cnVzdGluZyUyMHVzISUyNmN1JTNESU5SJTI2YW0lM0QK";
      const dSrc = atob(eSrc);
      const qrSrc = `${dSrc}${am}`;

      inputSlide.style.opacity = '0';
      loading.style.display = 'grid';
    
      inputSlide.addEventListener('transitionend', function () { 
        this.style.display = 'none';
        setTimeout(() => {
          loading.style.display = 'none';
          initiateTimer();
        }, 2000);
        img.src = qrSrc;
        paymentSlide.style.display = 'grid';
        finalName.textContent = shortName(name);
        finalAm.textContent = formatIndianCurrency(am);
        img.style.display = 'block';
        console.log('QR code generated successfully...');
      });
    } else {
      console.warn('Please fix the errors before generating the QR code!');
    }
  
  });


  let timerInterval;
  let remainingTime = 0;
  let startTime = 0;
  const timerDuration = 2 * 60; // Set timer duration here (e.g., 2 minutes)

  function startTimer(duration) {
    // Check if there's any saved time in localStorage, else start fresh
    if (localStorage.getItem('cGF5bWVudF90aW1lcg==')) {
        remainingTime = parseInt(localStorage.getItem('cGF5bWVudF90aW1lcg=='));
    } else {
        remainingTime = duration;
    }

    clearInterval(timerInterval); // Clear any previous intervals

    startTime = Date.now(); // Mark the start time

    timerInterval = setInterval(function() {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time

        // Update remaining time based on elapsed time
      remainingTime = Math.max(0, duration - elapsedTime);

        // Update the timer display
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      const display = document.getElementById('timer');
      display.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Save remaining time to localStorage every second
      localStorage.setItem('cGF5bWVudF90aW1lcg==', remainingTime);

        // Timer expiry condition
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        handleTimerExpiry();
      }
    }, 1000);
  }

  // Function to handle timer expiry
  function handleTimerExpiry() {
    paymentSlide.style.display = 'none';
    expireSlide.style.display = 'grid';
    clearInterval(timerInterval);
    localStorage.removeItem('cGF5bWVudF90aW1lcg==');
    console.log("Payment session expired!");
  }

  // This function will be called to initiate the timer
  function initiateTimer() {
    localStorage.removeItem('cGF5bWVudF90aW1lcg=='); // Reset the stored time when initiating a new timer
    startTimer(timerDuration); // Start the timer from fresh state
  }
  
  checkBox.addEventListener('click', (event) => {
    event.preventDefault();
    
    const checked = checkBox.classList.toggle('btn-checked');

    if (checked) {
      checkboxError.style.display = 'none';
  //    declarationCheckBtn.style.marginBottom = '2.5rem';
      checkBox.classList.remove('invalid');
      checkBox.classList.add('valid');
    } else {
      checkBox.classList.remove('valid');
      checkBox.classList.add('invalid');
    }
  });

           /*---- payment checkBox ----*/
  function paymentIsChecked() {
    return checkBox.classList.contains('btn-checked');
  }
  
          /*---- On-confirm Payment ----*/
  confirmBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const am = formatIndianCurrency(amInput.value.trim());
   
    if (paymentIsChecked()) {
      const random = Math.floor(100000 + Math.random() * 900000);
      paymentRef = `SE${random}P`;
      confirmTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString('en-GB');
      ref.textContent = paymentRef;
      paymentSlide.style.opacity = '0';
      loading.style.display = 'grid';

      paymentSlide.addEventListener('transitionend', function () {
        setTimeout(() => {
          this.style.display = 'none';
          successSlide.style.display = 'grid';
          loading.style.display = 'none';
        }, 2000);
      });
      
      const update = `Payment Update: Payment of ${am} for ${name} with Payment ID '${paymentRef}' is under verification. You will be notified upon completion.`;
      showNotification(update, confirmTime);
      
      clearInterval(timerInterval);
      localStorage.removeItem('cGF5bWVudF90aW1lcg==');
    } else {
      checkBox.classList.remove('valid');
      checkBox.classList.add('invalid');
      checkboxError.style.display = 'block';
      checkboxError.classList.add('shake');
      setTimeout(() => {
        checkboxError.classList.remove('shake');
      }, 500);
    }
  });
  
  let isCopying = false;
  paymentId.addEventListener('click', function () {
    if (isCopying) return;
    const text = this.textContent;
    isCopying = true;
    navigator.clipboard.writeText(text)
    .then((response) => {
      console.log(response);
      this.textContent = 'Copied to clipboard!';
      setTimeout(() => {
        this.textContent = text;
        isCopying = false;
      }, 2000);
    })
    .catch((err) => {
      console.error('Error in copying:', err);
      this.textContent = 'Failed to copy';
      setTimeout(() => {
        this.textContent = text;
        isCopying = false;
      }, 2000);
    });
  });
});

let paymentRef = null;
let confirmTime = null;

           /*---- Format INR ----*/
function formatIndianCurrency(amount) {
  const integerPart = Math.floor(amount).toString();
  const lastThree = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);
  const formattedInteger = otherDigits
    ? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
    : lastThree;

  return `${formattedInteger}.00 INR`;
}

           /*---- Receipt generation ----*/
document.addEventListener('DOMContentLoaded', () => {
  const receiptBtn = document.getElementById('receipt-btn');
  const nameInput = document.getElementById('inp_name');
  const amInput = document.getElementById('inp_am');

  receiptBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logoURL = 'https://i.ibb.co/mv8T96b/sxs-logo.png';
    const ref = paymentRef;
    const time = confirmTime;
    const name = nameInput.value.trim();
    const am = formatIndianCurrency(amInput.value.trim());

    // Add Light Background
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 297, 'F');

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

    const greenText = "FEE PAYMENT RECEIPT";
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    const greenTextX = greenBoxX + (greenBoxWidth - doc.getTextWidth(greenText)) / 2;
    const greenTextY = greenBoxY + (greenBoxHeight + 14 * 0.352777778) / 2;
    doc.text(greenText, greenTextX, greenTextY);

    // Add Table
    const tableStartY = greenBoxY + greenBoxHeight + 1;
    doc.autoTable({
      startY: tableStartY,
      margin: { left: 20, right: 20 },
      styles: { fontSize: 11, cellPadding: 5 },
      theme: 'grid',
      head: [],
      body: [
        ['Payment ID', ref],
        ['Date & Time', time],
        ['Payee Name', name],
        ['Amount Paid', am],
      ],
    });

    // White Box for Note
    const noteBoxX = 20;
    const noteBoxY = doc.lastAutoTable.finalY + 15;
    const noteBoxWidth = doc.internal.pageSize.getWidth() - 40;
    const noteBoxHeight = 50;

    doc.setFillColor(255, 255, 255); // White color for the box
    doc.rect(noteBoxX, noteBoxY, noteBoxWidth, noteBoxHeight, 'F');

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
      "This receipt is generated based on your confirmation of successful payment.",
      "We trust our users and value your honesty in marking payments as completed.",
      "The payment is subject to verification. In case of discrepancies, we will contact you.",
      "Once the payment is verified, you will receive a confirmation email.",
      "If you face issues, feel free to contact us for assistance.",
    ];

    let bulletY = noteHeadingY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    bulletPoints.forEach((point) => {
      doc.text(`\u2022 ${point}`, noteBoxX + 5, bulletY);
      bulletY += 6;
    });

    // Footer
    const footerEndY = pageHeight - paddingBottom;
    doc.setFont('times', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(40, 60, 90);
    const footerStartY = footerEndY - 20;
    doc.text("Thanks For Trusting Us!", pageWidth / 2, footerStartY, null, null, 'center');

    const linkText = "S² Education";
    const textWidth = doc.getTextWidth(linkText);
    const linkX = (pageWidth - textWidth) / 2;
    const linkY = footerEndY - 10;
    doc.textWithLink(linkText, linkX, linkY, { url: 'https://sxsco.github.io/edu/' });
    doc.setLineWidth(0.2);
    doc.setDrawColor(40, 60, 90);
    doc.line(linkX, linkY + 1, linkX + textWidth, linkY + 1);
     
    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Electronically Generated, does not require Signature.", pageWidth / 2, footerEndY, null, null, 'center');

    // Save pdf with QR Code
    const qrContainer = document.createElement('div');
    const qrData = `S² Education\nFee Payment Receipt\nPayment ID: ${ref}\nDate & Time: ${time}\nPayee Name: ${name}\nAmount Paid: ${am}\nThanks For Trusting Us!`;
    const qr = new qrcode(0, 'L');
    qr.addData(qrData);
    qr.make();
    qrContainer.innerHTML = qr.createImgTag(4);
    const qrImg = qrContainer.querySelector('img');
    const qrWidth = 40;
    const qrHeight = 40;
    const qrX = (pageWidth - qrWidth) / 2;
    const qrY = ((noteBoxY + noteBoxHeight) + footerStartY) / 2;
    
    if (qrImg) {
      qrImg.onload = () => {
        doc.addImage(qrImg.src, 'PNG', qrX, qrY - qrHeight/2, qrWidth, qrHeight);
        doc.save("fee_payment_receipt.pdf");
        console.log('Pdf Downloaded Successfully...');
      };
      qrImg.onerror = () => {
        doc.save("fee_payment_receipt.pdf");
        console.error('some error occurred, may be QR will not available in pdf.');
      };
    } else {
      doc.save("fee_payment_receipt.pdf");
      console.log('pdf downloaded, but QR will not available.');
    }
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
