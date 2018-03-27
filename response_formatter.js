ResponseFormatter = {
  dayStringMapping: {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Sunday'
  },

  getDetailsJson: function(details) {
    return {
      id: details.id,
      price: details.price,
      availability: details.availability
    }
  },
  call: function(response) {
    data = response.data
    result = {}
    room_types = []
    for (var i = 0; i < data.length; i++) {
      date = new Date(data[i].date);
      room_types.push(data[i].room_type);
      if(!result[data[i].date]) {
        result[data[i].date] = {
          day: date.getDate(),
          weekDay: ResponseFormatter.dayStringMapping[date.getDay()],
          details: {}
        }
      }
      result[data[i].date].details[data[i].room_type] = ResponseFormatter.getDetailsJson(data[i])
    }
    return {
      dayWiseData: result,
      roomTypes: room_types.filter(function(x, i) { return room_types.indexOf(x) === i })
    }
  }
}
