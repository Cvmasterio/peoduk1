document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Espreso", img: "menu1.jpg", price: 15000 },
      { id: 2, name: "Cappuccino", img: "menu2.jpg", price: 20000 },
      { id: 3, name: "Flat White", img: "menu3.jpg", price: 22000 },
      { id: 4, name: "Cafe Mocha", img: "menu4.jpg", price: 26000 },
      { id: 5, name: "Affogato", img: "menu5.jpg", price: 23000 },
      { id: 6, name: "Latte Macchiato", img: "menu6.jpg", price: 21000 },
      { id: 7, name: "Coffe Milk", img: "menu7.jpg", price: 18000 },
      { id: 8, name: "Espresso Tonic", img: "menu8.jpg", price: 28000 },
      { id: 9, name: "Matcha Memory", img: "menu9.jpg", price: 16000 },
      { id: 10, name: "brewed coffee", img: "menu10.jpg", price: 7000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di keranjang
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / keranjang kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada cek barang sama /tidak
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada , tambah, dan total seluruhnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau dihapus berdasarkan idnya
      const cartItem = this.items.find((item) => item.id == id);

      // jika item lebih dari satu
      if (cartItem.quantity > 1) {
        //  telusuri 1 per 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.querySelector("#checkout-button");
  const form = document.querySelector("#checkoutForm");

  // Mendengarkan perubahan input dalam form
  form.addEventListener("input", () => {
    let isValid = true;
    // Memeriksa setiap elemen input
    form.querySelectorAll("input").forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });
    // Mengubah status disabled pada tombol checkout
    if (isValid) {
      checkoutButton.classList.remove("disabled");
    } else {
      checkoutButton.classList.add("disabled");
    }
  });

  // Mengirim data ketika tombol checkout diklik
  checkoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!checkoutButton.classList.contains("disabled")) {
      // Jika tombol tidak dalam status disable, maka kirim data ke WhatsApp
      const formData = new FormData(form);
      const message = formatMessage(Object.fromEntries(formData));
      window.open(
        "http://wa.me/6282134953089?text=" + encodeURIComponent(message)
      );
    } else {
      // Jika tombol dalam status disable, tampilkan pemberitahuan
      alert("Mohon lengkapi semua data sebelum melakukan checkout.");
    }
  });
});

// Format pesan WA
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
${JSON.parse(obj.items).map(
  (item) => `${item.name} (${item.quantity} * ${rupiah(item.total)}) \n`
)} 
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};
// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
