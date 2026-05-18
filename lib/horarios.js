export function getDiaAtualKey() {
  const dias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  return dias[now.getDay()];
}

export function getDiasHorario() {
  return [
    { key: 'dom', label: 'Domingo' },
    { key: 'seg', label: 'Segunda-Feira' },
    { key: 'ter', label: 'Terça-Feira' },
    { key: 'qua', label: 'Quarta-Feira' },
    { key: 'qui', label: 'Quinta-Feira' },
    { key: 'sex', label: 'Sexta-Feira' },
    { key: 'sab', label: 'Sábado' },
  ];
}

export function formatHorario(value) {
  if (!value || value === 'fechado') return 'Fechado';
  if (value === '24h') return '24 horas';
  return value.replace('-', ' – ');
}

export function getStatusFuncionamento(horarios) {
  if (!horarios) return { aberto: false, label: 'Fechado', detail: 'Sem horários disponíveis' };

  const diaKey = getDiaAtualKey();
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const horaAtual = now.getHours() * 60 + now.getMinutes();

  const valorHoje = (horarios[diaKey] || 'fechado').trim().toLowerCase();

  if (valorHoje === '24h') {
    return { aberto: true, label: 'Aberto agora', detail: 'Aberto 24 horas' };
  }

  if (valorHoje === 'fechado') {
    const proximoDia = getProximoDiaAberto(horarios, diaKey);
    return {
      aberto: false,
      label: 'Fechado',
      detail: proximoDia ? `Abre ${proximoDia.label} às ${proximoDia.hora}` : 'Fechado hoje',
    };
  }

  const [inicio, fim] = valorHoje.split('-').map((t) => {
    const [h, m] = t.trim().split(':').map(Number);
    return h * 60 + m;
  });

  if (horaAtual >= inicio && horaAtual < fim) {
    const horaFim = horarios[diaKey].split('-')[1].trim();
    return { aberto: true, label: 'Aberto agora', detail: `Fecha às ${horaFim}` };
  }

  if (horaAtual < inicio) {
    const horaInicio = horarios[diaKey].split('-')[0].trim();
    return { aberto: false, label: 'Fechado', detail: `Abre às ${horaInicio}` };
  }

  const proximoDia = getProximoDiaAberto(horarios, diaKey);
  return {
    aberto: false,
    label: 'Fechado',
    detail: proximoDia ? `Abre ${proximoDia.label} às ${proximoDia.hora}` : 'Fechado por hoje',
  };
}

function getProximoDiaAberto(horarios, diaAtualKey) {
  const ordem = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const labels = {
    dom: 'domingo', seg: 'segunda', ter: 'terça',
    qua: 'quarta', qui: 'quinta', sex: 'sexta', sab: 'sábado',
  };
  const idxAtual = ordem.indexOf(diaAtualKey);

  for (let i = 1; i <= 6; i++) {
    const idx = (idxAtual + i) % 7;
    const key = ordem[idx];
    const valor = (horarios[key] || 'fechado').trim().toLowerCase();
    if (valor !== 'fechado') {
      const hora = valor === '24h' ? '00:00' : valor.split('-')[0].trim();
      return { label: labels[key], hora };
    }
  }
  return null;
}
