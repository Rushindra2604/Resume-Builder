let resumeData = {
  name: "", email: "", phone: "", linkedin: "", github: "",
  summary: "", skills: "", education: "",
  projects: [], customSections: []
};

const inputs = document.querySelectorAll("input, textarea");
inputs.forEach(i => i.addEventListener("input", updateData));

function updateData() {
  resumeData.name = document.getElementById("name").value;

  console.log("Name value:", resumeData.name);

  resumeData.email = email.value;
  resumeData.phone = phone.value;
  resumeData.linkedin = linkedin.value;
  resumeData.github = github.value;
  resumeData.summary = summary.value;
  resumeData.skills = skills.value;
  resumeData.education = education.value;

  updatePreview();
}

function updatePreview() {
  document.getElementById("previewName").textContent =
    resumeData.name.trim() !== "" ? resumeData.name : "Your Name";

  // ✅ FIXED CONTACT DISPLAY
  previewContact.textContent =
    `${resumeData.email} | ${resumeData.phone} | ${resumeData.linkedin} | ${resumeData.github}`;

  previewSummary.innerHTML = resumeData.summary.replace(/\n/g, "<br>");

  // skills
  const skillsList = document.getElementById("previewSkills");
  skillsList.innerHTML = "";

  const skillsArray = resumeData.skills
    .split(/,|\n/)
    .map(s => s.trim())
    .filter(s => s);

  // normalize
  const lowerSkills = skillsArray.map(s => s.toLowerCase());

  // categories
  let frontend = [];
  let backend = [];
  let tools = [];
  let languages = [];
  let others = [];

  lowerSkills.forEach((skill, index) => {

    if (["html", "css", "react", "javascript", "bootstrap"].includes(skill)) {
      frontend.push(skillsArray[index]);
    }
    else if (["node", "express", "mongodb", "mysql"].includes(skill)) {
      backend.push(skillsArray[index]);
    }
    else if (["git", "github", "vscode", "postman"].includes(skill)) {
      tools.push(skillsArray[index]);
    }
    else if (["python", "java", "c", "c++"].includes(skill)) {
      languages.push(skillsArray[index]);
    }
    else {
      others.push(skillsArray[index]);
    }

  });

  // render function
  function addSkill(title, arr) {
    if (arr.length > 0) {
      const li = document.createElement("li");
      li.innerHTML = `<b>${title}:</b> ${arr.join(", ")}`;
      skillsList.appendChild(li);
    }
  }

  // render in order
  addSkill("Languages", languages);
  addSkill("Frontend", frontend);
  addSkill("Backend", backend);
  addSkill("Tools", tools);
  addSkill("Others", others);

  const eduLines = resumeData.education.split("\n");

  let formattedEdu = "";

  eduLines.forEach(line => {
    if (line.trim()) {
      formattedEdu += `<div class="edu-line">${line}</div>`;
    }
  });

  document.getElementById("previewEducation").innerHTML = formattedEdu;

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

  // IMPORTANT: attach listeners
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
  previewProjects.innerHTML = "";

  resumeData.projects.forEach(p => {
    const div = document.createElement("div");

    const bullets = p.desc
      .split("\n")
      .map(d => `<li>${d}</li>`)
      .join("");

    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small><b>Tech:</b> ${p.tech}</small>
      <ul>${bullets}</ul>
    `;

    previewProjects.appendChild(div);
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

  customSectionsContainer.appendChild(card);
  card.querySelectorAll("input,textarea").forEach(i => i.addEventListener("input", updateCustomSections));
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
  previewCustomSections.innerHTML = "";

  resumeData.customSections.forEach(s => {
    const div = document.createElement("div");

    const bullets = s.content
      .split("\n")
      .map(line => `<li>${line}</li>`)
      .join("");

    div.innerHTML = `
      <div class="section">
        <h3>${s.title}</h3>
        <ul>${bullets}</ul>
      </div>
    `;

    previewCustomSections.appendChild(div);
  });
}

function deleteCard(btn) {
  btn.parentElement.remove();
  updateProjects();
  updateCustomSections();
}

// PDF
function downloadPDF() {
  html2pdf().from(resumePreview).save();
}

// 🤖 AI SUMMARY (FREE MOCK FOR NOW)
function generateSummary() {
  const nameVal = name.value || "a fresher";

  const text = `Motivated and detail-oriented developer with strong foundation in web technologies. Passionate about building user-friendly applications and solving real-world problems. Eager to learn, grow, and contribute effectively in a dynamic team environment.`;

  summary.value = text;
  updateData();
}

function generateProjectAI(btn) {
  const card = btn.parentElement.parentElement;

  const title = card.querySelector(".title").value;
  const tech = card.querySelector(".tech").value;

  if (!title && !tech) {
    alert("Enter project title or tech first");
    return;
  }

  // 🔥 Mock AI (works without API)
  const text = `
• Developed a ${title || "web application"} using ${tech || "modern technologies"}
• Designed responsive UI and improved user experience
• Implemented optimized and scalable functionality
`;

  card.querySelector(".desc").value = text.trim();

  updateProjects(); // VERY IMPORTANT
}