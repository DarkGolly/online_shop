#!/bin/bash

# Define the directory containing the files
DIR="db/images"

# Move into the directory
cd "$DIR"

# Manual translations
declare -A translations
translations["glass_iPhone_12.jpg"]="Glass iPhone 12.jpg"
translations["Защитное стекло iPhone 14.jpg"]="Protective Glass iPhone 14.jpg"
translations["Наушники Apple AirPods Pro.jpg"]="Apple AirPods Pro Headphones.jpg"
translations["Чехол для IPhone 14.jpg"]="Case for iPhone 14.jpg"
translations["headphones_wired.jpg"]="Wired Headphones.jpg"
translations["Защитное стекло iPhone 15.jpg"]="Protective Glass iPhone 15.jpg"
translations["Чехол для IPhone 12.jpg"]="Case for iPhone 12.jpg"
translations["Чехол для IPhone 15.jpg"]="Case for iPhone 15.jpg"
translations["Защитное стекло iPhone 13.jpg"]="Protective Glass iPhone 13.jpg"
translations["Наушники Apple AirPods.jpg"]="Apple AirPods Headphones.jpg"
translations["Чехол для IPhone 13.jpg"]="Case for iPhone 13.jpg"

# Renaming process
for file in "${!translations[@]}"; do
    if [[ -f "$file" ]]; then
        mv "$file" "${translations[$file]}"
        echo "Renamed $file to ${translations[$file]}"
    else
        echo "File $file does not exist"
    fi
done
