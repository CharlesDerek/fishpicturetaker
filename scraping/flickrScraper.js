console.log("flickerScraper.js v1.");
if (jQuery === undefined) {
  console.error("Remember to paste in jQuery first: https://code.jquery.com/jquery-3.3.1.min.js .");
}
var metaData = [];
var getImageUrl = element => {
  var backgroundImageValue = element.style["background-image"];
  const regex = /url\("\/\/(.+\/\d+_[a-z\d]+)/gm;
  let match = regex.exec(backgroundImageValue);
  if (match === null) {
    return null;
  } else {
    const urlMatchIndex = 1;
    return match[urlMatchIndex] + "_b.jpg"; // Assume all images are jpg and that they support this URL.
  }
};

var getContextUrl = anchor => {
  return anchor.href;
};
var deleteUrl = imageUrl => {
  metaData = metaData.filter(x => x.imageUrl !== imageUrl);
  console.log("Deleted: " + imageUrl);
};
// Click adds to metaData array.
$(document).on("click", ".overlay", function(e) {
  e.preventDefault();
  var imageUrl = getImageUrl($(this).closest(".photo-list-photo-view"));
  if (e.ctrlKey) {
    deleteUrl(imageUrl);
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
