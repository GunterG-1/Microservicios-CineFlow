import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './pages.css';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { isRegistered, userProfile, updateProfile, logout, getDisplayName } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    metodoPago: '',
    contrasena: '',
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      nombre: userProfile?.nombreUsuario || '',
      apellido: userProfile?.apellidoUsuario || '',
      metodoPago: userProfile?.metodoPago || '',
      contrasena: '',
    });
  }, [userProfile]);

  if (!isRegistered) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <section className="profile-card">
            <h1>Perfil no disponible</h1>
            <p>Debes iniciar sesión o registrarte para ver tu perfil.</p>
            <div className="profile-actions">
              <Link to="/iniciar-sesion" className="profile-link profile-link--primary">Iniciar sesión</Link>
              <Link to="/registrarse" className="profile-link">Registrarse</Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.metodoPago.trim()) {
      setError('Debes indicar un metodo de pago para guardar cambios.');
      setFeedback('');
      return;
    }

    setIsSaving(true);
    setError('');
    setFeedback('');

    const result = await updateProfile({
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      metodoPago: formData.metodoPago.trim(),
      contrasena: formData.contrasena.trim() || undefined,
    });

    setIsSaving(false);

    if (!result.ok) {
      setError(result.message || 'No se pudieron guardar los cambios.');
      return;
    }

    setFormData((current) => ({
      ...current,
      contrasena: '',
    }));
    setFeedback('Perfil actualizado correctamente.');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <main className="profile-page">
        <section className="profile-layout">
          <aside className="profile-side">
            <div className="profile-avatar">{getDisplayName().charAt(0).toUpperCase()}</div>
            <h1>{getDisplayName()}</h1>
            <p>{userProfile?.correo || 'Sin correo guardado'}</p>
            <button type="button" className="profile-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </aside>

          <section className="profile-card">
            <h2>Mis datos</h2>
            <p>Actualiza tus datos en el microservicio de usuarios.</p>

            <form className="profile-form" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input name="nombre" type="text" value={formData.nombre} onChange={handleChange} />
              </label>

              <label>
                Apellido
                <input name="apellido" type="text" value={formData.apellido} onChange={handleChange} />
              </label>

              <label>
                Metodo de pago
                <input name="metodoPago" type="text" value={formData.metodoPago} onChange={handleChange} />
              </label>

              <label>
                Nueva contraseña (opcional)
                <input name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} />
              </label>

              {error && <p className="auth-error">{error}</p>}
              {feedback && <p>{feedback}</p>}

              <div className="profile-actions">
                <button type="submit" className="profile-link profile-link--primary" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <Link to="/" className="profile-link">Volver al inicio</Link>
              </div>
            </form>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Profile;