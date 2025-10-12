// Organization Management JavaScript
// Handles all interactive functionality for organization profile and member management

// Initialize global variables
let currentMembers = [];
let memberIdCounter = 1;
let eventListeners = []; // Track event listeners for cleanup

// Track the last focused element before opening modal
let lastFocusedElement = null;

// Show modal function with accessibility improvements
function showModal(modal) {
    if (!modal) return;
    
    // Store the currently focused element
    lastFocusedElement = document.activeElement;
    
    // Remove aria-hidden and set role
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    // Show modal
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.setAttribute('data-dismiss', 'modal');
    document.body.appendChild(backdrop);
    
    // Focus the first focusable element in the modal
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    
    // Trap focus inside the modal
    trapFocus(modal);
}

// Hide modal function with cleanup
function hideModal(modal) {
    if (!modal) return;
    
    // Hide modal
    modal.style.display = 'none';
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
    
    // Remove backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    
    // Return focus to the element that had focus before the modal opened
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

// Trap focus inside modal for better keyboard navigation
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        } else if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                hideModal(openModal);
                const form = openModal.querySelector('form');
                if (form) form.reset();
            }
        }
    });
}

// Add event listener helper with cleanup tracking
function addListener(element, event, handler) {
    if (!element) return;
    element.addEventListener(event, handler);
    eventListeners.push({ element, event, handler });
}

// Cleanup event listeners
function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    eventListeners = [];
}

// Initialize modal functionality
function initializeModals() {
    console.log('Modal initialization not required');
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize the application
    initializeApp();
    initializeTabs();
    
    // Cleanup on page unload
    addListener(window, 'beforeunload', cleanupEventListeners);
});

function initializeApp() {
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Initialize organization profile functionality
    initializeOrganizationProfile();
    
    // Initialize member management
    initializeMemberManagement();
    
    // Initialize modals
    initializeModals();
    
    // Load sample data
    loadSampleData();
}

// Tab switching functionality
function initializeTabs() {
    console.log('Initializing tabs...');
    
    // Get all tab buttons and content sections
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.profile-container');
    
    // Debug: Log found elements
    console.log('Tab buttons:', tabButtons);
    console.log('Tab contents:', tabContents);
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.error('No tab buttons or content sections found');
        return;
    }
    
    // Function to switch tabs
    const switchTab = (targetTab) => {
        console.log('Switching to tab:', targetTab);
        
        // Update active tab button
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === targetTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show the selected tab content
        tabContents.forEach(content => {
            if (content.id === targetTab) {
                console.log('Showing content for:', content.id);
                content.style.display = 'block';
                // Trigger a custom event when a tab is shown
                content.dispatchEvent(new Event('tabShown', { bubbles: true }));
            } else {
                content.style.display = 'none';
            }
        });
        
        // Update URL hash for bookmarking
        window.location.hash = targetTab;
    };

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            console.log('Tab clicked:', targetTab);
            switchTab(targetTab);
        });
    });
    
    // Function to handle initial tab display
    const initTabDisplay = () => {
        // Check URL hash first
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const targetTabButton = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
            if (targetTabButton) {
                console.log('Found hash in URL, switching to:', hash);
                switchTab(hash);
                return;
            }
        }
        
        // Otherwise, check for active tab
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const targetTab = activeTab.getAttribute('data-tab');
            console.log('Found active tab, switching to:', targetTab);
            switchTab(targetTab);
        } 
        // If no active tab and no hash, activate the first tab
        else if (tabButtons.length > 0) {
            const firstTab = tabButtons[0].getAttribute('data-tab');
            console.log('No active tab found, defaulting to first tab:', firstTab);
            tabButtons[0].classList.add('active');
            switchTab(firstTab);
        }
    };
    
    // Initialize tab display
    initTabDisplay();
}

// Sidebar functionality
function initializeSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-active');
        });
    }
    
    // Profile navigation
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            const profileUrl = this.getAttribute('data-profile-url');
            if (profileUrl) {
                window.location.href = profileUrl;
            }
        });
    }
}

