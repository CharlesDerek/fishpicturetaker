import argparse
import json

def main():
    args = parse_args()
    print("Reading JSON file")
    fishes = None
    with open(args.json_path, "r") as f:
    	fishes = json.loads(f.read())

    print("Writing to text file")
    with open(args.output_path, "w") as f:
        for fish in fishes:
            f.write(fish['ScientificName'] + "\n")

def parse_args():
    parser = argparse.ArgumentParser(description='Extract the scientific names out of a JSON file to later use to search for Bing Images.')
    parser.add_argument('--json_path', help='the path to the fish json file.', default='../../FishApp/assets/fish.json')
    parser.add_argument('--output_path', help='the path to output the URLs files.', default='./scientific_names.txt')
    return parser.parse_args()

if __name__ == '__main__':
    main()
