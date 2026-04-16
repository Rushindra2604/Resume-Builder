let resumeData = {
  name: "", email: "", phone: "", linkedin: "", github: "",
  summary: "", skills: "", education: "",
  projects: [], customSections: []
};

// INPUT LISTENER
document.querySelectorAll("input, textarea").forEach(input => {
  input.addEventListener("input", updateData);
});

function updateData() {
  resumeData.name = document.getElementById("name").value;
  resumeData.email = document.getElementById("email").value;
  resumeData.phone = document.getElementById("phone").value;
  resumeData.linkedin = document.getElementById("linkedin").value;
  resumeData.github = document.getElementById("github").value;
  resumeData.summary = document.getElementById("summary").value;
  resumeData.skills = document.getElementById("skills").value;
  resumeData.education = document.getElementById("education").value;

  updatePreview();
}

// ROLE DETECTION
function detectRole(skills) {
  const s = skills.toLowerCase();

  if (s.includes("react") || s.includes("html") || s.includes("css")) return "frontend developer";
  if (s.includes("node") || s.includes("mongodb")) return "backend developer";
  if (s.includes("python") || s.includes("java")) return "software developer";

  return "developer";
}

// PREVIEW
function updatePreview() {
  document.getElementById("previewName").textContent =
    resumeData.name || "Your Name";

  document.getElementById("previewContact").textContent =
    `${resumeData.email || ""} ${resumeData.phone ? "| " + resumeData.phone : ""} ${resumeData.linkedin ? "| " + resumeData.linkedin : ""} ${resumeData.github ? "| " + resumeData.github : ""}`;

  document.getElementById("previewSummary").innerHTML =
    resumeData.summary.replace(/\n/g, "<br>");

  // SKILLS
  const skillsList = document.getElementById("previewSkills");
  skillsList.innerHTML = "";

  const skillsArray = resumeData.skills.split(/,|\n/).map(s => s.trim()).filter(s => s);
  const lowerSkills = skillsArray.map(s => s.toLowerCase());

  let frontend = [], backend = [], tools = [], languages = [], others = [];

  lowerSkills.forEach((skill, i) => {
    if (["html", "css", "react", "javascript"].includes(skill)) frontend.push(skillsArray[i]);
    else if (["node", "express", "mongodb"].includes(skill)) backend.push(skillsArray[i]);
    else if (["git", "github", "vscode"].includes(skill)) tools.push(skillsArray[i]);
    else if (["python", "java", "c", "c++"].includes(skill)) languages.push(skillsArray[i]);
    else others.push(skillsArray[i]);
  });

  function addSkill(title, arr) {
    if (arr.length) {
      const li = document.createElement("li");
      li.innerHTML = `<b>${title}:</b> ${arr.join(", ")}`;
      skillsList.appendChild(li);
    }
  }

  addSkill("Languages", languages);
  addSkill("Frontend", frontend);
  addSkill("Backend", backend);
  addSkill("Tools", tools);
  addSkill("Others", others);

  // EDUCATION
  const eduLines = resumeData.education.split("\n");
  let eduHTML = "";

  eduLines.forEach(line => {
    if (line.trim()) {
      eduHTML += `<div class="edu-line">${line}</div>`;
    }
  });

  document.getElementById("previewEducation").innerHTML = eduHTML;

  updateProjectsPreview();
  updateCustomPreview();
}

// PROJECTS
function addProject() {
  const container = document.getElementById("projectsContainer");

  const card = document.createElement("div");
  card.className = "project-card";

  card.innerHTML = `
    <input class="title" placeholder="Project Title">
    <input class="tech" placeholder="Tech Stack">
    <textarea class="desc" placeholder="Description (line by line)"></textarea>

    <div class="btn-group">
      <button onclick="generateProjectAI(this)">✨ AI</button>
      <button onclick="deleteCard(this)">❌</button>
    </div>
  `;

  container.appendChild(card);

  card.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", updateProjects);
  });
}

