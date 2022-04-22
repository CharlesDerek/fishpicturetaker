import os
import argparse
import json
import csv
from utils import read_lines, get_file_ext, download_image, sha256_digest


def get_csv_rows(file_path):
    with open(file_path, "r") as csv_file:
        reader = csv.reader(csv_file, delimiter=";", quotechar="\"")
        return [row for row in reader]

if __name__ == "__main__":
    argParser = argparse.ArgumentParser()
    argParser.add_argument("urls_file", help="The file that contains the line delimited URLs.")
    argParser.add_argument("output_dir", help="The directory to output files to.")
    args = vars(argParser.parse_args())

    csv_rows = get_csv_rows(args["urls_file"])
    print("Downloading %s images" % len(csv_rows))

    output_dir = args["output_dir"]

    digests_to_images = {}
    for url, class_name, notes in csv_rows:
        if class_name == "":
            class_name = "unknown"
        class_dir = os.path.join(output_dir, class_name)
        if not os.path.isdir(class_dir):
            os.makedirs(class_dir)

        try:
            digest, file_ext, path = download_image(url, class_dir)
            digests_to_images[digest] = { "url": url, "digest": digest, "fileExtension": file_ext }
            #print("Downloaded", url, "to", path)
        except Exception as e:
            print("[INFO] error downloading %s" % url)
            print(e)

    """
    json_file_path = os.path.sep.join([output_dir, "data.json"])
    with open(json_file_path, "w") as f:
        f.write(json.dumps(list(digests_to_images.values())))
    print("Wrote JSON data to", json_file_path)
    """
