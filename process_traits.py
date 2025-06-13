import json
import os

def process_traits_output(traits_output_file='outgoing_data.txt'):
    """
    Process the output file from traits.py to extract personality scores.
    
    Returns:
        trait_scores: Dictionary of trait scores
    """
    try:
        # Check if file exists
        if not os.path.exists(traits_output_file):
            return None
            
        # Try to get the most recent trait scores from the outgoing_data.txt file
        with open(traits_output_file, 'r') as f:
            content = f.read()
            
        # Find the last occurrence of FINAL PERCENTAGES
        last_percentages_idx = content.rfind('FINAL PERCENTAGES = ')
        if last_percentages_idx == -1:
            return None
            
        # Extract the JSON-like string
        json_str = content[last_percentages_idx:].split('FINAL PERCENTAGES = ')[1].split('\n\n')[0]
        
        # Handle various formats: either direct dictionary or string representation
        try:
            if '{' in json_str:
                # Try to parse as dictionary string
                trait_scores = eval(json_str)
            else:
                # If it's not in dictionary format, try something else
                return None
                
            # Remove "Overall Score" if present (we only need traits)
            if 'Overall Score' in trait_scores:
                trait_scores.pop('Overall Score', None)
                
            # Also remove any recommended job category if present
            if 'Recommended Job Category' in trait_scores:
                trait_scores.pop('Recommended Job Category', None)
                
            return trait_scores
            
        except Exception:
            return None
            
    except Exception as e:
        print(f"Error processing traits output: {e}")
        return None