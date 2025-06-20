// Espera a que el DOM esté completamente cargado para ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const botonesAgregar = document.querySelectorAll('.btn-product');
    const carritoSidebar = document.getElementById('carrito-sidebar');
    const btnVerCarrito = document.getElementById('ver-carrito-btn');
    const btnCerrarCarrito = document.getElementById('cerrar-carrito-btn');
    const carritoItemsContainer = document.getElementById('carrito-items');
    const carritoTotalEl = document.getElementById('carrito-total');
    const carritoContadorEl = document.getElementById('carrito-contador');
    const btnVaciarCarrito = document.getElementById('vaciar-carrito-btn');

    // --- ESTADO DEL CARRITO ---
    // Usamos un array para guardar los productos del carrito.
    let carrito = [];

    // --- EVENT LISTENERS (ESCUCHADORES DE EVENTOS) ---

    // 1. Agregar productos al carrito
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarProductoAlCarrito);
    });

    // 2. Mostrar y ocultar el carrito
    btnVerCarrito.addEventListener('click', toggleCarrito);
    btnCerrarCarrito.addEventListener('click', toggleCarrito);

    // 3. Vaciar el carrito
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    
    // 4. Eliminar un item específico del carrito (usando delegación de eventos)
    carritoItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('eliminar-item-btn')) {
            eliminarItemDelCarrito(e);
        }
    });


    // --- FUNCIONES ---

    function agregarProductoAlCarrito(e) {
        // Obtenemos la "tarjeta" del producto más cercana al botón que se clickeó
        const tarjetaProducto = e.target.closest('.product-card');
        
        // Extraemos la información del producto
        const producto = {
            id: tarjetaProducto.querySelector('h3').textContent,
            nombre: tarjetaProducto.querySelector('h3').textContent,
            precio: tarjetaProducto.querySelector('.product-price').textContent,
            imagen: tarjetaProducto.querySelector('img').src,
            cantidad: 1
        };

        // Comprobamos si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === producto.id);

        if (productoExistente) {
            // Si ya existe, aumentamos la cantidad
            productoExistente.cantidad++;
        } else {
            // Si no existe, lo agregamos al array del carrito
            carrito.push(producto);
        }

        // Actualizamos la vista del carrito
        actualizarVistaCarrito();
        // Abrimos el carrito para que el usuario vea que se agregó el producto
        if (!carritoSidebar.classList.contains('activo')) {
            toggleCarrito();
        }
    }

    function eliminarItemDelCarrito(e) {
        const idProductoAEliminar = e.target.dataset.id;
        // Filtramos el carrito, manteniendo solo los productos cuyo ID no coincida
        carrito = carrito.filter(item => item.id !== idProductoAEliminar);
        // Actualizamos la vista
        actualizarVistaCarrito();
    }

    function vaciarCarrito() {
        carrito = []; // Reseteamos el array
        actualizarVistaCarrito(); // Actualizamos la vista
    }

    function actualizarVistaCarrito() {
        // Limpiamos el contenido actual del carrito para no duplicar
        carritoItemsContainer.innerHTML = '';
        
        let total = 0;
        let totalItems = 0;

        // Recorremos el array del carrito para crear el HTML de cada producto
        carrito.forEach(item => {
            // Convertimos el precio de "15,00 €" a un número 15.00
            const precioNumerico = parseFloat(item.precio.replace(',', '.'));
            total += precioNumerico * item.cantidad;
            totalItems += item.cantidad;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="carrito-item-info">
                    <h4>${item.nombre}</h4>
                    <p>${item.cantidad} x ${item.precio}</p>
                </div>
                <button class="eliminar-item-btn" data-id="${item.id}">&times;</button>
            `;
            carritoItemsContainer.appendChild(itemDiv);
        });

        // Actualizamos el total en el HTML, formateándolo de nuevo a un estilo de moneda local
        carritoTotalEl.textContent = `${total.toFixed(2).replace('.', ',')} €`;
        // Actualizamos el contador del ícono del carrito
        carritoContadorEl.textContent = totalItems;
    }
    
    function toggleCarrito() {
        carritoSidebar.classList.toggle('activo');{}
    }
