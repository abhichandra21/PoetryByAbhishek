#!/usr/bin/python3

import os
import json
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

def generate_poem_json(input_directory, output_file, file_extension=".txt"):
    """
    Reads poem files from a directory and generates a JSON array
    with Hindi text, romanized text, and translated text.

    Args:
        input_directory (str): The path to the directory containing poem files.
        output_file (str): The path where the output JSON file will be saved.
        file_extension (str): The extension of the poem files (e.g., ".txt").
    """
    poems_list = []
    poem_id_counter = 1

    if not os.path.isdir(input_directory):
        print(f"Error: Input directory not found: {input_directory}")
        return

    # Get a sorted list of files to ensure consistent ID assignment
    try:
        filenames = sorted([f for f in os.listdir(input_directory)
                            if f.endswith(file_extension) and os.path.isfile(os.path.join(input_directory, f))])
    except OSError as e:
        print(f"Error listing directory contents: {e}")
        return

    for filename in filenames:
        filepath = os.path.join(input_directory, filename)
        title = os.path.splitext(filename)[0]  # Get filename without extension
        lines = []

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                # Read lines and strip trailing whitespace (including newline)
                lines = [line.rstrip() for line in f]

            # Create romanized title and lines
            romanized_title = romanize_text(title)
            romanized_lines = [romanize_text(line) if line.strip() else line for line in lines]

            poem_data = {
                "id": poem_id_counter,
                "title": title,
                "romanizedTitle": romanized_title,
                # You'll need to manually add these for now
                "translatedTitle": "",  # Add manually or use translation API
                "lines": lines,
                "romanizedLines": romanized_lines,
                # You'll need to manually add these for now
                "translatedLines": [""] * len(lines),  # Add manually or use translation API
                "tags": []  # Add manually later
            }

            poems_list.append(poem_data)
            poem_id_counter += 1

        except Exception as e:
            print(f"Error processing file {filename}: {e}")
            # Continue processing other files even if one fails

    # Write the list of poems to a JSON file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(poems_list, f, indent=2, ensure_ascii=False)
        print(f"Successfully generated JSON file: {output_file}")

    except Exception as e:
        print(f"Error writing output JSON file {output_file}: {e}")

def romanize_text(text):
    """
    Convert Devanagari text to Roman script.
    Returns text as-is if it's already in Roman script.
    """
    if not text:
        return text
    
    try:
        # Use ITRANS scheme which is commonly used for Hindi romanization
        romanized = transliterate(text, sanscript.DEVANAGARI, sanscript.ITRANS)
        
        # Alternative: You can use HK (Harvard-Kyoto) or ISO for different romanization styles
        # romanized = transliterate(text, sanscript.DEVANAGARI, sanscript.HK)
        
        return romanized
    except:
        # If transliteration fails, return original text
        return text

# --- How to use the script ---

# 1. Create a directory (e.g., "poems") and place your poem files inside.
#    Each file should contain one poem.
#    Example: poems/कशमकश.txt

# 2. Specify the directory where your poem files are located:
input_dir = "poems"  # <-- Change this to your directory path

# 3. Specify the name for the output JSON file:
output_json_file = "poems_output.json"  # <-- Change this if needed

# 4. Specify the file extension of your poem files:
poem_file_extension = ""  # <-- Change this if your files have a different extension

# Run the function
generate_poem_json(input_dir, output_json_file, poem_file_extension)