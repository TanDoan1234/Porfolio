// Xử lý scrolling mượt mà khi nhấp vào các liên kết
document.addEventListener("DOMContentLoaded", function () {
  // Thêm nút hamburger menu cho mobile
  const navbar = document.querySelector(".navbar .container");
  const navMenu = document.querySelector(".navbar ul");

  // Tạo nút hamburger
  const menuToggle = document.createElement("div");
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

  // Chèn nút vào navbar
  navbar.insertBefore(menuToggle, navMenu);

  // Thêm event listener cho nút menu
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
    if (navMenu.classList.contains("show")) {
      menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Đóng menu khi click vào link
  const navLinks = document.querySelectorAll(".navbar ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Chỉ đóng menu nếu đang hiển thị (có class show) và màn hình nhỏ
      if (window.innerWidth <= 768 && navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Đóng menu khi click ra ngoài
  document.addEventListener("click", function (event) {
    if (
      !event.target.closest(".navbar") &&
      navMenu.classList.contains("show")
    ) {
      navMenu.classList.remove("show");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Cập nhật trạng thái menu khi resize màn hình
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Smooth scroll cho tất cả liên kết trong menu
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

  // Lazy loading cho hình ảnh
  if ("IntersectionObserver" in window) {
    const imgOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");

          if (src) {
            img.src = src;
            img.removeAttribute("data-src");
          }

          observer.unobserve(img);
        }
      });
    }, imgOptions);

    // Tìm tất cả hình ảnh có thuộc tính data-src
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imgObserver.observe(img);
    });
  } else {
    // Fallback cho trình duyệt không hỗ trợ Intersection Observer
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    });
  }
});
