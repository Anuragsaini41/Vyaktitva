import json
import os
import numpy as np
import pandas as pd
from collections import Counter, defaultdict
from sklearn.preprocessing import MinMaxScaler

class TraitDatasetBuilder:
    """
    Comprehensive trait-to-job dataset builder that analyzes questions and trait mappings
    to create high-quality training data for job prediction models.
    """
    
    def __init__(self, questions_path='questions.js', traits_mapping_path='traits_mapping.json', output_dir='.'):
        self.questions_path = questions_path
        self.traits_mapping_path = traits_mapping_path
        self.output_dir = output_dir
        
        # Main trait categories
        self.trait_categories = {
            'Leadership': [],
            'Empathy & Social Skills': [],
            'Strategic Thinking & Problem-Solving': [],
            'Creativity & Innovation': [],
            'Resilience & Adaptability': []
        }
        
        # Job category definitions with trait weights
        self.job_categories = {
            'Creation and Development': {
                'description': 'Roles focused on creating new products, designs, or solutions that require innovation and creativity.',
                'key_traits': ['Creativity & Innovation', 'Strategic Thinking & Problem-Solving'],
                'example_roles': ['Software Developer', 'UX Designer', 'Product Designer', 'R&D Engineer'],
                'trait_weights': {
                    'Leadership': 0.6,
                    'Empathy & Social Skills': 0.4, 
                    'Strategic Thinking & Problem-Solving': 0.9,
                    'Creativity & Innovation': 0.9,
                    'Resilience & Adaptability': 0.6
                }
            },
            'Planning and Administration': {
                'description': 'Roles involving organizational planning, coordination, and structured management.',
                'key_traits': ['Leadership', 'Strategic Thinking & Problem-Solving'],
                'example_roles': ['Project Manager', 'Business Analyst', 'Operations Manager', 'Administrative Director'],
                'trait_weights': {
                    'Leadership': 0.9,
                    'Empathy & Social Skills': 0.5,
                    'Strategic Thinking & Problem-Solving': 0.9,
                    'Creativity & Innovation': 0.6,
                    'Resilience & Adaptability': 0.5
                }
            },
            'Management and Sales': {
                'description': 'Customer-facing and team management roles that require strong interpersonal skills.',
                'key_traits': ['Empathy & Social Skills', 'Resilience & Adaptability'],
                'example_roles': ['Sales Manager', 'Marketing Specialist', 'Account Executive', 'Team Leader'],
                'trait_weights': {
                    'Leadership': 0.6,
                    'Empathy & Social Skills': 0.9,
                    'Strategic Thinking & Problem-Solving': 0.7,
                    'Creativity & Innovation': 0.7,
                    'Resilience & Adaptability': 0.8
                }
            }
        }
        
        # Load data sources
        self.traits_mapping = self._load_traits_mapping()
        self.questions_data = self._extract_questions_data()
        
        # Storage for analysis
        self.trait_distribution = {}
        self.trait_to_category = {}
        self.all_traits = set()
        self.trait_weights = {}
    
    def _load_traits_mapping(self):
        """Load trait mappings from JSON file."""
        try:
            print(f"Loading traits mapping from {self.traits_mapping_path}...")
            with open(self.traits_mapping_path, 'r') as f:
                traits_mapping = json.load(f)
                print(f"Successfully loaded {len(traits_mapping)} trait mappings")
                return traits_mapping
        except Exception as e:
            print(f"Error loading traits mapping: {e}")
            return {}
    
    def _extract_questions_data(self):
        """Extract question data from JavaScript file for analysis."""
        try:
            print(f"Analyzing questions from {self.questions_path}...")
            question_data = {
                'option_count': 0,
                'question_count': 0,
                'option_ids': []
            }
            
            # For a simple analysis, we just extract option IDs from the file
            with open(self.questions_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Very simple extraction of option_ids using string matching
                # This is not robust but gives us some insight
                for line in content.split('\n'):
                    if 'option_id' in line and ':' in line:
                        try:
                            option_id = line.split(':')[1].strip().strip('"').strip("'").strip(',').strip()
                            if option_id.startswith('"') and option_id.endswith('"'):
                                option_id = option_id[1:-1]
                            
                            if option_id and len(option_id) > 3:
                                question_data['option_ids'].append(option_id)
                                question_data['option_count'] += 1
                        except Exception as e:
                            # Skip this line if there's an error
                            pass
            
            # Extract unique question IDs from option IDs
            question_ids = set()
            for option_id in question_data['option_ids']:
                parts = option_id.split('_')
                if len(parts) >= 2:
                    question_id = parts[0] + '_' + parts[1].split('a')[0].split('b')[0].split('c')[0].split('d')[0]
                    question_ids.add(question_id)
            
            question_data['question_count'] = len(question_ids)
            print(f"Found {question_data['option_count']} options across {question_data['question_count']} questions")
            return question_data
            
        except Exception as e:
            print(f"Error extracting question data: {e}")
            return {
                'option_count': 0,
                'question_count': 0,
                'option_ids': [],
                'error': str(e)
            }
    
    def analyze_traits(self):
        """Analyze trait distribution across all options."""
        if not self.traits_mapping:
            print("No traits mapping loaded, cannot analyze traits.")
            return False
        
        print("Analyzing trait distribution...")
        trait_counter = Counter()
        question_trait_map = defaultdict(list)
        
        # Count trait occurrences
        for option_id, traits in self.traits_mapping.items():
            # Extract question ID from option ID
            question_id = '_'.join(option_id.split('_')[:2])
            question_trait_map[question_id].extend(traits)
            
            for trait in traits:
                trait_counter[trait] += 1
                self.all_traits.add(trait)
        
        # Calculate trait diversity per question
        question_diversity = {}
        for question_id, traits in question_trait_map.items():
            unique_traits = set(traits)
            question_diversity[question_id] = len(unique_traits)
        
        # Store analysis results
        self.trait_distribution = {
            'trait_counts': dict(trait_counter),
            'question_diversity': question_diversity,
            'total_unique_traits': len(self.all_traits),
            'question_trait_map': dict(question_trait_map)
        }
        
        print(f"Found {len(self.all_traits)} unique traits across {len(question_trait_map)} questions")
        print("Top 10 most common traits:")
        for trait, count in trait_counter.most_common(10):
            print(f"  {trait}: {count} occurrences")
        
        return True
    
    def categorize_traits(self):
        """Assign each trait to one of the five core dimensions."""
        if not self.all_traits and not self.analyze_traits():
            return False
        
        print("Categorizing traits into five core dimensions...")
        
        # Keywords for categorization by dimension
        category_keywords = {
            'Leadership': [
                'lead', 'manage', 'direct', 'decisive', 'authority', 'vision',
                'confidence', 'bold', 'ambition', 'initiative', 'command',
                'goal', 'drive', 'action', 'achievement', 'assertive'
            ],
            'Empathy & Social Skills': [
                'empathy', 'social', 'team', 'people', 'support', 'collaborate',
                'compassion', 'help', 'communicate', 'relation', 'emotion',
                'trust', 'care', 'understand', 'connect', 'mentor'
            ],
            'Strategic Thinking & Problem-Solving': [
                'strategic', 'problem', 'solution', 'analytical', 'logic', 'plan',
                'process', 'structured', 'system', 'precision', 'data', 'evidence',
                'analyse', 'evaluate', 'optimize', 'rational', 'efficient'
            ],
            'Creativity & Innovation': [
                'creat', 'innov', 'design', 'art', 'novel', 'imagin', 'original',
                'express', 'explore', 'experiment', 'curious', 'invent', 
                'inspir', 'vision', 'idea', 'unique', 'transform'
            ],
            'Resilience & Adaptability': [
                'adapt', 'resil', 'flex', 'endure', 'persist', 'recover',
                'learn', 'change', 'patience', 'tolera', 'cope', 'stable',
                'balance', 'growth', 'evolv', 'adjust', 'strength'
            ]
        }
        
        # Manual mappings for specific traits
        manual_mappings = {
            'Wisdom': 'Leadership',
            'Trust': 'Empathy & Social Skills',
            'Risk-Taking': 'Creativity & Innovation',
            'Focus': 'Strategic Thinking & Problem-Solving',
            'Balance': 'Resilience & Adaptability',
            'Decision Making': 'Leadership',
            'Long-Term Planning': 'Strategic Thinking & Problem-Solving',
            'Efficiency': 'Strategic Thinking & Problem-Solving',
            'Growth': 'Resilience & Adaptability',
            'Team-Building': 'Empathy & Social Skills',
            'Quality Focus': 'Strategic Thinking & Problem-Solving',
            'Self-Awareness': 'Resilience & Adaptability',
            'Confidence': 'Leadership',
            'Integrity': 'Empathy & Social Skills',
            'Passion': 'Creativity & Innovation',
            'Work-Life Balance': 'Resilience & Adaptability',
            'Ambition': 'Leadership',
            'Patience': 'Resilience & Adaptability',
            'Supportive': 'Empathy & Social Skills',
            'Transparency': 'Leadership',
            'Innovation': 'Creativity & Innovation',
            'Structured': 'Strategic Thinking & Problem-Solving',
            'Customer-Oriented': 'Empathy & Social Skills',
            'Result-Oriented': 'Leadership',
            'Analytical Thinking': 'Strategic Thinking & Problem-Solving',
            'Resilient': 'Resilience & Adaptability',
            'Resourcefulness': 'Creativity & Innovation',
            'Team-Oriented': 'Empathy & Social Skills',
            'Curiosity': 'Creativity & Innovation'
        }
        
        # First assign based on manual mappings
        for trait in self.all_traits:
            if trait in manual_mappings:
                category = manual_mappings[trait]
                self.trait_to_category[trait] = category
                self.trait_categories[category].append(trait)
                continue
                
            # Then try keyword matching
            trait_lower = trait.lower()
            matched = False
            
            for category, keywords in category_keywords.items():
                if any(keyword in trait_lower for keyword in keywords):
                    self.trait_to_category[trait] = category
                    self.trait_categories[category].append(trait)
                    matched = True
                    break
            
            # Use most similar category if no direct match
            if not matched:
                # Count keyword partial matches for each category
                scores = {}
                for category, keywords in category_keywords.items():
                    scores[category] = sum(1 for kw in keywords if kw[:3] in trait_lower)
                
                # Select category with highest score, defaulting to Leadership
                best_category = max(scores.items(), key=lambda x: x[1])[0] if any(scores.values()) else 'Leadership'
                self.trait_to_category[trait] = best_category
                self.trait_categories[best_category].append(trait)
        
        # Save the categorizations
        categorized_traits_path = os.path.join(self.output_dir, 'categorized_traits.json')
        with open(categorized_traits_path, 'w') as f:
            json.dump(self.trait_categories, f, indent=2)
        
        print("Trait categorization complete:")
        for category, traits in self.trait_categories.items():
            print(f"  {category}: {len(traits)} traits")
        print(f"Categories saved to {categorized_traits_path}")
        
        return True
    
    def calculate_trait_weights(self):
        """Calculate importance weights for individual traits based on frequency and category."""
        if not self.trait_distribution or not self.trait_to_category:
            if not self.categorize_traits():
                return False
        
        print("Calculating trait importance weights...")
        
        # Get trait counts
        trait_counts = self.trait_distribution.get('trait_counts', {})
        if not trait_counts:
            print("Error: No trait counts available")
            return False
        
        # Calculate weights based on frequency (rarer traits get higher weight)
        max_count = max(trait_counts.values()) if trait_counts else 1
        
        for trait, count in trait_counts.items():
            # Base weight calculation - less frequent traits get slightly higher weights
            frequency_factor = 0.5 + 0.5 * (1 - count/max_count)
            
            # Adjust by category importance
            category = self.trait_to_category.get(trait)
            # All categories have equal base importance (1.0)
            category_factor = 1.0
            
            # Calculate final weight (0-1 scale)
            final_weight = round(frequency_factor * category_factor, 2)
            self.trait_weights[trait] = final_weight
        
        # Save weights to file
        weights_path = os.path.join(self.output_dir, 'trait_weights.json')
        with open(weights_path, 'w') as f:
            json.dump(self.trait_weights, f, indent=2)
        
        print(f"Calculated weights for {len(self.trait_weights)} traits")
        print(f"Trait weights saved to {weights_path}")
        
        return True
    
    def rebuild_trait_dataset(self):
        """Regenerate the dataset.csv with proper trait categorizations."""
        if not self.trait_categories:
            if not self.categorize_traits():
                return False
        
        print("Rebuilding trait category dataset...")
        
        # Build data rows
        data = []
        for category, traits in self.trait_categories.items():
            for trait in traits:
                data.append({'Category': category, 'Trait': trait})
        
        # Create DataFrame and save
        df = pd.DataFrame(data)
        trait_dataset_path = os.path.join(self.output_dir, 'dataset.csv')
        df.to_csv(trait_dataset_path, index=False)
        
        print(f"Rebuilt trait dataset with {len(data)} entries")
        print(f"Saved to {trait_dataset_path}")
        
        return True
    
    def generate_job_dataset(self, samples_per_job=50, variation=0.15, noise=0.05):
        """Generate a realistic job category dataset with proper trait distributions."""
        print(f"Generating job category dataset with {samples_per_job} samples per job...")
        
        # Set random seed for reproducibility
        np.random.seed(42)
        
        data = []
        for job_idx, (job_category, job_info) in enumerate(self.job_categories.items()):
            # Get trait weights for this job
            trait_weights = job_info['trait_weights']
            
            for i in range(samples_per_job):
                datapoint = {}
                
                # Generate trait scores based on weights with controlled variation
                for trait_category, weight in trait_weights.items():
                    # Base value from weight (0-1) scaled to 0-100
                    base_value = weight * 100
                    
                    # Add controlled variation
                    variation_amount = variation * base_value
                    adjusted_value = base_value + np.random.uniform(-variation_amount, variation_amount)
                    
                    # Add small noise for realism
                    noise_amount = noise * 100
                    adjusted_value += np.random.uniform(-noise_amount, noise_amount)
                    
                    # Ensure value stays in range 0-100
                    final_value = max(0, min(100, adjusted_value))
                    
                    # Round to 2 decimal places
                    datapoint[trait_category] = round(final_value, 2)
                
                # Add job category and index
                datapoint['Job Role Category'] = job_category
                datapoint['Vector Value for ML'] = job_idx
                
                data.append(datapoint)
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Add realistic correlations between related traits
        df = self._add_realistic_correlations(df)
        
        # Save dataset
        dataset_path = os.path.join(self.output_dir, 'job_category_dataset.csv')
        df.to_csv(dataset_path, index=False)
        
        print(f"Generated dataset with {len(df)} samples")
        print(f"Dataset saved to {dataset_path}")
        
        return df
    
    def _add_realistic_correlations(self, df):
        """Add realistic correlations between related traits."""
        print("Adding realistic trait correlations...")
        
        # Define related traits with correlation strengths
        related_traits = [
            ('Leadership', 'Strategic Thinking & Problem-Solving', 0.3),
            ('Empathy & Social Skills', 'Resilience & Adaptability', 0.25),
            ('Strategic Thinking & Problem-Solving', 'Creativity & Innovation', 0.2),
            ('Leadership', 'Empathy & Social Skills', 0.15),
            ('Creativity & Innovation', 'Resilience & Adaptability', 0.15)
        ]
        
        # Apply correlations with random variations
        for trait1, trait2, strength in related_traits:
            for idx in df.index:
                # Apply correlation to 80% of samples with random variation
                if np.random.random() < 0.8:
                    value1 = df.at[idx, trait1]
                    value2 = df.at[idx, trait2]
                    
                    # Calculate adjustment with random factor
                    adjustment = strength * (value1 - value2) * np.random.uniform(0.7, 1.3)
                    
                    # Apply adjustment to trait2 based on trait1
                    df.at[idx, trait2] += adjustment
                    
                    # Keep within valid range and round
                    df.at[idx, trait2] = round(max(0, min(100, df.at[idx, trait2])), 2)
        
        return df
    
    def execute_full_pipeline(self):
        """Execute the complete dataset building pipeline."""
        print("Starting complete trait analysis and dataset building pipeline...")
        
        success = True
        success &= self.analyze_traits()
        success &= self.categorize_traits()
        success &= self.calculate_trait_weights()
        success &= self.rebuild_trait_dataset()
        success &= self.generate_job_dataset(samples_per_job=50)
        
        if success:
            print("Dataset building pipeline completed successfully!")
        else:
            print("Dataset building completed with some errors.")
        
        return success

# Execute if run directly
if __name__ == "__main__":
    builder = TraitDatasetBuilder()
    builder.execute_full_pipeline()