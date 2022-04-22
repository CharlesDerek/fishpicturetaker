package com.fishapp;

public final class Utilities {
  public static void _assert(boolean condition) throws Exception {
    if (!condition) {
      throw new Exception("Assertion failed.");
    }
  }
}