// Organization Profile functionality
function initializeOrganizationProfile() {
    const viewDetailsBtn = document.getElementById('view-details-btn');
    const orgDetailsSection = document.getElementById('org-details-section');
    const hideDetailsBtn = document.getElementById('hide-details-btn');
    const editOrgBtn = document.getElementById('edit-organization-btn');
    const editOrgModal = document.getElementById('edit-org-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const saveOrgBtn = document.getElementById('save-org-btn');
    const editOrgForm = document.getElementById('edit-org-form');
    
    // View details button - show all details section
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            showOrganizationDetails();
        });
    }
    
    // Hide details button
    if (hideDetailsBtn) {
        hideDetailsBtn.addEventListener('click', function() {
            hideOrganizationDetails();
        });
    }
    
    // Edit organization button
    if (editOrgBtn) {
        editOrgBtn.addEventListener('click', function() {
            showEditForm();
        });
    }
    
    // Close edit modal
    if (closeEditModal) {
        closeEditModal.addEventListener('click', function() {
            hideModal(editOrgModal);
        });
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            hideModal(editOrgModal);
        });
    }
    
    // Save organization changes
    if (saveOrgBtn) {
        saveOrgBtn.addEventListener('click', function() {
            saveOrganizationChanges();
        });
    }
    
    // Character counter for description
    const descTextarea = document.getElementById('edit-org-description');
    const charCounter = document.getElementById('desc-count');
    
    if (descTextarea && charCounter) {
        descTextarea.addEventListener('input', function() {
            charCounter.textContent = this.value.length;
        });
    }
    
    // File upload preview
    const fileInput = document.getElementById('edit-org-image');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFileUpload(this);
        });
    }
}

// Member Management functionality
function initializeMemberManagement() {
    const addMemberBtn = document.getElementById('add-member-btn');
    const addMemberModal = document.getElementById('add-member-modal');
    const closeAddModal = document.getElementById('close-add-member-modal');
    const cancelAddBtn = document.getElementById('cancel-add-member');
    const addMemberForm = document.getElementById('add-member-form');
    const memberSearch = document.getElementById('member-search');
    
    // Add member button
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', function() {
            resetAddMemberForm();
            showModal(addMemberModal);
        });
    }
    
    // Close add member modal
    if (closeAddModal) {
        closeAddModal.addEventListener('click', function() {
            hideModal(addMemberModal);
        });
    }
    
    // Cancel add member
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', function() {
            hideModal(addMemberModal);
        });
    }
    
    // Handle form submission
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewMember();
        });
    }
    
    // Search functionality
    if (memberSearch) {
        memberSearch.addEventListener('input', function() {
            filterMembers(this.value);
        });
    }
    
    // Initialize with sample data if no members exist
    if (currentMembers.length === 0) {
        loadSampleData();
    }
}

// Modal functionality
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                hideModal(activeModal);
            }
        }
    });
}

// Sample data
const sampleMembers = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Officer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Member",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Officer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 4,
        name: "David Kim",
        role: "Member",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
        id: 5,
        name: "Lisa Thompson",
        role: "Member",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
];

// Initialize with sample data if no members exist
if (currentMembers.length === 0) {
    currentMembers = [...sampleMembers];
    memberIdCounter = sampleMembers.length + 1;
}

// Load sample data
function loadSampleData() {
    renderMembers(currentMembers);
    updateMemberCount();
}

// Helper function to add event listeners with cleanup
function addListener(element, event, handler, options) {
    if (!element) return null;
    element.addEventListener(event, handler, options);
    eventListeners.push({ element, event, handler });
    return handler;
}

// Cleanup all event listeners
function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    eventListeners = [];
}

// Modal functions
function showModal(modal) {
    try {
        if (!modal) return;
        
        // First remove display: none if it's set inline
        modal.style.display = '';
        
        // Add the active class
        modal.classList.add('active');
        modal.classList.add('show');
        
        // Add overflow hidden to body
        document.body.style.overflow = 'hidden';
        
        // Add escape key handler for this modal
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                hideModal(modal);
            }
        };
        
        // Add click outside handler
        const clickOutsideHandler = (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        };
        
        addListener(document, 'keydown', escapeHandler);
        addListener(modal, 'click', clickOutsideHandler);
        
        // Trigger a reflow to ensure the transition works
        void modal.offsetWidth;
        
    } catch (error) {
        console.error('Error showing modal:', error);
    }
}

