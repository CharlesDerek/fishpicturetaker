package com.fishapp;

import android.content.ContentResolver;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.net.Uri;
import android.support.annotation.NonNull;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public final class ImageUtilities {


  public static Bitmap getBitmap(ContentResolver contentResolver, Uri imageUri) throws IOException {
    if (imageUri != null) {
      InputStream is = contentResolver.openInputStream(imageUri);
      Bitmap image = BitmapFactory.decodeStream(is);
      is.close();
      return image;
    } else {
      return null;
    }
  }

  public static Bitmap getBitmapFromUrl(String url) throws IOException {
    BufferedInputStream in = new java.io.BufferedInputStream(new URL(url).openStream());
    return BitmapFactory.decodeStream(in);
  }

  public static int[] getPixels(Bitmap bitmap) {
    int[] pixels = new int[bitmap.getWidth() * bitmap.getHeight()];
    final int offset = 0;
    final int x = 0;
    final int y = 0;
    bitmap.getPixels(pixels, offset, bitmap.getWidth(), x, y, bitmap.getWidth(), bitmap.getHeight());
    return pixels;
  }

  @NonNull
  public static Bitmap resizeImage(Bitmap image, int width, int height) {
    Bitmap resizedImage = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(resizedImage);
    //image = CentreCropImage(image);
    //Matrix matrix = scaleAndCropTopLeft(image.getWidth(), image.getHeight(), width, height);
    Matrix matrix = scaleImageIgnoringAspectRatio(image.getWidth(), image.getHeight(), width, height);
    canvas.drawBitmap(image, matrix, null);
    return resizedImage;
  }

  public static Matrix scaleAndCropTopLeft(int srcWidth, int srcHeight, int destWidth, int destHeight) {
    Matrix transformation = new Matrix();
    // We need to find the biggest scale ratio and use that to keep the aspect ratio. Because the origin is at the bottom? left, it will crop the top? and right.
    float scaleFactor = Math.max(destWidth / srcWidth, destHeight / srcHeight);
    transformation.postScale(scaleFactor, scaleFactor);
    return transformation;
  }

  // Attribution: https://stackoverflow.com/a/10703256/137996
  public static Matrix scaleImageIgnoringAspectRatio(int srcWidth, int srcHeight, int newWidth, int newHeight) {
    // This is exact same scaling technique that the model uses to train on at the moment.
    float scaleWidth = ((float) newWidth) / srcWidth;
    float scaleHeight = ((float) newHeight) / srcHeight;
    // CREATE A MATRIX FOR THE MANIPULATION
    Matrix matrix = new Matrix();
    // RESIZE THE BIT MAP
    matrix.postScale(scaleWidth, scaleHeight);
    return matrix;
  }

  /*
  public static Matrix buildMatrix(float srcWidth, float srcHeight, float destWidth, float destHeight) {
    // Attribution: https://stackoverflow.com/a/15441311/137996
    float scale = destWidth / srcWidth;

    float xTranslation = 0.0f;
    float yTranslation = (destHeight - srcHeight * scale) / 2.0f;

    Matrix transformation = new Matrix();
    transformation.postTranslate(xTranslation, yTranslation);
    transformation.preScale(scale, scale);
    return transformation;
  }
  */

  /*
  // Attribution: https://stackoverflow.com/a/28367226/137996
  public static Bitmap resize(Bitmap image, int maxWidth, int maxHeight) {
    if (maxHeight > 0 && maxWidth > 0) {
      int width = image.getWidth();
      int height = image.getHeight();
      float ratioBitmap = (float) width / (float) height;
      float ratioMax = (float) maxWidth / (float) maxHeight;

      int finalWidth = maxWidth;
      int finalHeight = maxHeight;
      if (ratioMax > ratioBitmap) {
        finalWidth = (int) ((float)maxHeight * ratioBitmap);
      } else {
        finalHeight = (int) ((float)maxWidth / ratioBitmap);
      }
      image = Bitmap.createScaledBitmap(image, finalWidth, finalHeight, true);
      return image;
    } else {
      return image;
    }
  }
  */

  public static Bitmap centreCropImage(Bitmap image) {
    int size = Math.min(image.getWidth(), image.getHeight());
    int x = (int)((image.getWidth() - size) / 2.0);
    int y = (int)((image.getHeight() - size) / 2.0);
    /*
    int[] pixels = new int[size * size];
    image.getPixels(pixels, 0, image.getWidth(), x, y, size, size);
    Bitmap centredImage = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
    centredImage.getPixels(pixels, 0, centredImage.getWidth(), 0, 0, size, size);
    return centredImage;
    */
    return Bitmap.createBitmap(image, x, y, size, size);
  }
}
