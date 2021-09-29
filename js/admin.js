"use strict";

var zoom_meetings = [];

function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function the_change() {
	var user = getCookie("username"); // get the user type
	var d = document.getElementById("change_user");
	document.getElementById("change_user").innerHTML = user;
	}




$(function() {
	// your code goes here
	var username = getCookie("username");
	zoom_meetings = [];
	jQuery.ajax({
		type: 'GET',
		url: '/api/meetings',
		data: 'username=' + username,
		success: function (backend_events) {
			for (var i = 0; i < backend_events.length; i++) {
				console.log(backend_events[i]['title']);
				console.log(typeof backend_events[i]['title']);
				zoom_meetings.push({title: backend_events[i]['title'],
									url: backend_events[i]['url'],
									start: backend_events[i]['start']});

				console.log(zoom_meetings[i]);
				console.log(typeof zoom_meetings[i]);
				console.log("dsadsadas");
				console.log(typeof {title: '13:30', url: 'dsadas', start:'blah'})
				jQuery('.events_calendar').fullCalendar(
					{
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'month,agendaWeek,agendaDay,listWeek'
						},
						defaultDate: '2021-09-15',
						editable: true,
						eventLimit: true,
						navLinks: true,
						aspectRatio: 1,
						events: zoom_meetings
					}
				);
			}

		}
	});

});

(function(){
	

		//Global Defaults
			//fonts
	Chart.defaults.global.defaultFontColor = '#666666';
	Chart.defaults.global.defaultFontFamily = 'Poppins, Arial, sans-serif';
	Chart.defaults.global.defaultFontSize = 12;
			//responsive
	Chart.defaults.global.maintainAspectRatio = false;

			//legends
	Chart.defaults.global.legend.labels.usePointStyle = true;

			//scale
	Chart.defaults.scale.gridLines.color = 'rgba(100,100,100,0.15)';
	Chart.defaults.scale.gridLines.zeroLineColor = 'rgba(100,100,100,0.15)';
	// Chart.defaults.scale.gridLines.drawTicks = false;
	
	// Chart.defaults.scale.ticks.min = 0;
	Chart.defaults.scale.ticks.beginAtZero = true;
	Chart.defaults.scale.ticks.maxRotation = 0;

		//padding for Y axes
	Chart.defaults.scale.ticks.padding = 3;
	Chart.defaults.scale.ticks.autoSkipPadding = 10;

		//points
	Chart.defaults.global.elements.point.radius = 5;
	Chart.defaults.global.elements.point.borderColor = 'transparent';


		//custom Chart plugin for set a background to chart
	Chart.pluginService.register({
	beforeDraw: function (chart, easing) {
		if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
			var ctx = chart.chart.ctx;
			var chartArea = chart.chartArea;
				ctx.save();
				ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
				ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
				ctx.restore();
			}
		}
	});

	/////////////////////
	//date range picker//
	/////////////////////
	//http://www.daterangepicker.com/
	(function() {
		var start = moment().subtract(29, 'days');
		var end = moment();

		function cb(start, end) {
			jQuery('.dashboard-daterangepicker span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		}

		jQuery('.dashboard-daterangepicker').daterangepicker({
			"startDate": start,
			"endDate": end,
			"autoApply": true,
			"linkedCalendars": false,
			"showCustomRangeLabel": false,
			"alwaysShowCalendars": true,
			"ranges": {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			
			},
		}, cb);

		cb(start, end);
	})();

	/////////////
	//sparkline//
	/////////////
	//http://omnipotent.net/jquery.sparkline/
	jQuery('.sparklines').each(function(){
		//sparkline type: 'line' (default), 'bar', 'tristate', 'discrete', 'bullet', 'pie', 'box'
		var $this = jQuery(this);
		var data = $this.data();
		
		var type = data.type ? data.type : 'bar';
		var lineColor = data.lineColor ? data.lineColor : '#4db19e';
		var negBarColor = data.negColor ? data.negColor : '#dc5753';
		var barWidth = data.barWidth ? data.barWidth : 4;
		var height = data.height ? data.height : false;
		
		var values = data.values ? JSON.parse("[" + data.values + "]") : false;
		
		$this.sparkline(values, {
			type: type,
			lineColor: lineColor,
			barColor: lineColor,
			negBarColor: negBarColor,
			barWidth: barWidth,
			height: height,
		});
	});


})();