import re
import json
from bs4 import BeautifulSoup
import requests

def scrape_urls(urls):
    scientific_names = []
    for url in urls:
        print("Scraping", url)
        r = requests.get(url)
        data = r.text
        soup = BeautifulSoup(data, 'html5lib')
        table = single(soup.find_all('table', {"class": "commonTable"}))
        results = table.find_all("i")
        if len(results) != 0:
            scientific_names = scientific_names + extract_names(results)
        else:
            raise Exception("URL has no names.")
    return scientific_names

def extract_names(elements):
    return list(map(lambda a: a.contents[0], elements))

def single(iterable):
    assert len(iterable) == 1
    return iterable[0]

if __name__ == "__main__":
    urls = [
        "http://www.fishbase.org/ListByLetter/ScientificNamesA.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesB.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesC.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesD.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesE.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesF.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesG.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesH.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesI.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesJ.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesK.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesL.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesM.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesN.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesO.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesP.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesQ.Htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesR.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesS.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesT.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesU.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesV.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesW.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesX.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesY.htm",
        "http://www.fishbase.org/ListByLetter/ScientificNamesZ.htm",
    ]

    scientific_names = sorted(scrape_urls(urls))
    print(scientific_names)

    output_file_path = "./fish_scientific_names.txt"
    with open(output_file_path, "w") as text_file:
        for name in scientific_names:
            text_file.write("%s\n" % name)
    print("Created", output_file_path)

