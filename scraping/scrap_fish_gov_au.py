import requests
import re
import json
import os
from bs4 import BeautifulSoup
from scrap_urls import download_image
from os.path import join


protocol_and_domain = "http://www.fish.gov.au"

def scrape_urls(urls):
    species_urls = get_species_urls(urls)
    print("Number of species", len(species_urls))
    return list(map(lambda a: get_species(a), species_urls))

def get_species_urls(jurisdiction_urls):
    species_urls = set()
    for url in jurisdiction_urls:
        content_div = get_content(url)
        report = single(content_div.find_all('div', {"class": "sustainability-report"}))
        anchors = single(report.find_all("ul", {"class": "clearfix"})).find_all("a")
        species_urls.update(map(get_page_url, anchors))
    return list(species_urls)

def get_page_url(anchor):
    href = anchor.get("href")
    return protocol_and_domain + re.sub("\?jurisdictionId=\d+", "", href)

def get_species(url):
    content_div = get_content(url)
    common_name = single(content_div.find_all('h2', {"class": "maintitle"})).get_text()
    scientific_name = single(content_div.find_all('p', {"class": "subtitle"})).get_text()
    gallery = single_or_none(content_div.find_all('div', {"class": "gallery"}))
    image_urls = []
    if gallery != None:
        image_urls = list(map(lambda a: protocol_and_domain + a.get("href"), gallery.find_all("a", {"class": "image"})))
    return {
        "CommonName": common_name,
        "ScientificName": scientific_name,
        "ImageUrls": image_urls,
        "Url": url
    }

def get_content(url):
    print("Scraping", url)
    r = requests.get(url)
    data = r.text
    soup = BeautifulSoup(data, 'html5lib')
    content_div = single(soup.find_all('div', {"class": "content"}))
    return content_div

def find_one(soup, element, attributes=None):
    results = soup.find_all(element, attributes)
    return single(results)

def find_one_of(element, selector_tuples):
    for element_type, attributes in selector_tuples:
        results = element.find_all(element_type, attributes)
        if len(results) == 1:
            return single(results)
    return None

def single(iterable):
    assert len(iterable) == 1
    return iterable[0]

def single_or_none(iterable):
    return iterable[0] if len(iterable) == 1 else None

def get_class_name(common_name):
    class_name = s["CommonName"].replace(" ", "_").lower()
    corrections = { "golden_snapper": "golden_snapper_fingermark" }
    if class_name in corrections:
        return corrections[class_name]
    else:
        return class_name

if __name__ == "__main__":
    urls = [
        "http://www.fish.gov.au/Jurisdiction/Commonwealth",
        "http://www.fish.gov.au/Jurisdiction/New-South-Wales",
        "http://www.fish.gov.au/Jurisdiction/Queensland",
        "http://www.fish.gov.au/Jurisdiction/South-Australia",
        "http://www.fish.gov.au/Jurisdiction/Tasmania",
        "http://www.fish.gov.au/Jurisdiction/Victoria",
        "http://www.fish.gov.au/Jurisdiction/Western-Australia",
        "http://www.fish.gov.au/Jurisdiction/Northern-Territory",
    ]
    test_urls = [
    ]
    species = scrape_urls(urls)

    dataset_path = os.path.join(os.environ['FISHPIC_DATASETS_PATH'], "fish.gov.au")
    json_file_path = join(dataset_path, "species.json")
    with open(json_file_path, "w") as text_file:
        json.dump(species, text_file)
    print("Created", json_file_path)

    print("Downloading images")
    for s in species:
        class_name = get_class_name(s["CommonName"])
        species_dir = join(dataset_path, class_name)
        if not os.path.isdir(species_dir):
            os.makedirs(species_dir)
        for image_url in s["ImageUrls"]:
            download_image(image_url, species_dir) 
    print("Finished")
