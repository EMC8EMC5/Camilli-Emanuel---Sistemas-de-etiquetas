from datetime import date
from pedido import Pedido

class Usuario:
    def __init__(self, id_usuario, nombre, apellido, email, contrasena, fecha_registro=None):
        self._id_usuario = id_usuario
        self._nombre = nombre
        self._apellido = apellido
        self._email = email
        self._contrasena = contrasena
        self._fecha_registro = fecha_registro or date.today()

    # Getters
    def get_id_usuario(self): return self._id_usuario
    def get_nombre(self): return self._nombre
    def get_apellido(self): return self._apellido
    def get_email(self): return self._email
    def get_contrasena(self): return self._contrasena
    def get_fecha_registro(self): return self._fecha_registro

    # Setters
    def set_nombre(self, nuevo_nombre): self._nombre = nuevo_nombre
    def set_apellido(self, nuevo_apellido): self._apellido = nuevo_apellido
    def set_email(self, nuevo_email): self._email = nuevo_email
    def set_contrasena(self, nueva_contrasena): self._contrasena = nueva_contrasena
    def set_fecha_registro(self, nueva_fecha): self._fecha_registro = nueva_fecha

    # Métodos principales
    def registrar(self):
        print(f"Usuario {self._nombre} registrado con éxito.")

    def iniciar_sesion(self, email, contrasena):
        if self._email == email and self._contrasena == contrasena:
            print("Inicio de sesión exitoso.")
            return True
        else:
            print("Error en las credenciales.")
            return False

    def eliminar_cuenta(self):
        print(f"Usuario {self._nombre} eliminado del sistema.")


class UsuarioCliente(Usuario):
    def __init__(self, id_usuario, nombre, apellido, email, contrasena, direccion, telefono, fecha_registro=None):
        super().__init__(id_usuario, nombre, apellido, email, contrasena, fecha_registro)
        self._direccion = direccion
        self._telefono = telefono
        self._pedidos_realizados = []

    # Getters
    def get_direccion(self): return self._direccion
    def get_telefono(self): return self._telefono
    def get_pedidos_realizados(self): return self._pedidos_realizados  # NUEVO GETTER

    # Setters
    def set_direccion(self, nueva_direccion): self._direccion = nueva_direccion
    def set_telefono(self, nuevo_telefono): self._telefono = nuevo_telefono

    # Métodos específicos del cliente
    def realizar_pedido(self, id_pedido, total, id_envio, id_pago, lista_imagenes):
        nuevo_pedido = Pedido(id_pedido, date.today(), total, self._id_usuario, id_envio, id_pago, lista_imagenes)
        self._pedidos_realizados.append(nuevo_pedido)
        print(f"{self._nombre} ha realizado un nuevo pedido con ID {id_pedido}.")

    def ver_historial_pedidos(self):
        print(f"Historial de pedidos de {self._nombre}:")
        for pedido in self._pedidos_realizados:
            resumen = pedido.get_resumen()
            print(f"ID: {resumen['ID Pedido']}, Total: {resumen['Total']}, Imágenes: {resumen['Imágenes']}")

    def seleccionar_etiqueta(self):
        print(f"{self._nombre} está seleccionando una etiqueta.")

    def editar_datos(self, nuevo_nombre=None, nuevo_apellido=None, nuevo_email=None, nueva_direccion=None, nuevo_telefono=None):
        if nuevo_nombre: self.set_nombre(nuevo_nombre)
        if nuevo_apellido: self.set_apellido(nuevo_apellido)
        if nuevo_email: self.set_email(nuevo_email)
        if nueva_direccion: self.set_direccion(nueva_direccion)
        if nuevo_telefono: self.set_telefono(nuevo_telefono)
        print("Datos del cliente actualizados correctamente.")


class UsuarioAdministrador(Usuario):
    def __init__(self, id_usuario, nombre, apellido, email, contrasena, cargo, turno, fecha_registro=None):
        super().__init__(id_usuario, nombre, apellido, email, contrasena, fecha_registro)
        self._cargo = cargo
        self._turno = turno

    # Getters
    def get_cargo(self): return self._cargo
    def get_turno(self): return self._turno

    # Setters
    def set_cargo(self, nuevo_cargo): self._cargo = nuevo_cargo
    def set_turno(self, nuevo_turno): self._turno = nuevo_turno

    # Métodos adicionales del administrador

    def eliminar_cuenta_usuario(self, cliente):
        print(f"Cuenta de usuario cliente {cliente.get_nombre()} eliminada por administrador.")

    def ver_pedidos_de_cliente(self, cliente):
        print(f"Historial de pedidos del cliente {cliente.get_nombre()}:")
        for pedido in cliente.get_pedidos_realizados():
            resumen = pedido.get_resumen()
            print(f"ID: {resumen['ID Pedido']}, Total: {resumen['Total']}, Imágenes: {resumen['Imágenes']}")