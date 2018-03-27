RoomDetailsManager = {
  roomTypes: [],
  nextButton: $('#load-more-next'),
  prevButton: $('#load-more-prev'),
  startDate: $('#start-date'),
  endDate: $('#end-date'),
  table: $('#content'),
  init: function() {
    RoomDetailsManager.loadData('2019-01-01', '2019-01-10');
    RoomDetailsManager.bindEvents();
  },

  bindEvents: function() {
    RoomDetailsManager.nextButton.on('click', function() {
      endDate = RoomDetailsManager.endDate.text()
      RoomDetailsManager.loadData(endDate, RoomDetailsManager.getDateFrom(endDate, 10))
    });

    RoomDetailsManager.prevButton.on('click', function() {
      startDate = RoomDetailsManager.startDate.text()
      RoomDetailsManager.loadData(RoomDetailsManager.getDateFrom(startDate, -10), startDate)
    });
  },

  getDateFrom: function(textDate, relative) {
    var targetDate = new Date(textDate);
    targetDate.setDate(targetDate.getDate() + relative);
    var dd = targetDate.getDate();
    var mm = targetDate.getMonth() + 1;
    var yyyy = targetDate.getFullYear();
    return `${yyyy}-${mm}-${dd}`
  },

  deleteOldData: function() {
    $.each(ResponseFormatter.roomTypes, function(index, roomType) {
      $(`#${roomType}-row`).remove();
      $(`#${roomType}-price`).remove();
      $(`#${roomType}-availability`).remove();
    });
    $('#week-day').html('<th>Price and availability</th>')
    $('#day-number').html('<th></th>')
  },

  printHeaders: function() {
    $.each(ResponseFormatter.roomTypes, function(index, roomType) {
      RoomDetailsManager.table.append(`<tr id='${roomType}-row'><th>${roomType} Room</th></tr><tr id='${roomType}-availability'><td>Rooms Available</td></tr><tr id='${roomType}-price'><td>Price</td></tr>`)
    });
  },

  printRows: function(dayWiseDataDetails) {
    $.each(dayWiseDataDetails, function(date, dayWiseData) {
      style = ""
      if (dayWiseData.weekDay == 'Saturday' || dayWiseData.weekDay == 'Sunday') {
        style = "style = 'background-color: red'"
      }
      $('#week-day').append(`<th ${style}>${dayWiseData.weekDay}</th>`)
      $('#day-number').append(`<th>${dayWiseData.day}</th>`)
      $.each(dayWiseData.details, function(roomType, roomWiseDetails) {
        $(`#${roomType}-price`).append(`<td class='detail-ele' id ='${roomWiseDetails.id}-price-td' data-id=${roomWiseDetails.id}  data-type='price'><a href='#' onclick='return false' class='value'>${roomWiseDetails.price}</a></td>`)
        $(`#${roomType}-availability`).append(`<td class='detail-ele' id ='${roomWiseDetails.id}-availability-td' data-id=${roomWiseDetails.id} data-type='availability'><a href='#' onclick='return false' class='value'>${roomWiseDetails.availability}</a></td>`)
      })
    });
  },

  printData: function(startDate, endDate, response) {
    RoomDetailsManager.startDate.text(startDate);
    RoomDetailsManager.endDate.text(endDate);
    RoomDetailsManager.deleteOldData();

    data = ResponseFormatter.call(response)
    ResponseFormatter.roomTypes = data.roomTypes;
    RoomDetailsManager.printHeaders();
    RoomDetailsManager.printRows(data.dayWiseData);

    Loader.hide();
  },
  loadData: function(startDate, endDate) {
    Loader.show();
    $.ajax(
      {
        url: `${host}/room_details`,
        data: { start_date: startDate, end_date: endDate, hotel_name: hotelName },
        success: function(response) {
          RoomDetailsManager.printData(startDate, endDate, response)
        }
      }
    );
  }
}
