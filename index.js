document.addEventListener("DOMContentLoaded", () => {
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


  const elementsToAnimate = document.querySelectorAll('.float-up');

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
      });
  }, {
      threshold: 0.2 // Trigger when 20% of the element is visible
  });

  elementsToAnimate.forEach(element => observer.observe(element));

  // Navbar 
  const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('nav ul');

// Toggle Navigation Menu on Hamburger Click
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close Menu on Outside Click
document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger) {
        navLinks.classList.remove('active');  // Close the menu if clicked outside
    }
});



  const tabs = document.querySelectorAll(".tablinks");
  const tabLine = document.querySelector(".tabs-line");

  // Function to switch between tabs
  function openTab(evt, categoryName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");

    // Hide all tab content
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Remove "active" class from all tabs
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Display the selected tab content
    document.getElementById(categoryName).style.display = "block";

    // Add "active" class to the clicked tab
    evt.currentTarget.className += " active";

    // Move the hotpink line under the active tab
    const activeTab = evt.currentTarget;
    const tabWidth = activeTab.offsetWidth;
    const tabPosition = activeTab.offsetLeft;
    tabLine.style.width = `${tabWidth}px`;
    tabLine.style.left = `${tabPosition}px`;
  }

  // Set up event listeners for each tab button
  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const categoryName = event.target
        .getAttribute("onclick")
        .match(/'(.*?)'/)[1];
      openTab(event, categoryName);
    });
  });

  // Set the default active tab to open when the page loads
  if (tabs.length > 0) {
    tabs[0].click();
  }
});
