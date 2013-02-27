var holder = document.getElementById('holder'),
    state = document.getElementById('status');

if (typeof window.FileReader === 'undefined') {
  state.className = 'fail';
} else {
  state.className = 'success';
  state.innerHTML = 'File API & FileReader available';
}

function sortFilesIntoFontArrays(files){
  var fileNames = [];
  var fonts = [];
  var currentObject = {};

  for(x in files){
    //console.log(files[x].name);
    if(files[x].name !== undefined && files[x].name !== 'item'){ //adding item due to browser bug
      var filenamechunks = files[x].name.split('.');
      var extension = filenamechunks.pop();
      var name = filenamechunks.pop();

      if(name !== currentObject.name){
        if(x !== 0 && x !== '0'){
          fonts.push(currentObject);
        }
        currentObject = {};
        currentObject.extensions = [];
      }

      currentObject.name = name;
      currentObject.extensions.push(extension);

      if(x == files.length-1){
        fonts.push(currentObject);
      }
    }
  }
  return fonts;
}

function fsErrorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function capitaliseFirstLetter(string)
{
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function sortExtensions(a,b){
  switch(a){
    case 'svg':
      return 1;
    break;
    case 'ttf':
      if(b == 'woff'){
        return 1;
      }
    break;
  }
}

function printCSSFontsDefinitions (fonts) {
  var css = "<pre class='brush: css'>";
  for(x in fonts){
    var nameChunks = fonts[x].name.split('-');
    for(i in nameChunks){
      var tmp = capitaliseFirstLetter(nameChunks[i]);
      nameChunks[i] = tmp;
    }
    var fontName = nameChunks.join().replace(/,/g,'');



    css += "@font-face {\n";
    css += "\tfont-family: '"+ fontName +"';\n";
    
    var sorted = fonts[x].extensions.sort(sortExtensions);
    fonts[x].extensions = sorted;


    for(y in fonts[x].extensions){
      switch(fonts[x].extensions[y]){
        case "eot":
          css += "\tsrc: url('"+ fonts[x].name + '.' + fonts[x].extensions[y]  +"');\n";
          css += "\tsrc: url('"+ fonts[x].name + '.' + fonts[x].extensions[y] +"?#iefix') format('embedded-opentype'),\n";
        break;
        case "ttf":
          css += "\t\t url('"+ fonts[x].name + '.' + fonts[x].extensions[y] +"') format('truetype'),\n";
        break;
        case "woff":
          css += "\t\t url('"+ fonts[x].name + '.' + fonts[x].extensions[y] +"') format('woff'),\n";
        break;
        case "svg":
          css += "\t\t url('"+ fonts[x].name + '.' + fonts[x].extensions[y] +"#"+ fontName +"') format('svg');\n";
        break;
      }
    }
    css += "\tfont-weight: normal;\n";
    css += "\tfont-style: normal;\n";
    css += "}\n";
  }
  css += "</pre>";
  $('#holder').html(css);
  SyntaxHighlighter.highlight($('#holder pre')[0]);
}
 
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  e.preventDefault();

  var files;

  var length = e.dataTransfer.items.length;
  for (var i = 0; i < length; i++) {
    var entry = e.dataTransfer.items[i].webkitGetAsEntry();
    if (entry.isFile) {
      files = e.dataTransfer.files;
    } else if (entry.isDirectory) {
      window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, function(fs){
        fs.root.getDirectory('rlaporte', {}, function(dirEntry){
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(function(entries) {
            for(var i = 0; i < entries.length; i++) {
              var entry = entries[i];
              if (entry.isDirectory){
                console.log('Directory: ' + entry.fullPath);
              }
              else if (entry.isFile){
                console.log('File: ' + entry.fullPath);
              }
            }

          }, fsErrorHandler);
        }, fsErrorHandler);
      }, fsErrorHandler);
    }
  }

  
  var reader = new FileReader();

  
  reader.onload = function (event) {
    //console.log(event.target);
    holder.style.background = 'url(' + event.target.result + ') no-repeat center';
  };

  var fonts = sortFilesIntoFontArrays(files);
  printCSSFontsDefinitions(fonts);
  
  return false;
};