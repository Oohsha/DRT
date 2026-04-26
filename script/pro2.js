// script.js

document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("myImage");
  const lens = document.querySelector(".magnifier-lens");
  const quantityInput = document.getElementById("productQuantity");
  const totalPriceElement = document.getElementById("totalProductPrice");
  const discountedPrice = 607890; // 실제 금액 (숫자형)
  const minusBtn = document.querySelector(".minus-btn");
  const plusBtn = document.querySelector(".plus-btn");

  // 썸네일 클릭 시 페이지 이동
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const page = thumbnail.getAttribute("data-product-page");
      if (page) {
        window.location.href = page;
      }
    });
  });

  // 수량 조절 기능
  function updateTotalPrice() {
    const quantity = parseInt(quantityInput.value) || 1;
    const total = discountedPrice * quantity;
    totalPriceElement.textContent = total.toLocaleString() + "원";
  }

  minusBtn.addEventListener("click", () => {
    let qty = parseInt(quantityInput.value);
    if (qty > 1) quantityInput.value = qty - 1;
    updateTotalPrice();
  });

  plusBtn.addEventListener("click", () => {
    let qty = parseInt(quantityInput.value);
    if (qty < 100) quantityInput.value = qty + 1;
    updateTotalPrice();
  });

  quantityInput.addEventListener("input", updateTotalPrice);

  // 장바구니/바로 구매 버튼 기능
  document.getElementById("addToCartBtn").addEventListener("click", (e) => {
    e.preventDefault();
    alert("장바구니에 상품이 담겼습니다!");
  });

  document.getElementById("buyNowBtn").addEventListener("click", (e) => {
    e.preventDefault();
    alert("결제 페이지로 이동합니다.");
    location.href = "pay2.html"; // 필요시 연결
  });

  // 이미지 확대 렌즈 기능
  const container = document.querySelector(".main-image-container");

  function setLensPosition(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lensSize = 150;

    const left = Math.max(0, Math.min(x - lensSize / 2, container.offsetWidth - lensSize));
    const top = Math.max(0, Math.min(y - lensSize / 2, container.offsetHeight - lensSize));

    lens.style.left = left + "px";
    lens.style.top = top + "px";
    lens.style.backgroundImage = `url(${mainImage.src})`;
    lens.style.backgroundSize = container.offsetWidth * 2 + "px " + container.offsetHeight * 2 + "px";
    lens.style.backgroundPosition = `-${left * 2}px -${top * 2}px`;
  }

  container.addEventListener("mousemove", (e) => {
    lens.style.display = "block";
    setLensPosition(e);
  });

  container.addEventListener("mouseleave", () => {
    lens.style.display = "none";
  });

  // 렌즈 초기 설정
  Object.assign(lens.style, {
    position: "absolute",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.3)",
    display: "none",
    pointerEvents: "none",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    zIndex: 10
  });
});
