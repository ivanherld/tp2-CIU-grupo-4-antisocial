function tiempoRelativo(fecha: string | undefined): string {
  if (!fecha) return '';
  const creado = new Date(fecha);
  
  if (isNaN(creado.getTime())){
    console.warn('Fecha inválida recibida', fecha);
    return '';
  } 
  const ahora = new Date();
  const diferencia = ahora.getTime() - creado.getTime();
  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (segundos < 60) return 'hace un momento';
  if (minutos < 60) return `hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
  if (horas < 24) return `hace ${horas} hora${horas !== 1 ? 's' : ''}`;
  if (dias < 7) return `hace ${dias} día${dias !== 1 ? 's' : ''}`;

  return creado.toLocaleDateString('es-AR', {day:'numeric', month:'short'});
}

export { tiempoRelativo };