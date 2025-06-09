// --- Clases JavaScript (Replicando la lógica de Python) ---

class Pedido {
    constructor(id_pedido, fecha_pedido, total, id_usuario, id_envio, id_pago, lista_imagenes) {
        this._id_pedido = id_pedido;
        this._fecha_pedido = fecha_pedido;
        this._total = total;
        this._id_usuario = id_usuario;
        this._id_envio = id_envio;
        this._id_pago = id_pago;
        this._lista_imagenes = lista_imagenes;
    }

    get_resumen() {
        return {
            'ID Pedido': this._id_pedido,
            'Fecha': this._fecha_pedido.toLocaleDateString(),
            'Total': `$${this._total.toFixed(2)}`,
            'Imágenes': this._lista_imagenes.join(', ')
        };
    }
}

class Usuario {
    constructor(id_usuario, nombre, apellido, email, contrasena, fecha_registro = new Date()) {
        this._id_usuario = id_usuario;
        this._nombre = nombre;
        this._apellido = apellido;
        this._email = email;
        this._contrasena = contrasena;
        this._fecha_registro = fecha_registro;
    }

    // Getters
    get_id_usuario() { return this._id_usuario; }
    get_nombre() { return this._nombre; }
    get_apellido() { return this._apellido; }
    get_email() { return this._email; }
    get_contrasena() { return this._contrasena; }
    get_fecha_registro() { return this._fecha_registro; }

    // Setters
    set_nombre(nuevo_nombre) { this._nombre = nuevo_nombre; }
    set_apellido(nuevo_apellido) { this._apellido = nuevo_apellido; }
    set_email(nuevo_email) { this._email = nuevo_email; }
    set_contrasena(nueva_contrasena) { this._contrasena = nueva_contrasena; }
    set_fecha_registro(nueva_fecha) { this._fecha_registro = nueva_fecha; }

    registrar() {
        console.log(`Usuario ${this._nombre} registrado con éxito.`);
        // En un entorno real, aquí se enviaría a un backend
    }

    iniciar_sesion(email, contrasena) {
        if (this._email === email && this._contrasena === contrasena) {
            console.log("Inicio de sesión exitoso.");
            return true;
        } else {
            console.log("Error en las credenciales.");
            return false;
        }
    }

    eliminar_cuenta() {
        console.log(`Usuario ${this._nombre} eliminado del sistema.`);
    }
}

class UsuarioCliente extends Usuario {
    constructor(id_usuario, nombre, apellido, email, contrasena, direccion, telefono, fecha_registro = new Date()) {
        super(id_usuario, nombre, apellido, email, contrasena, fecha_registro);
        this._direccion = direccion;
        this._telefono = telefono;
        this._pedidos_realizados = [];
    }

    // Getters
    get_direccion() { return this._direccion; }
    get_telefono() { return this._telefono; }
    get_pedidos_realizados() { return this._pedidos_realizados; }

    // Setters
    set_direccion(nueva_direccion) { this._direccion = nueva_direccion; }
    set_telefono(nuevo_telefono) { this._telefono = nuevo_telefono; }

    realizar_pedido(id_pedido, total, id_envio, id_pago, lista_imagenes) {
        const nuevo_pedido = new Pedido(id_pedido, new Date(), total, this._id_usuario, id_envio, id_pago, lista_imagenes);
        this._pedidos_realizados.push(nuevo_pedido);
        console.log(`${this._nombre} ha realizado un nuevo pedido con ID ${id_pedido}.`);
    }

    ver_historial_pedidos() {
        console.log(`Historial de pedidos de ${this._nombre}:`);
        this._pedidos_realizados.forEach(pedido => {
            const resumen = pedido.get_resumen();
            console.log(`ID: ${resumen['ID Pedido']}, Total: ${resumen['Total']}, Imágenes: ${resumen['Imágenes']}`);
        });
    }

    seleccionar_etiqueta() {
        console.log(`${this._nombre} está seleccionando una etiqueta.`);
    }

    editar_datos(nuevo_nombre = null, nuevo_apellido = null, nuevo_email = null, nueva_direccion = null, nuevo_telefono = null) {
        if (nuevo_nombre) this.set_nombre(nuevo_nombre);
        if (nuevo_apellido) this.set_apellido(nuevo_apellido);
        if (nuevo_email) this.set_email(nuevo_email);
        if (nueva_direccion) this.set_direccion(nueva_direccion);
        if (nuevo_telefono) this.set_telefono(nuevo_telefono);
        console.log("Datos del cliente actualizados correctamente.");
    }
}

