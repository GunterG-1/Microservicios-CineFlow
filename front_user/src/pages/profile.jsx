import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import './pages.css';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { isRegistered, userProfile, updateProfile, logout, getDisplayName } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    setFormData({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
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

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(formData);
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
            <p>{userProfile?.email || 'Sin correo guardado'}</p>
            <button type="button" className="profile-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </aside>

          <section className="profile-card">
            <h2>Mis datos</h2>
            <p>Modifica tu nombre o correo y se guardará en este navegador.</p>

            <form className="profile-form" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input name="name" type="text" value={formData.name} onChange={handleChange} />
              </label>

              <label>
                Correo electrónico
                <input name="email" type="email" value={formData.email} onChange={handleChange} />
              </label>

              <div className="profile-actions">
                <button type="submit" className="profile-link profile-link--primary">Guardar cambios</button>
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