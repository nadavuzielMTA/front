"use strict";

var zoom_meetings = [];
var admin_users_psy = ['liat har-tov', 'adi green', 'rina aaluf', 'clara moldan', 'lora cohen'];


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


function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";

}
function admin_logout() {
	setCookie("username", '' ,0);
}

function save_complaint() {
	var id = this.id[6];
	var sent_value = document.getElementById('sent-id' + id).checked;
	var sent_to_police_value = document.getElementById('sent-to-police-id' + id).checked;
	var in_treatment_value = document.getElementById('in-treatment-id' + id).checked;
	var done_value = document.getElementById('done_id' + id).checked;
	var user_id_value = document.getElementById('user_id' + id).innerText;

	jQuery.ajax({
		type: 'POST',
		url: '/api/lawyer_complaint',
		data: 'user_id=' + user_id_value + '&sent=' + sent_value + '&sent_to_police=' + sent_to_police_value
			+ '&in_treatment=' + in_treatment_value + '&done=' + done_value,
		success: function (msg) {
			if (msg) {
				location.reload();
			}
		}
	});
}

$(function() {
	// your code goes here
	var username = getCookie("username");
	zoom_meetings = [];

	if (username !== '') {
		document.getElementById("change_user").innerText = username;
	}
	if (username === 'ruby polantiak') {
		jQuery.ajax({
			type: 'GET',
			url: '/api/lawyer_complaint',
			success: function (complaints) {
				for (var i = 0; i < complaints.length; i++) {
					var sent_checked = '';
					var sent_to_policy_checked = '';
					var in_treatment_checked = '';
					var done_checked = '';
					var row_id =  'row-id' + i;
					var sent_id = 'sent-id' + i;
					var sent_to_police_id = 'sent-to-police-id' + i;
					var in_treatment_id = 'in-treatment-id' + i;
					var done_id = 'done_id' + i;
					var user_id = 'user_id' + i;
					if (complaints[i]['sent'])  sent_checked = 'checked';
					if (complaints[i]['sent_to_police']) sent_to_policy_checked = 'checked';
					if (complaints[i]['in_treatment']) in_treatment_checked = 'checked';
					if (complaints[i]['done'])  done_checked = 'checked';

					var row = '<tr class="item-editable"><td ></td><td><div class="media"><div class="media-left"></div>' +
						'<div class="media-body"><p>' + complaints[i]["name"] + '</p></div></div></td>' +
						'<td><div id=' + user_id + ' class="media-body">' + complaints[i]["user_id"] + '</div></td>' +
						'<td><time class="entry-date">' + complaints[i]["created"] + '</time></td>' +
						'<td><time class="entry-date">' + complaints[i]["last_update"] + '</time></td>' +
						'<td class="media-middle scroll"><p>' + complaints[i]["description"] + '</p></td> ' +
						'<td class="media-middle text-center"><input id=' + sent_id + ' type="checkbox"' + sent_checked + '></td>' +
						'<td class="media-middle text-center"><input id=' + sent_to_police_id + ' type="checkbox"' + sent_to_policy_checked + '></td>' +
						'<td class="media-middle text-center"><input id=' + in_treatment_id + ' type="checkbox"' + in_treatment_checked + '></td>' +
						'<td class="media-middle text-center"><input id=' + done_id + ' type="checkbox"' + done_checked + '></td>' +
						'<td><button id=' + row_id+ ' onclick="save_complaint.call(this)">שמור</button></td>' +
						'</tr>';

					$(row).insertAfter("#lawyer-table tr:first");
				}
			}
		});
	}
	else {
		if (username !== ''){
			jQuery.ajax({
				type: 'GET',
				url: '/api/meetings',
				data: 'username=' + username,
				success: function (backend_events) {
					for (var i = 0; i < backend_events.length; i++) {
						zoom_meetings.push({
							title: backend_events[i]['title'],
							url: backend_events[i]['url'],
							start: backend_events[i]['start']
						});
						jQuery('.events_calendar').fullCalendar(
							{
								header: {
									left: 'prev,next today',
									center: 'title',
									right: 'month,agendaWeek,agendaDay,listWeek'
								},
								defaultDate: '2021-10-20',
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
			if (!admin_users_psy.includes(username)){
				jQuery.ajax({
					type: 'GET',
					url: '/api/complaint',
					data: 'username=' + username,
					success: function (complaint_details) {
						var hazana = complaint_details['sent']; // value is 'true' or 'false'
						if (hazana === 'true' && hazana !== 'false') {
							document.getElementById('send-progress-bar').style.backgroundColor = 'green';
							document.getElementById('send-precentage').innerText = '100%';
						}
						else {
							document.getElementById('send-progress-bar').style.backgroundColor = 'red';
							document.getElementById('send-precentage').innerText = '0%';
						}

						var hagasha = complaint_details['sent_to_police']; // value is 'true' or 'false'
						if (hagasha && hagasha !== 'false') {
							document.getElementById('police-progress-bar').style.backgroundColor = 'green';
							document.getElementById('police-precentage').innerText = '100%';
						}
						else {
							document.getElementById('police-progress-bar').style.backgroundColor = 'red';
							document.getElementById('police-precentage').innerText = '0%';
						}

						var betipul = complaint_details['in_treatment']; // value is 'true' or 'false'
						if (betipul && betipul !== 'false') {
							document.getElementById('treatment-progress-bar').style.backgroundColor = 'green';
							document.getElementById('treatment-precentage').innerText = '100%';
						}
						else {
							document.getElementById('treatment-progress-bar').style.backgroundColor = 'red';
							document.getElementById('treatment-precentage').innerText = '0%';
						}
						var tupal = complaint_details['in_treatment']; // value is 'true' or 'false'
						if (tupal && tupal !== 'false') {
							document.getElementById('done-progress-bar').style.backgroundColor = 'green';
							document.getElementById('done-precentage').innerText = '100%';
						}
						else {
							document.getElementById('done-progress-bar').style.backgroundColor = 'red';
							document.getElementById('done-precentage').innerText = '0%';
						}
					}
				});
			}
		}
	}
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