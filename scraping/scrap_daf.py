import re
import json
from bs4 import BeautifulSoup
import requests

def scrape_urls(urls):
    species = []
    for url in urls:
        print("Scraping", url)
        r = requests.get(url)
        data = r.text
        soup = BeautifulSoup(data, 'html5lib')
        content_div = single(soup.find_all('div', {"role": "main"}))
        results = content_div.find_all("table")
        if len(results) == 1:
            s = extract_species(content_div, results[0])
            s["sourceUrl"] = url
            species.append(s)
        elif len(results) == 0:
            headers = [x for x in content_div.find_all('h1') if not (x.has_attr('class') and x.attrs['class'][0] == 'qg-visually-hidden')]
            # If the page is missing, skip the URL so you don't enter an infinite loop.
            if headers[0].get_text() == "Species Not Found":
                continue
            scraped_urls = get_urls(content_div)
            species = species + scrape_urls(scraped_urls)
        else:
            raise Exception("Unexpected number of results.")
    return species

def extract_species(content_div, species_table):
    common_name = single(find_one(content_div, "h1", {"class": ""}).contents)
    fields = get_table_fields(species_table)
    #print(fields)
    species = {
        "commonName": common_name,
        "authorityCommonName": common_name,
        "otherNames": fields["Other names"] if "Other names" in fields else None,
        "scientificName": merge_into_one(fields['Scientific name']) if 'Scientific name' in fields else None,
        "imageUrls": get_image_urls(content_div),
        "closedSeasonNotes": None
    }
    species.update(process_size(fields.get("Size limits on takes")))
    species.update(process_possession(fields.get("Possession limits on takes")))
    return species

def merge_into_one(value):
    if isinstance(value, str):
        return value
    else:
        return " ".join(value)

def get_table_fields(table):
    fields = {}
    tbody = find_one_or_none(table, "tbody")
    if tbody != None:
        for tr in tbody("tr", recursive=False):
            name = get_table_field_name(tr)
            value_td_index = 1
            td = tr.find_all("td")[value_td_index]
            fields[name] = get_all_contents(td)
    return fields

def get_table_field_name(tr):
    name_td_index = 0
    th = tr.find_all("td", None)[name_td_index]
    return th.contents[0].strip()

def process_size(texts):
    min_size = None
    max_size = None
    size_notes = None

    if texts != None:
        simple_integer_regex = r"^[^\d+]+(\d+)[^\d]*$" 
        for text in texts:
            text = text.replace("\xa0", " ")
            value = get_int_from_regex(simple_integer_regex, text)
            #print(text, value)
            ignored_texts = ['N/A', '1 greater than 120cm from some dams', '11.5 cm tail minimum, 9cm carapace minimum']

            if text.startswith("Minimum size"):
                if min_size == None:
                    min_size = value
                else:
                    min_size = max(value, min_size)
            elif text.startswith("Maximum size"):
                if max_size == None:
                    max_size = value
                else:
                    max_size = min(value, max_size)
            elif text.startswith('East coast: '):
                if text.endswith('min'):
                    if min_size == None:
                        min_size = value
                    else:
                        min_size = max(value, min_size)
                elif text.endswith('max'):
                    if max_size == None:
                        max_size = value
                    else:
                        max_size = min(value, max_size)
                else:
                    raise Exception("Unexpected text: '%s'." % text) 
            elif text.startswith("Gulf of Carpentaria: "):
                size_notes = text
            elif 'applies' in text:
                size_notes = text
            elif text in ignored_texts or "no size limit" in text or text.startswith('No take') or text.startswith('('):
                pass
            else:
                raise Exception("Unknown text: '%s'." % text) 
    else:
        print("Ignoring species size and posession limits.")

    return {
        "minimumSizeInCentimetres": min_size,
        "maximumSizeInCentimetres": max_size,
        "scrapedSizeNotes": size_notes,
        "scrapedSizeLimits": texts,
    }

