# 🏦 Banco ACME - Aplicación Web de Autogestión Bancaria

Esta es una aplicación web interactiva que permite a los usuarios registrarse, iniciar sesión y gestionar sus cuentas bancarias de forma autónoma. Se desarrolló como parte de un proyecto académico con tecnologías modernas del entorno web y Firebase.

Link de la maquetación del proyecto: **https://www.figma.com/design/2ltP2ckbBVCvXDRsEQifbR/banco-ACME?node-id=15-2725&t=YLD161SsTkIVNx3K-1**

---

## ⚙️ Instrucciones para instalar y ejecutar el proyecto

1. **Clona o descarga este repositorio**
   ```bash
   git clone https://github.com/davida282/ProyectoAcmebank_JavaScript_ArdilaDavidQuinonezPedro.git
   cd banco-acme
   ```

2. **Abre el proyecto en VS CODE**


3. **Ejecuta el proyecto:**
   - Puedes abrir directamente el archivo `login.html` en tu navegador.
   - O usar una extensión como **Live Server** en VS Code.

---

## ✅ Funcionalidades completadas

### 🔐 Autenticación
- Registro de usuarios con validación.
- Inicio de sesión con verificación de datos.
- Persistencia del usuario en `localStorage`.

### 📄 Dashboard Principal
- Vista resumen del saldo actual.
- Bienvenida personalizada al usuario.

### 💸 Retiro de Dinero
- Validación de mínimo de retiro ($10.000).
- Verificación de saldo suficiente.
- Descuento del saldo y registro de transacción.
- Página de confirmación con resumen del retiro.

### 📥 Consignación Electrónica
- Módulo para enviar dinero a otra cuenta.
- Validación de cuenta de destino y fondos disponibles.
- Actualización de saldos para emisor y receptor.
- Registro automático de la transacción para ambos.

### 📊 Extracto Bancario
- Formulario para seleccionar mes y año.
- Visualización de transacciones filtradas por fecha.
- Redirección al dashboard si no se encuentra información.
- Opción de imprimir el extracto.

### 📃 Resumen de Transacciones
- Vista con las últimas 10 transacciones recientes.
- Información clara: fecha, referencia, tipo, concepto, valor.
- Botón para imprimir y opción de volver al dashboard.

### 🔒 Seguridad y control
- Protección de páginas: si el usuario no está logeado, se redirige a login.
- Autocompletado automático de datos del usuario.

---

## 🛠️ Tecnologías utilizadas
- HTML5 + CSS3
- JavaScript (ES Modules)
- Firebase Realtime Database
- LocalStorage (para persistencia)
- Google Fonts
- Responsive Design

---

## ✨ Estado del proyecto
✅ **100% completado**  

---

