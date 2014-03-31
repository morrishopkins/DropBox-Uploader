  function GetURLParameter(sParam) {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
          var sParameterName = sURLVariables[i].split('=');
          if (sParameterName[0] == sParam) {
              return sParameterName[1];
          }
      }
  }

  var dest = GetURLParameter('d');


  var reader;
  var progress = document.querySelector('.percent');

  function abortRead() {
      reader.abort();
  }

  function errorHandler(evt) {
      switch (evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
              alert('File Not Found!');
              break;
          case evt.target.error.NOT_READABLE_ERR:
              alert('File is not readable');
              break;
          case evt.target.error.ABORT_ERR:
              break; // noop
          default:
              alert('An error occurred reading this file.');
      };
  }

  function updateProgress(evt) {
      // evt is an ProgressEvent.
      if (evt.lengthComputable) {
          var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
          // Increase the progress bar length.
          if (percentLoaded < 100) {
              progress.style.width = percentLoaded + '%';
              progress.textContent = percentLoaded + '%';
          }
      }
  }

  function handleFileSelect(evt) {
      // Reset progress indicator on new file selection.
      progress.style.width = '0%';
      progress.textContent = '0%';

      reader = new FileReader({
          'blob': true
      });
      reader.onerror = errorHandler;
      reader.onprogress = updateProgress;

      reader.onabort = function(e) {
          alert('File read cancelled');
      };
      reader.onloadstart = function(e) {
          document.getElementById('progress_bar').className = 'loading';
      };
      reader.onload = function(e) {
          var rawBytes = e.target.result;
          
          DBox = {};
          
          DBox.uploadFile = function(client) {
              client.writeFile(dest+'/'+evt.target.files[0].name, rawBytes, function(error, stat) {
                  if (error) {
                      return handleError(error);
                  }
                  // The image has been succesfully written.
              });
          }
          
          DBox.showError = function(e) {
              alert(e);
          }
          
          ///  Authenticate and upload file.  Could use nice call back.
          var client = new Dropbox.Client({
              key: "XXXXXXXXXXXXXXXX"
          });
          
          client.authenticate(function(error, client) {
              if (error) {
                  console.dir(error);
                  return showError(error);
              }


              DBox.uploadFile(client);
          });
          ////////////////////////////////////////////////////////////////////


          progress.style.width = '100%';
          progress.textContent = '100%';
          setTimeout("document.getElementById('progress_bar').className='';", 2000);
      }
      reader.readAsArrayBuffer(evt.target.files[0]);
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);
