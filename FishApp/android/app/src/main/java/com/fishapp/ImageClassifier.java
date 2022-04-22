package com.fishapp;

import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.support.annotation.NonNull;

import org.tensorflow.Operation;
import org.tensorflow.contrib.android.TensorFlowInferenceInterface;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


/**
 * Created by ashley on 24/03/18.
 */

public class ImageClassifier {
  private static final int NUM_CHANNELS = 3;

  private TensorFlowInferenceInterface inferenceInterface;
  private int numClasses;
  private String inputName;
  private int inputSize;
  private int imageMean;
  private float imageStd;
  private String outputName;

  public ImageClassifier(
      AssetManager assestManager,
      String modelFileName,
      String inputName,
      int inputSize,
      int imageMean,
      float imageStd,
      String outputName
    ) {
    inferenceInterface = new TensorFlowInferenceInterface(assestManager, modelFileName);
    Operation operation = inferenceInterface.graphOperation(outputName);
    final int idx = 0;
    final int i = 1;
    numClasses = (int) operation.output(idx).shape().size(i);
    this.inputName = inputName;
    this.inputSize = inputSize;
    this.imageMean = imageMean;
    this.imageStd = imageStd;
    this.outputName = outputName;
  }

  // This expects bitMap to be of type Bitmap.Config.ARGB_8888) of the correct size.
  public List<Result> classifyImage(final Bitmap bitmap) {
    if (bitmap.getWidth() != inputSize || bitmap.getHeight() != inputSize) {
      throw new IllegalArgumentException("Bitmap is not of expected size.");
    }
    // The preprocessed image should range from 0.0 (for black) to 1.0 (for white).
    float[] preprocessedImage = preprocessImage(bitmap, imageMean, imageStd);
    final int batchSize = 1;
    inferenceInterface.feed(inputName, preprocessedImage, batchSize, inputSize, inputSize, NUM_CHANNELS);
    final boolean logStats = false;
    inferenceInterface.run(new String[] { outputName }, logStats);
    float[] outputs = new float[numClasses];
    inferenceInterface.fetch(outputName, outputs);
    final int topFive = 5;
    return getResults(outputs, topFive);
  }

  public static float[] preprocessImage(Bitmap bitmap, int mean, float std) {
    int[] values = ImageUtilities.getPixels(bitmap);
    float[] floats = new float[bitmap.getWidth() * bitmap.getHeight() * NUM_CHANNELS];
    for (int i = 0; i < values.length; i++) {
      final int value = values[i];
      floats[(i * NUM_CHANNELS) + 0] = (((value >> 16) & 0xFF) - mean) / std;
      floats[(i * NUM_CHANNELS) + 1] = (((value >> 8) & 0xFF) - mean) / std;
      floats[(i * NUM_CHANNELS) + 2] = ((value & 0xFF) - mean) / std;
    }
    return floats;
  }

  @NonNull
  private List<Result> getResults(float[] outputs, int maxSize) {
    final double confidenceThreshold = 0.001;
    ArrayList<Result> results = new ArrayList<Result>();
    for (int i = 0; i < outputs.length; i++) {
      float confidence = outputs[i];
      if (confidence >= confidenceThreshold) {
        results.add(new Result(i, confidence));
      }
    }
    Collections.sort(results, new Comparator<Result>() {
      @Override
      public int compare(Result lhs, Result rhs) {
        float difference = lhs.getConfidence() - rhs.getConfidence();
        // Sort in descending order
        if (difference == 0.0) {
          return 0;
        } else if (difference > 0) {
          return -1;
        } else {
          return 1;
        }
      }
    });
    return results.subList(0, Math.min(maxSize, results.size()));
  }
}

