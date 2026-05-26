const app = express();
app.use(cors());
app.use(express.json());

// CONEXIÓN CORREGIDA: Usamos comillas invertidas para el nombre con espacios
// CONEXIÓN CORREGIDA: Sin comillas invertidas adentro, solo el texto plano
const sequelize = new Sequelize('agenda de lesly', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Definición del modelo adaptado a tu tabla 'contactos'
const Contacto = sequelize.define('contactos', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    fecha_nacimiento: { type: DataTypes.DATEONLY }
}, {
    tableName: 'contactos', // Tu tabla real
    timestamps: false
});

// Ruta principal tipo "Multi-acción" mediante GET
app.get('/usuarios', async (req, res) => {
    const { action } = req.query;

    try {
        switch (action) {
            case 'getAll':
                const usuarios = await Contacto.findAll();
                return res.json(usuarios);

            case 'add':
                const { nombre, direccion, telefono, fecha_nacimiento } = req.query;
                if (!nombre || !direccion || !telefono || !fecha_nacimiento) {
                    return res.status(400).json({ error: 'Faltan parámetros para agregar' });
                }
                const nuevo = await Contacto.create({ nombre, direccion, telefono, fecha_nacimiento });
                return res.json({ message: 'Usuario agregado', usuario: nuevo });

            case 'update':
                const { id, nombre: nomU, direccion: dirU, telefono: telU, fecha_nacimiento: fnU } = req.query;
                if (!id || !nomU || !dirU || !telU || !fnU) {
                    return res.status(400).json({ error: 'Faltan parámetros para actualizar' });
                }
                const actualizado = await Contacto.update(
                    { nombre: nomU, direccion: dirU, telefono: telU, fecha_nacimiento: fnU },
                    { where: { id } }
                );
                return res.json({ message: 'Usuario actualizado', resultado: actualizado });

            case 'delete':
                const idEliminar = req.query.id;
                if (!idEliminar) {
                    return res.status(400).json({ error: 'Falta el id para eliminar' });
                }
                await Contacto.destroy({ where: { id: idEliminar } });
                return res.json({ message: 'Usuario eliminado' });

            default:
                return res.status(400).json({ error: 'Acción no válida' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Arrancar el servidor
sequelize.authenticate()
    .then(() => {
        console.log('🚀 Conectado exitosamente a la base de datos de Lesly.');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(3000, () => {
            console.log('🔥 Servidor corriendo en http://localhost:3000');
        });
    })
    .catch(err => {
        console.error('❌ Error al conectar:', err);
    });
