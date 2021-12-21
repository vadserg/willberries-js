const getGoods = () => {
  const links = document.querySelectorAll(".navigation-link");
  const moreBtn = document.querySelector(".more");

  const renderGoods = (goods) => {
    const goodsContainer = document.querySelector(".long-goods-list");

    goodsContainer.innerHTML = "";

    goods.forEach((good) => {
      const goodBlock = document.createElement("div");

      goodBlock.classList.add("col-lg-3", "col-sm-6");

      goodBlock.innerHTML = `
        <div class="goods-card">
          <span class="label ${good.label ? null : "d-none"}">${good.label
        }</span>
          <img
            src="db/${good.img}"
            alt="${good.name}"
            class="goods-image"
          />
          <h3 class="goods-title">${good.name}</h3>
          <p class="goods-description">${good.description}</p>
          <button class="button goods-card-btn add-to-cart" data-id="${good.id
        }">
            <span class="button-price">$${good.price}</span>
          </button>
        </div>
      `;
      goodsContainer.append(goodBlock);
    });
  };

  const getData = (value, category) => {
    fetch("/db/db.json")
      .then((res) => res.json())
      .then((data) => {
        const array = category
          ? data.filter((good) => good[category] === value)
          : data;

        localStorage.setItem("goods", JSON.stringify(array));

        if (window.location.pathname !== "/goods.html" && value !== '') {

          window.location.href = "/goods.html";
        } else {

          renderGoods(array);
        }
      });
  };
  // инициализируем "goods" полным списком товаров
  getData('', false); // ограничение по размеру хранилища // требует оптимизации

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const linkValue = link.textContent;
      const category = link.dataset.field;

      getData(linkValue, category); // выборка из каталога по категориям
    });
  });

  if (
    localStorage.getItem("goods") &&
    window.location.pathname === "/goods.html"
  ) {
    renderGoods(JSON.parse(localStorage.getItem("goods")));
  } else {
    moreBtn.addEventListener("click", (event) => {
      event.preventDefault();

      getData(); // полный каталог с пустыми параметрами
    });
  }
};

export default getGoods;
