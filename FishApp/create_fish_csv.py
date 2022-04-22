import json

with open("assets/fish.json") as json_file:
    fishes = json.load(json_file)

output_file_path = "fishes.csv"
with open(output_file_path, "w") as csv_file:
    csv_file.write("Common Name,Minimum Size,Maximum Size,Possession Limit,Possession Notes,Is No Take Species\n")
    for fish in fishes:
        data = [ fish["CommonName"], fish["MinimumSizeInCentimetres"], fish["MaximumSizeInCentimetres"], fish["PossessionLimit"], fish["PossessionNotes"], fish["IsNoTakeSpecies"] ]
        line = ",".join(map(lambda a: str(a), data))
        csv_file.write(line + "\n")
    print("Created", output_file_path)
