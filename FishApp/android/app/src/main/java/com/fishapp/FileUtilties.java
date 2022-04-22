package com.fishapp;

import android.content.res.AssetManager;
import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

public final class FileUtilties {
  public static String[] getLabels(AssetManager assetManager, String filePath) {
    InputStream is;
    try {
      is = assetManager.open(filePath);
      String[] lines = convertStreamToStringArray(is);
      is.close();
      return lines;
    } catch (Exception e) {
      Log.e("FileUtilties", e.getMessage());
      return null;
    }
  }

  private static String[] convertStreamToStringArray(InputStream is) throws Exception {
    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
    String line;
    ArrayList<String> lines = new ArrayList();
    while ((line = reader.readLine()) != null) {
      lines.add(line);
    }
    reader.close();
    return lines.toArray(new String[0]);
  }
}
