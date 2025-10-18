document.addEventListener('DOMContentLoaded', () => {
  // Manage Programs Chips
  const openModalBtn = document.getElementById('openModalBtn');
  const displayChips = document.getElementById('displayChips');

  // Function to create a chip
  function createChip(name, id = null) {
    const chip = document.createElement('span');
    chip.className = "inline-flex items-center bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full";

    // Chip text
    const text = document.createElement('span');
    text.textContent = name;
    chip.appendChild(text);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '×';
    removeBtn.className = 'ml-2 text-blue-700 font-bold';
    removeBtn.addEventListener('click', () => chip.remove());
    chip.appendChild(removeBtn);

    if (id) chip.dataset.id = id; // store program id if exists
    return chip;
  }

  // Add program via prompt
  openModalBtn?.addEventListener('click', () => {
    const programName = prompt("Enter program name:");
    if (programName) {
      const chip = createChip(programName);
      displayChips.appendChild(chip);

      // Remove placeholder text if exists
      const placeholder = displayChips.querySelector('.text-gray-400');
      if (placeholder) placeholder.remove();
    }
  });

  // Submit form data
  const form = document.getElementById('organizationForm');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Collect program IDs or names
    const allowedPrograms = Array.from(displayChips.children)
                                .filter(chip => !chip.classList.contains('text-gray-400'))
                                .map(chip => chip.dataset.id || chip.textContent);

    const formData = new FormData();
    formData.append('org_name', document.getElementById('org-name').value);
    formData.append('org_adviser', document.getElementById('org-adviser').value);
    formData.append('org_about', document.getElementById('org-about').value);
    formData.append('is_public', document.getElementById('is-public').value);

    allowedPrograms.forEach(prog => formData.append('allowed_programs', prog));

    try {
      const response = await fetch(window.location.href, { // POST to current page
        method: 'POST',
        headers: { 'X-CSRFToken': csrfToken },
        body: formData
      });

      if (response.redirected) {
        window.location.href = response.url; // redirect after success
      } else {
        alert("Organization updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  });
});

// Programs Modal
const programsModal = document.getElementById('programsModal');
document.getElementById('openProgramsModal').addEventListener('click', () => programsModal.classList.remove('hidden'));
document.getElementById('closeProgramsModal').addEventListener('click', () => programsModal.classList.add('hidden'));
document.getElementById('cancelPrograms').addEventListener('click', () => programsModal.classList.add('hidden'));

document.getElementById('savePrograms').addEventListener('click', () => {
  const chips = document.getElementById('displayChips');
  chips.innerHTML = ''; // Clear old chips
  const selected = Array.from(document.querySelectorAll('.program-checkbox:checked'));
  if(selected.length === 0){
    chips.innerHTML = '<span class="text-gray-400 text-sm italic">No programs selected yet</span>';
  } else {
    selected.forEach(prog => {
      const chip = document.createElement('span');
      chip.className = "inline-flex items-center bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full";
      chip.textContent = prog.nextElementSibling.textContent;
      chip.dataset.id = prog.value;
      chips.appendChild(chip);
    });
  }
  programsModal.classList.add('hidden');
});