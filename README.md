# Fishpic

Fishpic is a React Native Android app that helps Australian fishermen to identify different fish species. It is available on https://play.google.com/store/apps/details?id=com.fishapp. Fishpic uses Tensorflow to run a Mobilenet V2 neural network to identity 72 fish species with a validation accuracy of 80.2%.

This repository also contains a custom image labelling tool called Fishpic Console. Fishpic Console was built with React, AWS Lambda and Amazon DynamoDB.

## Folders

Here's a description of the different folders in this repository:

FishApp - The React Native App that identifies fish.

data - various different JSON and CSV files that contain data about different fish species.

fishpic-api - The Back End API for a custom image labelling web app that I built to identity images taken by real users. It is powered by AWS Lambda and DynamnoDB.

fishpic-console - The Front End app for the custom image labelling web app that was built with React.

scraping - a bunch of scripts I used for web scraping the images I used to train the neural network.

training - the scripts used to train and evaulate the neural networks that identity fish.

transformation - the scripts use to transform the scraped images into a folder structure that is used to train the neural networks.

visual\_designs - the logo files for Fishpic.

yolo - an experiment to attempt to use a Yolo model to find fish using bounding boxes to help improve model accuracy. This experiment wasn't a success.

## Setup

Certain bash scripts and python scripts need the `FISHPIC_DATASETS_PATH` and `DERIVED_DATASETS_PATH` environment variables set to the directory that will contain all Fishpic dataset files and all Fishpic derived dataset files respectively. If both variables are not set, an error will occur when running certain scripts.

The Fishpic dataset files are not included in this repository.

## Deployment

To compile the Android APK to deployed to the Google Play Store, go to `/FishApp/android/` and run `./gradlew assembleRelease`.

The create APK file will be located in: `/FishApp/android/app/build/outputs/apk/release`.

## Scraping

To create a dataset for a some new species:

1. Run `python3 scraping/download_bing_images_search_urls.py` to get Image URLs from Bing.
2. Run `python3 scraping/download_noisy_images.py` to download all of the URLs.

Now you will have downloaded all bing search images for the given scientific names.

## Dataset creation

1. Run `python3 transformation/change_class_names.py` to change the class names from scientific names to official class names.
2. Run `python3 training/filter_all_species_dataset_with_fnf.py` to filter out the non Fish images.
3. Run `python3 training/transform_dataset.py` to create the final Fishpic dataset.

## Add new attributions to Fishpic

1. Update the FishProfileImages Google document.
2. Download it as a CSV file to `/data/fish_profile_images.csv`.
3. Run `python trainsformation/convert_csv_to_json.py data/fish_profile_images.csv FishApp/assets/fish_profile_images.json`.

Now the app will have the latest version of the attributions.

## Misc

### iOS Tensorflow compiliation notes

Ideas: currently, I can get the tf_camera_example to compile with the static TF library, but it still receives the same kernel error as before. So either Xcode is not using my compiled static TF library, or I compiled the library incorrectly and it lacks the necessary ops/kernels.

When adding the static Tensorflow library a file to an Xcode workspace, if you get an error like `ld: library not found for -ltensorflow-core` then you need to a two items to the Other Linker Flags in Xcode: -L and path to the directory that contains the static Tensorflow library a file.
