export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    unit: '/mes',
    detail: 'Hasta 5 integrantes',
    pricePerPerson: 0,
    flatPrice: 0,
    maxMembers: 5,
    features: [
      'Hasta 5 integrantes',
      'Gestión de tareas esencial',
      'Dashboard sin alertas emergentes',
      'Sin asistente Lumi'
    ]
  },
  {
    id: 'equipo',
    name: 'Equipo',
    price: '$80',
    unit: '/mes',
    detail: 'Hasta 25 integrantes, alertas y Lumi',
    pricePerPerson: 0,
    flatPrice: 80,
    maxMembers: 25,
    features: [
      'Hasta 25 integrantes',
      'Asistente Lumi',
      'Alertas emergentes',
      'Soporte estándar'
    ]
  },
  {
    id: 'empresa',
    name: 'Empresa',
    price: 'A medida',
    unit: '',
    detail: 'Integrantes ilimitados',
    custom: true,
    features: [
      'Integrantes ilimitados',
      'Análisis avanzado de equipo',
      'Soporte personalizado',
      'Integraciones enterprise'
    ]
  }
];