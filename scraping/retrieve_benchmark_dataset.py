import os
import argparse
import requests
from utils import download_image, sha256_digest

def main():
    args = parse_args()
    names_to_urls = {
        'australian_bass': 'https://yaffa-cdn.s3.amazonaws.com/yaffadsp/images/dmImage/StandardImage/bass11.jpg',
        'barramundi': 'https://www.abc.net.au/news/image/9320982-3x2-700x467.jpg',
        'barred_cheek_coral_trout': 'https://app.fisheries.qld.gov.au/images/barred-cheek-coral-trout-2.jpg',
        'giant_trevally': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Caranx_ignobilis.jpg/1200px-Caranx_ignobilis.jpg',
        'diamond_scale_mullet': 'https://us.123rf.com/450wm/aozz85/aozz851708/aozz85170800005/83943872-diamond-scale-mullet-liza-vaigiensis-also-known-as-diamond-scaled-mullet-squaretail-mullet-blackfin-.jpg?ver=6',
        'mahi_mahi': 'https://cdn-tp2.mozu.com/15440-22239/cms/files/7bb4f59f-02ae-4a62-a788-f985f0951012?maxWidth=960&quality=75&_mzcb=_1536869987056',
        'wahoo': 'https://www.fishingcairns.com.au/wp-content/uploads/2017/05/Wahoo-e1510617727696.jpg',
    }
    for name, url in names_to_urls.items():
        path = os.path.join(args.path, name)
        if not os.path.isdir(path):
            os.makedirs(path)

        try:
            digest, file_ext, path = download_image(url, path)
            print("Downloaded", url, "to", path)
        except Exception as e:
            print("[INFO] error downloading %s" % url)
            print(e)

def parse_args():
   parser = argparse.ArgumentParser(description='Downloads the benchmark dataset used to compare the model running on a server and on a device.') 
   parser.add_argument('--path', help='the path to save the images to.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'benchmark'))
   return parser.parse_args()

if __name__ == '__main__':
    main()
