const data = {
  topic: ["Тема 1", "Тема 2"],
  subtopic: [
    ["Подтема 1.1", "Подтема 1.2", "Подтема 1.3"],
    ["Подтема 2.1", "Подтема 2.2", "Подтема 2.3"],
  ],
  content: [
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
      topic: +localStorage.getItem("topic") || 0,
      subtopic: +localStorage.getItem("subtopic") || 0,
    };
    this.init();
  }
  init() {
    this.renderThemes();
    this.renderSubThemes();
  }
  renderThemes() {
    this.createList(this.data.topic, "topic");
    const state = this.loadFromStorage("topic");
    EL.topic.children[state].classList.add("active");
  }
  renderSubThemes() {
    const topic = this.loadFromStorage("topic");
    const supTopic = this.loadFromStorage("subtopic");
    let subThemes = this.data.subtopic[topic];
    this.createList(subThemes, "subtopic");
    EL.subtopic.children[supTopic].classList.add("active");
    this.renderContent();
  }
  createList(dataArr, containerKey) {
    for (let i = 0; i < dataArr.length; i++) {
      const div = document.createElement("div");
      div.innerHTML = `${dataArr[i]}`;
      div.addEventListener("click", () => this.clickFunction(containerKey, i));
      EL[containerKey].appendChild(div);
    }
  }
  clickFunction(containerKey, index) {
    const state = this.loadFromStorage(containerKey);
    if (index !== state) {
      this.saveIndexActiveElement(containerKey, index);
      const children = EL[containerKey].children;
      for (let i = 0; i < children.length; i++) {
        children[i].classList.toggle("active", i === index);
      }
      if (containerKey == "topic") {
        EL.subtopic.innerHTML = "";
        this.saveIndexActiveElement("subtopic", 0);
        this.renderSubThemes();
      } else {
        this.renderContent();
      }
    }
  }

  saveIndexActiveElement(section, index) {
    localStorage.setItem(section, index);
  }
  loadFromStorage(key) {
    return +localStorage.getItem(key) || 0;
  }
  renderContent() {
    const topic = this.loadFromStorage("topic");
    const supTopic = this.loadFromStorage("subtopic");
    let text = this.data.content[topic][supTopic];
    EL.content.textContent = text;
  }
}
new KnowledgeBase();
