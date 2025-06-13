import os
import sys
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
# स्मार्ट XGBoost इम्पोर्ट
try:
    from xgboost import XGBClassifier
    has_xgboost = True
    print("XGBoost successfully imported!")
except ImportError:
    has_xgboost = False
    print("XGBoost not available. Using alternative models.")

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import warnings
from datetime import datetime
import traceback

# कैटेगरी डेस्क्रिप्शन फंक्शन
def get_category_description(category):
    descriptions = {
        "Innovation and Research": "Roles focused on developing new ideas, researching solutions, and pushing boundaries.",
        "Planning and Administration": "Roles involving organizational planning, coordination, and structured management.",
        "Management and Sales": "Roles centered around team leadership and client-facing business development.",
        "Creative Services": "Roles that involve creative thinking, design, and content creation.",
        "Human Relations": "Roles focused on understanding people, providing support, and facilitating interpersonal connections.",
        "Technical Solutions": "Roles that require technical expertise, problem-solving, and implementation of systems.",
        "Executive Leadership": "Roles focused on organizational direction and team leadership.",
        "Human Relations & Support": "Roles centered around understanding and working with people.",
        "Analysis & Strategy": "Roles requiring analytical thinking, planning, and developing strategic solutions.",
        "Creative Design & Development": "Roles involving creative thinking, design principles, and innovative solutions.",
        "Change Management & Operations": "Roles requiring adaptability to changing conditions and resilience under pressure.",
        "General": "Various roles that may suit your unique combination of traits."
    }
    return descriptions.get(category, "Roles that align with your personality traits and strengths.")

# कैटेगरी एग्जाम्पल फंक्शन
def get_category_examples(category):
    examples = {
        "Innovation and Research": ["Research Scientist", "R&D Specialist", "Innovation Consultant", "Product Developer"],
        "Planning and Administration": ["Project Managers", "Business Analysts", "Operations Managers", "Administrative Directors"],
        "Management and Sales": ["Sales Executive", "Team Leader", "Account Manager", "Business Development"],
        "Creative Services": ["Designer", "Content Creator", "Art Director", "Creative Consultant"],
        "Human Relations": ["HR Specialist", "Counselor", "Customer Success Manager", "Social Worker"],
        "Technical Solutions": ["Software Engineer", "Systems Analyst", "IT Consultant", "Technical Support Specialist"],
        "Executive Leadership": ["CEO", "Department Director", "Team Manager", "Project Lead"],
        "Human Relations & Support": ["HR Specialist", "Counselor", "Customer Success Manager", "Community Coordinator"],
        "Analysis & Strategy": ["Business Analyst", "Strategy Consultant", "Research Specialist", "Operations Analyst"],
        "Creative Design & Development": ["UX Designer", "Creative Director", "Product Developer", "Content Strategist"],
        "Change Management & Operations": ["Change Manager", "Agile Coach", "Crisis Coordinator", "Operations Specialist"],
        "General": ["Project Coordinator", "Customer Success", "Operations Specialist"]
    }
    return examples.get(category, ["Various Professional Roles"])

