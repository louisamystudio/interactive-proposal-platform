#!/usr/bin/env python3
"""
Fixed CSV to SQL converter for PR Construction Cost Index 2025.
Maps complex CSV headers to database column names correctly.
"""

import csv
import sys
from typing import Dict, Optional

# Manual mapping of CSV headers to database columns
COLUMN_MAPPING = {
    'Building Use': 'building_use',
    'Building Type': 'building_type', 
    'Category': 'category',
    'Building Tier': 'building_tier',
    
    # Shell costs
    'shell New Construction Min $/ft² All-in': 'shell_new_min',
    'shell Existing to Remodel Min $/ft² All-in': 'shell_existing_min', 
    'shell New Construction Target $/ft² All-in': 'shell_new_target',
    'shell Existing to Remodel Target $/ft² All-in': 'shell_existing_target',
    'shell New Construction Max $/ft² All-in': 'shell_new_max',
    'shell Existing to Remodel Max $/ft² All-in': 'shell_existing_max',
    
    # Interior costs  
    'Interior New Construction Min $/ft² All-in': 'interior_new_min',
    'Interior Existing to Remodel Min $/ft² All-in': 'interior_existing_min',
    'Interior New Construction Target $/ft² All-in': 'interior_new_target', 
    'Interior Existing to Remodel Target $/ft² All-in': 'interior_existing_target',
    'Interior New Construction Max $/ft² All-in': 'interior_new_max',
    'Interior Existing to Remodel Max $/ft² All-in': 'interior_existing_max',
    
    # Landscape costs
    'Outdoor & Landscape New Construction Min $/ft² All-in': 'landscape_new_min',
    'Outdoor & Landscape Existing to Remodel Min $/ft² All-in': 'landscape_existing_min',
    'Outdoor & Landscape New Construction Target $/ft² All-in': 'landscape_new_target',
    'Outdoor & Landscape Existing to Remodel Target $/ft² All-in': 'landscape_existing_target', 
    'Outdoor & Landscape New Construction Max $/ft² All-in': 'landscape_new_max',
    'Outdoor & Landscape Existing to Remodel Max $/ft² All-in': 'landscape_existing_max',
    
    # Pool costs
    'Swimming Pool New Construction Min $/ft² All-in': 'pool_new_min',
    'Swimming Pool Existing to Remodel Min $/ft² All-in': 'pool_existing_min',
    'Swimming Pool New Construction Target $/ft² All-in': 'pool_new_target',
    'Swimming Pool Existing to Remodel Target $/ft² All-in': 'pool_existing_target',
    'Swimming Pool New Construction Max $/ft² All-in': 'pool_new_max', 
    'Swimming Pool Existing to Remodel Max $/ft² All-in': 'pool_existing_max',
    
    # Project shares (percentages)
    'Project Shell Share (%)': 'project_shell_share_pct',
    'Project Interior Share (%)': 'project_interior_share_pct',
    'Project Landscape Share (%)': 'project_landscape_share_pct',
    
    # Design shares (percentages)
    'Architectural Design Share (%)': 'architectural_design_share_pct',
    'Interior Design Share (%)': 'interior_design_share_pct', 
    'Landscape Design Share (%)': 'landscape_design_share_pct',
    'Structural Design Share (%)': 'structural_design_share_pct',
    'Civil Design Share (%)': 'civil_design_share_pct',
    'Mechanical Design Share (%)': 'mechanical_design_share_pct', 
    'Electrical Design Share (%)': 'electrical_design_share_pct',
    'Plumbing Design Share (%)': 'plumbing_design_share_pct',
    'Telecommunication Design (%)': 'telecommunication_design_share_pct',
    
    # Project shares (decimal)
    'Project Shell Share': 'project_shell_share',
    'Project Interior Share': 'project_interior_share', 
    'Project Landscape Share': 'project_landscape_share',
    
    # Design shares (decimal) 
    'Architectural Design Share': 'architectural_design_share',
    'Interior Design Share': 'interior_design_share',
    'Landscape Design Share': 'landscape_design_share',
    'Structural Design Share': 'structural_design_share',
    'Civil Design Share': 'civil_design_share',
    'Mechanical Design Share': 'mechanical_design_share',
    'Electrical Design Share': 'electrical_design_share', 
    'Plumbing Design Share': 'plumbing_design_share',
    'Telecomunication Design': 'telecommunication_design',  # Note: CSV has typo
    'Telecommunication Design': 'telecommunication_design'  # Also handle correct spelling
}

def parse_value(val: str) -> Optional[float]:
    """Parse a value from CSV, handling numbers and empty strings."""
    if val is None or val.strip() == '':
        return None
    try:
        return float(val.strip())
    except ValueError:
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: csv_converter_fixed.py <csv_path>", file=sys.stderr)
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
    except Exception as e:
        print(f"Error reading CSV: {e}", file=sys.stderr)
        sys.exit(1)
    
    print("-- Generated SQL from PR Construction Cost Index 2025 CSV")
    print("-- Database alignment validation")
    print("BEGIN;")
    print("")
    
    # Clear existing data
    print("DELETE FROM pr_construction_cost_index_2025;")
    print("")
    
    processed = 0
    errors = 0
    
    for row_num, row in enumerate(rows, 2):  # Start at 2 since CSV has header
        try:
            # Extract required fields
            building_use = row.get('Building Use', '').strip()
            building_type = row.get('Building Type', '').strip() 
            category = parse_value(row.get('Category', ''))
            building_tier = row.get('Building Tier', '').strip()
            
            if not all([building_use, building_type, category is not None, building_tier]):
                print(f"-- Skipping row {row_num}: missing required fields", file=sys.stderr)
                errors += 1
                continue
            
            # Map all columns
            values = []
            for csv_header, db_col in COLUMN_MAPPING.items():
                val = row.get(csv_header, '')
                if csv_header in ['Building Use', 'Building Type', 'Building Tier']:
                    # String values
                    values.append(f"'{val.strip()}'")
                elif csv_header == 'Category':
                    # Integer category 
                    values.append(str(int(category)))
                else:
                    # Numeric values
                    num_val = parse_value(val)
                    values.append(str(num_val) if num_val is not None else 'NULL')
            
            # Generate INSERT statement
            db_columns = list(COLUMN_MAPPING.values())
            values_str = ','.join(values)
            columns_str = ','.join(db_columns)
            
            print(f"INSERT INTO pr_construction_cost_index_2025 ({columns_str}) VALUES ({values_str});")
            processed += 1
            
        except Exception as e:
            print(f"-- Error processing row {row_num}: {e}", file=sys.stderr)
            errors += 1
    
    print("")
    print("COMMIT;")
    print(f"-- Processed {processed} rows, {errors} errors", file=sys.stderr)

if __name__ == '__main__':
    main()
