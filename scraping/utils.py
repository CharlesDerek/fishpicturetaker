import os
import re
import argparse
import requests
from urllib.parse import urlparse
import hashlib
import imghdr
import magic
import mimetypes
import asyncio
import aiohttp


def read_lines(file_path):
    with open(file_path) as f:
        return f.read().strip().split("\n")

# TODO: Delete this method and use the async version below.
def download_image(url, output_dir):
    headers = {"User-Agent": "single threaded web scraping script."}
    r = requests.get(url, timeout=60, headers=headers)
    digest = sha256_digest(r.content)
    file_ext = get_file_ext(r.url, r.content, r.headers)
    if file_ext == None:
        raise Exception("Image could not be identified.")
    elif file_ext == "htm" or file_ext == "html":
        raise Exception("Html file was downloaded.")
    file_name = "%s.%s" % (digest, file_ext)
    path = os.path.sep.join([output_dir, file_name])
    if not os.path.isfile(path):
        f = open(path, "wb")
        f.write(r.content)
        f.close()
    return digest, file_ext, path

semaphore = asyncio.Semaphore(10)

async def download_image_async(url, output_dir):
    headers = {"User-Agent": "single threaded web scraping script."}
    async with semaphore:
        async with aiohttp.ClientSession() as session:
            r = await session.get(url, timeout=60, headers=headers)
            content = await r.read()
            digest = sha256_digest(content)
            file_ext = get_file_ext(url, content, r.headers)
    if file_ext == None:
        raise Exception("Image could not be identified.")
    elif file_ext == "htm" or file_ext == "html":
        raise Exception("Html file was downloaded.")
    file_name = "%s.%s" % (digest, file_ext)
    path = os.path.sep.join([output_dir, file_name])
    print("Saving to", path)
    if not os.path.isfile(path):
        f = open(path, "wb")
        f.write(content)
        f.close()
    return digest, file_ext, path

def get_file_ext(url, content, headers):
    ignored_param = ''
    ext_index = 1
    mime_type = magic.from_buffer(content, mime=True)
    file_ext = mimetypes.guess_extension(mime_type) \
        or imghdr.what(ignored_param, content) \
        or mimetypes.guess_extension(headers["content-type"]) \
        or os.path.splitext(url)[ext_index][1:]
    #print(mimetypes.guess_extension(mime_type))
    #print(imghdr.what(ignored_param, content))
    #print(mimetypes.guess_extension(headers["content-type"]))
    #print(os.path.splitext(url)[ext_index][1:])

    if file_ext.startswith("."):
        file_ext = file_ext[1:]

    if "?" in file_ext:
        file_ext = file_ext[:file_ext.index("?")]

    if file_ext in ["jpeg", "jpe"]:
        return "jpg"
    elif file_ext == "":
        return None
    else:
        return file_ext

def sha256_digest(data):
    return hashlib.sha256(data).hexdigest()
