RoomDetailsUpdateManager = {
  individualUpdateForm: $('#i-form'),
  individualUpdateSubmitButton: $('.i-update'),
  individualUpdateCancelButton: $('.i-cancel'),
  individualUpdateInputButton: $('.i-input'),
  bulkUpdateSubmitButton: $('#update-submit-button'),
  bulkUpdateCancelButton: $('#cancel-button'),
  filterIds: ['room_type', 'from_date', 'to_date', 'all_day', 'all_weekday',
   'all_weekend', 'all_monday', 'all_tuesday', 'all_wednesday',
   'all_thursday', 'all_friday', 'all_saturday', 'all_sunday',
    'price', 'availability'],
  init: function() {
    RoomDetailsUpdateManager.bindEvents();
  },

  bulkUpdateInputValid: function() {
    isValid = ($('#from_date').val() && $('#to_date').val() && $('#room_type').val() && $('#price').val() && $('#availability').val())
    if(!isValid) {
      alert('from date, to date, room type, price and availability are neccesary fields');
    }
    return isValid;
  },

  bulkUpdateParams: function() {
    dataJson = {hotel_name: hotelName}
    $.each(RoomDetailsUpdateManager.filterIds, function(i, filterId) {
      dataJson[filterId] = (($(`#${filterId}`)[0].type == 'checkbox') ? $(`#${filterId}`)[0].checked : $(`#${filterId}`).val())
    });
    return dataJson;
  },

  bulkUpdateSuccess: function(response) {
    Loader.hide()
    alert(response.message)
    RoomDetailsUpdateManager.clearBulkUpdateInput();
  },

  bulkUpdateErorr: function(response) {
    alert(response.responseJSON.message);
    Loader.hide();
  },

  updateData: function() {
    if (RoomDetailsUpdateManager.bulkUpdateInputValid()) {
      $.ajax(
        {
          url: `${host}/room_details/update_bulk`,
          method: 'PUT',
          data: RoomDetailsUpdateManager.bulkUpdateParams(),
          beforeSend: Loader.show,
          success: function(response) {
            RoomDetailsUpdateManager.bulkUpdateSuccess(response)
          },
          error: function(response) {
            RoomDetailsUpdateManager.bulkUpdateErorr(response)
          }
        }
      );
    }
  },

  clearBulkUpdateInput: function() {
    $.each(RoomDetailsUpdateManager.filterIds, function(i, filterId) {
      ele = document.getElementById(filterId)
      ele.value = null;
      ele.checked = null;
      ele.selected = null;
    })
  },

  updateIndividualParams: function(){
    dataJson = { hotel_name: hotelName}
    dataJson[RoomDetailsUpdateManager.individualUpdateForm.data('type')] = RoomDetailsUpdateManager.individualUpdateInputButton.val();
    return dataJson;
  },

  individualUpdateSuccess: function(response) {
    $(`#${RoomDetailsUpdateManager.individualUpdateForm.data('id')}-${RoomDetailsUpdateManager.individualUpdateForm.data('type')}-td`).find('.value').text($('.i-input').val())
    Loader.hide();
    RoomDetailsUpdateManager.individualUpdateForm.hide();
    alert(response.message)
  },

  individualUpdateError: function(response) {
    Loader.hide();
    alert(response.responseJSON.message);
  },
  updateIndividualDetail: function() {
    $.ajax({
      url: `${host}/room_details/${RoomDetailsUpdateManager.individualUpdateForm.data('id')}`,
      method: 'PUT',
      data: RoomDetailsUpdateManager.updateIndividualParams(),
      beforeSend: function() {
        Loader.show()
      },
      success: function(response) {
        RoomDetailsUpdateManager.individualUpdateSuccess(response);
      },
      error: function(response) {
        RoomDetailsUpdateManager.individualUpdateError(response);
      }
    })
  },

  showIndividualUpdateForm: function(item) {
    $item = $(item)
    current_value = $item.find('.value').text();
    RoomDetailsUpdateManager.individualUpdateInputButton.data('current_value', current_value)
    RoomDetailsUpdateManager.individualUpdateInputButton[0].value = current_value
    RoomDetailsUpdateManager.individualUpdateForm.data('id', $item.data('id'))
    RoomDetailsUpdateManager.individualUpdateForm.data('type', $item.data('type'))
    RoomDetailsUpdateManager.individualUpdateForm.show()
    RoomDetailsUpdateManager.individualUpdateForm[0].scrollIntoView();
  },

  bindEvents: function() {
    RoomDetailsUpdateManager.bulkUpdateSubmitButton.on('click', function() {
      RoomDetailsUpdateManager.updateData();
    })
    RoomDetailsUpdateManager.bulkUpdateCancelButton.on('click', function() {
      RoomDetailsUpdateManager.clearBulkUpdateInput();
    })

    RoomDetailsUpdateManager.individualUpdateCancelButton.on('click', function() {
      RoomDetailsUpdateManager.individualUpdateForm.hide();
    })

    RoomDetailsUpdateManager.individualUpdateSubmitButton.on('click', RoomDetailsUpdateManager.updateIndividualDetail)

    $(document).on('click', '.detail-ele', function(event) {
      RoomDetailsUpdateManager.showIndividualUpdateForm(this)
    })

  }
}
