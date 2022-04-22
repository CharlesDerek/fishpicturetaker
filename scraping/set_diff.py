import os
import argparse

argParser = argparse.ArgumentParser()
argParser.add_argument("first_file", help="The first text file.")
argParser.add_argument("second_file", help="The second text file.")

args = vars(argParser.parse_args())

def get_set(file_path):
    return set(open(file_path).read().strip().split("\n"))

first_set = get_set(args["first_file"])
second_set = get_set(args["second_file"])

intersection = first_set.intersection(second_set)
first_only = first_set.difference(second_set)
second_only = second_set.difference(first_set)

def write_to_file(file_path, iterable):
    with open(file_path, "w") as f:
        for line in iterable:
            f.write(line + "\n")

write_to_file("first_only.txt", first_only)
write_to_file("second_only.txt", second_only)

print("intersection:", len(intersection))
print("first only:", len(first_only))
print("second only:", len(second_only))
