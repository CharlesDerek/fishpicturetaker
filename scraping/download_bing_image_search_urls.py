import argparse
import os
import urllib
import math
import requests

QUERY_COUNT = 150

def main():
    args = parse_args()
    if not os.path.isdir(args.output_dir):
        os.makedirs(args.output_dir)

    requests_limit = 3000
    n_requests = 0

    with open(args.search_phrases_path, "r") as f:
        for line in f:
            search_phrase = line.strip()
            file_path = os.path.join(args.output_dir, "%s.txt" % search_phrase)
            if os.path.isfile(file_path):
                print("Already downloaded", search_phrase)
                continue
            urls = bing_image_search(search_phrase)
            if len(urls) != 0:
                save_urls(file_path, urls)

            print("%s: %s" % (search_phrase, len(urls)))
            n_species_requests = int(math.ceil(len(urls) / QUERY_COUNT))
            n_requests += n_species_requests if n_species_requests != 0 else 1
            if n_requests >= requests_limit:
                print("Hit request limit.")
                break
    
    print("Number of requests sent: %s" % n_requests)

def parse_args():
    parser = argparse.ArgumentParser(description='Download all image queries for a given list of search phrases.')
    parser.add_argument('--search_phrases_path', help='the path to the search phrases file where each line contains one search phrase.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'scientific_names', 'fish_scientific_names.txt'))
    parser.add_argument('--output_dir', help='the path to output the URLs files.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'noisy_web_urls'))
    return parser.parse_args()

def bing_image_search(search, offset = 0, limit = 10000):
    if offset >= limit:
        return []

    data = send_search_request(search, offset)
    if "message" in data:
        raise Exception("Bing Image Search message: %s" % data["message"])

    urls = list(map(lambda a: a["contentUrl"], data["value"]))
    
    if len(urls) == 0:
        return urls
    elif data["nextOffset"] is not None and data["nextOffset"] < data["totalEstimatedMatches"]:
        return urls + bing_image_search(search, data["nextOffset"], limit)
    else:
        return urls 

def send_search_request(search, offset):
    host = 'api.cognitive.microsoft.com'
    path = '/bing/v7.0/images/search'
    queryParams = {
        'q': search,
        'offset': offset,
        'count': QUERY_COUNT
    }
    url = "https://" + host + path + '?' + urllib.parse.urlencode(queryParams)
    subscriptionKey = '779f909a1cfc49569a7af883868da987'
    headers = {
      'Content-Type': "applicationjson; charset=utf-8",
      'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
    r = requests.get(url, headers=headers)
    return r.json()

def save_urls(path, urls):
    with open(path, "w") as f:
        for url in sorted(set(urls)):
            f.write(url + "\n")

if __name__ == "__main__":
    main()