def process_possession(texts):
    possession_limit = None
    possession_notes = ''
    has_special_case = False
    is_no_take_species = False

    if texts != None:
        simple_integer_regex = r"^[^\d+]*(\d+)[^\d]*$" 
        for text in texts:
            text = text.replace("\xa0", " ")
            value = get_int_from_regex(simple_integer_regex, text)
            #print(text, value)
            ignored_texts = ['1 during closed season at some dams', '10 litres', ' ', 'includes part thereof']

            if text.startswith("possession limit"):
                possession_limit = value
            elif text == '5':
                possession_limit = 5
            elif 'combined' in text or "combination of" in text or "with no more than" in text \
                    or text.startswith("Gulf of Carpentaria: "):
                has_special_case = True
                possession_notes += text
                if possession_limit == None:
                    possession_limit = value
            elif text in ignored_texts:
                pass
            elif "returned" in text or "NO TAKE species" in text:
                has_special_case = True
            elif text.startswith('A possession limit of ') or 'accidentally' in text or text.startswith('not included') \
                    or text.startswith('(') or text.startswith('Protected species') or text.startswith('Due to their restricted') \
                    or 'prohibited' in text:
                possession_notes += text
            elif text.startswith('East coast: '):
                possession_limit = value
            elif text.startswith('No take'):
                is_no_take_species = True
                has_special_case = True
                if text != 'No take':
                    possession_notes += text
            else:
                raise Exception("Unknown text: '%s'." % text) 
    else:
        print("Ignoring species size and posession limits.")

    return {
        "possessionLimit": possession_limit,
        "possessionNotes": None,
        "scrapedPossessionNotes": possession_notes if possession_notes != '' else None,
        "isNoTakeSpecies": is_no_take_species,
        "scrapedPossessionLimits": texts,
        "hasPossessionSpecialCase": has_special_case,
    }

def get_int_from_regex(regex, text):
    matches = re.search(regex, text)
    number_group_index = 1
    return int(matches.group(number_group_index)) if matches != None else None

def get_all_contents(element):
    if len(element.findChildren()) == 0:
        return [element.get_text()]
    else:
        return [child.get_text() for child in element.findChildren() if len(child.findChildren()) == 0 and child.get_text() != '']

def find_one(soup, element, attributes=None):
    results = soup.find_all(element, attributes)
    return single(results)

def find_one_or_none(soup, element, attributes=None):
    results = soup.find_all(element, attributes)
    return single_or_none(results)

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
    assert len(iterable) <= 1
    return iterable[0] if len(iterable) == 1 else None

def get_urls(element):
    urls = []
    for link in element.find_all('a'):
        href = link.get("href")
        if not href is None and not href.startswith("#") and not "rules-regulations" in href:
            urls.append(href)
    return urls

def get_image_urls(element):
    urls = []
    for img in element.find_all("img"):
        urls.append(img.get("src"))
    return urls

