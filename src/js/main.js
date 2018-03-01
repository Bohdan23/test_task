$(document).ready(function() {

  // Photo uploading
  $('#previewPhoto').hide();
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $('#previewPhoto').attr('src', e.target.result);

        $('#previewPhoto').fadeIn(400);

      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#photoFile").change(function() {
    readURL(this);
  });

  // Object for checking fields states 
  var validationObj = {
    nameInp: true,
    nameInpLength: false,
    emailInp: false,
    emailInpLength: false,
    selectVal: false,
    textareaLength: false
  }

  // Checking fields are empty or not for disable/anable submit btn
  function checkStates() {
    if (validationObj.emailInpLength == false || validationObj.selectVal == false || validationObj.textareaLength == false) {
      $('#submit').attr('disabled', 'disabled').attr('title', 'Please, fills all require fields.');
    } else {
      $('#submit').removeAttr('disabled').removeAttr('title');
    }
  }
  checkStates();

  // Red fields if somethink incorrect after form submit
  function errorFields() {
    if (validationObj.nameInp == false) {
      $('.form-group-name').addClass('form-group-error')
    }
    if (validationObj.emailInp == false || validationObj.emailInpLength == false) {
      $('.form-group-email').addClass('form-group-error')
    }
    if (validationObj.textareaLength == false) {
      $('.form-group-message').addClass('form-group-error')
    }
  }

  // Checking Inputs
  $('#email').on('keyup', function() {
    var val = $(this).val(),
        regExp = /^[\w.+\-]+@(gmail|outlook)\.com$/;
    
    val == '' ? validationObj.emailInpLength = false : validationObj.emailInpLength = true;

    regExp.test(val) == false ? validationObj.emailInp = false : validationObj.emailInp = true;
    checkStates();
    if (validationObj.emailInp == true && validationObj.emailInpLength == true && $('.form-group-email').hasClass('form-group-error')) {
      $('.form-group-email').removeClass('form-group-error');
    }
  });

  $('#name').on('keyup', function() {
    var val = $(this).val(),
        regExp = /^[a-zA-Z\s]*$/;
    
    val == '' ? validationObj.nameInpLength = false : validationObj.nameInpLength = true;

    regExp.test(val) == false ? validationObj.nameInp = false : validationObj.nameInp = true;

    if (validationObj.nameInp == true && $('.form-group-name').hasClass('form-group-error')) {
      $('.form-group-name').removeClass('form-group-error');
    }
  });

  // Checking Textarea
  $('#message').on('keyup', function() {
    var len = $(this).val().length;
    len < 3 || len > 300 ? validationObj.textareaLength = false : validationObj.textareaLength = true;
    checkStates();

    if (validationObj.textareaLength == true && $('.form-group-message').hasClass('form-group-error')) {
      $('.form-group-message').removeClass('form-group-error');
    }
  });

  // Checking Select
  $('#season').on('change', function() {
    var val = $(this).val();
    val == '' ? validationObj.selectVal = false : validationObj.selectVal = true;
    checkStates();
  });

  // Clear btn
  $('.clear-btn').on('click', function() {
    $('#submit').attr('disabled', 'disabled').attr('title', 'Please, fills all require fields.');
  });

  // Form submit
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    // var formData = new FormData();
    // var uploadPhoto = $('#photoFile').files[0];
    // formData.append('photo', uploadPhoto);
    var infoObj = {
      email: $('#email').val(),
      select: $('#season').val(),
      name: $('#name').val(),
      message: $('#message').val(),
      photo: $('#photoFile').val()
    };
    if (validationObj.nameInp == false || validationObj.emailInp == false || validationObj.emailInpLength == false || validationObj.selectVal == false || validationObj.textareaLength == false) {
        $('#modal').modal({show: true});
        $('.modal-title').text('ERROR! This issue couldn\'t have been saved. Please correct all incorrects fields.');
        errorFields();
    } else {
      $.post($(this).attr('action'), infoObj, function(data){}, 'json');
      $('#modal').modal({show: true});
      $('.modal-title').text('Request complete!');
      
    }
  });
});