function updateProjects() {
  resumeData.projects = [];

  document.querySelectorAll(".project-card").forEach(c => {
    resumeData.projects.push({
      title: c.querySelector(".title").value,
      desc: c.querySelector(".desc").value,
      tech: c.querySelector(".tech").value
    });
  });

  updateProjectsPreview();
}

function updateProjectsPreview() {
  const preview = document.getElementById("previewProjects");
  preview.innerHTML = "";

  resumeData.projects.forEach(p => {
    const div = document.createElement("div");

    const bullets = p.desc
      .split("\n")
      .map(d => d.replace(/^•\s*/, "").trim()) // REMOVE manual bullets
      .filter(d => d)
      .map(d => `<li>${d}</li>`)
      .join("");

    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small><b>Tech:</b> ${p.tech}</small>
      <ul>${bullets}</ul>
    `;

    preview.appendChild(div);
  });
}

// CUSTOM
function addCustomSection() {
  const card = document.createElement("div");
  card.className = "custom-section-card";

  card.innerHTML = `
    <input class="title" placeholder="Section Title">
    <textarea class="content" placeholder="Content"></textarea>
    <button onclick="deleteCard(this)">❌</button>
  `;

  document.getElementById("customSectionsContainer").appendChild(card);

  card.querySelectorAll("input, textarea").forEach(i =>
    i.addEventListener("input", updateCustomSections)
  );
}

function updateCustomSections() {
  resumeData.customSections = [];

  document.querySelectorAll(".custom-section-card").forEach(c => {
    resumeData.customSections.push({
      title: c.querySelector(".title").value,
      content: c.querySelector(".content").value
    });
  });

  updateCustomPreview();
}

function updateCustomPreview() {
  const container = document.getElementById("previewCustomSections");
  container.innerHTML = "";

  resumeData.customSections.forEach(s => {
    const div = document.createElement("div");

    const bullets = s.content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line)
      .map(line => `<li>${line}</li>`)
      .join("");

    div.innerHTML = `
      <div class="section">
        <h3>${s.title}</h3>
        <ul>${bullets}</ul>
      </div>
    `;

    container.appendChild(div);
  });
}

function deleteCard(btn) {
  btn.parentElement.remove();
  updateProjects();
  updateCustomSections();
}

// PDF
function downloadPDF() {
  try {
    html2pdf().from(document.getElementById("resumePreview")).save();
  } catch {
    alert("Download failed");
  }
}

// AI SUMMARY
function generateSummary() {
  const name = document.getElementById("name").value || "A motivated fresher";
  const skills = document.getElementById("skills").value;

  if (!skills) {
    alert("Enter skills first");
    return;
  }

  const role = detectRole(skills);
  const skillList = skills.split(/,|\n/).map(s => s.trim()).filter(s => s);
  const mainSkills = skillList.slice(0, 3).join(", ");

  const templates = [
    `${name} is a passionate ${role} with strong knowledge of ${mainSkills}. Focused on building responsive applications.`,
    `Aspiring ${role} skilled in ${mainSkills}. Interested in solving real-world problems.`,
    `${name} is an enthusiastic ${role} with expertise in ${mainSkills}. Eager to contribute to development teams.`
  ];

  document.getElementById("summary").value =
    templates[Math.floor(Math.random() * templates.length)];

  updateData();
}

// AI PROJECT
function generateProjectAI(btn) {
  const card = btn.parentElement.parentElement;

  const title = card.querySelector(".title").value || "web application";
  const tech = card.querySelector(".tech").value || "modern technologies";

  const templates = [
`Developed a ${title} using ${tech}
Designed responsive UI and improved user experience
Optimized performance and functionality`,

`Built ${title} with ${tech}
Focused on clean design and usability
Implemented efficient features`,

`Created ${title} using ${tech}
Ensured responsiveness across devices
Enhanced application performance`
  ];

  card.querySelector(".desc").value =
    templates[Math.floor(Math.random() * templates.length)];

  updateProjects();
}