console.log("bingSearchScraper.js v1.");
delete $;
var metaData = [];
// pull down jquery into the JavaScript console
var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";
script.onload = function() {
  console.log("CSP has been turned off.");
  var getImageUrl = anchor => {
    var metaText = $(anchor).closest(".rg_bx").find(".rg_meta").text();
    return JSON.parse(metaText).ou;
  };
  var getContextUrl = anchor => {
    return anchor.href;
  };
  var deleteUrl = imageUrl => {
    metaData = metaData.filter(x => x.imageUrl !== imageUrl);
    console.log("Deleted: " + imageUrl);
  };
  debugger;
  // Click adds to metaData array.
  $(document).on("click", ".rg_bx a", function(e) {
    var imageUrl = getImageUrl(this);
    if (e.ctrlKey) {
      deleteUrl(imageUrl);
      e.preventDefault();
    } else if (metaData.map(x => x.imageUrl).indexOf(imageUrl) !== -1) {
      console.log("Url already exists: " + imageUrl);
    } else {
      var previewUrl = getContextUrl(this);
      metaData.push({ imageUrl: imageUrl, previewUrl: previewUrl });
      console.log("Added: " + imageUrl);
    }
  });
  $(document).on("dblclick", ".rg_bx a", function(e) {
    e.preventDefault();
    deleteUrl(getImageUrl(this));
  });
  console.log("Click an image to add it the list, ctrl + click, or double click the image to remove it from the list, and run save(); in the console to download the list as a file.");
};
document.getElementsByTagName('head')[0].appendChild(script);

// write the URls to file (one per line)
function save() {
  var delimiter = ";";
  var textToSave = metaData.map(x => x.imageUrl + delimiter + x.previewUrl).join('\n');
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'metaData.csv';
  hiddenElement.click();
}
