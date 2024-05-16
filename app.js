function loadingAction() {
  const loadingContainer = document.querySelector(".loading-container");
  return {
    show: () => (loadingContainer.style.visibility = "visible"),
    hide: () => {
      loadingContainer.style.visibility = "hidden";
      loadingContainer.style.opacity = "0";
    },
  };
}

class Category {
  constructor() {}
  static selectedCategory = null;
  static init() {
    const categorys = document.querySelectorAll(".category li button");

    categorys.forEach((category) => {
      category.addEventListener("click", function () {
        if (Category.selectedCategory === this.value) {
          Category.selectedCategory = null;
          this.classList.remove("click");
        } else {
          // 기존에 선택된 버튼의 클래스를 제거
          if (Category.selectedCategory) {
            document
              .querySelector(
                `.category li button[value="${Category.selectedCategory}"]`
              )
              .classList.remove("click");
          }
          Category.selectedCategory = this.value;
          this.classList.add("click");
        }
        App.render(Category.selectedCategory);
      });
    });
  }
  static render() {}
}

class App {
  static async init(categoryValue = null) {
    loadingAction().show();
    const API_URL = "https://dummyjson.com/products";
    const resp = await fetch(API_URL);
    const { products } = await resp.json();

    const filteredProducts = categoryValue
      ? products.filter((product) => product.brand === categoryValue)
      : products;

    return filteredProducts;
  }

  static async render(categoryValue = null) {
    const productData = await this.init(categoryValue);

    const renderHook = document.querySelector("#hook ul");

    const html = productData
      .map((item) => {
        const images = item.images[0];
        const title = item.title;
        const brand = item.brand;
        const link = item.thumbnail;

        return `
          <li>
              <div class="img">
                  <img src="${images}" alt="" />
              </div>
              <div class="txt">
                  <div class="title">
                      <h3>${title}</h3>
                  </div>
                  <div class="tag">
                      <span>${brand}</span>
                  </div>
              </div>
              <div class="link">
                  <a href="${link}">사이트 바로가기</a>
              </div>
          </li>
          `;
      })
      .join("");
    renderHook.innerHTML = html;

    loadingAction().hide();
  }
}

App.render(); // 초기 렌더링
Category.init(); // 카테고리 초기화 및 이벤트 리스너 추가