class UsuarioAdministrador extends Usuario {
    constructor(id_usuario, nombre, apellido, email, contrasena, cargo, turno, fecha_registro = new Date()) {
        super(id_usuario, nombre, apellido, email, contrasena, fecha_registro);
        this._cargo = cargo;
        this._turno = turno;
    }

    // Getters
    get_cargo() { return this._cargo; }
    get_turno() { return this._turno; }

    // Setters
    set_cargo(nuevo_cargo) { this._cargo = nuevo_cargo; }
    set_turno(nuevo_turno) { this._turno = nuevo_turno; }

    eliminar_cuenta_usuario(cliente) {
        console.log(`Cuenta de usuario cliente ${cliente.get_nombre()} eliminada por administrador.`);
        // Lógica para eliminar el cliente del almacenamiento
    }

    ver_pedidos_de_cliente(cliente) {
        console.log(`Historial de pedidos del cliente ${cliente.get_nombre()}:`);
        cliente.get_pedidos_realizados().forEach(pedido => {
            const resumen = pedido.get_resumen();
            console.log(`ID: ${resumen['ID Pedido']}, Total: ${resumen['Total']}, Imágenes: ${resumen['Imágenes']}`);
        });
    }
}

// --- Lógica del Frontend ---

let usuariosRegistrados = []; // Array para simular la base de datos de usuarios
let usuarioLogeado = null;

const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const userDisplayName = document.getElementById('user-display-name');
const userType = document.getElementById('user-type');
const clientDashboard = document.getElementById('client-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const logoutBtn = document.getElementById('logout-btn');

const registroForm = document.getElementById('registro-form');
const regTipoUsuario = document.getElementById('reg-tipo-usuario');
const regDireccion = document.getElementById('reg-direccion');
const regTelefono = document.getElementById('reg-telefono');
const regCargo = document.getElementById('reg-cargo');
const regTurno = document.getElementById('reg-turno');

const loginForm = document.getElementById('login-form');

const clientDireccionDisplay = document.getElementById('client-direccion');
const clientTelefonoDisplay = document.getElementById('client-telefono');
const editClientDataBtn = document.getElementById('edit-client-data-btn');
const editClientForm = document.getElementById('edit-client-form');
const editNombre = document.getElementById('edit-nombre');
const editApellido = document.getElementById('edit-apellido');
const editEmail = document.getElementById('edit-email');
const editDireccion = document.getElementById('edit-direccion');
const editTelefono = document.getElementById('edit-telefono');
const saveClientDataBtn = document.getElementById('save-client-data-btn');
const cancelEditClientDataBtn = document.getElementById('cancel-edit-client-data-btn');

const realizarPedidoForm = document.getElementById('realizar-pedido-form');
const pedidosList = document.getElementById('pedidos-list');

const adminCargoDisplay = document.getElementById('admin-cargo');
const adminTurnoDisplay = document.getElementById('admin-turno');
const adminClientList = document.getElementById('admin-client-list');


// Mostrar/ocultar campos de registro según el tipo de usuario
regTipoUsuario.addEventListener('change', () => {
    if (regTipoUsuario.value === 'cliente') {
        regDireccion.style.display = 'block';
        regTelefono.style.display = 'block';
        regCargo.style.display = 'none';
        regTurno.style.display = 'none';
    } else {
        regDireccion.style.display = 'none';
        regTelefono.style.display = 'none';
        regCargo.style.display = 'block';
        regTurno.style.display = 'block';
    }
});

// Función para mostrar mensajes al usuario
function showMessage(element, message, type) {
    let msgDiv = document.querySelector('.message');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        element.parentNode.insertBefore(msgDiv, element.nextSibling);
    }
    msgDiv.textContent = message;
    msgDiv.className = `message ${type}`;
    setTimeout(() => msgDiv.remove(), 5000); // Eliminar el mensaje después de 5 segundos
}

