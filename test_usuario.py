import unittest
from datetime import date
from usuario import UsuarioCliente, UsuarioAdministrador
from pedido import Pedido

class TestUsuarioCliente(unittest.TestCase):
    def test_registro_y_pedido_cliente(self):
        cliente = UsuarioCliente(
            1,
            "Lucía",
            "Ramírez",
            "lucia@mail.com",
            "abc123",
            "Calle 123",
            "1234567890",
            date.today()
        )

        print("\n--- REGISTRO CLIENTE ---")
        print("Nombre:", cliente.get_nombre())
        print("Apellido:", cliente.get_apellido())
        print("Email:", cliente.get_email())
        print("Dirección:", cliente.get_direccion())
        print("Teléfono:", cliente.get_telefono())

        cliente.registrar()
        self.assertTrue(cliente.iniciar_sesion("lucia@mail.com", "abc123"))

        # Crea y registra pedido
        cliente.realizar_pedido(101, 3000, 1, 1,["imagen1.png", "imagen2.png"])
        cliente.realizar_pedido(102, 5000, 2, 2, ["imagen3.png", "imagen4.png"])

        self.assertEqual(len(cliente.get_pedidos_realizados()), 2)

        print("\n--- HISTORIAL DE PEDIDOS ---")
        cliente.ver_historial_pedidos()


class TestUsuarioAdministrador(unittest.TestCase):
    def test_login_y_acciones_admin(self):
        admin = UsuarioAdministrador(
            99,
            "Carlos",
            "Pérez",
            "admin@empresa.com",
            "admin123",
            date.today(),
            "Supervisor",
            "Mañana"
        )

        print("\n--- LOGIN ADMINISTRADOR ---")
        self.assertTrue(admin.iniciar_sesion("admin@empresa.com", "admin123"))
        self.assertFalse(admin.iniciar_sesion("admin@empresa.com", "claveIncorrecta"))

        print("Nombre:", admin.get_nombre())
        print("Apellido:", admin.get_apellido())
        print("Email:", admin.get_email())
        print("Cargo:", admin.get_cargo())
        print("Turno:", admin.get_turno())

        #Se crea el cliente_test para el historial de pedidos por parte del admin
        cliente_test = UsuarioCliente(
            1,
            "Lucía",
            "Ramírez",
            "lucia@mail.com",
            "abc123",
            "Calle 123",
            "123456789"
        )

        #Luego creamos los pedidos
        cliente_test.realizar_pedido(101, 3000, 1, 1, ["imagen1.png", "imagen2.png"])
        cliente_test.realizar_pedido(102, 5000, 2, 2, ["imagen3.png", "imagen4.png"])

        # Se muestra los pedidos desde el admin
        print("\n--- HISTORIAL DE PEDIDOS DEL CLIENTE DESDE ADMIN ---")
        admin.ver_pedidos_de_cliente(cliente_test)

        print("\n--- ELIMINAR CUENTA DE CLIENTE ---")
        admin.eliminar_cuenta_usuario(cliente_test)

if __name__ == "__main__":
    unittest.main()
