#!/usr/bin/env python3
"""
Generate SQL INSERT statements for pr_construction_cost_index_2025 from the CSV.

Usage:
  python database/scripts/csv_to_sql_converter.py "References/PR_Construction_Cost_Index_2025_filled (1).csv" > out.sql
  psql "$DATABASE_URL" -f database/schema/construction_cost_index.sql
  psql "$DATABASE_URL" -f out.sql

Note: This performs a best-effort mapping by normalizing CSV headers to snake_case and
      selecting the columns expected by the target table.
"""

import csv
import re
import sys

TARGET_COLS = [
    'building_use','building_type','category','building_tier',
    'shell_new_min','shell_existing_min','shell_new_target','shell_existing_target','shell_new_max','shell_existing_max',
    'interior_new_min','interior_existing_min','interior_new_target','interior_existing_target','interior_new_max','interior_existing_max',
    'landscape_new_min','landscape_existing_min','landscape_new_target','landscape_existing_target','landscape_new_max','landscape_existing_max',
    'pool_new_min','pool_existing_min','pool_new_target','pool_existing_target','pool_new_max','pool_existing_max',
    'project_shell_share_pct','project_interior_share_pct','project_landscape_share_pct','architectural_design_share_pct',
    'interior_design_share_pct','landscape_design_share_pct','structural_design_share_pct','civil_design_share_pct',
    'mechanical_design_share_pct','electrical_design_share_pct','plumbing_design_share_pct','telecommunication_design_share_pct',
    'project_shell_share','project_interior_share','project_landscape_share','architectural_design_share','interior_design_share',
    'landscape_design_share','structural_design_share','civil_design_share','mechanical_design_share','electrical_design_share',
    'plumbing_design_share','telecommunication_design'
]

def snake(s: str) -> str:
    s = re.sub(r"(ftA�|ft²|ft\^2)", "ft2", s, flags=re.I)
    s = re.sub(r"[^a-zA-Z0-9]+", "_", s)
    s = re.sub(r"_{2,}", "_", s)
    s = s.strip("_")
    return s.lower()

def try_num(v: str):
    if v is None:
        return None
    t = v.strip().replace(",", "")
    if t == "":
        return None
    try:
        return float(t)
    except ValueError:
        return v.strip()

def main():
    if len(sys.argv) < 2:
        print("Usage: csv_to_sql_converter.py <csv_path>", file=sys.stderr)
        sys.exit(1)
    csv_path = sys.argv[1]

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)

    if not rows:
        sys.exit(1)

    headers = [snake(h or '') for h in rows[0]]
    idx_map = {h:i for i,h in enumerate(headers)}

    # Build INSERTs in batches
    print("BEGIN;")
    for r in rows[1:]:
        # identity guard
        bu = r[idx_map.get('building_use', -1)] if idx_map.get('building_use', -1) >= 0 else None
        bt = r[idx_map.get('building_type', -1)] if idx_map.get('building_type', -1) >= 0 else None
        cat = r[idx_map.get('category', -1)] if idx_map.get('category', -1) >= 0 else None
        tier = r[idx_map.get('building_tier', -1)] if idx_map.get('building_tier', -1) >= 0 else None
        if not (bu and bt and cat and tier):
            continue

        values = []
        for col in TARGET_COLS:
            # best-effort key mapping from CSV; account for duplicate headers with trailing underscores
            keys = [col, f"{col}_"]
            val = None
            for k in keys:
                idx = idx_map.get(k)
                if idx is not None and idx >= 0 and idx < len(r):
                    val = r[idx]
                    break
            v = try_num(val) if val is not None else None
            if v is None:
                values.append("NULL")
            elif isinstance(v, float):
                values.append(str(v))
            else:
                # quote string
                esc = str(v).replace("'", "''")
                values.append(f"'{esc}'")

        cols = ",".join(TARGET_COLS)
        vals = ",".join(values)
        print(f"INSERT INTO pr_construction_cost_index_2025 ({cols}) VALUES ({vals}) ON CONFLICT (building_use, building_type, category, building_tier) DO UPDATE SET building_use = EXCLUDED.building_use;")

    print("COMMIT;")

if __name__ == '__main__':
    main()

