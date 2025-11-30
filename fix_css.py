
import os

path = r"c:\Edumate_AI\skillforge\app\globals.css"
try:
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    print(f"Total lines: {len(lines)}")
    
    # Check if the file is indeed 937 lines (or close)
    if len(lines) < 900:
        print("File is smaller than expected, aborting.")
        exit(1)

    # We want to keep lines 1-720 (indices 0-719)
    # And lines 916-end (indices 915-end)
    # The garbage is from index 720 to 914.
    
    # Verify start of garbage
    print(f"Line 721 (Index 720): {lines[720].strip()}")
    # Verify end of garbage
    print(f"Line 915 (Index 914): {lines[914].strip()}")
    # Verify start of good code
    print(f"Line 916 (Index 915): {lines[915].strip()}")

    new_lines = lines[:720] + lines[915:]
    
    print(f"New line count: {len(new_lines)}")

    with open(path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
    print("File updated successfully.")

except Exception as e:
    print(f"Error: {e}")
