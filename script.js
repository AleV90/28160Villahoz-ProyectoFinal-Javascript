swal("Bienvenido a la tienda virtual de Comiluqui!", " Al momento de ordenar, tenga en cuenta que los envios se realizan los dias : xxxxx de xx a xx hs");

const main = document.querySelector("#main");
const sidebar = document.querySelector(".sidebar");
const btnCarrito = document.querySelector(".btn-carrito");
const container = document.querySelector(".container")

let carrito = JSON.parse(localStorage.getItem("carrito")) || []

btnCarrito.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

fetch('../json/medallones.json')
.then(res => res.json())
.then(medallones => {
    medallones.forEach((element) => {
        main.innerHTML += `
            <div id="medallon${element.id} " class=" card border-primary mb-3 m-1" style="max-width: 20rem;" d-flex>
            <img src="../img/${element.img} " class=" img card-img-top" alt="${element.nombre}">
            <div class="card-body">
            <h4 class= "nombre card-title">${element.nombre}</h4>
            <p class="precio card-text"> ${element.precio}</p>
            <button class="btn-agregar" data-id=${element.id}>Agregar</button>
        </div>
        </div>
        `       
    }); 
    const btnAgregar = document.querySelectorAll(".btn-agregar");
  btnAgregar.forEach((e) =>
    e.addEventListener("click", (e) => {
      let articulo = e.target.parentElement;
      agregarAlCarrito(articulo);

      Toastify({
        text: "El articulo se añadió al carrito satisfactoriamente",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
      }).showToast();
    })
  );
})

const agregarAlCarrito = (articulo) => {
  let producto = {
    nombre: articulo.querySelector(".nombre").textContent,
    precio: Number(articulo.querySelector(".precio").textContent),
    cantidad: 1,
    imagen: articulo.parentElement.querySelector("img").src,
    id: Number(articulo.querySelector("button").getAttribute("data-id")),
  };

  let productoEncontrado = carrito.find(
    (element) => element.id === producto.id
  );

  if (productoEncontrado) {
    productoEncontrado.cantidad++;
  } else {
    carrito.push(producto);
  }
  console.log(carrito);
  mostrarCarrito();
};

const mostrarCarrito = () => {
  sidebar.innerHTML = "";
  carrito.forEach((element) => {
    let { imagen, nombre, precio, cantidad, id } = element;
    sidebar.innerHTML += `
        <div class="caja--carrito" >
          <img class="caja-carrito-img" src="${imagen}">
          <div class="caja--carrito--datos">
            <p class="nombre">${nombre}</p>
            <p class="cantidad">CANTIDAD: ${cantidad}</p>
            <p class="subtotal">Subtotal: $${precio * cantidad}</p>
            <p class="precio"> $ <span>${precio}</span> </p>
          <button class="btn_restar" data-id="${id}">-</button>
          <button class="btn_borrar" data-id="${id}">BORRAR</button>
          </div>

        </div>`;
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  aumentarNumeroCantidadCarrito();
};

const restarProducto = (productoRestar) => {
  let productoEncontrado = carrito.find(
    (element) => element.id === Number(productoRestar)
  );
  if (productoEncontrado) {
    productoEncontrado.cantidad--;
    if (productoEncontrado.cantidad === 0) {
      productoEncontrado.cantidad = 1;
    }
  }
  mostrarCarrito();
};

const borrarProducto = (productoBorrar) => {
  carrito = carrito.filter((element) => element.id !== Number(productoBorrar));
  mostrarCarrito();
};

const escucharBotonesSidebar = () => {
  sidebar.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn_restar")) {
      restarProducto(e.target.getAttribute("data-id"));
    }
    if (e.target.classList.contains("btn_borrar")) {
      borrarProducto(e.target.getAttribute("data-id"));
    }
  });
};

const aumentarNumeroCantidadCarrito = () => {
  let total = carrito.reduce((acc, ite) => acc + ite.cantidad, 0);
  document.querySelector(".cont-carrito").textContent = total;
};

mostrarCarrito();
escucharBotonesSidebar();
