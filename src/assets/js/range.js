$(function () {
  $('input[name="daterange"]').daterangepicker({
    opens: 'right',
    locale: {
      format: 'DD/MM/YYYY',
    },
    ranges: {
      'Hoy': [moment(), moment()],
      'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Ultimos 7 dias': [moment().subtract(6, 'days'), moment()],
      'Ultimos 30 dias': [moment().subtract(29, 'days'), moment()],
      'Este Mes': [moment().startOf('month'), moment().endOf('month')],
      'Mes Pasado': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
  }, function (start, end, label) {
    sessionStorage.setItem('fecha_inicio', start.format('YYYY-MM-DD'));
    sessionStorage.setItem('fecha_fin', end.format('YYYY-MM-DD'));
  });
});