package com.fishapp;

public class Result {
  private int classIndex;
  private float confidence;

  public Result(int classIndex, float confidence)
  {
    this.classIndex = classIndex;
    this.confidence = confidence;
  }

  public int getClassIndex() {
    return this.classIndex;
  }

  public float getConfidence() {
    return this.confidence;
  }
}