function hideModal(modal) {
    try {
        if (!modal) return;
        
        // Remove active class
        modal.classList.remove('active');
        modal.classList.remove('show');
        
        // Reset body overflow
        document.body.style.overflow = 'auto';
        
        // Cleanup any modal-specific event listeners
        cleanupEventListeners();
    } catch (error) {
        console.error('Error hiding modal:', error);
    }
}

// Cleanup on page unload
addListener(window, 'beforeunload', cleanupEventListeners);

// Organization profile functions
function showOrganizationDetails() {
    const orgDetailsSection = document.getElementById('org-details-section');
    const viewDetailsBtn = document.getElementById('view-details-btn');
    
    if (orgDetailsSection && viewDetailsBtn) {
        orgDetailsSection.style.display = 'block';
        viewDetailsBtn.style.display = 'none';
        
        // Smooth scroll to details
        orgDetailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function hideOrganizationDetails() {
    const orgDetailsSection = document.getElementById('org-details-section');
    const viewDetailsBtn = document.getElementById('view-details-btn');
    
    if (orgDetailsSection && viewDetailsBtn) {
        orgDetailsSection.style.display = 'none';
        viewDetailsBtn.style.display = 'inline-flex';
    }
}

function showEditForm() {
    const editForm = document.getElementById('edit-org-form');
    const orgDetailsSection = document.getElementById('org-details-section');
    
    if (editForm) {
        // Hide the details section and show the edit form
        if (orgDetailsSection) {
            orgDetailsSection.style.display = 'none';
        }
        
        // Populate form fields with current values
        populateEditForm();
        
        // Show the edit form
        editForm.style.display = 'block';
        
        // Scroll to the top of the form
        editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function populateEditForm() {
    // Get the organization name and description from the profile
    const orgName = document.getElementById('org-name')?.textContent.trim();
    const orgDescription = document.getElementById('org-description')?.textContent.trim();
    
    // Populate the form fields
    const nameInput = document.getElementById('org-name-input');
    const descriptionInput = document.getElementById('org-description');
    
    if (nameInput && orgName) {
        nameInput.value = orgName;
    }
    
    if (descriptionInput && orgDescription) {
        descriptionInput.value = orgDescription;
    }
}

function cancelEdit() {
    const editForm = document.getElementById('edit-org-form');
    const orgDetailsSection = document.getElementById('org-details-section');
    
    if (editForm) {
        editForm.style.display = 'none';
    }
    
    if (orgDetailsSection) {
        orgDetailsSection.style.display = 'block';
    }
}

function saveOrganizationChanges(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('org-name-input')?.value.trim();
    const description = document.getElementById('org-description')?.value.trim();
    
    // Basic validation
    if (!name) {
        showError('name-error', 'Organization name is required');
        return;
    }
    
    if (!description) {
        showError('description-error', 'Description is required');
        return;
    }
    
    // Update the organization profile
    const orgNameElement = document.getElementById('org-name');
    const orgDescriptionElement = document.getElementById('org-description');
    
    if (orgNameElement) orgNameElement.textContent = name;
    if (orgDescriptionElement) orgDescriptionElement.textContent = description;
    
    // Show success message
    showSuccessMessage('Organization profile updated successfully!');
    
    // Switch back to view mode
    cancelEdit();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cancel edit button
    const cancelEditBtn = document.getElementById('cancel-edit-org');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            cancelEdit();
        });
    }

    // Save organization form submission
    const editOrgForm = document.getElementById('edit-org-form');
    if (editOrgForm) {
        editOrgForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveOrganizationChanges(e);
        });
    }

    // Add member form submission
    const addMemberForm = document.getElementById('add-member-form');
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewMember();
        });
    }

    // Character counter for organization description
    const descriptionInput = document.getElementById('org-description');
    if (descriptionInput) {
        descriptionInput.addEventListener('input', function() {
            const charCount = this.value.length;
            const charCounter = document.getElementById('char-count');
            if (charCounter) {
                charCounter.textContent = charCount;
            }
        });
    }
});

