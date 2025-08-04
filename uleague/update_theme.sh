#!/bin/bash

# Files to update
files=("scoring.html" "nodes.html" "rules.html")

for file in "${files[@]}"; do
    echo "Updating $file..."
    
    # Update color variables
    sed -i 's/var(--primary-gold)/var(--primary-orange)/g' "$file"
    sed -i 's/var(--secondary-gold)/var(--secondary-orange)/g' "$file"
    sed -i 's/var(--accent-purple)/var(--secondary-orange)/g' "$file"
    sed -i 's/var(--primary-blue)/var(--primary-orange)/g' "$file"
    sed -i 's/var(--secondary-blue)/var(--secondary-orange)/g' "$file"
    
    # Update body background
    sed -i 's/background: var(--dark-bg);/background: linear-gradient(135deg, var(--primary-white) 0%, var(--off-white) 100%);/g' "$file"
    sed -i 's/color: var(--text-primary);/color: var(--dark-bg);/g' "$file"
    
    # Update navbar
    sed -i 's/background: rgba(15, 23, 42, 0.95)/background: rgba(255, 255, 255, 0.95)/g' "$file"
    sed -i 's/border-bottom: 1px solid var(--border-color)/border-bottom: 1px solid #e0e0e0/g' "$file"
    
    # Update dropdown
    sed -i 's/background: var(--card-bg)/background: var(--primary-white)/g' "$file"
    sed -i 's/border: 1px solid var(--border-color)/border: 1px solid #e0e0e0/g' "$file"
    
    # Update scrollbar
    sed -i 's/background: var(--darker-bg);/background: var(--light-gray);/g' "$file"
    
    # Update hover effects
    sed -i 's/rgba(255, 213, 79, 0.1)/rgba(255, 107, 53, 0.1)/g' "$file"
    
    echo "$file updated successfully!"
done

echo "All files updated with orange theme!"
