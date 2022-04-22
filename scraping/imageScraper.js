var urls = [];
// pull down jquery into the JavaScript console
var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";
script.onload = function() {
  // Click adds to urls array.
  $(document).on("click", "img", function(e) {
    e.preventDefault();
    var url = e.target.src;
    if (e.ctrlKey) {
      urls = urls.filter(x => x !== url);
      console.log("Deleted: " + url);
    } else if (urls.indexOf(url) !== -1) {
      console.log("Url already exists: " + url);
    } else {
      urls.push(url);
      console.log("Added: " + url);
    }
  });
  console.log("Click an image to add it the list, ctrl + click the image to remove it from the list, and run save(); in the console to download the list as a file.");
};
document.getElementsByTagName('head')[0].appendChild(script);

// write the URls to file (one per line)
function save() {
  var textToSave = urls.join('\n');
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'urls.txt';
  hiddenElement.click();
}
