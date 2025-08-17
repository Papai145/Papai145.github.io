const data = {
  topics: ["Тема 1", "Тема 2"],
  subtopics: [
    ["Подтема 1.1", "Подтема 1.2", "Подтема 1.3"],
    ["Подтема 2.1", "Подтема 2.2", "Подтема 2.3"],
  ],
  contents: [
    ["Текст подтемы 1.1", "Текст подтемы 1.2", "Текст подтемы 1.3"],
    ["Текст подтемы 2.1", "Текст подтемы 2.2", "Текст подтемы 2.3"],
  ],
};

const EL = {
  topic: document.querySelector(".topic"),
  subtopic: document.querySelector(".subtopic"),
  content: document.querySelector(".content"),
};

class KnowledgeBase {
  constructor() {
    this.data = data;
    this.state = {
      topicIndex: 0,
      subtopicIndex: 0,
    };
    this.init();
  }

  init() {
    this.loadState();
    this.setupEventDelegation();
    this.renderAll();
  }

  loadState() {
    this.state.topicIndex = +localStorage.getItem("topicIndex") || 0;
    this.state.subtopicIndex = +localStorage.getItem("subtopicIndex") || 0;
  }

  saveState() {
    localStorage.setItem("topicIndex", this.state.topicIndex);
    localStorage.setItem("subtopicIndex", this.state.subtopicIndex);
  }

  setupEventDelegation() {
    EL.topic.addEventListener("click", (e) => {
      const index = this.getClickedIndex(e.target, EL.topic);
      if (index !== -1 && index !== this.state.topicIndex) {
        this.handleTopicChange(index);
      }
    });

    EL.subtopic.addEventListener("click", (e) => {
      const index = this.getClickedIndex(e.target, EL.subtopic);
      if (index !== -1 && index !== this.state.subtopicIndex) {
        this.handleSubtopicChange(index);
      }
    });
  }

  getClickedIndex(clickedElement, parent) {
    const item = clickedElement.closest("div");
    if (!item || !parent.contains(item)) return -1;
    return [...parent.children].indexOf(item);
  }

  renderAll() {
    this.renderTopics();
    this.renderSubtopics();
    this.renderContent();
    this.updateActiveElements();
  }

  renderTopics() {
    EL.topic.innerHTML = "";
    this.data.topics.forEach((topic, index) => {
      const div = document.createElement("div");
      div.textContent = topic;
      div.dataset.index = index;
      EL.topic.appendChild(div);
    });
  }

  renderSubtopics() {
    EL.subtopic.innerHTML = "";
    const subtopics = this.data.subtopics[this.state.topicIndex] || [];
    subtopics.forEach((subtopic, index) => {
      const div = document.createElement("div");
      div.textContent = subtopic;
      div.dataset.index = index;
      EL.subtopic.appendChild(div);
    });
  }

  renderContent() {
    const content =
      this.data.contents[this.state.topicIndex]?.[this.state.subtopicIndex] ||
      "";
    EL.content.textContent = content;
  }

  handleTopicChange(newIndex) {
    this.state.topicIndex = newIndex;
    this.state.subtopicIndex = 0;
    this.saveState();
    this.renderSubtopics();
    this.renderContent();
    this.updateActiveElements();
  }

  handleSubtopicChange(newIndex) {
    this.state.subtopicIndex = newIndex;
    this.saveState();
    this.renderContent();
    this.updateActiveElements();
  }

  updateActiveElements() {
    [...EL.topic.children].forEach((child, index) => {
      child.classList.toggle("active", index === this.state.topicIndex);
    });

    [...EL.subtopic.children].forEach((child, index) => {
      child.classList.toggle("active", index === this.state.subtopicIndex);
    });
  }
}

new KnowledgeBase();
