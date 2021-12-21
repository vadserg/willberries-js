const smoothScroll = () => {
  const scrolllBtn = document.querySelector(".scroll-link");

  scrolllBtn.addEventListener("click", (e) => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

export default smoothScroll;
