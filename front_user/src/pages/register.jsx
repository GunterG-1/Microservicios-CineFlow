import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './pages.css';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { markAsRegistered, isRegisteredUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [overlayMessage, setOverlayMessage] = useState('');

  useEffect(() => {
    if (!overlayMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setOverlayMessage('');
    }, 2400);

    return () => window.clearTimeout(timeoutId);
  }, [overlayMessage]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegisteredUser(email)) {
      setOverlayMessage('Usuario ya registrado. Inicia sesión o usa otro correo.');
      return;
    }
    
    if (name.length < 4) {
      setError('El nombre debe tener al menos 4 caracteres');
      return;
    }
    
    if (email !== emailConfirm) {
      setError('Los correos electrónicos no coinciden');
      return;
    }
    
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    markAsRegistered({
      name: normalizedName,
      email: normalizedEmail,
      password: password,
    });
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section className="auth-card">
          <h1>Registrarse</h1>
          <p>Crea tu cuenta para comprar entradas y guardar tu acceso.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input 
              name="name" 
              type="text" 
              placeholder="Nombre completo (mínimo 4 caracteres)" 
              aria-label="Nombre completo" 
              required 
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Correo electrónico" 
              aria-label="Correo electrónico" 
              required 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
            <input 
              name="emailConfirm" 
              type="email" 
              placeholder="Confirmar correo electrónico" 
              aria-label="Confirmar correo electrónico" 
              required 
              value={emailConfirm}
              onChange={(e) => {
                setEmailConfirm(e.target.value);
                setError('');
              }}
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Contraseña (mínimo 8 caracteres)" 
              aria-label="Contraseña" 
              required 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <input 
              name="passwordConfirm" 
              type="password" 
              placeholder="Confirmar contraseña" 
              aria-label="Confirmar contraseña" 
              required 
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setError('');
              }}
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" disabled={name.length < 4 || password.length < 8 || email !== emailConfirm || password !== passwordConfirm}>
              Crear cuenta
            </button>
          </form>
          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Iniciar sesión</Link>
          </p>
        </section>
      </main>
      {overlayMessage && (
        <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-overlay-title">
          <div className="auth-overlay__panel">
            <span className="auth-overlay__icon" aria-hidden="true">i</span>
            <h2 id="auth-overlay-title">Registro duplicado</h2>
            <p>{overlayMessage}</p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Register;