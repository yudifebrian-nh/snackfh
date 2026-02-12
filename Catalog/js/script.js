let cart = [];
let selectedProduct = null;

/* =====================
   CART
===================== */
function addToCart(btn){
  const card = btn.closest(".card");
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price);

  const existing = cart.find(i => i.name === name);

  if(existing){
    existing.qty++;
  } else {
    cart.push({name, price, qty:1});
  }

  updateCart();
  document.getElementById("cartPanel").classList.add("active");
}

function updateCart(){
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const totalPrice = document.getElementById("totalPrice");

  cartItems.innerHTML = "";
  let total = 0;
  let qty = 0;

  cart.forEach((item,i)=>{
    total += item.price * item.qty;
    qty += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div class="qty-control">
          <button class="qty-btn" onclick="decreaseQty(${i})">−</button>
          ${item.qty}
          <button class="qty-btn" onclick="increaseQty(${i})">+</button>
          <span class="remove-btn" onclick="removeItem(${i})">✖</span>
        </div>
      </div>
    `;
  });

  cartCount.innerText = qty;
  totalPrice.innerText = total.toLocaleString();

  syncBadges(qty);
}

function increaseQty(i){
  cart[i].qty++;
  updateCart();
}

function decreaseQty(i){
  if(cart[i].qty > 1){
    cart[i].qty--;
  } else {
    cart.splice(i,1);
  }
  updateCart();
}

function removeItem(i){
  cart.splice(i,1);
  updateCart();
}

function toggleCart(){
  document.getElementById("cartPanel").classList.toggle("active");
}

/* =====================
   CHECKOUT (WHATSAPP)
===================== */
function checkout(){
  if(cart.length === 0){
    alert("Keranjang masih kosong!");
    return;
  }

  let msg = "Halo admin, saya ingin pesan:%0A";
  let total = 0;

  cart.forEach(item=>{
    total += item.price * item.qty;
    msg += `- ${item.name} (${item.qty}x) = Rp ${(
      item.price * item.qty
    ).toLocaleString()}%0A`;
  });

  msg += `Total: Rp ${total.toLocaleString()}`;

  if(confirm(
    `Anda yakin ingin checkout?\n\n${
      cart.map(i => i.name + " x" + i.qty).join("\n")
    }\n\nTotal: Rp ${total.toLocaleString()}`
  )){
    window.open(`https://wa.me/6285732844902?text=${msg}`);
  }
}

/* =====================
   DARK MODE
===================== */
document.getElementById("darkToggle")?.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});

/* =====================
   PRODUCT MODAL
===================== */
function openModal(card){
  selectedProduct = card;
  document.getElementById("modalImg").src =
    card.querySelector("img").src;
  document.getElementById("modalTitle").innerText =
    card.dataset.name;
  document.getElementById("modalPrice").innerText =
    "Rp " + Number(card.dataset.price).toLocaleString();

  document.getElementById("productModal").classList.add("active");
}

function closeModal(){
  document.getElementById("productModal").classList.remove("active");
}

function addToCartFromModal(){
  if(selectedProduct){
    addToCart(selectedProduct.querySelector(".buy-btn"));
    closeModal();
  }
}

/* CLOSE MODAL ON OUTSIDE CLICK */
window.addEventListener("click",e=>{
  const modal = document.getElementById("productModal");
  if(e.target === modal){
    closeModal();
  }
});

/* =====================
   UTILITIES
===================== */
function scrollToTop(){
  window.scrollTo({top:0, behavior:'smooth'});
}

function toggleDark(){
  document.body.classList.toggle('dark');
}

/* =====================
   BADGE SYNC (BOTTOM NAV / FLOATING CART)
===================== */
function syncBadges(totalQty){
  const bn = document.getElementById('bnCount');
  const fc = document.getElementById('fcCount');
  if(bn) bn.innerText = totalQty;
  if(fc) fc.innerText = totalQty;
}
