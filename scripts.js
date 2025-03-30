document.addEventListener("DOMContentLoaded", () => {
  // --- Smooth Scrolling ---
  const navLinks = document.querySelectorAll("header nav ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      // Special case for home or invalid links
      if (!targetId || targetId === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = document.querySelector("header").offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open and active
        const navUl = document.querySelector("header nav ul");
        const menuIcon = document.querySelector(".menu-toggle i"); // Use menuIcon here
        if (navUl.classList.contains("active")) {
          navUl.classList.remove("active");
          menuIcon.classList.remove("fa-times");
          menuIcon.classList.add("fa-bars");
        }
      }
    });
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navUl = document.querySelector("header nav ul");
  const menuIcon = menuToggle ? menuToggle.querySelector("i") : null; // Get the icon element safely

  if (menuToggle && navUl && menuIcon) {
    menuToggle.addEventListener("click", () => {
      navUl.classList.toggle("active");
      // Toggle icon class
      if (navUl.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
      } else {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
      }
    });
  } else {
    console.warn("Mobile menu elements not found.");
  }

  // --- Scroll Animations ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Add staggered delay for project cards if needed
          if (entry.target.classList.contains("project-card")) {
            const cards = Array.from(entry.target.parentNode.children);
            const index = cards.indexOf(entry.target);
            entry.target.style.setProperty("--card-index", index + 1);
          }
        } else {
          // Optional: Remove class to re-animate when scrolling back up
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
      // rootMargin: "-50px 0px -50px 0px" // Adjust trigger point if needed
    }
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // --- Update Footer Year ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Header Style Change on Scroll ---
  const header = document.querySelector("header");
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 50) {
        header.style.backgroundColor = "var(--secondary-color)"; // Make it solid
      } else {
        header.style.backgroundColor = "rgba(1, 4, 9, 0.85)"; // Back to semi-transparent
      }
      // Optional: Hide header on scroll down, show on scroll up
      // if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight){
      //   header.style.top = `-${header.offsetHeight}px`; // Hide
      // } else {
      //   header.style.top = "0"; // Show
      // }
      // lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
  }

  // --- Feedback Form Handling (Added Back) ---
  const feedbackForm = document.getElementById("feedback-form");
  const submitButton = document.getElementById("submit-button");
  const formStatus = document.getElementById("form-status");

  // !!! QUAN TRỌNG: Thay thế URL này bằng URL Web App Google Apps Script của bạn !!!
  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwwFczuC9s6511O0ey4JXmlfAIvrXNDSq5H2AXiDOzq3lkLnW5_-xRCbmq_cKUXef0b/exec"; // PASTE YOUR URL HERE

  if (feedbackForm && submitButton && formStatus) {
    // Check if all elements exist
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Ngăn chặn form submit mặc định

      // --- Validate SCRIPT_URL ---
      if (
        SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" ||
        SCRIPT_URL === ""
      ) {
        updateStatus(
          "Error: Google Apps Script URL is not configured in script.js.",
          true
        );
        console.error("Google Apps Script URL is missing in script.js");
        return; // Dừng thực thi nếu URL chưa được cấu hình
      }

      // --- Disable button and show loading ---
      submitButton.disabled = true;
      submitButton.textContent = "Submitting..."; // Change button text
      updateStatus("", false); // Clear previous status

      const formData = new FormData(feedbackForm);
      const formDataObject = {}; // Create an object for logging if needed
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      // console.log("Form Data:", formDataObject); // Optional: Log data being sent

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: formData,
          // mode: 'no-cors' // Usually not needed for Apps Script POST if deployed correctly
        });

        // Check if response is ok (status 200-299)
        if (!response.ok) {
          // Try to get error details from response body if possible
          let errorText = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json(); // Assume error details might be JSON
            errorText = `Error: ${errorData.message || response.statusText}`;
          } catch (jsonError) {
            // If response is not JSON, use the status text
            errorText = `HTTP error! status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(errorText);
        }

        // Apps Script should return JSON
        const result = await response.json();

        if (result.result === "success") {
          updateStatus(
            result.message || "Success! Your message has been sent.",
            false
          );
          feedbackForm.reset(); // Clear the form
        } else {
          // Show specific error from Apps Script if available
          updateStatus(
            `Error: ${
              result.message || "Could not submit form. Please try again."
            }`,
            true
          );
          console.error("Apps Script Error:", result);
        }
      } catch (error) {
        console.error("Fetch/Submit Error:", error);
        updateStatus(
          `An error occurred: ${error.message}. Please check connection or contact support.`,
          true
        );
      } finally {
        // --- Re-enable button and restore text ---
        submitButton.disabled = false;
        submitButton.textContent = "Submit Message"; // Restore original text
      }
    });
  } else {
    console.warn(
      "Feedback form elements (#feedback-form, #submit-button, #form-status) not found. Form submission will not work."
    );
  }

  // --- Helper function to update form status message ---
  function updateStatus(message, isError = false) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.className = "form-status"; // Reset classes
      if (message) {
        formStatus.classList.add(isError ? "error" : "success");
        // Make status visible
        formStatus.style.display = "block";
      } else {
        // Hide status if message is empty
        formStatus.style.display = "none";
      }
    }
  }
}); // End of DOMContentLoaded
