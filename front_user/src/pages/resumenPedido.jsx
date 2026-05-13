import "./pages.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from '../contexts/AuthContext';
import { useCarrito } from '../contexts/carritoContext';
import { promotions } from '../database/promotions';
import { snacks } from '../database/snacks';

const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEAT_COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8];
const INITIAL_OCCUPIED_SEATS = new Set(['A3', 'A4', 'B6', 'C2', 'D7', 'E1', 'F8']);
const PURCHASED_SEATS_KEY = 'cine-flow-purchased-seats';

const getPurchasedSeats = () => {
  if (typeof window === 'undefined') {
    return new Set();
  }

  const stored = window.localStorage.getItem(PURCHASED_SEATS_KEY);
  if (!stored) {
    return new Set();
  }

  try {
    const parsed = JSON.parse(stored);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

const savePurchasedSeats = (seats) => {
  if (typeof window === 'undefined') {
    return;
  }

  const allPurchased = new Set([...getPurchasedSeats(), ...seats]);
  window.localStorage.setItem(PURCHASED_SEATS_KEY, JSON.stringify(Array.from(allPurchased)));
};

function ResumenPedido() {
  const navigate = useNavigate();
  const { isRegistered, getDisplayName } = useAuth();
  const { cartItems, obtenerPrecioTotal, vaciarCarrito, agregarAlCarrito } = useCarrito();
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatError, setSeatError] = useState('');
  const [occupiedSeats, setOccupiedSeats] = useState(new Set(INITIAL_OCCUPIED_SEATS));
  const [mostrarRevisionPago, setMostrarRevisionPago] = useState(false);
  const [mostrarOpcionesExtras, setMostrarOpcionesExtras] = useState(false);
  const [indiceExtraActivo, setIndiceExtraActivo] = useState(0);
  const [mensajeExtra, setMensajeExtra] = useState('');

  const totalTickets = cartItems.reduce((total, item) => {
    const esEntrada = Number.isInteger(item.horaNum) && Number.isInteger(item.minutoNum);
    return esEntrada ? total + item.cantidad : total;
  }, 0);

  useEffect(() => {
    const purchased = getPurchasedSeats();
    setOccupiedSeats(new Set([...INITIAL_OCCUPIED_SEATS, ...purchased]));
    setSelectedSeats([]);
    setSeatError('');
    setMostrarRevisionPago(false);
    setMostrarOpcionesExtras(false);
    setIndiceExtraActivo(0);
    setMensajeExtra('');
  }, [totalTickets]);

  useEffect(() => {
    if (indiceExtraActivo > snacks.length - 1) {
      setIndiceExtraActivo(0);
    }
  }, [indiceExtraActivo]);

  const handleSeatToggle = (seatId) => {
    if (occupiedSeats.has(seatId) || confirmando) {
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((currentSeats) => currentSeats.filter((seat) => seat !== seatId));
      setSeatError('');
      return;
    }

    if (selectedSeats.length >= totalTickets) {
      setSeatError(`Solo puedes seleccionar ${totalTickets} asiento${totalTickets === 1 ? '' : 's'}.`);
      return;
    }

    setSelectedSeats((currentSeats) => [...currentSeats, seatId]);
    setSeatError('');
  };

  if (!isRegistered) {
    return (
      <>
        <Navbar />
        <main className="resumen-page">
          <div className="resumen-error">
            <p>Debes iniciar sesión para completar tu pedido</p>
            <button onClick={() => navigate('/iniciar-sesion')}>Ir a Login</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="resumen-page">
          <div className="resumen-empty">
            <p>Tu carrito está vacío</p>
            <button onClick={() => navigate('/')}>Continuar comprando</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalPrice = obtenerPrecioTotal();

  const handleProcesarPago = () => {
    if (selectedSeats.length !== totalTickets) {
      setSeatError(`Debes seleccionar ${totalTickets} asiento${totalTickets === 1 ? '' : 's'} antes de continuar.`);
      return;
    }

    if (!aceptoTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    setConfirmando(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      const pedido = {
        id: Date.now(),
        usuario: getDisplayName(),
        items: cartItems,
        asientos: selectedSeats,
        total: totalPrice,
        totalEntradas: totalTickets,
        fecha: new Date().toLocaleDateString('es-ES'),
        hora: new Date().toLocaleTimeString('es-ES'),
        estado: 'Confirmado'
      };

      // Guardar asientos comprados
      savePurchasedSeats(selectedSeats);

      // Guardar pedido en localStorage
      const pedidos = JSON.parse(localStorage.getItem('cine-flow-pedidos') || '[]');
      pedidos.push(pedido);
      localStorage.setItem('cine-flow-pedidos', JSON.stringify(pedidos));

      // Vaciar carrito
      vaciarCarrito();

      // Redirigir a confirmación
      navigate('/pedido-confirmado', { state: { pedido } });
    }, 2000);
  };

  const handleSolicitarRevisionPago = () => {
    if (selectedSeats.length !== totalTickets) {
      setSeatError(`Debes seleccionar ${totalTickets} asiento${totalTickets === 1 ? '' : 's'} antes de continuar.`);
      return;
    }

    if (!aceptoTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    setMostrarRevisionPago(true);
  };

  const handleAgregarExtra = (snack) => {
    agregarAlCarrito(snack);
    setMensajeExtra(`${snack.title} agregado al carrito`);
    setTimeout(() => setMensajeExtra(''), 1800);
  };

  const moverCarruselExtras = (direccion) => {
    setIndiceExtraActivo((actual) => {
      if (direccion === 'prev') {
        return actual === 0 ? snacks.length - 1 : actual - 1;
      }

      return actual === snacks.length - 1 ? 0 : actual + 1;
    });
  };

  const extraActivo = snacks[indiceExtraActivo];

  return (
    <>
      <Navbar />
      <main className="resumen-page">
        <div className="resumen-container">
          <h1>Resumen de Pedido</h1>

          <div className="resumen-content">
            {/* Detalles del cliente */}
            <section className="resumen-cliente">
              <h2>Detalles del Cliente</h2>
              <div className="cliente-info">
                <p><strong>Usuario:</strong> {getDisplayName()}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
                <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES')}</p>
                <p><strong>Entradas:</strong> {totalTickets}</p>
              </div>
            </section>

            /* Items del pedido */
            <section className="resumen-items">
              <h2>Items del Pedido</h2>
              <div className="resumen-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="resumen-item-row">
                    <div className="resumen-item-img">
                      <img src={item.imageSrc} alt={item.title} />
                    </div>
                    <div className="resumen-item-details">
                      <h3>{item.title}</h3>
                      <p className="resumen-item-genre">{item.genre || item.description}</p>
                      {item.fechaFuncionTexto && item.horario ? (
                        <p className="resumen-item-schedule">{item.fechaFuncionTexto} - {item.horario}</p>
                      ) : item.diaAgendaNombre && item.horario ? (
                        <p className="resumen-item-schedule">{item.diaAgendaNombre} - {item.horario}</p>
                      ) : null}
                    </div>
                    <div className="resumen-item-cantidad">
                      <span>{item.cantidad} x </span>
                    </div>
                    <div className="resumen-item-precio">
                      <span>${(item.price * item.cantidad).toFixed(3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Selección de asientos */}
            <section className="resumen-asientos">
              <div className="resumen-asientos__header">
                <div>
                  <h2>Selecciona tus asientos</h2>
                  <p>
                    Elige {totalTickets} asiento{totalTickets === 1 ? '' : 's'} para continuar con el pago.
                  </p>
                </div>
                <div className="resumen-asientos__counter">
                  <span>Seleccionados</span>
                  <strong>{selectedSeats.length}/{totalTickets}</strong>
                </div>
              </div>

              <div className="seat-map__screen">Pantalla</div>

              <div className="seat-map">
                {SEAT_ROWS.map((row) => (
                  <div key={row} className="seat-map__row">
                    <span className="seat-map__row-label">{row}</span>
                    <div className="seat-map__grid">
                      {SEAT_COLUMNS.map((column) => {
                        const seatId = `${row}${column}`;
                        const isOccupied = occupiedSeats.has(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            type="button"
                            className={`seat ${isOccupied ? 'seat--occupied' : ''} ${isSelected ? 'seat--selected' : ''}`}
                            onClick={() => handleSeatToggle(seatId)}
                            disabled={isOccupied || confirmando}
                            aria-pressed={isSelected}
                            aria-label={`Asiento ${seatId}${isOccupied ? ', ocupado' : ''}`}
                          >
                            {seatId}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <span className="seat-legend__item"><i className="seat seat--available" /> Disponible</span>
                <span className="seat-legend__item"><i className="seat seat--selected" /> Seleccionado</span>
                <span className="seat-legend__item"><i className="seat seat--occupied" /> Ocupado</span>
              </div>

              {seatError ? <p className="seat-error">{seatError}</p> : null}

              {selectedSeats.length > 0 ? (
                <div className="seat-selection-summary">
                  <span>Asientos elegidos:</span>
                  <div className="seat-chips">
                    {selectedSeats.map((seat) => (
                      <span key={seat} className="seat-chip">{seat}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            {/* Resumen financiero */}
            <section className="resumen-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(3)}</span>
              </div>
              <div className="total-row">
                <span>Impuestos (0%):</span>
                <span>$0.000</span>
              </div>
              <div className="total-row final">
                <strong>Total:</strong>
                <strong>${totalPrice.toFixed(3)}</strong>
              </div>
            </section>

            {/* Términos y condiciones */}
            <section className="resumen-terminos">
              <label className="terminos-checkbox">
                <input
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  disabled={confirmando}
                />
                <span>
                  Acepto los términos y condiciones de compra y la política de privacidad
                </span>
              </label>
            </section>

            {/* Botones de acción */}
            <div className="resumen-acciones">
              <button
                className="resumen-volver-btn"
                onClick={() => navigate('/carrito')}
                disabled={confirmando}
              >
                Volver al carrito
              </button>
              <button
                className="resumen-confirmar-btn"
                onClick={handleSolicitarRevisionPago}
                disabled={!aceptoTerminos || confirmando || selectedSeats.length !== totalTickets}
              >
                {confirmando ? 'Procesando...' : 'Ir al pago'}
              </button>
            </div>
          </div>
        </div>
      </main>
      {mostrarRevisionPago ? (
        <div className="payment-review-overlay" onClick={() => setMostrarRevisionPago(false)}>
          <div className="payment-review-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="payment-review-close" onClick={() => setMostrarRevisionPago(false)}>
              ✕
            </button>
            <h2>No nos falta nada?</h2>
            <p className="payment-review-copy">
              Revisa tu pedido una vez más antes de proceder con el pago.
            </p>

            <section className="payment-review-promos">
              <h3>Promos disponibles</h3>
              <div className="payment-review-promos-grid">
                {promotions.slice(0, 3).map((promo) => (
                  <article key={promo.id} className="payment-review-promo-card">
                    <div className="payment-review-promo-emoji">{promo.emoji}</div>
                    <div className="payment-review-promo-body">
                      <h4>{promo.title}</h4>
                      <p>{promo.description}</p>
                    </div>
                    <span className="payment-review-promo-badge">{promo.discount}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="payment-review-extras">
              <button
                type="button"
                className="payment-review-extras-toggle"
                onClick={() => setMostrarOpcionesExtras((current) => !current)}
                disabled={confirmando}
              >
                {mostrarOpcionesExtras ? 'Ocultar opciones para agregar' : 'Ver carrusel de opciones para agregar'}
              </button>

              {mostrarOpcionesExtras && extraActivo ? (
                <div className="payment-review-extras-panel">
                  <div className="payment-review-extras-carousel">
                    <button
                      type="button"
                      className="payment-review-extras-nav"
                      onClick={() => moverCarruselExtras('prev')}
                      aria-label="Opción anterior"
                    >
                      ‹
                    </button>

                    <article className="payment-review-extra-card">
                      <div className="payment-review-extra-emoji">{extraActivo.emoji}</div>
                      <h4>{extraActivo.title}</h4>
                      <p>{extraActivo.description}</p>
                      <strong>${extraActivo.price.toFixed(3)}</strong>
                      <button
                        type="button"
                        className="payment-review-extra-add"
                        onClick={() => handleAgregarExtra(extraActivo)}
                        disabled={confirmando}
                      >
                        Agregar
                      </button>
                    </article>

                    <button
                      type="button"
                      className="payment-review-extras-nav"
                      onClick={() => moverCarruselExtras('next')}
                      aria-label="Siguiente opción"
                    >
                      ›
                    </button>
                  </div>

                  <p className="payment-review-extras-index">
                    Opción {indiceExtraActivo + 1} de {snacks.length}
                  </p>
                  {mensajeExtra ? <p className="payment-review-extras-feedback">{mensajeExtra}</p> : null}
                </div>
              ) : null}
            </section>

            <div className="payment-review-summary">
              <div>
                <span>Entradas</span>
                <strong>{totalTickets}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>${totalPrice.toFixed(3)}</strong>
              </div>
            </div>

            <div className="payment-review-actions">
              <button type="button" className="payment-review-secondary" onClick={() => setMostrarRevisionPago(false)}>
                Revisar pedido
              </button>
              <button type="button" className="payment-review-primary" onClick={handleProcesarPago} disabled={confirmando}>
                {confirmando ? 'Procesando...' : 'Sí, proceder al pago'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default ResumenPedido;
