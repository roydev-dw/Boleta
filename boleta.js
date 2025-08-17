const fechaActualizada = document.querySelector('.fecha');
const detalleTabla = document.querySelector('.tabla-detalle');
const totalGeneral = document.querySelector('.total-general');
const botonImprimir = document.getElementById('boton-imprimir');
const boletaElement = document.querySelector('.contenedor-boleta');
const botonWhatsapp = document.getElementById('boton-whatsapp');

const fecha = new Date();
const fechaFormateada = fecha.toLocaleDateString('es-CL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

fechaActualizada.innerHTML = `<b>Fecha:</b> ${fechaFormateada}`;

function crearProducto(item = '', cantidad = 0, precio = 0) {
  const fila = document.createElement('div');
  fila.className = 'fila';
  fila.innerHTML = `
    <div class="item">
      <span class="label">Ítem:</span>
      <span contenteditable="true" class="span-item">nombre${item}</span>
    </div>
    <div class="item">
      <span class="label">Cantidad:</span>
      <span contenteditable="true" class="span-cantidad">${cantidad}</span>
    </div>
    <div class="item">
      <span class="label">Precio:</span>
      <span contenteditable="true" class="span-precio">${precio}</span>
    </div>
    <div class="item">
      <span class="label">Subtotal:</span>
      <span class="span-subtotal">${formatoCLP.format(0)}</span>
    </div>
    <hr />
`;

  const cantEl = fila.querySelector('.span-cantidad');
  const precioEl = fila.querySelector('.span-precio');
  const subtotalEl = fila.querySelector('.span-subtotal');

  function recalcular() {
    const cant = parseInt(cantEl.textContent) || 0;
    const prec = parseInt(precioEl.textContent) || 0;
    subtotalEl.textContent = formatoCLP.format(cant * prec);

    actualizaTotal();
  }

  cantEl.addEventListener('input', recalcular);
  precioEl.addEventListener('input', recalcular);

  detalleTabla.appendChild(fila);
}

function actualizaTotal() {
  let total = 0;
  document.querySelectorAll('.span-subtotal').forEach((subtotalEl) => {
    const subtotal = parseInt(subtotalEl.textContent.replace(/\D/g, '')) || 0;
    total += subtotal;
  });
  totalGeneral.textContent = formatoCLP.format(total);
}

document.getElementById('boton-agregar').addEventListener('click', () => {
  crearProducto();
});

document.getElementById('boton-limpiar').addEventListener('click', () => {
  detalleTabla.innerHTML = '';
  crearProducto();
  totalGeneral.textContent = formatoCLP.format(0);
});

botonImprimir.addEventListener('click', () => {
  window.print();
});

botonWhatsapp.addEventListener('click', async () => {
  if (!('share' in navigator) || !('canShare' in navigator)) {
    window.open(
      'https://wa.me/56963540147?text=' +
        encodeURIComponent('Te envío la boleta'),
      '_blank'
    );
    return;
  }

  const canvas = await html2canvas(boletaElement, {
    backgroundColor: '#fff',
    scale: 2,
    ignoreElements: (element) =>
      element.classList.contains('html2canvas-ignore'),
  });
  canvas.toBlob(async (blob) => {
    const file = new File([blob], `boleta_${Date.now()}.png`, {
      type: 'image/png',
    });
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Boleta',
        text: 'Te envío la boleta',
      });
    } else {
      window.open(
        'https://wa.me/56963540147?text=' +
          encodeURIComponent('Te envío la boleta'),
        '_blank'
      );
    }
  }, 'image/png');
});

crearProducto();