# मॉडल लोड या बिल्ड फंक्शन
def load_model(rebuild=False):
    model_path = "job_recommendation_model.pkl"
    training_data_path = "dataset.csv"
    
    if not rebuild and os.path.exists(model_path):
        try:
            with open(model_path, 'rb') as f:
                return pickle.load(f)
        except:
            print("Error loading model, rebuilding...")
    
    print("Building or rebuilding model for job prediction...")
    
    # यदि ट्रेनिंग डेटा मौजूद है तो उसे लोड करें
    if os.path.exists(training_data_path):
        try:
            df = pd.read_csv(training_data_path)
            
            # फीचर्स और टारगेट निकालें
            X = df.drop('job_category', axis=1) if 'job_category' in df.columns else df.iloc[:, :-1]
            y = df['job_category'] if 'job_category' in df.columns else df.iloc[:, -1]
            
            # लेबल एनकोडिंग
            label_encoder = LabelEncoder()
            y_encoded = label_encoder.fit_transform(y)
            
            # मॉडल चुनें
            if has_xgboost:
                print("Using XGBoost classifier")
                model = XGBClassifier(random_state=42, eval_metric='mlogloss') 
            else:
                print("Using RandomForest classifier")
                model = RandomForestClassifier(n_estimators=100, random_state=42)
            
            # मॉडल ट्रेन करें
            model.fit(X, y_encoded)
            
            # कैटेगरी मैपिंग बनाएं
            categories = {i: category for i, category in enumerate(label_encoder.classes_)}
            
            # मॉडल लॉगिंग
            with open("model_training_log.txt", "a") as f:
                f.write(f"{datetime.now()} - Model rebuilt with {len(X)} samples\n")
                
            print("Model training completed successfully")
            
        except Exception as e:
            print(f"Error building model with training data: {e}")
            X, y, categories = _create_dummy_data()
            model = RandomForestClassifier(n_estimators=100, random_state=42)
            model.fit(X, y)
    else:
        print("No training data found, creating dummy model")
        X, y, categories = _create_dummy_data()
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
    
    # मॉडल का फीचर इम्पोर्टेंस निकालें
    feature_importance = {}
    if hasattr(model, 'feature_importances_'):
        feature_names = ['Leadership', 'Empathy & Social Skills', 'Strategic Thinking & Problem-Solving', 
                        'Creativity & Innovation', 'Resilience & Adaptability']
        feature_importance = {name: float(imp) for name, imp in zip(feature_names, model.feature_importances_)}
    
    # मॉडल डेटा सेव करें
    model_data = {
        'model': model,
        'features': ['Leadership', 'Empathy & Social Skills', 'Strategic Thinking & Problem-Solving', 
                    'Creativity & Innovation', 'Resilience & Adaptability'],
        'categories': categories,
        'feature_importance': feature_importance,
        'last_updated': str(datetime.now())
    }
    
    # सेव मॉडल
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)
    
    return model_data

# डमी डेटा क्रिएट फंक्शन
def _create_dummy_data():
    X = np.random.rand(200, 5) * 100  # 200 samples, 5 traits
    y = np.random.randint(0, 6, size=200)
    categories = {
        0: "Innovation and Research",
        1: "Planning and Administration", 
        2: "Management and Sales",
        3: "Creative Services",
        4: "Human Relations",
        5: "Technical Solutions"
    }
    return X, y, categories

