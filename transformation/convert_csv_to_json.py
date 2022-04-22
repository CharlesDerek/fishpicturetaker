from utils import convert_csv_into_json
import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='convert a csv file into a json file.')
    parser.add_argument('csv_path', help='the path of the csv file.')
    parser.add_argument('json_path', help='the path of the json file that will be created.')
    args = parser.parse_args()
    convert_csv_into_json(args.csv_path, args.json_path)