function saveOrganizationChanges() {
    const nameInput = document.getElementById('edit-org-name');
    const descInput = document.getElementById('edit-org-description');
    const imageInput = document.getElementById('edit-org-image');
    
    // Clear previous errors
    clearErrors();
    
    let isValid = true;
    
    // Validate organization name
    if (!nameInput.value.trim()) {
        showError('name-error', 'Organization name is required.');
        isValid = false;
    }
    
    // Validate description
    if (!descInput.value.trim()) {
        showError('desc-error', 'Description is required.');
        isValid = false;
    }
    
    // Validate file if selected
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
            showError('image-error', 'Please upload a JPG or PNG image.');
            isValid = false;
        } else if (file.size > maxSize) {
            showError('image-error', 'File size must be less than 10MB.');
            isValid = false;
        }
    }
    
    if (isValid) {
        // Update the organization info
        document.getElementById('org-name').textContent = nameInput.value.trim();
        document.getElementById('org-description').textContent = descInput.value.trim();
        document.getElementById('detail-org-name').textContent = nameInput.value.trim();
        document.getElementById('detail-org-description').textContent = descInput.value.trim();
        
        // Update profile image if selected
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('org-profile-img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        
        // Close modal and show success message
        hideModal(document.getElementById('edit-org-modal'));
        showSuccessMessage('Profile updated successfully!');
        
        // Reset form
        document.getElementById('edit-org-form').reset();
        document.getElementById('desc-count').textContent = '0';
    }
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError('image-error', 'Please upload a JPG or PNG image.');
            input.value = '';
            return;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showError('image-error', 'File size must be less than 10MB.');
            input.value = '';
            return;
        }
        
        // Clear any previous errors
        clearError('image-error');
    }
}