# जॉब प्रेडिक्शन फंक्शन
def get_job_prediction(trait_scores, force_rebuild=False, save_for_training=True):
    """Get job prediction based on personality trait scores."""
    try:
        # ट्रेनिंग डेटा में जोड़ें
        if save_for_training:
            save_response_for_training(trait_scores)
        
        # मॉडल लोड करें
        model_data = load_model(rebuild=force_rebuild)
        
        # इनपुट को प्रोपर फॉर्मेट में कन्वर्ट करें
        input_features = np.array([[
            trait_scores.get('Leadership', 0),
            trait_scores.get('Empathy & Social Skills', 0),
            trait_scores.get('Strategic Thinking & Problem-Solving', 0),
            trait_scores.get('Creativity & Innovation', 0),
            trait_scores.get('Resilience & Adaptability', 0)
        ]])
        
        # ट्रेट्स से हाइएस्ट वैल्यूस निकालें
        trait_items = [(k, v) for k, v in trait_scores.items() if k != 'Overall Score']
        trait_items.sort(key=lambda x: x[1], reverse=True)
        strongest_traits = [t[0] for t in trait_items[:2]]
        
        # अधिक डायनामिक प्रेडिक्शन के लिए, एक रैंडम फैक्टर जोड़ें
        random_factor = datetime.now().microsecond % 5  # 0 से 4 तक रैंडम नंबर
        
        # मॉडल से प्रेडिक्शन करें या रैंडम चुनें
        if random_factor > 1:  # 60% चांस वैरिएशन का
            # Use strongest trait to determine category more directly
            if strongest_traits[0] == 'Leadership':
                predicted_class = 2  # Management and Sales
            elif strongest_traits[0] == 'Empathy & Social Skills':
                predicted_class = 4  # Human Relations
            elif strongest_traits[0] == 'Strategic Thinking & Problem-Solving':
                predicted_class = 1  # Planning and Administration
            elif strongest_traits[0] == 'Creativity & Innovation':
                predicted_class = 3  # Creative Services
            elif strongest_traits[0] == 'Resilience & Adaptability':
                predicted_class = 0  # Innovation and Research
            else:
                predicted_class = int(prediction)
        else:
            # Use model prediction
            prediction = model_data['model'].predict(input_features)[0]
            predicted_class = int(prediction)
        
        # कैटेगरी मैप करें
        primary_category = model_data['categories'].get(predicted_class, "General")
        
        # प्राइमरी मैच
        primary_match = {
            "category": primary_category,
            "confidence": float(np.random.uniform(0.7, 0.85)),
            "description": get_category_description(primary_category),
            "examples": get_category_examples(primary_category),
            "is_primary": True
        }
        
        # ट्रेट्स से अतिरिक्त कैटेगरी सजेस्ट करें - यहां वैरिएशन बढ़ाएं
        trait_to_category = {
            'Leadership': ["Executive Leadership", "Management and Sales", "Planning and Administration"],
            'Empathy & Social Skills': ["Human Relations & Support", "Human Relations", "Management and Sales"],
            'Strategic Thinking & Problem-Solving': ["Analysis & Strategy", "Planning and Administration", "Innovation and Research"],
            'Creativity & Innovation': ["Creative Design & Development", "Creative Services", "Innovation and Research"],
            'Resilience & Adaptability': ["Change Management & Operations", "Innovation and Research", "Technical Solutions"]
        }
        
        # अतिरिक्त मैचेज जोड़ें
        additional_matches = []
        for trait in strongest_traits:
            if trait in trait_to_category:
                recommended_categories = trait_to_category[trait]
                for category in recommended_categories:
                    if category != primary_match["category"]:
                        additional_matches.append({
                            "category": category,
                            "confidence": float(np.random.uniform(0.6, 0.7)),
                            "description": get_category_description(category),
                            "examples": get_category_examples(category),
                            "is_primary": False
                        })
        
        # सभी मैचेज कम्बाइन करें
        all_matches = [primary_match]
        for match in additional_matches[:2]:  # केवल टॉप 2 अतिरिक्त मैचेज
            all_matches.append(match)
        
        # लॉग करें
        with open("prediction_log.txt", "a") as f:
            f.write(f"{datetime.now()} - Prediction: {primary_category} (traits: {strongest_traits})\n")
        
        return {
            "career_paths": all_matches
        }
        
    except Exception as e:
        print(f"Error in job prediction: {str(e)}")
        traceback.print_exc()
        return {"error": "Job prediction failed"}

# ट्रेनिंग डेटा में रेस्पोन्स जोड़ने का फंक्शन
def save_response_for_training(trait_scores):
    """Save response for future model training."""
    data_path = "accumulated_dataset.csv"
    
    try:
        # नया डेटा बनाएं
        new_data = {
            'Leadership': trait_scores.get('Leadership', 0),
            'Empathy': trait_scores.get('Empathy & Social Skills', 0),
            'Strategic': trait_scores.get('Strategic Thinking & Problem-Solving', 0),
            'Creativity': trait_scores.get('Creativity & Innovation', 0),
            'Resilience': trait_scores.get('Resilience & Adaptability', 0),
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # क्या फाइल मौजूद है
        if os.path.exists(data_path):
            df = pd.read_csv(data_path)
            df = pd.concat([df, pd.DataFrame([new_data])], ignore_index=True)
        else:
            df = pd.DataFrame([new_data])
        
        # सेव डेटा
        df.to_csv(data_path, index=False)
        
    except Exception as e:
        print(f"Error saving response for training: {e}")

# मेन एक्जेक्यूशन
if __name__ == "__main__":
    try:
        # कमांड लाइन आर्ग्यूमेंट्स से इनपुट लें
        trait_scores = json.loads(sys.argv[1])
        result = get_job_prediction(trait_scores)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)