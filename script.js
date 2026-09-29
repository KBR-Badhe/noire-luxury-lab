    // ====== EDIT THESE SETTINGS ======
const WHATSAPP_NUMBER = "919999999999"; // Replace with your WhatsApp number, e.g. 919876543210

// Add your products here. To use a real photo, put the image in an "images" folder
// and change image: "" to image: "images/your-photo.jpg".
const products = [
  { id: 1, name: "Daisy Crochet Earrings", price: 199, category: "Earrings", icon: "✿", image: "image/134130153523449940.jpg" },
  { id: 2, name: "Blossom Bracelet", price: 249, category: "Bracelets", icon: "❀", image: "" },
  { id: 3, name: "Petal Necklace", price: 299, category: "Necklaces", icon: "✾", image: "" },
  { id: 4, name: "Mini Flower Ring", price: 149, category: "Rings", icon: "❋", image: "" },
  { id: 5, name: "Pearl Crochet Hoops", price: 279, category: "Earrings", icon: "◌", image: "" },
  { id: 6, name: "Garden Charm Bracelet", price: 229, category: "Bracelets", icon: "❁", image: "" }
];

let cart = JSON.parse(localStorage.getItem("crochetCart") || "[]");

const productGrid = document.getElementById("products");
const search = document.getElementById("search");
const noResults = document.getElementById("noResults");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function money(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function renderProducts(list = products) {
  productGrid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span>${p.icon}</span>`}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.category} • Handmade</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="addToCart(${p.id})">Add to cart</button>
        </div>
      </div>
    </article>
  `).join("");
  noResults.classList.toggle("hidden", list.length !== 0);
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  openCart();
}

function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function saveCart() {
  localStorage.setItem("crochetCart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  let total = 0;
  let count = 0;

  if (!cart.length) {
    cartItems.innerHTML = `<p class="small">Your cart is empty. Add a handmade piece to begin.</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      const subtotal = p.price * item.qty;
      total += subtotal;
      count += item.qty;
      return `
        <div class="cart-row">
          <div>
            <strong>${p.name}</strong>
            <small>${money(p.price)} each</small>
          </div>
          <div class="qty">
            <button onclick="changeQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
        </div>`;
    }).join("");
  }

  if (cart.length) {
    count = cart.reduce((sum, item) => sum + item.qty, 0);
    total = cart.reduce((sum, item) => {
      const p = products.find(x => x.id === item.id);
      return sum + p.price * item.qty;
    }, 0);
  }

  cartCount.textContent = count;
  cartTotal.textContent = money(total);
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
}
function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

search.addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  renderProducts(products.filter(p =>
    `${p.name} ${p.category}`.toLowerCase().includes(q)
  ));
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  let message = "Hello! I'd like to place an order:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    const subtotal = p.price * item.qty;
    total += subtotal;
    message += `${encodeURIComponent(p.name)} x ${item.qty} = ${encodeURIComponent(money(subtotal))}%0A`;
  });

  message += `%0A${encodeURIComponent("Total: " + money(total))}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
});

document.getElementById("whatsappLink").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I would like to know more about your crochet jewellery.")}`;

document.getElementById("year").textContent = new Date().getFullYear();

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

renderProducts();
renderCart();
