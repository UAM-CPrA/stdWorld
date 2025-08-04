// Fixed Template Generator JavaScript - Simplified Version
class TemplateGenerator {
    constructor() {
        this.selectedTemplate = null;
        this.selectedSections = [];
        this.formData = {};
        this.sectionContents = {}; // Store custom content for each section
        this.featuredElements = []; // Array for featured elements
        this.currentEditingSection = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateAvailableSections();
        this.updateFeaturedElementsList();
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('creationDate').value = today;
        document.getElementById('lastUpdated').value = today;
    }

    setupEventListeners() {
        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });

        // Form inputs
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                this.updateFormData();
            });
        });

        // Custom path change handler
        document.getElementById('customPath').addEventListener('input', () => {
            this.updatePathPreview();
        });
    }

    selectTemplate(templateType) {
        this.selectedTemplate = templateType;
        
        // Update UI
        document.querySelectorAll('.template-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`[data-template="${templateType}"]`).classList.add('selected');
        
        // Show appropriate form fields
        const conceptsFields = document.getElementById('conceptsFields');
        const uploadFields = document.getElementById('uploadFields');
        
        // Hide all template-specific fields first
        conceptsFields.style.display = 'none';
        uploadFields.style.display = 'none';
        
        if (templateType === 'concepts') {
            conceptsFields.style.display = 'block';
            this.showNotification('Article template selected! Fill in the basic information.', 'success');
        } else if (templateType === 'upload') {
            uploadFields.style.display = 'block';
            this.showNotification('Upload mode selected! Upload an existing HTML file to edit.', 'success');
        }
        
        // Show basic info form
        document.getElementById('basicInfoForm').classList.add('active');
        this.updateProgress(2);
    }

    populateAvailableSections() {
        const sections = [
            { id: 'introduction', name: 'Introduction', icon: '🎯', description: 'Problem overview and motivation' },
            { id: 'complexity-analysis', name: 'Complexity Analysis', icon: '📊', description: 'Time and space complexity breakdown' },
            { id: 'algorithm-explanation', name: 'Algorithm Explanation', icon: '🧮', description: 'Step-by-step algorithm breakdown' },
            { id: 'implementation', name: 'Code Implementation', icon: '💻', description: 'Complete code solution with comments' },
            { id: 'visual-example', name: 'Visual Example', icon: '🎨', description: 'Step-by-step visual walkthrough' },
            { id: 'problem-variations', name: 'Problem Variations', icon: '🧩', description: 'Similar problems and variations' },
            { id: 'practice-problems', name: 'Practice Problems', icon: '💪', description: 'Curated practice problems' },
            { id: 'optimization-tips', name: 'Optimization Tips', icon: '⚡', description: 'Performance optimization techniques' },
            { id: 'common-mistakes', name: 'Common Mistakes', icon: '⚠️', description: 'Pitfalls and debugging tips' },
            { id: 'contest-applications', name: 'Contest Applications', icon: '🏆', description: 'Real contest problems using this technique' }
        ];

        const container = document.getElementById('availableSections');
        container.innerHTML = '';
        
        sections.forEach(section => {
            const div = document.createElement('div');
            div.className = 'section-card';
            div.innerHTML = `
                <h4>${section.icon} ${section.name}</h4>
                <p>${section.description}</p>
            `;
            div.addEventListener('click', () => this.addSection(section));
            container.appendChild(div);
        });
    }

    addSection(section) {
        // Create unique ID for each instance
        const uniqueId = `${section.id}_${Date.now()}`;
        const sectionWithId = { ...section, uniqueId };
        
        this.selectedSections.push(sectionWithId);
        this.updateSelectedSectionsUI();
        this.showNotification(`Added ${section.name} section`, 'success');
    }

    removeSection(index) {
        const section = this.selectedSections[index];
        if (section) {
            // Remove from sectionContents as well
            delete this.sectionContents[section.uniqueId || section.id];
            this.selectedSections.splice(index, 1);
            this.updateSelectedSectionsUI();
            this.showNotification('Section removed', 'success');
        }
    }

    editSection(index) {
        this.currentEditingSection = index;
        const section = this.selectedSections[index];
        const uniqueId = section.uniqueId || section.id;
        
        // Set modal title and basic fields
        document.getElementById('editorTitle').textContent = `Edit ${section.name} Section`;
        document.getElementById('sectionTitle').value = section.name;
        document.getElementById('sectionIcon').value = section.icon;
        
        // Get existing content or create default
        const existingContent = this.sectionContents[uniqueId] || {};
        
        // Generate section-specific fields
        const dynamicContent = document.getElementById('dynamicContent');
        dynamicContent.innerHTML = this.generateSectionSpecificFields(section.id, existingContent);
        
        // Show modal
        document.getElementById('contentEditor').classList.add('show');
    }

    generateSectionSpecificFields(sectionId, existingContent) {
        switch (sectionId) {
            case 'introduction':
                return `
                    <div class="content-editor">
                        <label for="problemOverview">Problem Overview</label>
                        <textarea id="problemOverview" placeholder="Describe what this algorithm does and why it's important in competitive programming...">${existingContent.problemOverview || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="intuition">Key Intuition</label>
                        <textarea id="intuition" placeholder="What's the main insight that makes this algorithm work?">${existingContent.intuition || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="prerequisites">Prerequisites</label>
                        <textarea id="prerequisites" placeholder="What should students know before learning this? (List with bullet points)">${existingContent.prerequisites || ''}</textarea>
                    </div>
                `;
                
            case 'complexity-analysis':
                return `
                    <div class="content-editor">
                        <label for="complexityTable">Complexity Table (Format: Operation|Time|Space|Notes, one per line)</label>
                        <textarea id="complexityTable" placeholder="Basic operation|O(log n)|O(1)|Standard binary search\nWorst case|O(log n)|O(1)|Target not found\nRecursive version|O(log n)|O(log n)|Due to call stack">${existingContent.complexityTable || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="complexityExplanation">Why This Complexity?</label>
                        <textarea id="complexityExplanation" placeholder="Explain the mathematical reasoning behind the time complexity...">${existingContent.complexityExplanation || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="spaceComplexity">Space Complexity Details</label>
                        <textarea id="spaceComplexity" placeholder="Detailed analysis of memory usage, differences between iterative vs recursive...">${existingContent.spaceComplexity || ''}</textarea>
                    </div>
                `;
                
            case 'algorithm-explanation':
                return `
                    <div class="content-editor">
                        <label for="algorithmSteps">Algorithm Steps</label>
                        <textarea id="algorithmSteps" placeholder="1. Initialize left = 0, right = n-1\n2. Calculate mid = left + (right-left)/2\n3. Compare arr[mid] with target\n4. Update boundaries\n5. Repeat until found or impossible">${existingContent.algorithmSteps || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="pseudocode">Pseudocode</label>
                        <textarea id="pseudocode" placeholder="function binarySearch(arr, target):\n    left = 0\n    right = arr.length - 1\n    \n    while left <= right:\n        mid = left + (right - left) / 2\n        if arr[mid] == target:\n            return mid\n        // ... rest of algorithm">${existingContent.pseudocode || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="keyInsights">Key Insights & Critical Details</label>
                        <textarea id="keyInsights" placeholder="Critical implementation details:\n- Use mid = left + (right-left)/2 to avoid overflow\n- Always update with mid±1 to avoid infinite loops\n- Choose correct loop condition (< vs <=)">${existingContent.keyInsights || ''}</textarea>
                    </div>
                `;
                
            case 'implementation':
                return `
                    <div class="content-editor">
                        <label for="implDescription">Implementation Description</label>
                        <textarea id="implDescription" placeholder="Brief description of the implementation approach and any important notes...">${existingContent.implDescription || ''}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="content-editor">
                            <label for="codeLanguage">Primary Programming Language</label>
                            <select id="codeLanguage">
                                <option value="cpp" ${existingContent.codeLanguage === 'cpp' ? 'selected' : ''}>C++</option>
                                <option value="python" ${existingContent.codeLanguage === 'python' ? 'selected' : ''}>Python</option>
                                <option value="java" ${existingContent.codeLanguage === 'java' ? 'selected' : ''}>Java</option>
                                <option value="javascript" ${existingContent.codeLanguage === 'javascript' ? 'selected' : ''}>JavaScript</option>
                            </select>
                        </div>
                    </div>
                    <div class="content-editor">
                        <label for="codeContent">Code Implementation</label>
                        <textarea id="codeContent" style="font-family: monospace; min-height: 250px;" placeholder="// Complete implementation with multiple variations if useful
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}">${existingContent.codeContent || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="codeExplanation">Code Explanation</label>
                        <textarea id="codeExplanation" placeholder="Line-by-line or section-by-section explanation of the implementation...">${existingContent.codeExplanation || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="alternativeCode">Alternative Implementation (Optional)</label>
                        <textarea id="alternativeCode" placeholder="Python implementation or alternative approach...">${existingContent.alternativeCode || ''}</textarea>
                    </div>
                `;
                
            case 'visual-example':
                return `
                    <div class="content-editor">
                        <label for="exampleInput">Example Input</label>
                        <textarea id="exampleInput" placeholder="arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]\ntarget = 7">${existingContent.exampleInput || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="stepByStep">Step-by-Step Execution</label>
                        <textarea id="stepByStep" placeholder="Step 1: Initialize left=0, right=9\nArray: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]\nSearch space: entire array\n\nStep 2: First iteration\nmid = 0 + (9-0)/2 = 4\nArray: [1, 3, 5, 7, [9], 11, 13, 15, 17, 19]\narr[4] = 9 > 7, so search left half...">${existingContent.stepByStep || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="visualization">Visualization Notes</label>
                        <textarea id="visualization" placeholder="Describe visual elements that help understand the algorithm - highlighting, crossing out eliminated elements, etc.">${existingContent.visualization || ''}</textarea>
                    </div>
                `;
                
            case 'problem-variations':
                return `
                    <div class="content-editor">
                        <label for="variationsIntro">Variations Introduction</label>
                        <textarea id="variationsIntro" placeholder="This algorithm can be adapted for various related problems in competitive programming...">${existingContent.variationsIntro || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="variationsList">Problem Variations (Format: 🔍 Title | Description | Difficulty)</label>
                        <textarea id="variationsList" placeholder="🔍 Find First/Last Occurrence | When array has duplicates, find leftmost or rightmost occurrence | Easy
🔄 Search in Rotated Array | Array is sorted but rotated at some pivot | Medium
📐 Search in 2D Matrix | Search in row-wise and column-wise sorted matrix | Medium
🎯 Binary Search on Answer | Find minimum/maximum value that satisfies condition | Hard">${existingContent.variationsList || ''}</textarea>
                    </div>
                `;
                
            case 'practice-problems':
                return `
                    <div class="content-editor">
                        <label for="practiceIntro">Practice Problems Introduction</label>
                        <textarea id="practiceIntro" placeholder="Master this algorithm with these carefully selected problems, ordered by difficulty...">${existingContent.practiceIntro || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="beginnerProblems">🟢 Beginner Problems (Format: Title | Platform | Difficulty | Topic | Description | URL)</label>
                        <textarea id="beginnerProblems" placeholder="Binary Search | LeetCode | Easy | Basic Implementation | Classic binary search implementation problem | https://leetcode.com/problems/binary-search/
Search Insert Position | LeetCode | Easy | Lower Bound | Find index where target should be inserted | https://leetcode.com/problems/search-insert-position/">${existingContent.beginnerProblems || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="intermediateProblems">🟡 Intermediate Problems</label>
                        <textarea id="intermediateProblems" placeholder="Find First and Last Position | LeetCode | Medium | Range Finding | Find starting and ending position of target | https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
Search in Rotated Sorted Array | LeetCode | Medium | Rotated Array | Search in rotated sorted array | https://leetcode.com/problems/search-in-rotated-sorted-array/">${existingContent.intermediateProblems || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="advancedProblems">🔴 Advanced Problems</label>
                        <textarea id="advancedProblems" placeholder="Median of Two Sorted Arrays | LeetCode | Hard | Advanced Binary Search | Find median in O(log(min(m,n))) time | https://leetcode.com/problems/median-of-two-sorted-arrays/
Aggressive Cows | SPOJ | Hard | Binary Search on Answer | Classic BSOA problem | https://www.spoj.com/problems/AGGRCOW/">${existingContent.advancedProblems || ''}</textarea>
                    </div>
                `;
                
            case 'optimization-tips':
                return `
                    <div class="content-editor">
                        <label for="optimizationIntro">Optimization Introduction</label>
                        <textarea id="optimizationIntro" placeholder="Take your binary search skills to the next level with these optimization techniques...">${existingContent.optimizationIntro || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="optimizationTips">Optimization Tips (Format: 🚀 Title | Description)</label>
                        <textarea id="optimizationTips" placeholder="🚀 Avoid Integer Overflow | Always use mid = left + (right - left) / 2 instead of mid = (left + right) / 2
🎯 Choose the Right Template | Use different templates for different scenarios - while(left <= right) for exact search
🔄 Iterative vs Recursive | Prefer iterative to avoid stack overflow and reduce space complexity
📏 Binary Search on Floating Point | Use while(right - left > eps) where eps is desired precision">${existingContent.optimizationTips || ''}</textarea>
                    </div>
                `;
                
            case 'common-mistakes':
                return `
                    <div class="content-editor">
                        <label for="mistakesIntro">Common Mistakes Introduction</label>
                        <textarea id="mistakesIntro" placeholder="Avoid these common pitfalls that can turn correct binary search into infinite loops...">${existingContent.mistakesIntro || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="mistakesList">Common Mistakes (Format: 🔄 Title | Description | Wrong Code | Correct Code)</label>
                        <textarea id="mistakesList" placeholder="🔄 Infinite Loop Bug | Always move boundary to avoid infinite loops | if (arr[mid] <= target) left = mid; | if (arr[mid] <= target) left = mid + 1;
📊 Integer Overflow | Prevents overflow when left + right > INT_MAX | int mid = (left + right) / 2; | int mid = left + (right - left) / 2;
🎯 Wrong Boundary Condition | Choose correct condition based on use case | Using wrong while condition | while(left <= right) for exact match">${existingContent.mistakesList || ''}</textarea>
                    </div>
                `;
                
            case 'contest-applications':
                return `
                    <div class="content-editor">
                        <label for="contestIntro">Contest Applications Introduction</label>
                        <textarea id="contestIntro" placeholder="Binary search appears frequently in competitive programming contests. Here are real examples...">${existingContent.contestIntro || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="classicProblems">🔍 Classic Binary Search Problems (Format: Title | Contest | Year | Difficulty | Description)</label>
                        <textarea id="classicProblems" placeholder="ICPC World Finals 2019 - Problem F | ICPC | 2019 | Medium | Required binary search on sorted array with custom comparison
Codeforces Round 650 - Problem C | Codeforces | 2020 | Medium | Binary search to find optimal position in sorted sequence">${existingContent.classicProblems || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="bsOnAnswerProblems">🎯 Binary Search on Answer Problems</label>
                        <textarea id="bsOnAnswerProblems" placeholder="AtCoder Beginner Contest 146 - Problem D | AtCoder | 2019 | Hard | Binary search on maximum number of colors needed
TopCoder SRM 144 - Division I, Level 2 | TopCoder | 2003 | Hard | Classic binary search on answer for optimization">${existingContent.bsOnAnswerProblems || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="advancedApplications">🌊 Advanced Applications</label>
                        <textarea id="advancedApplications" placeholder="Google Code Jam 2020 - Round 1A Problem 3 | Google Code Jam | 2020 | Hard | Binary search combined with segment trees
IOI 2014 - Problem 2 | IOI | 2014 | Very Hard | Binary search on answer with complex feasibility checking">${existingContent.advancedApplications || ''}</textarea>
                    </div>
                `;
                
            default:
                return `
                    <div class="content-editor">
                        <label for="mainContent">Main Content</label>
                        <textarea id="mainContent" placeholder="Enter the main content for this section...">${existingContent.mainContent || ''}</textarea>
                    </div>
                    <div class="content-editor">
                        <label for="keyPoints">Key Points</label>
                        <textarea id="keyPoints" placeholder="- Key point 1\n- Key point 2\n- Key point 3">${existingContent.keyPoints || ''}</textarea>
                    </div>
                `;
        }
    }

    saveSection() {
        const section = this.selectedSections[this.currentEditingSection];
        const uniqueId = section.uniqueId || section.id;
        
        // Collect basic data
        const sectionContent = {
            title: document.getElementById('sectionTitle').value,
            icon: document.getElementById('sectionIcon').value,
            sectionType: section.id
        };
        
        // Collect section-specific data
        this.collectSectionSpecificData(section.id, sectionContent);
        
        // Save the content using uniqueId
        this.sectionContents[uniqueId] = sectionContent;
        
        // Update the section name in the UI if it was changed
        if (sectionContent.title !== section.name) {
            this.selectedSections[this.currentEditingSection].name = sectionContent.title;
        }
        if (sectionContent.icon !== section.icon) {
            this.selectedSections[this.currentEditingSection].icon = sectionContent.icon;
        }
        
        // Update the UI to show the section has been edited
        this.updateSelectedSectionsUI();
        
        // Close modal
        this.closeEditor();
        
        this.showNotification('Section content saved successfully!', 'success');
    }

    collectSectionSpecificData(sectionId, sectionContent) {
        switch (sectionId) {
            case 'introduction':
                sectionContent.problemOverview = document.getElementById('problemOverview')?.value || '';
                sectionContent.intuition = document.getElementById('intuition')?.value || '';
                sectionContent.prerequisites = document.getElementById('prerequisites')?.value || '';
                break;
                
            case 'complexity-analysis':
                sectionContent.complexityTable = document.getElementById('complexityTable')?.value || '';
                sectionContent.complexityExplanation = document.getElementById('complexityExplanation')?.value || '';
                sectionContent.spaceComplexity = document.getElementById('spaceComplexity')?.value || '';
                break;
                
            case 'algorithm-explanation':
                sectionContent.algorithmSteps = document.getElementById('algorithmSteps')?.value || '';
                sectionContent.pseudocode = document.getElementById('pseudocode')?.value || '';
                sectionContent.keyInsights = document.getElementById('keyInsights')?.value || '';
                break;
                
            case 'implementation':
                sectionContent.implDescription = document.getElementById('implDescription')?.value || '';
                sectionContent.codeLanguage = document.getElementById('codeLanguage')?.value || '';
                sectionContent.codeContent = document.getElementById('codeContent')?.value || '';
                sectionContent.codeExplanation = document.getElementById('codeExplanation')?.value || '';
                break;
                
            case 'visual-example':
                sectionContent.exampleInput = document.getElementById('exampleInput')?.value || '';
                sectionContent.stepByStep = document.getElementById('stepByStep')?.value || '';
                sectionContent.visualization = document.getElementById('visualization')?.value || '';
                break;
                
            case 'problem-variations':
                sectionContent.variationsIntro = document.getElementById('variationsIntro')?.value || '';
                sectionContent.variationsList = document.getElementById('variationsList')?.value || '';
                break;
                
            case 'practice-problems':
                sectionContent.practiceIntro = document.getElementById('practiceIntro')?.value || '';
                sectionContent.problemsList = document.getElementById('problemsList')?.value || '';
                break;
                
            case 'optimization-tips':
                sectionContent.optimizationIntro = document.getElementById('optimizationIntro')?.value || '';
                sectionContent.optimizationTips = document.getElementById('optimizationTips')?.value || '';
                break;
                
            case 'common-mistakes':
                sectionContent.mistakesIntro = document.getElementById('mistakesIntro')?.value || '';
                sectionContent.mistakesList = document.getElementById('mistakesList')?.value || '';
                break;
                
            case 'contest-applications':
                sectionContent.contestIntro = document.getElementById('contestIntro')?.value || '';
                sectionContent.contestProblems = document.getElementById('contestProblems')?.value || '';
                break;
                
            default:
                sectionContent.mainContent = document.getElementById('mainContent')?.value || '';
                sectionContent.keyPoints = document.getElementById('keyPoints')?.value || '';
                break;
        }
    }

    updateSelectedSectionsUI() {
        const container = document.getElementById('selectedSections');
        if (this.selectedSections.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--light-grey); margin: 2rem 0;">Click on sections above to add them to your document</p>';
            return;
        }
        
        container.innerHTML = '';
        this.selectedSections.forEach((section, index) => {
            const uniqueId = section.uniqueId || section.id;
            const isEdited = this.sectionContents[uniqueId] ? ' ✓' : '';
            const editedClass = this.sectionContents[uniqueId] ? ' edited' : '';
            
            const div = document.createElement('div');
            div.className = `selected-section-item${editedClass}`;
            div.innerHTML = `
                <span>${section.icon} ${section.name}${isEdited}</span>
                <div>
                    <button class="btn btn-small btn-secondary" onclick="generator.editSection(${index})" style="margin-right: 0.5rem;">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="generator.removeSection(${index})">Remove</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    closeEditor() {
        const modal = document.getElementById('contentEditor');
        modal.classList.remove('show');
        this.currentEditingSection = null;
    }

    updateFormData() {
        this.formData = {};
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.id) {
                this.formData[input.id] = input.value;
            }
        });
    }

    updatePathPreview() {
        const customPath = document.getElementById('customPath').value.trim();
        const previewElement = document.getElementById('pathPreviewText');
        
        if (customPath) {
            previewElement.textContent = customPath;
            previewElement.style.color = 'var(--teal)';
        } else {
            previewElement.textContent = 'Enter a custom path';
            previewElement.style.color = 'var(--text-secondary)';
        }
    }

    updateFeaturedElementsList() {
        const container = document.getElementById('featuredElementsList');
        const elementsContainer = container.querySelector('.featured-elements-container');
        
        if (this.featuredElements.length === 0) {
            elementsContainer.innerHTML = '<div class="no-featured-elements">No featured elements added yet. Add elements that make your content special.</div>';
            elementsContainer.classList.remove('has-elements');
        } else {
            let html = '';
            this.featuredElements.forEach((element, index) => {
                html += `
                    <div class="featured-element">
                        <span>${element}</span>
                        <button class="featured-element-remove" onclick="generator.removeFeaturedElement(${index})">×</button>
                    </div>
                `;
            });
            elementsContainer.innerHTML = html;
            elementsContainer.classList.add('has-elements');
        }
    }

    addFeaturedElement() {
        const input = document.getElementById('newFeaturedElement');
        const element = input.value.trim();
        
        if (element && !this.featuredElements.includes(element)) {
            this.featuredElements.push(element);
            input.value = '';
            this.updateFeaturedElementsList();
            this.showNotification('Featured element added!', 'success');
        }
    }

    removeFeaturedElement(index) {
        this.featuredElements.splice(index, 1);
        this.updateFeaturedElementsList();
    }

    proceedToSections() {
        this.updateFormData();
        
        // Validate required fields
        if (!this.formData.documentTitle) {
            this.showNotification('Please enter a document title', 'warning');
            return;
        }
        
        if (!this.formData.originalAuthor) {
            this.showNotification('Please enter the original author', 'warning');
            return;
        }
        
        document.getElementById('basicInfoForm').style.display = 'none';
        document.getElementById('sectionManager').style.display = 'block';
        this.updateProgress(3);
    }

    goBackToBasicInfo() {
        document.getElementById('sectionManager').style.display = 'none';
        document.getElementById('basicInfoForm').style.display = 'block';
        this.updateProgress(2);
    }

    generatePreview() {
        if (this.selectedSections.length === 0) {
            this.showNotification('Please add at least one section to your document', 'warning');
            return;
        }
        
        const html = this.generateHTML();
        const metaJSON = this.generateMetaJSON();
        const fileInstructions = this.generateFileInstructions();
        
        // Display preview
        document.getElementById('codePreview').textContent = html;
        document.getElementById('metaPreview').textContent = JSON.stringify(metaJSON, null, 2);
        document.getElementById('fileInstructions').innerHTML = fileInstructions;
        
        document.getElementById('sectionManager').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'block';
        this.updateProgress(4);
    }

    goBackToSections() {
        document.getElementById('previewContainer').style.display = 'none';
        document.getElementById('sectionManager').style.display = 'block';
        this.updateProgress(3);
    }

    generateHTML() {
        const data = this.formData;
        const title = data.documentTitle || '[Your Algorithm Title Here]';
        const description = data.documentDescription || 'A comprehensive guide to mastering this algorithm in competitive programming';
        const level = data.documentLevel || 'Beginner';
        const readingTime = data.readingTime || '15';
        const { cssPath, faviconPath } = this.getCSSPath();

        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - std::Learn </title>
    <link rel="icon" type="image/svg+xml" href="${faviconPath}">
    <link rel="stylesheet" href="${cssPath}">
</head>
<body>
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <img src="../_img/stdLearnLogo.png" alt="std::Learn" style="height: 40px; width: auto;">
            </a>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../concepts.html">Algorithms</a></li>
                <li><a href="../research.html">Advanced Topics</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </div>
    </nav>

    <div class="article-container">
        <nav class="breadcrumb">
            <a href="../concepts.html">Algorithms</a>
            <span class="breadcrumb-separator">></span>
            <a href="../concepts.html#fundamentals">Fundamentals</a>
            <span class="breadcrumb-separator">></span>
            <span>${title}</span>
        </nav>

        <header class="article-header">
            <h1 class="article-title">${title}</h1>
            <p class="article-subtitle">${description}</p>
            <div class="article-meta">
                <div class="meta-item">
                    <span>📅</span>
                    <span>Updated: ${data.lastUpdated || new Date().toLocaleDateString()}</span>
                </div>
                <div class="meta-item">
                    <span>⏱️</span>
                    <span>Reading time: ${readingTime} min</span>
                </div>
                <div class="meta-item">
                    <span>🎯</span>
                    <span>Level: ${level}</span>
                </div>
            </div>
        </header>

        <main>`;

        // Add selected sections
        this.selectedSections.forEach(section => {
            html += this.generateSectionHTML(section);
        });

        // Add authority section
        html += this.generateAuthoritySection(data);

        html += `
        </main>

        <nav class="article-navigation">
            <a href="#" class="nav-link prev">Previous Algorithm</a>
            <a href="../concepts.html" class="nav-link">Back to Algorithms</a>
            <a href="#" class="nav-link next">Next Algorithm</a>
        </nav>
    </div>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 std::Learn. Mastering competitive programming excellence.</p>
            <span class="by-text">by</span>
            <img src="${faviconPath}" alt="CPrA Logo" class="cpra-logo-small">
        </div>
    </footer>

    <script>
        // Add your JavaScript functionality here
        function runDemo() {
            alert('Implement your interactive demo here!');
        }
    </script>
</body>
</html>`;

        return html;
    }

    generateSectionHTML(section) {
        const uniqueId = section.uniqueId || section.id;
        const content = this.sectionContents[uniqueId];
        
        if (!content) {
            return `
            <section class="content-section">
                <div class="section-header">
                    <span class="section-icon">${section.icon}</span>
                    <h2 class="section-title">${section.name}</h2>
                </div>
                <p>This section needs content. Please edit it to add your content.</p>
            </section>`;
        }
        
        let html = `
        <section class="content-section">
            <div class="section-header">
                <span class="section-icon">${content.icon}</span>
                <h2 class="section-title">${content.title}</h2>
            </div>`;
        
        switch (section.id) {
            case 'introduction':
                html += this.generateIntroductionSectionHTML(content);
                break;
            case 'complexity-analysis':
                html += this.generateComplexityAnalysisSectionHTML(content);
                break;
            case 'algorithm-explanation':
                html += this.generateAlgorithmExplanationSectionHTML(content);
                break;
            case 'implementation':
                html += this.generateImplementationSectionHTML(content);
                break;
            case 'visual-example':
                html += this.generateVisualExampleSectionHTML(content);
                break;
            case 'problem-variations':
                html += this.generateProblemVariationsSectionHTML(content);
                break;
            case 'practice-problems':
                html += this.generatePracticeProblemsSectionHTML(content);
                break;
            case 'optimization-tips':
                html += this.generateOptimizationTipsSectionHTML(content);
                break;
            case 'common-mistakes':
                html += this.generateCommonMistakesSectionHTML(content);
                break;
            case 'contest-applications':
                html += this.generateContestApplicationsSectionHTML(content);
                break;
            default:
                html += this.generateDefaultSectionHTML(content);
                break;
        }
        
        html += `</section>`;
        return html;
    }

    generateIntroductionSectionHTML(content) {
        let html = '';
        
        if (content.problemOverview) {
            html += `<p>${this.formatTextContent(content.problemOverview)}</p>`;
        }
        
        if (content.intuition) {
            html += `<div class="content-block">
                <h3>Key Intuition</h3>
                <p>${this.formatTextContent(content.intuition)}</p>
            </div>`;
        }
        
        if (content.prerequisites) {
            html += `<div class="content-block">
                <h3>Prerequisites</h3>
                <div>${this.formatListContent(content.prerequisites)}</div>
            </div>`;
        }
        
        return html;
    }

    generateComplexityAnalysisSectionHTML(content) {
        let html = '';
        
        if (content.complexityTable) {
            html += `<div class="complexity-table">
                <table>
                    <thead>
                        <tr>
                            <th>Operation</th>
                            <th>Time Complexity</th>
                            <th>Space Complexity</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            const rows = content.complexityTable.split('\n').filter(row => row.trim());
            rows.forEach(row => {
                const cols = row.split('|').map(col => col.trim());
                if (cols.length >= 4) {
                    html += `<tr>
                        <td>${cols[0]}</td>
                        <td><code>${cols[1]}</code></td>
                        <td><code>${cols[2]}</code></td>
                        <td>${cols[3]}</td>
                    </tr>`;
                }
            });
            
            html += `</tbody></table></div>`;
        }
        
        if (content.complexityExplanation) {
            html += `<div class="content-block">
                <h3>Why This Complexity?</h3>
                <p>${this.formatTextContent(content.complexityExplanation)}</p>
            </div>`;
        }
        
        if (content.spaceComplexity) {
            html += `<div class="content-block">
                <h3>Space Complexity Details</h3>
                <p>${this.formatTextContent(content.spaceComplexity)}</p>
            </div>`;
        }
        
        return html;
    }

    generateAlgorithmExplanationSectionHTML(content) {
        let html = '';
        
        if (content.algorithmSteps) {
            html += `<div class="content-block">
                <h3>Step-by-Step Algorithm</h3>
                <div class="step-by-step">
                    ${this.formatSteps(content.algorithmSteps)}
                </div>
            </div>`;
        }
        
        if (content.pseudocode) {
            html += `<div class="content-block">
                <h3>Pseudocode</h3>
                <pre class="code-block"><code>${content.pseudocode}</code></pre>
            </div>`;
        }
        
        if (content.keyInsights) {
            html += `<div class="content-block">
                <h3>� Key Insights & Critical Details</h3>
                <div>${this.formatListContent(content.keyInsights)}</div>
            </div>`;
        }
        
        return html;
    }

    generateImplementationSectionHTML(content) {
        let html = '';
        
        if (content.implDescription) {
            html += `<p>${this.formatTextContent(content.implDescription)}</p>`;
        }
        
        if (content.codeContent) {
            const languageMap = {
                'cpp': 'C++',
                'python': 'Python',
                'java': 'Java',
                'javascript': 'JavaScript'
            };
            
            html += `<div class="code-implementation">
                <div class="code-header">
                    <span class="code-language">${languageMap[content.codeLanguage] || 'Code'}</span>
                </div>
                <pre class="code-block"><code class="language-${content.codeLanguage}">${content.codeContent}</code></pre>
            </div>`;
        }
        
        if (content.codeExplanation) {
            html += `<div class="content-block">
                <h3>Code Explanation</h3>
                <p>${this.formatTextContent(content.codeExplanation)}</p>
            </div>`;
        }
        
        if (content.alternativeCode) {
            html += `<div class="content-block">
                <h3>Alternative Implementation</h3>
                <pre class="code-block"><code>${content.alternativeCode}</code></pre>
            </div>`;
        }
        
        return html;
    }

    generateVisualExampleSectionHTML(content) {
        let html = '';
        
        if (content.exampleInput) {
            html += `<div class="content-block">
                <h3>Example Input</h3>
                <pre class="code-block"><code>${content.exampleInput}</code></pre>
            </div>`;
        }
        
        if (content.stepByStep) {
            html += `<div class="content-block">
                <h3>Step-by-Step Execution</h3>
                <div class="step-walkthrough">
                    ${this.formatStepWalkthrough(content.stepByStep)}
                </div>
            </div>`;
        }
        
        if (content.visualization) {
            html += `<div class="content-block">
                <h3>Visualization Notes</h3>
                <p>${this.formatTextContent(content.visualization)}</p>
            </div>`;
        }
        
        return html;
    }

    generateProblemVariationsSectionHTML(content) {
        let html = '';
        
        if (content.variationsIntro) {
            html += `<p>${this.formatTextContent(content.variationsIntro)}</p>`;
        }
        
        if (content.variationsList) {
            html += `<div class="variations-grid">
                ${this.formatVariations(content.variationsList)}
            </div>`;
        }
        
        return html;
    }

    generatePracticeProblemsSectionHTML(content) {
        let html = '';
        
        if (content.practiceIntro) {
            html += `<p>${this.formatTextContent(content.practiceIntro)}</p>`;
        }
        
        if (content.beginnerProblems) {
            html += `<div class="problems-section">
                <h3>🟢 Beginner Problems</h3>
                <div class="problem-cards">
                    ${this.formatPracticeProblems(content.beginnerProblems)}
                </div>
            </div>`;
        }
        
        if (content.intermediateProblems) {
            html += `<div class="problems-section">
                <h3>🟡 Intermediate Problems</h3>
                <div class="problem-cards">
                    ${this.formatPracticeProblems(content.intermediateProblems)}
                </div>
            </div>`;
        }
        
        if (content.advancedProblems) {
            html += `<div class="problems-section">
                <h3>🔴 Advanced Problems</h3>
                <div class="problem-cards">
                    ${this.formatPracticeProblems(content.advancedProblems)}
                </div>
            </div>`;
        }
        
        return html;
    }

    generateOptimizationTipsSectionHTML(content) {
        let html = '';
        
        if (content.optimizationIntro) {
            html += `<p>${this.formatTextContent(content.optimizationIntro)}</p>`;
        }
        
        if (content.optimizationTips) {
            html += `<div class="tips-grid">
                ${this.formatTips(content.optimizationTips)}
            </div>`;
        }
        
        return html;
    }

    generateCommonMistakesSectionHTML(content) {
        let html = '';
        
        if (content.mistakesIntro) {
            html += `<p>${this.formatTextContent(content.mistakesIntro)}</p>`;
        }
        
        if (content.mistakesList) {
            html += `<div class="mistakes-grid">
                ${this.formatMistakes(content.mistakesList)}
            </div>`;
        }
        
        return html;
    }

    generateContestApplicationsSectionHTML(content) {
        let html = '';
        
        if (content.contestIntro) {
            html += `<p>${this.formatTextContent(content.contestIntro)}</p>`;
        }
        
        if (content.classicProblems) {
            html += `<div class="contest-section">
                <h3>🔍 Classic Binary Search Problems</h3>
                <div class="contest-cards">
                    ${this.formatContestProblems(content.classicProblems)}
                </div>
            </div>`;
        }
        
        if (content.bsOnAnswerProblems) {
            html += `<div class="contest-section">
                <h3>🎯 Binary Search on Answer Problems</h3>
                <div class="contest-cards">
                    ${this.formatContestProblems(content.bsOnAnswerProblems)}
                </div>
            </div>`;
        }
        
        if (content.advancedApplications) {
            html += `<div class="contest-section">
                <h3>🌊 Advanced Applications</h3>
                <div class="contest-cards">
                    ${this.formatContestProblems(content.advancedApplications)}
                </div>
            </div>`;
        }
        
        return html;
    }

    generateDefaultSectionHTML(content) {
        let html = '';
        
        if (content.mainContent) {
            html += `<div class="main-content">
                ${this.formatTextContent(content.mainContent)}
            </div>`;
        }
        
        if (content.keyPoints) {
            html += `<div class="key-points">
                <h4>Key Points:</h4>
                ${this.formatTextContent(content.keyPoints)}
            </div>`;
        }
        
        return html;
    }

    generateAuthoritySection(data) {
        return `
        <section class="authority-section">
            <h2>📝 Article Information</h2>
            <div class="authority-grid">
                <div class="authority-item">
                    <h4>Original Author</h4>
                    <p>${data.originalAuthor || 'Not specified'}</p>
                    ${data.authorAffiliation ? `<small>${data.authorAffiliation}</small>` : ''}
                </div>
                <div class="authority-item">
                    <h4>Creation Date</h4>
                    <p>${data.creationDate || 'Not specified'}</p>
                </div>
                <div class="authority-item">
                    <h4>Last Updated</h4>
                    <p>${data.lastUpdated || 'Not specified'}</p>
                </div>
                <div class="authority-item">
                    <h4>Version</h4>
                    <p>${data.version || '1.0'}</p>
                </div>
                ${data.contributors ? `
                <div class="authority-item">
                    <h4>Contributors</h4>
                    <p>${data.contributors}</p>
                </div>
                ` : ''}
            </div>
        </section>`;
    }

    getCSSPath() {
        const customPath = this.formData.customPath || '';
        
        if (!customPath) {
            // Default paths if no custom path specified
            return {
                cssPath: '../concepts-template.css',
                faviconPath: '../_img/favicon.svg.png'
            };
        }
        
        // Count directory levels to determine relative path
        // Remove the filename to count only directory levels
        const pathParts = customPath.split('/');
        const fileName = pathParts.pop(); // Remove filename
        const levels = pathParts.length;
        
        let cssPath, faviconPath;
        
        if (levels === 1) {
            // File is directly in concepts/ directory
            cssPath = 'concepts-template.css';
            faviconPath = '_img/favicon.svg.png';
        } else if (levels === 2) {
            // File is in concepts/subdirectory/ (like concepts/algorithms/)
            cssPath = '../concepts-template.css';
            faviconPath = '../_img/favicon.svg.png';
        } else {
            // File is deeper, need more ../
            const prefix = '../'.repeat(levels - 1);
            cssPath = `${prefix}concepts-template.css`;
            faviconPath = `${prefix}_img/favicon.svg.png`;
        }
        
        return { cssPath, faviconPath };
    }

    generateMetaJSON() {
        const data = this.formData;
        const customPath = data.customPath || '';
        const fileName = customPath.split('/').pop() || 'article.html';
        
        return {
            title: data.documentTitle || 'Algorithm Article',
            description: data.documentDescription || 'Algorithm tutorial for competitive programming',
            level: data.documentLevel || 'Beginner',
            author: data.originalAuthor || 'Unknown',
            lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0],
            readingTime: parseInt(data.readingTime) || 15,
            fileName: fileName,
            featured: this.featuredElements.length > 0 ? this.featuredElements : undefined,
            sections: this.selectedSections.map(s => s.name),
            complexity: {
                time: data.timeComplexity || 'Not specified',
                space: data.spaceComplexity || 'Not specified'
            }
        };
    }

    generateFileInstructions() {
        const data = this.formData;
        const customPath = data.customPath || 'concepts/your-algorithm.html';
        const pathParts = customPath.split('/');
        const fileName = pathParts.pop();
        const directory = pathParts.join('/');
        
        return `
            <h4>File Structure Instructions:</h4>
            <ol>
                <li><strong>HTML File Location:</strong><br>
                    Save the generated HTML as: <code style="background: var(--slate-600); padding: 0.2rem 0.5rem; border-radius: 3px;">${customPath}</code>
                </li>
                <li><strong>Meta.json Update:</strong><br>
                    Add the generated JSON entry to: <code style="background: var(--slate-600); padding: 0.2rem 0.5rem; border-radius: 3px;">${directory}/meta.json</code>
                </li>
                <li><strong>Directory Structure:</strong><br>
                    Ensure the directory <code style="background: var(--slate-600); padding: 0.2rem 0.5rem; border-radius: 3px;">${directory}</code> exists in your project
                </li>
            </ol>
            
            <div style="margin-top: 1rem; padding: 1rem; background: var(--slate-600); border-radius: 5px; border-left: 4px solid var(--teal);">
                <strong>💡 Quick Setup:</strong><br>
                1. Create the directory if it doesn't exist<br>
                2. Save the HTML file<br>
                3. Update the meta.json with the provided JSON<br>
                4. Test the article in your local environment
            </div>
        `;
    }

    formatSteps(stepsText) {
        if (!stepsText) return '';
        
        const steps = stepsText.split('\n').filter(line => line.trim());
        return steps.map((step, index) => {
            const cleanStep = step.replace(/^\d+\.\s*/, '').trim();
            return `<div class="step-item">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">${cleanStep}</div>
            </div>`;
        }).join('');
    }

    formatListContent(text) {
        if (!text) return '';
        
        // Handle bullet points and lists
        if (text.includes('\n- ') || text.includes('\n• ')) {
            const items = text.split('\n').filter(line => line.trim());
            let html = '<ul>';
            items.forEach(item => {
                const cleaned = item.replace(/^[-•]\s*/, '').trim();
                if (cleaned) {
                    html += `<li>${cleaned}</li>`;
                }
            });
            html += '</ul>';
            return html;
        }
        
        return `<p>${text}</p>`;
    }

    formatStepWalkthrough(text) {
        if (!text) return '';
        
        const steps = text.split(/Step \d+:/).filter(step => step.trim());
        return steps.map((step, index) => {
            const content = step.trim();
            if (!content) return '';
            
            return `<div class="walkthrough-step">
                <div class="step-header">Step ${index + 1}</div>
                <div class="step-details">${content.replace(/\n/g, '<br>')}</div>
            </div>`;
        }).join('');
    }

    formatVariations(variationsText) {
        if (!variationsText) return '';
        
        const variations = variationsText.split('\n').filter(line => line.trim() && line.includes('|'));
        return variations.map(variation => {
            const parts = variation.split('|').map(part => part.trim());
            if (parts.length >= 3) {
                const [icon_title, description, difficulty] = parts;
                const [icon, title] = icon_title.split(' ', 2);
                
                return `<div class="variation-card">
                    <div class="variation-header">
                        <span class="variation-icon">${icon}</span>
                        <span class="variation-title">${title}</span>
                        <span class="difficulty-badge difficulty-${difficulty.toLowerCase()}">${difficulty}</span>
                    </div>
                    <p class="variation-description">${description}</p>
                </div>`;
            }
            return '';
        }).join('');
    }

    formatPracticeProblems(problemsText) {
        if (!problemsText) return '';
        
        const problems = problemsText.split('\n').filter(line => line.trim() && line.includes('|'));
        return problems.map(problem => {
            const parts = problem.split('|').map(part => part.trim());
            if (parts.length >= 6) {
                const [title, platform, difficulty, topic, description, url] = parts;
                
                return `<div class="problem-card">
                    <div class="problem-header">
                        <h4 class="problem-title">${title}</h4>
                        <div class="problem-meta">
                            <span class="platform-badge">${platform}</span>
                            <span class="difficulty-badge difficulty-${difficulty.toLowerCase()}">${difficulty}</span>
                        </div>
                    </div>
                    <div class="problem-topic">${topic}</div>
                    <p class="problem-description">${description}</p>
                    <a href="${url}" target="_blank" class="problem-link">Solve Problem →</a>
                </div>`;
            }
            return '';
        }).join('');
    }

    formatTips(tipsText) {
        if (!tipsText) return '';
        
        const tips = tipsText.split('\n').filter(line => line.trim() && line.includes('|'));
        return tips.map(tip => {
            const parts = tip.split('|').map(part => part.trim());
            if (parts.length >= 2) {
                const [icon_title, description] = parts;
                const [icon, ...titleParts] = icon_title.split(' ');
                const title = titleParts.join(' ');
                
                return `<div class="tip-card">
                    <div class="tip-header">
                        <span class="tip-icon">${icon}</span>
                        <span class="tip-title">${title}</span>
                    </div>
                    <p class="tip-description">${description}</p>
                </div>`;
            }
            return '';
        }).join('');
    }

    formatMistakes(mistakesText) {
        if (!mistakesText) return '';
        
        const mistakes = mistakesText.split('\n').filter(line => line.trim() && line.includes('|'));
        return mistakes.map(mistake => {
            const parts = mistake.split('|').map(part => part.trim());
            if (parts.length >= 4) {
                const [icon_title, description, wrongCode, correctCode] = parts;
                const [icon, ...titleParts] = icon_title.split(' ');
                const title = titleParts.join(' ');
                
                return `<div class="mistake-card">
                    <div class="mistake-header">
                        <span class="mistake-icon">${icon}</span>
                        <span class="mistake-title">${title}</span>
                    </div>
                    <p class="mistake-description">${description}</p>
                    <div class="code-comparison">
                        <div class="wrong-code">
                            <div class="code-label">❌ Wrong</div>
                            <code>${wrongCode}</code>
                        </div>
                        <div class="correct-code">
                            <div class="code-label">✅ Correct</div>
                            <code>${correctCode}</code>
                        </div>
                    </div>
                </div>`;
            }
            return '';
        }).join('');
    }

    formatContestProblems(problemsText) {
        if (!problemsText) return '';
        
        const problems = problemsText.split('\n').filter(line => line.trim() && line.includes('|'));
        return problems.map(problem => {
            const parts = problem.split('|').map(part => part.trim());
            if (parts.length >= 5) {
                const [title, contest, year, difficulty, description] = parts;
                
                return `<div class="contest-card">
                    <div class="contest-header">
                        <h4 class="contest-title">${title}</h4>
                        <span class="difficulty-badge difficulty-${difficulty.toLowerCase()}">${difficulty}</span>
                    </div>
                    <div class="contest-meta">
                        <span class="contest-name">${contest}</span>
                        <span class="contest-year">${year}</span>
                    </div>
                    <p class="contest-description">${description}</p>
                </div>`;
            }
            return '';
        }).join('');
    }

    formatTextContent(text) {
        if (!text) return '';
        
        // Convert newlines to paragraphs and handle basic formatting
        return text
            .split('\n\n')
            .map(paragraph => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    // Handle lists
                    const items = trimmed.split('\n').filter(item => item.trim());
                    const listItems = items.map(item => {
                        const cleaned = item.replace(/^[-•]\s*/, '').trim();
                        return `<li>${cleaned}</li>`;
                    }).join('');
                    return `<ul>${listItems}</ul>`;
                } else if (trimmed.match(/^\d+\./)) {
                    // Handle numbered lists
                    const items = trimmed.split('\n').filter(item => item.trim());
                    const listItems = items.map(item => {
                        const cleaned = item.replace(/^\d+\.\s*/, '').trim();
                        return `<li>${cleaned}</li>`;
                    }).join('');
                    return `<ol>${listItems}</ol>`;
                } else {
                    return `<p>${trimmed}</p>`;
                }
            })
            .join('');
    }

    downloadHTML() {
        const html = this.generateHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const customPath = this.formData.customPath || 'algorithm-article.html';
        const fileName = customPath.split('/').pop() || 'algorithm-article.html';
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('HTML file downloaded successfully!', 'success');
    }

    copyToClipboard() {
        const html = this.generateHTML();
        navigator.clipboard.writeText(html).then(() => {
            this.showNotification('HTML copied to clipboard!', 'success');
        });
    }

    copyMetaJSON() {
        const metaJSON = this.generateMetaJSON();
        navigator.clipboard.writeText(JSON.stringify(metaJSON, null, 2)).then(() => {
            this.showNotification('Meta JSON copied to clipboard!', 'success');
        });
    }

    updateProgress(step) {
        for (let i = 1; i <= 4; i++) {
            const stepElement = document.getElementById(`step${i}`);
            const numberElement = stepElement.querySelector('.step-number');
            
            if (i < step) {
                stepElement.classList.remove('active');
                stepElement.classList.add('completed');
                numberElement.classList.remove('active');
                numberElement.classList.add('completed');
                numberElement.innerHTML = '✓';
            } else if (i === step) {
                stepElement.classList.remove('completed');
                stepElement.classList.add('active');
                numberElement.classList.remove('completed');
                numberElement.classList.add('active');
                numberElement.innerHTML = i;
            } else {
                stepElement.classList.remove('active', 'completed');
                numberElement.classList.remove('active', 'completed');
                numberElement.innerHTML = i;
            }
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // File upload handling
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const uploadStatus = document.getElementById('uploadStatus');
        uploadStatus.style.display = 'block';
        uploadStatus.className = 'upload-status loading';
        uploadStatus.innerHTML = '📤 Uploading and parsing file...';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.parseUploadedHTML(e.target.result);
                uploadStatus.className = 'upload-status success';
                uploadStatus.innerHTML = '✅ File uploaded and parsed successfully!';
            } catch (error) {
                uploadStatus.className = 'upload-status error';
                uploadStatus.innerHTML = `❌ Error parsing file: ${error.message}`;
            }
        };
        reader.readAsText(file);
    }

    parseUploadedHTML(htmlContent) {
        // Simple HTML parsing for demo purposes
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Extract basic information
        const title = doc.querySelector('title')?.textContent?.replace(' - std::Learn', '') || 'Parsed Article';
        const h1 = doc.querySelector('h1')?.textContent || title;
        const subtitle = doc.querySelector('.article-subtitle')?.textContent || '';
        
        // Populate form fields
        document.getElementById('documentTitle').value = h1;
        document.getElementById('documentDescription').value = subtitle;
        
        // Show parsed info
        const parsedInfo = document.getElementById('parsedInfo');
        parsedInfo.style.display = 'block';
        parsedInfo.querySelector('#parsedContent').innerHTML = `
            <p><strong>Title:</strong> ${h1}</p>
            <p><strong>Subtitle:</strong> ${subtitle}</p>
            <p><strong>Sections found:</strong> ${doc.querySelectorAll('section').length}</p>
            <p class="note">The form has been pre-filled with the extracted information. You can now edit and update the content.</p>
        `;
        
        this.showNotification('Article parsed successfully! Review and edit as needed.', 'success');
    }
}

// Global functions for onclick handlers
let generator;

function init() {
    generator = new TemplateGenerator();
}

function addFeaturedElement() {
    generator.addFeaturedElement();
}

function proceedToSections() {
    generator.proceedToSections();
}

function goBackToBasicInfo() {
    generator.goBackToBasicInfo();
}

function generatePreview() {
    generator.generatePreview();
}

function goBackToSections() {
    generator.goBackToSections();
}

function downloadHTML() {
    generator.downloadHTML();
}

function copyToClipboard() {
    generator.copyToClipboard();
}

function copyMetaJSON() {
    generator.copyMetaJSON();
}

function saveSection() {
    generator.saveSection();
}

function closeEditor() {
    generator.closeEditor();
}

function handleFileUpload(event) {
    generator.handleFileUpload(event);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
