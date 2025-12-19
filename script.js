let users = JSON.parse(localStorage.getItem('users')) || [];
let cart = [];
let isSignup = true;

/* AUTH */
function toggleAuth(){
  isSignup = !isSignup;
  authTitle.innerText = isSignup ? 'Signup' : 'Signin';
}

function signup(){
  if(isSignup){
    const user={
      name:name.value,
      phone:phone.value,
      address:address.value,
      landmark:landmark.value
    };
    users.push(user);
    localStorage.setItem('users',JSON.stringify(users));
    localStorage.setItem('currentUser',JSON.stringify(user));
  } else {
    const user = users.find(u=>u.phone===phone.value);
    if(!user) return alert('User not found');
    localStorage.setItem('currentUser',JSON.stringify(user));
  }
  auth.style.display='none';
  shop.style.display='block';
}

/* ADD TO CART */
function addToCart(item,price){
  const existing = cart.find(c=>c.item===item);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({item,price,qty:1});
  }
  alert(item+' added to cart');
}

/* OPEN CART */
function openCart(){
  cartBox.style.display='flex';
  renderCart();
}

/* RENDER CART */
function renderCart(){
  let total=0;
  cartItems.innerHTML='';

  cart.forEach((c,index)=>{
    let itemTotal = c.price * c.qty;
    total += itemTotal;

    cartItems.innerHTML += `
      <div style="margin-bottom:10px">
        <b>${c.item}</b><br>
        Qty:
        <button onclick="changeQty(${index},-1)">➖</button>
        ${c.qty} kg
        <button onclick="changeQty(${index},1)">➕</button>
        <br>
        ₹${itemTotal}
        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
  });

  grandTotal.innerText = 'Grand Total ₹'+total;
}

/* CHANGE QTY */
function changeQty(index,change){
  cart[index].qty += change;
  if(cart[index].qty < 0.5) cart[index].qty = 0.5;
  renderCart();
}

/* REMOVE ITEM */
function removeItem(index){
  cart.splice(index,1);
  renderCart();
}

/* PLACE ORDER */
function placeOrder(){
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if(cart.length===0) return alert('Cart is empty');

  let msg = `🐔 CHICKEN ORDER 🐔
Name: ${user.name}
Phone: ${user.phone}
Address: ${user.address}

ITEMS:
`;

  let total=0;
  cart.forEach(c=>{
    let price = c.price * c.qty;
    msg += `${c.item} - ${c.qty}kg - ₹${price}\n`;
    total += price;
  });

  msg += `\nTOTAL ₹${total}`;

  window.open(`https://wa.me/918754565826?text=${encodeURIComponent(msg)}`);
}
