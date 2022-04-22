/*
@RunWith(RobolectricTestRunner.class)
public class ImageClassifierTest {

    @Before
    public void init() {
    }

    @Test
    public void ImageClassifier_FakeTest_ProcessBitmap() {
      final int inputSize = 224;
      final int imageMean = 0;
      final float imageStd = 255f;
      String barramundiUrl = "https://www.abc.net.au/news/image/9320982-3x2-700x467.jpg";
      Bitmap bm = null;
      try {
        bm = GetBitmapFromUrl(barramundiUrl);
      } catch (IOException e) {
        Assert.fail();
      }
      //Bitmap bm = Bitmap.createBitmap(inputSize * 2, inputSize, Bitmap.Config.ARGB_8888);
      Canvas c = new Canvas(bm);
      float[] pixels = ImageClassifier.prepocessImage(bm, imageMean, imageStd);
      for(float pixel : pixels)
      {
        Assert.assertTrue(0.0 <= pixel && pixel <= 1.0);
      }
    }

    private Bitmap GetBitmapFromUrl(String url) throws IOException {
      BufferedInputStream in = new java.io.BufferedInputStream(new URL(url).openStream());
      return BitmapFactory.decodeStream(in);
    }
}
*/
