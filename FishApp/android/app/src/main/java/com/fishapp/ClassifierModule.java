package com.fishapp;

import android.graphics.Bitmap;
import android.net.Uri;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

/**
 * This class is not thread safe.
 */
public class ClassifierModule extends ReactContextBaseJavaModule {
  //private final static int INPUT_SIZE = 299;
  private final static int INPUT_SIZE = 224;

  private ImageClassifier imageClassifier;
  private String[] labels;

  public ClassifierModule(ReactApplicationContext reactContext) {
    super(reactContext);
    labels = FileUtilties.getLabels(getReactApplicationContext().getAssets(), "labels.txt");
  }

  @Override
  public String getName(){
    return "Classifier";
  }

  @ReactMethod
  public void classify(String uri, Promise promise) {
    if (uri == null) {
      promise.reject(new Exception("uri is null."));
    } else {
      try {
        Bitmap image = ImageUtilities.getBitmap(getReactApplicationContext().getContentResolver(), Uri.fromFile(new File(uri)));
        List<Result> results = classifyImage(image);
        WritableMap map = getClassificationData(uri, results);
        promise.resolve(map);
      } catch (FileNotFoundException e) {
        promise.reject(e);
      } catch (IOException e) {
        promise.reject(e);
      }
    }
  }

  private List<Result> classifyImage(Bitmap image) {
    if (imageClassifier == null) {
      imageClassifier = createImageClassifier(getReactApplicationContext());
    }
    Bitmap resizedImage = ImageUtilities.resizeImage(image, INPUT_SIZE, INPUT_SIZE);
    Log.i("imageClassifier", "classifyImage start");
    List<Result> results = imageClassifier.classifyImage(resizedImage);
    Log.i("imageClassifier", "classifyImage end");
    return results;
  }

  private static ImageClassifier createImageClassifier(ReactApplicationContext reactContext) {
    /*
    retain.py Inception settings:

    final String modelFilePath = "file:///android_asset/inceptionv3_stripped.pb";
    final String inputName = "Mul";
    final int imageMean = 128;
    final float imageStd = 128f;
    final String outputName = "final_result";

    retrain.py Mobilenet settings:
    final String inputName = "Placeholder";
    final int imageMean = 128;
    final float imageStd = 128f;
    final String outputName = "final_result";
    */

    final String modelFilePath = "file:///android_asset/model.pb";
    final String inputName = "input_1:0";
    final int imageMean = 0;
    final float imageStd = 255f;
    final String outputName = "dense_2/Softmax";
    return new ImageClassifier(
        reactContext.getAssets(),
        modelFilePath,
        inputName,
        INPUT_SIZE,
        imageMean,
        imageStd,
        outputName
    );
  }


  @NonNull
  private WritableMap getClassificationData(String path, List<Result> results) {
    WritableMap map = new WritableNativeMap();
    map.putString("imageUri", path);
    map.putArray("results", getResults(results));
    return map;
  }

  @NonNull
  private WritableArray getResults(List<Result> results) {
    WritableArray array = Arguments.createArray();
    for(Result result : results) {
      WritableMap resultMap = Arguments.createMap();
      resultMap.putString("class", this.labels[result.getClassIndex()]);
      resultMap.putDouble("confidence", result.getConfidence());
      array.pushMap(resultMap);
    }
    return array;
  }

  // I can't get tests to run correctly so stupidly I have to run them on virtual devices.
  @ReactMethod
  public void runTests(Promise promise) {
    String[] urls = new String[] {
        "https://www.abc.net.au/news/image/9320982-3x2-700x467.jpg",
        "https://app.fisheries.qld.gov.au/images/barred-cheek-coral-trout-2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Caranx_ignobilis.jpg/1200px-Caranx_ignobilis.jpg",
        // Commented out because the Python scraping script has trouble downloading it.
        //"https://us.123rf.com/450wm/aozz85/aozz851708/aozz85170800005/83943872-diamond-scale-mullet-liza-vaigiensis-also-known-as-diamond-scaled-mullet-squaretail-mullet-blackfin-.jpg?ver=6",
        "https://cdn-tp2.mozu.com/15440-22239/cms/files/7bb4f59f-02ae-4a62-a788-f985f0951012?maxWidth=960&quality=75&_mzcb=_1536869987056",
        "https://www.fishingcairns.com.au/wp-content/uploads/2017/05/Wahoo-e1510617727696.jpg",
    };
    WritableArray bestResults = Arguments.createArray();
    try {
      for (String url : urls) {
        Bitmap bm = ImageUtilities.getBitmapFromUrl(url);
        preprocessImageUrl(bm);
        List<Result> results = classifyImage(bm);
        if (results.size() == 0) {
          bestResults.pushString(null);
        } else {
          Result r = results.get(0);
          String bestClass = this.labels[r.getClassIndex()];
          bestResults.pushString(bestClass + ": " + r.getConfidence());
        }
        createResizedImageInMedia(bm, Integer.toString(url.hashCode()));
      }
    } catch (Exception e) {
      bestResults.pushString(null);
    }
    promise.resolve(bestResults);
  }

  private void preprocessImageUrl(Bitmap bitmap) throws Exception {
    final int imageMean = 0;
    final float imageStd = 255f;
    float[] pixels = ImageClassifier.preprocessImage(bitmap, imageMean, imageStd);
    for(float pixel : pixels)
    {
      Utilities._assert(0.0 <= pixel && pixel <= 1.0);
    }
  }

  private void createResizedImageInMedia(Bitmap bm, String name) {
    Bitmap resizedBitmap = ImageUtilities.resizeImage(bm, INPUT_SIZE, INPUT_SIZE);
    MediaStore.Images.Media.insertImage(getReactApplicationContext().getContentResolver(), resizedBitmap, name , null);
  }
}
