import os
import argparse
import json
from utils import read_lines, get_file_ext, download_image, sha256_digest


if __name__ == "__main__":
    argParser = argparse.ArgumentParser()
    argParser.add_argument("urls_file", help="The file that contains the line delimited URLs.")
    argParser.add_argument("output_dir", help="The directory to output files to.")

    args = vars(argParser.parse_args())

    urls = read_lines(args["urls_file"])

    #download_image("http://www.ecofilms.com.au/wp-content/uploads/2012/04/Barramundi-grown-in-aquaponics-e1335677100567.jpg", args["output_dir"])

    output_dir = args["output_dir"]
    if not os.path.isdir(output_dir):
        os.makedirs(output_dir)

    digests_to_images = {}
    for url in urls:
        try:
            digest, file_ext, path = download_image(url, output_dir)
            digests_to_images[digest] = { "url": url, "digest": digest, "fileExtension": file_ext }
            #print("Downloaded", url, "to", path)
        except Exception as e:
            print("[INFO] error downloading %s" % url)
            print(e)

    json_file_path = os.path.sep.join([output_dir, "data.json"])
    with open(json_file_path, "w") as f:
        f.write(json.dumps(list(digests_to_images.values())))
    print("Wrote JSON data to", json_file_path)
