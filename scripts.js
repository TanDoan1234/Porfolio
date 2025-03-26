// Xử lý scrolling mượt mà khi nhấp vào các liên kết
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll cho tất cả liên kết trong menu
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Thêm class active cho menu item được click
      navLinks.forEach((item) => item.parentElement.classList.remove("active"));
      this.parentElement.classList.add("active");

      // Lấy target section từ href
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Tính offset để scroll đẹp hơn (tránh bị navbar che đầu section)
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        // Scroll với hiệu ứng mượt
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Cập nhật URL nhưng không reload trang
        history.pushState(null, null, targetId);
      }
    });
  });

  // Highlight menu item tương ứng khi scroll
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    // Thêm shadow cho navbar khi scroll xuống
    const navbar = document.querySelector(".navbar");
    if (scrollPosition > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }

    // Highlight menu item tương ứng với section đang xem
    const sections = document.querySelectorAll("section, header");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.parentElement.classList.remove("active");
          if (link.getAttribute("href") === "#" + sectionId) {
            link.parentElement.classList.add("active");
          }
        });
      }
    });
  });

  // Thêm hiệu ứng reveal khi scroll cho các section
  const revealElements = document.querySelectorAll(
    ".about, .education, .skills, .projects, .social, .contact"
  );

  function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element) => {
      const revealTop = element.getBoundingClientRect().top;

      if (revealTop < windowHeight - revealPoint) {
        element.classList.add("section-revealed");
      }
    });
  }

  window.addEventListener("scroll", checkReveal);

  // Kiểm tra ngay khi trang tải xong
  checkReveal();
});