// Member management functions
function renderMembers(members) {
    const membersList = document.getElementById('members-list');
    
    if (members.length === 0) {
        membersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No members found</h3>
                <p>Try adjusting your search or add new members to get started.</p>
            </div>
        `;
        return;
    }
    
    membersList.innerHTML = members.map(member => `
        <div class="member-item" data-member-id="${member.id}">
            <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-role">
                    <span class="role-badge ${member.role.toLowerCase()}">${member.role}</span>
                </div>
            </div>
            <div class="member-actions">
                <button class="btn btn-sm ${member.role === 'Officer' ? 'btn-demote' : 'btn-promote'}" 
                        onclick="${member.role === 'Officer' ? 'demoteMember' : 'promoteMember'}(${member.id})">
                    <i class="fas ${member.role === 'Officer' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    ${member.role === 'Officer' ? 'Demote' : 'Promote'}
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmRemoveMember(${member.id}, '${member.name}')">
                    <i class="fas fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

function filterMembers(searchTerm) {
    const filteredMembers = currentMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderMembers(filteredMembers);
}

function addNewMember() {
    const emailInput = document.getElementById('member-email');
    const roleSelect = document.getElementById('member-role');
    
    // Clear previous errors
    clearMemberErrors();
    
    let isValid = true;
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        showError('member-email-error', 'Email address is required.');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        showError('member-email-error', 'Please enter a valid email address.');
        isValid = false;
    }
    
    // Validate role
    if (!roleSelect.value) {
        showError('member-role-error', 'Please select a role.');
        isValid = false;
    }
    
    if (isValid) {
        // Extract username from email (part before @)
        const username = emailInput.value.trim().split('@')[0];
        const formattedName = username.split('.').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        const newMember = {
            id: memberIdCounter++,
            name: formattedName,
            email: emailInput.value.trim(),
            role: roleSelect.value.charAt(0).toUpperCase() + roleSelect.value.slice(1), // Capitalize first letter
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=2563eb&color=fff&size=150`,
            status: 'pending' // New members are pending by default
        };
        
        currentMembers.push(newMember);
        renderMembers(currentMembers);
        updateMemberCount();
        hideModal(document.getElementById('add-member-modal'));
        showSuccessMessage('Member invitation sent successfully!');
        
        // Reset form
        resetAddMemberForm();
    }
}

// Update the renderMembers function to handle the new member structure
function renderMembers(members) {
    const tbody = document.querySelector('#members-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    members.forEach(member => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="member-info">
                <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
                <div>
                    <div class="member-name">${member.name}</div>
                    <div class="member-email">${member.email || 'No email'}</div>
                </div>
            </td>
            <td><span class="role-badge ${member.role.toLowerCase()}">${member.role}</span></td>
            <td><span class="status-badge ${member.status || 'active'}">${member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'Active'}</span></td>
            <td class="actions">
                ${member.role.toLowerCase() === 'member' ? 
                    `<button class="btn-icon" onclick="promoteMember(${member.id})" title="Promote to Admin">
                        <i class="fas fa-arrow-up"></i>
                    </button>` : 
                    member.role.toLowerCase() === 'admin' ?
                    `<button class="btn-icon" onclick="demoteMember(${member.id})" title="Demote to Member">
                        <i class="fas fa-arrow-down"></i>
                    </button>` : ''
                }
                <button class="btn-icon danger" onclick="confirmRemoveMember(${member.id}, '${member.name}')" title="Remove Member">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function promoteMember(memberId) {
    const member = currentMembers.find(m => m.id === memberId);
    if (member && member.role === 'Member') {
        member.role = 'Officer';
        renderMembers(currentMembers);
        showSuccessMessage(`${member.name} has been promoted to Officer!`);
    }
}

function demoteMember(memberId) {
    const member = currentMembers.find(m => m.id === memberId);
    if (member && member.role === 'Officer') {
        member.role = 'Member';
        renderMembers(currentMembers);
        showSuccessMessage(`${member.name} has been demoted to Member.`);
    }
}

function confirmRemoveMember(memberId, memberName) {
    const removeModal = document.getElementById('remove-member-modal');
    const removeMemberName = document.getElementById('remove-member-name');
    
    removeMemberName.textContent = memberName;
    
    // Store the member ID for removal
    removeModal.dataset.memberId = memberId;
    
    showModal(removeModal);
    
    // Set up the confirm button
    const confirmRemoveBtn = document.getElementById('confirm-remove-btn');
    const cancelRemoveBtn = document.getElementById('cancel-remove-btn');
    const closeRemoveModal = document.getElementById('close-remove-modal');
    
    // Remove existing listeners
    const newConfirmBtn = confirmRemoveBtn.cloneNode(true);
    confirmRemoveBtn.parentNode.replaceChild(newConfirmBtn, confirmRemoveBtn);
    
    const newCancelBtn = cancelRemoveBtn.cloneNode(true);
    cancelRemoveBtn.parentNode.replaceChild(newCancelBtn, cancelRemoveBtn);
    
    const newCloseBtn = closeRemoveModal.cloneNode(true);
    closeRemoveModal.parentNode.replaceChild(newCloseBtn, closeRemoveModal);
    
    // Add new listeners
    newConfirmBtn.addEventListener('click', function() {
        removeMember(memberId);
        hideModal(removeModal);
    });
    
    newCancelBtn.addEventListener('click', function() {
        hideModal(removeModal);
    });
    
    newCloseBtn.addEventListener('click', function() {
        hideModal(removeModal);
    });
}

function removeMember(memberId) {
    const member = currentMembers.find(m => m.id === memberId);
    if (member) {
        // Find the member element and add removing class
        const memberElement = document.querySelector(`[data-member-id="${memberId}"]`);
        if (memberElement) {
            memberElement.classList.add('removing');
            
            // Remove from array after animation
            setTimeout(() => {
                currentMembers = currentMembers.filter(m => m.id !== memberId);
                renderMembers(currentMembers);
                updateMemberCount();
                showSuccessMessage(`${member.name} has been removed from the organization.`);
            }, 300);
        }
    }
}

function updateMemberCount() {
    const memberCountElement = document.getElementById('member-count');
    if (memberCountElement) {
        memberCountElement.textContent = currentMembers.length;
    }
}

function resetAddMemberForm() {
    document.getElementById('add-member-form').reset();
    clearMemberErrors();
}

// Utility functions
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function clearErrors() {
    clearError('name-error');
    clearError('desc-error');
    clearError('image-error');
}

function clearMemberErrors() {
    clearError('member-name-error');
    clearError('member-role-error');
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    const successText = document.getElementById('success-text');
    
    if (successMessage && successText) {
        successText.textContent = message;
        successMessage.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }
}
