import argparse
import logging
import os
import sys
import urllib
import math
import requests
from collections import Counter
import asyncio
import aiohttp
import itertools
from utils import download_image_async
from PIL import Image


async def main():
    args = parse_args()
    species_to_urls = await get_species_to_urls(args.urls_dir)
    await download_species_urls(species_to_urls, args.output_dir)
    print("Finished")

def parse_args():
    parser = argparse.ArgumentParser(description='Download all noisy images from all URL files.')
    parser.add_argument('--urls_dir', help='the directory path that contains the url files.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'noisy_web_urls'))
    parser.add_argument('--output_dir', help='the path to output the noisy web images.', default=os.path.join(os.environ['FISHPIC_DATASETS_PATH'], 'noisy_web_images'))
    return parser.parse_args()

async def get_species_to_urls(urls_dir):
    species_to_urls = {}
    for file_name in os.listdir(urls_dir):
        if file_name.endswith(".txt"):
            with open(os.path.join(urls_dir, file_name), "r") as f:
                urls = set([x.strip() for x in f])
                species = os.path.splitext(file_name)[0]
                species_to_urls[species] = urls
    return species_to_urls
    
async def download_species_urls(species_to_urls, output_dir):
    all_urls = list(itertools.chain.from_iterable(species_to_urls.values()))
    ambiguous_urls = set([url for url, count in Counter(all_urls).items() if count > 1])
    print("All URLs:", len(all_urls), "ambiguous URLs:", len(ambiguous_urls), "percentage:", len(ambiguous_urls) / len(all_urls) * 100.0)

    digests_to_paths = {}
    for species, urls in sorted(species_to_urls.items()):
        print("\n", species, len(urls), "\n")
        filtered_urls = urls - ambiguous_urls # remove all URLs that show up in more than one species.
        if len(filtered_urls) == 0:
            print("All URLs for %s are ambiguous." % species)
            continue
        species_dir = os.path.join(output_dir, species)
        if os.path.isdir(species_dir):
            print("%s already downloaded." % species)
            continue
        os.makedirs(species_dir)

        results = await download_urls(filtered_urls, species_dir)
        for digest, path in results:
            if digest == None:
                pass
            elif digest in digests_to_paths:
                print("Digest %s already exists." % digest)
                if os.path.isfile(path):
                    os.remove(path)

                if os.path.isfile(digests_to_paths[digest]):
                    os.remove(digests_to_paths[digest])
            else:
                digests_to_paths[digest] = path

async def download_urls(urls, output_dir):
    return await asyncio.gather(*[download_and_convert_image(url, output_dir) for url in urls])

async def download_and_convert_image(url, output_dir):
    try:
        digest, file_ext, path = await download_image_async(url, output_dir)
        print("Downloaded", url)
    except Exception as e:
        print("Error downloading", url, file=sys.stderr)
        print(e, file=sys.stderr)
        return None, None

    if file_ext == "jpg": # Ignore the "jpeg" file extension to have a consistent output.
        return digest, path
    else:
        print("Converting", path)
        output_path = os.path.join(output_dir, "%s.jpg" % digest)
        try:
            im = Image.open(path).convert('RGBA')
            im.save(output_path)
        except OSError:
            print("Failed to convert image %s" % path)
        except ValueError as ve:
            print("Failed to convert image %s due to ValueError %s" % (path, ve))
        os.remove(path)
        return digest, output_path

if __name__ == "__main__":
    logging.getLogger().setLevel(logging.DEBUG)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.wait([main()]))
    loop.close()
