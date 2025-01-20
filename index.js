document.addEventListener("DOMContentLoaded", () => {

    /********* Particles *********/
  particlesJS.load("particles-js", "particles/particles.json", function () {
    console.log("callback - particles.js config loaded");
  });

  particlesJS.load(
    "particles-contact",
    "particles/particles.json",
    function () {
      console.log("callback - particles.js config loaded");
    }
  );

  const elementsToAnimate = document.querySelectorAll(".float-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    {
      threshold: 0.2, // Triggesr when 20% of the element is visible
    }
  );

  elementsToAnimate.forEach((element) => observer.observe(element));


  /********* Navbar *********/
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector("nav ul");

  // Toggle Navigation Menu on Hamburger Click
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close Menu on Outside Click
  document.addEventListener("click", (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger) {
      navLinks.classList.remove("active"); // Close the menu if clicked outside
    }
  });

    /********* Skill Tabs *********/

    const tabs = document.querySelectorAll(".tablinks");
    const tabLine = document.querySelector(".tabs-line");
    
    // Function to switch between tabs
    function openTab(evt, categoryName) {
        const tabcontent = document.getElementsByClassName("tabcontent");
    
        // Hide all tab content
        Array.from(tabcontent).forEach(content => {
            content.style.display = "none";
        });
    
        // Remove "active" class from all tabs
        tabs.forEach(tab => {
            tab.classList.remove("active");
        });
    
        // Display the selected tab content
        document.getElementById(categoryName).style.display = "block";
    
        // Add "active" class to the clicked tab
        evt.currentTarget.classList.add("active");
    
        // Move the hotpink line under the active tab
        moveTabLine(evt.currentTarget);
    }
    
    // Function to move the tab line to the active tab
    function moveTabLine(activeTab) {
        const tabWidth = activeTab.offsetWidth;
        const tabPosition = activeTab.offsetLeft;
    
        // Set the width and position of the tab line
        tabLine.style.width = `${tabWidth}px`;
        tabLine.style.left = `${tabPosition}px`;
    }
    
    // Set up event listeners for each tab button
    tabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            const categoryName = event.target.dataset.category;
            openTab(event, categoryName);
        });
    });
    
    // Set the default active tab to open when the page loads
    if (tabs.length > 0) {
        tabs[0].click(); // This will simulate a click on the first tab to make it active
    }
    
    // Adjust tab line when window is resized
    window.addEventListener("resize", () => {
        const activeTab = document.querySelector(".tablinks.active");
        if (activeTab) {
            moveTabLine(activeTab);
        }
    });
     /*****************Project Card Flip ***********************/

    const cards = document.querySelectorAll(".card.clickable");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        console.log('card clicked', card.classList);
        card.classList.toggle("flipped");
      });
    });

    /*****************CONTACT FORM ***********************/
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const response = await fetch('https://formspree.io/f/mgvvqlrz', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formMessage.textContent = 'Message sent, Thanks for contacting! Hope to get back to you soon.';
            formMessage.style.display = 'block';
            form.reset();
        } else {
            formMessage.textContent = 'Oops! Something went wrong. Please try again.';
            formMessage.style.color = 'red';
            formMessage.style.display = 'block';
        }
    });
    
});
