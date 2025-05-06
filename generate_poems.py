#!/usr/bin/python3

import os
import json

def generate_poem_json(input_directory, output_file, file_extension=".txt"):
    """
    Reads poem files from a directory and generates a JSON array
    in the specified format.

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
        title = os.path.splitext(filename)[0] # Get filename without extension
        lines = []

        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                # Read lines and strip trailing whitespace (including newline)
                lines = [line.rstrip() for line in f]

            poem_data = {
                "id": poem_id_counter,
                "title": title,
                "lines": lines,
                # Default empty tags list, as input files don't contain tag info
                "tags": []
            }

            poems_list.append(poem_data)
            poem_id_counter += 1

        except Exception as e:
            print(f"Error processing file {filename}: {e}")
            # Continue processing other files even if one fails

    # Write the list of poems to a JSON file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            # Use json.dump with indent for pretty printing and ensure_ascii=False
            # to handle non-ASCII characters like Hindi correctly.
            json.dump(poems_list, f, indent=2, ensure_ascii=False)
        print(f"Successfully generated JSON file: {output_file}")

    except Exception as e:
        print(f"Error writing output JSON file {output_file}: {e}")

# --- How to use the script ---

# 1. Create a directory (e.g., "poems") and place your poem files inside.
#    Each file should contain one poem.
#    Example: poems/ poem1.txt, poems/poem2.txt

# 2. Specify the directory where your poem files are located:
input_dir = "poems" # <-- Change this to your directory path

# 3. Specify the name for the output JSON file:
output_json_file = "poems_output.json" # <-- Change this if needed

# 4. Specify the file extension of your poem files:
poem_file_extension = "" # <-- Change this if your files have a different extension

# Run the function
generate_poem_json(input_dir, output_json_file, poem_file_extension)