def set_hardcoded_values(common_names_to_species):
    common_names_to_species["Amberjack"]["possessionLimit"] = 2
    common_names_to_species["Barramundi"]["possessionLimit"] = 5
    common_names_to_species["Barramundi"]["minimumSizeInCentimetres"] = 58
    common_names_to_species["Barramundi"]["maximumSizeInCentimetres"] = 120
    common_names_to_species["Blackspotted rockcod (estuary)"]["minimumSizeInCentimetres"] = 38
    common_names_to_species["Blackspotted rockcod (estuary)"]["maximumSizeInCentimetres"] = 120
    common_names_to_species["Snapper"]["possessionLimit"] = 4
    common_names_to_species["Blue threadfin"]["possessionLimit"] = 10

    flathead_family_pn = "This is a combined limit for all flathead except for dusky flatheads."
    garfish_family_pn = "This is a combined limit for all garfish."
    trout_family_pn = "This is a combined limit of 7 for all trout."
    coral_reef_fin_fish_pn = "There is also a total possession limit of 20 for all Coral Reef Fin fish."
    cods_and_groupers_pn = "There is a combined limit of 5 for all cods and groupers."
    estuary_cod_pn = "This is not a Coral Reef Fin Fish unlike most other cod species."
    specific_seabream_pn = "This is a combined limit for pikey bream, yellowin bream and tarwhine."
    samsomfish_and_amberjack_pn = "This is a combined limit for Samsonfish and Amberjack."
    carangidae_exception_pn = "This fish is not included in the combined posession limit that applies to most of the Carangidae fish family (most travallies, queenfishes, scads, darts and kingfishes)."
    carangidae_family_pn = "This fish is included in the combined posession limit that applies to most of the Carangidae fish family."
    certain_whiting_pn = "This is a combined possession limit for Goldline whiting, Sand whiting, and Northern whiting."
    common_names_to_possession_notes = {
        "Australian bass": "Australian Bass have a closed season from the 1st of June to the 31st of August in Queensland tidal waters only.",
        "Barramundi": "Barramundi have a closed season from Midday of the 1st of November to Midday of the 1st of February.",
        "Northern sand flathead": flathead_family_pn,
        "Bartailed flathead": flathead_family_pn,
        "Yellowtailed flathead": flathead_family_pn,
        "Dusky flathead": "This limit is not included in the combined limit for all other flathead.",
        "River garfish": garfish_family_pn,
        "Snubnose garfish (freshwater and tidal)": garfish_family_pn,
        "Three-by-two garfish": garfish_family_pn,
        "Barred-cheek coral trout": trout_family_pn + " " + coral_reef_fin_fish_pn,
        "Barred javelin": "For the Gulf of Carpentaria only, the following limits apply: 10 whole fish or 20 filets.",
        "Black jewfish": "For the Gulf of Carpentaria only, there is a minimum size of 60cm and a possesion limit of 2.",
        "Goldspotted rockcod (estuary)": cods_and_groupers_pn + " " + estuary_cod_pn,
        "Blackspotted rockcod (estuary)": cods_and_groupers_pn + " " + estuary_cod_pn,
        "Snapper": "There is a possession limit of 4 with no more than 1 over 70cm.",
        "Yellowfin bream": specific_seabream_pn,
        "Pikey bream": specific_seabream_pn,
        "Tarwhine": specific_seabream_pn,
        "Blue threadfin": "The possession limit is 20 only in the Gulf of Carpentaria.",
        "Samsonfish": samsomfish_and_amberjack_pn + " " + carangidae_exception_pn,
        "Amberjack": samsomfish_and_amberjack_pn + " " + carangidae_exception_pn,
        "Highfin amberjack": samsomfish_and_amberjack_pn + " " + carangidae_exception_pn,
        "Giant queenfish": carangidae_exception_pn,
        "Barred queenfish": carangidae_family_pn,
        "Giant trevally": carangidae_family_pn,
        "Bigeye trevally": carangidae_family_pn,
        "Blackbanded amberjack": carangidae_family_pn,
        # Commented out because it no longer exists in the new DAF website.
        #"Golden trevally": carangidae_family_pn,
        "Lesser queenfish": carangidae_family_pn,
        "Needleskin queenfish": carangidae_family_pn,
        "Small spotted dart": carangidae_family_pn,
        "Swallow-tailed dart": carangidae_exception_pn,
        "Snub-nosed dart": carangidae_family_pn,
        "Yellowtail kingfish": carangidae_exception_pn,
        "Goldline whiting": certain_whiting_pn,
        "Northern whiting": certain_whiting_pn,
        "Sand whiting": certain_whiting_pn,
    }
    for common_name, possession_notes in common_names_to_possession_notes.items():
        common_names_to_species[common_name]["possessionNotes"] = possession_notes

def create_csv_files(species, dataset_path):
    for s in species:
        path = "%s/URLs/%s.csv" % (dataset_path, s["commonName"])
        with open(path, "w") as f:
            f.write("URLs")
            for url in s["ImageUrls"]:
                f.write("\n" + url)
        print("Created", path)

if __name__ == "__main__":
    urls = [
        "https://www.daf.qld.gov.au/fish-identification-information/fish-species-guide/fish-species-id-info",
        #"https://www.daf.qld.gov.au/fish-identification-information/fish-species-guide/fish-species-id-info/profile?fish-id=concave-flathead-goby",
        #"https://www.daf.qld.gov.au/fish-identification-information/fish-species-guide/fish-species-id-info/profile?fish-id=goldspotted-rockcod-estuary"
    ]
    species = scrape_urls(urls)
    #print(species)
    # Remove duplicates
    common_names_to_species = {s["commonName"]: s for s in species}
    set_hardcoded_values(common_names_to_species)
    species = list(common_names_to_species.values())

    # Disable this since we manually scrape these images any way.
    #create_csv_files(species, dataset_path)
    json_file_path = "../data/daf_fish.json"
    with open(json_file_path, "w") as text_file:
        json.dump(species, text_file)
    print("Created", json_file_path)