// Evento para registrar un nuevo usuario
registroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id_usuario = Date.now().toString(); // ID simple basado en timestamp
    const nombre = document.getElementById('reg-nombre').value;
    const apellido = document.getElementById('reg-apellido').value;
    const email = document.getElementById('reg-email').value;
    const contrasena = document.getElementById('reg-contrasena').value;
    const tipoUsuario = regTipoUsuario.value;

    // Verificar si el email ya existe
    if (usuariosRegistrados.some(u => u.get_email() === email)) {
        showMessage(registroForm, 'El email ya está registrado.', 'error');
        return;
    }

    let nuevoUsuario;
    if (tipoUsuario === 'cliente') {
        const direccion = regDireccion.value;
        const telefono = regTelefono.value;
        nuevoUsuario = new UsuarioCliente(id_usuario, nombre, apellido, email, contrasena, direccion, telefono);
    } else { // admin
        const cargo = regCargo.value;
        const turno = regTurno.value;
        nuevoUsuario = new UsuarioAdministrador(id_usuario, nombre, apellido, email, contrasena, cargo, turno);
    }

    usuariosRegistrados.push(nuevoUsuario);
    nuevoUsuario.registrar();
    showMessage(registroForm, 'Usuario registrado con éxito.', 'success');
    registroForm.reset();
    regDireccion.style.display = 'block'; // Reset display after form reset
    regTelefono.style.display = 'block';
    regCargo.style.display = 'none';
    regTurno.style.display = 'none';
    updateAdminClientList(); // Actualizar la lista de clientes si se registra un cliente
});

// Evento para iniciar sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const contrasena = document.getElementById('login-contrasena').value;

    const usuarioEncontrado = usuariosRegistrados.find(u => u.get_email() === email);

    if (usuarioEncontrado && usuarioEncontrado.iniciar_sesion(email, contrasena)) {
        usuarioLogeado = usuarioEncontrado;
        renderDashboard();
        showMessage(loginForm, 'Inicio de sesión exitoso.', 'success');
    } else {
        showMessage(loginForm, 'Credenciales incorrectas.', 'error');
    }
    loginForm.reset();
});

// Función para renderizar el dashboard según el tipo de usuario
function renderDashboard() {
    authSection.style.display = 'none';
    dashboard.style.display = 'block';
    userDisplayName.textContent = usuarioLogeado.get_nombre();

    if (usuarioLogeado instanceof UsuarioCliente) {
        userType.textContent = 'Cliente';
        clientDashboard.style.display = 'block';
        adminDashboard.style.display = 'none';
        updateClientData();
        updatePedidosList();
    } else if (usuarioLogeado instanceof UsuarioAdministrador) {
        userType.textContent = 'Administrador';
        adminDashboard.style.display = 'block';
        clientDashboard.style.display = 'none';
        adminCargoDisplay.textContent = usuarioLogeado.get_cargo();
        adminTurnoDisplay.textContent = usuarioLogeado.get_turno();
        updateAdminClientList();
    }
}

// Función para actualizar los datos del cliente en el dashboard
function updateClientData() {
    if (usuarioLogeado instanceof UsuarioCliente) {
        clientDireccionDisplay.textContent = usuarioLogeado.get_direccion() || 'No especificada';
        clientTelefonoDisplay.textContent = usuarioLogeado.get_telefono() || 'No especificado';
        editNombre.value = usuarioLogeado.get_nombre();
        editApellido.value = usuarioLogeado.get_apellido();
        editEmail.value = usuarioLogeado.get_email();
        editDireccion.value = usuarioLogeado.get_direccion();
        editTelefono.value = usuarioLogeado.get_telefono();
    }
}

// Función para actualizar la lista de pedidos del cliente
function updatePedidosList() {
    if (usuarioLogeado instanceof UsuarioCliente) {
        pedidosList.innerHTML = '';
        if (usuarioLogeado.get_pedidos_realizados().length === 0) {
            pedidosList.innerHTML = '<li>No hay pedidos realizados aún.</li>';
        } else {
            usuarioLogeado.get_pedidos_realizados().forEach(pedido => {
                const li = document.createElement('li');
                const resumen = pedido.get_resumen();
                li.textContent = `ID: ${resumen['ID Pedido']}, Fecha: ${resumen['Fecha']}, Total: ${resumen['Total']}, Imágenes: ${resumen['Imágenes']}`;
                pedidosList.appendChild(li);
            });
        }
    }
}

// Función para actualizar la lista de clientes para el administrador
function updateAdminClientList() {
    adminClientList.innerHTML = '';
    const clientes = usuariosRegistrados.filter(u => u instanceof UsuarioCliente);
    if (clientes.length === 0) {
        adminClientList.innerHTML = '<p>No hay clientes registrados.</p>';
    } else {
        clientes.forEach(cliente => {
            const div = document.createElement('div');
            div.innerHTML = `
                <p><strong>ID:</strong> ${cliente.get_id_usuario()}</p>
                <p><strong>Nombre:</strong> ${cliente.get_nombre()} ${cliente.get_apellido()}</p>
                <p><strong>Email:</strong> ${cliente.get_email()}</p>
                <button class="view-client-orders-btn" data-client-id="${cliente.get_id_usuario()}">Ver Pedidos</button>
                <button class="delete-client-account-btn" data-client-id="${cliente.get_id_usuario()}">Eliminar Cuenta</button>
            `;
            adminClientList.appendChild(div);
        });

        document.querySelectorAll('.view-client-orders-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientId = e.target.dataset.clientId;
                const client = usuariosRegistrados.find(u => u.get_id_usuario() === clientId);
                if (client && usuarioLogeado instanceof UsuarioAdministrador) {
                    usuarioLogeado.ver_pedidos_de_cliente(client);
                    // Aquí podrías mostrar los pedidos en una ventana modal o en otra sección
                    alert(`Ver historial de pedidos de ${client.get_nombre()}. Revisa la consola para más detalles.`);
                }
            });
        });

        document.querySelectorAll('.delete-client-account-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const clientId = e.target.dataset.clientId;
                const clientIndex = usuariosRegistrados.findIndex(u => u.get_id_usuario() === clientId);
                if (clientIndex !== -1 && usuarioLogeado instanceof UsuarioAdministrador) {
                    const clienteAEliminar = usuariosRegistrados[clientIndex];
                    if (confirm(`¿Estás seguro de que quieres eliminar la cuenta de ${clienteAEliminar.get_nombre()}?`)) {
                        usuarioLogeado.eliminar_cuenta_usuario(clienteAEliminar);
                        usuariosRegistrados.splice(clientIndex, 1); // Eliminar del array
                        updateAdminClientList();
                        showMessage(adminClientList, 'Cuenta de cliente eliminada.', 'success');
                    }
                }
            });
        });
    }
}


// Evento para editar datos del cliente
editClientDataBtn.addEventListener('click', () => {
    editClientForm.style.display = 'block';
    editClientDataBtn.style.display = 'none';
});

cancelEditClientDataBtn.addEventListener('click', () => {
    editClientForm.style.display = 'none';
    editClientDataBtn.style.display = 'block';
    updateClientData(); // Restaurar valores originales
});

saveClientDataBtn.addEventListener('click', () => {
    if (usuarioLogeado instanceof UsuarioCliente) {
        usuarioLogeado.editar_datos(
            editNombre.value,
            editApellido.value,
            editEmail.value,
            editDireccion.value,
            editTelefono.value
        );
        updateClientData();
        editClientForm.style.display = 'none';
        editClientDataBtn.style.display = 'block';
        showMessage(clientDashboard, 'Datos actualizados correctamente.', 'success');
    }
});

// Evento para realizar un nuevo pedido
realizarPedidoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (usuarioLogeado instanceof UsuarioCliente) {
        const id_pedido = `PED-${Date.now()}`;
        const total = parseFloat(document.getElementById('pedido-total').value);
        const id_envio = document.getElementById('pedido-id-envio').value;
        const id_pago = document.getElementById('pedido-id-pago').value;
        const lista_imagenes = document.getElementById('pedido-imagenes').value.split(',').map(img => img.trim()).filter(img => img !== '');

        usuarioLogeado.realizar_pedido(id_pedido, total, id_envio, id_pago, lista_imagenes);
        updatePedidosList();
        realizarPedidoForm.reset();
        showMessage(realizarPedidoForm, 'Pedido realizado con éxito.', 'success');
    }
});

// Evento para cerrar sesión
logoutBtn.addEventListener('click', () => {
    usuarioLogeado = null;
    authSection.style.display = 'flex';
    dashboard.style.display = 'none';
    showMessage(document.body, 'Sesión cerrada.', 'success');
});

// Inicializar la vista al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Si queremos empezar con un usuario de prueba (opcional)
    // const adminTest = new UsuarioAdministrador('admin1', 'Admin', 'Global', 'admin@example.com', 'adminpass', 'Gerente', 'Mañana');
    // const clientTest = new UsuarioCliente('client1', 'Maria', 'Gomez', 'maria@example.com', 'mariapass', 'Calle Falsa 123', '555-1234');
    // usuariosRegistrados.push(adminTest, clientTest);
    // clientTest.realizar_pedido('P001', 150.75, 'ENV001', 'PAG001', ['img1.jpg', 'img2.png']);
    // clientTest.realizar_pedido('P002', 200.00, 'ENV002', 'PAG002', ['img3.webp']);

    // Esto asegura que al cargar la página, los campos de admin estén ocultos por defecto si la opción es cliente
    regDireccion.style.display = 'block';
    regTelefono.style.display = 'block';
    regCargo.style.display = 'none';
    regTurno.style.display = 'none';
});